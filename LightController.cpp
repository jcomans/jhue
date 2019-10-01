#include "LightController.hpp"

#include <map>

#include <boost/asio.hpp>
#include <boost/log/trivial.hpp>
#include <boost/property_tree/ptree.hpp>

#include "HueBridge.hpp"

using namespace std::string_literals;

struct LightController::Impl
{
  boost::asio::io_context& ioc;
  HueBridge bridge;
  const bool debug_enabled;
  std::map<std::string, std::pair<int,int>> light_map;

  Impl(const boost::property_tree::ptree& c, boost::asio::io_context& i)
    : ioc{i}
    , bridge{c.get_child("bridge"), ioc}
    , debug_enabled{c.get<bool>("general.debug")}
    , light_map{}
  {
  }
};

LightController::LightController(const boost::property_tree::ptree& config,
                                 boost::asio::io_context& ioc)
  : pimpl{std::make_unique<Impl>(config, ioc)}
{
  auto lights = config.get_child("lights");
  const auto light_state = pimpl->bridge.lightsStatus();

  BOOST_LOG_TRIVIAL(info) << "Setting up light configuration in "
                          << (pimpl->debug_enabled ? "debug" : "normal")
                          << " mode";

  for(const auto& light: lights)
  {
    if (light.second.get<bool>("enabled"))
    {
      const auto switch_off = light.second.get<int>("switch_off");

      pimpl->light_map[light.first].first = 0;
      pimpl->light_map[light.first].second = switch_off;

      const auto name = light_state.get<std::string>(light.first + ".name");

      BOOST_LOG_TRIVIAL(info) << "Configured light " << light.first << " (" << name << ")"
                              << " with switch_off " << switch_off;
    }
  }
}

LightController::~LightController() = default;

int LightController::poll_intervall() const
{
  return pimpl->debug_enabled ? 1 : 60;
}

void LightController::run_poll()
{
  const auto light_state = pimpl->bridge.lightsStatus();

  for( auto& light : pimpl->light_map)
  {
    if (light_state.get<bool>(light.first + ".state.on"))
    {
      BOOST_LOG_TRIVIAL(trace) << "Incrementing light " << light.first;
      ++light.second.first;
      if (light.second.first > light.second.second)
      {
        BOOST_LOG_TRIVIAL(debug) << "Switching off light " << light.first;
        pimpl->bridge.setLightState(light.first, false);
      }
    }
    else
    {
      light.second.first = 0;
    }

  }
}
