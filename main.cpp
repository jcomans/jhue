#include <iostream>
#include <fstream>

#include <boost/asio.hpp>

#include <boost/log/core.hpp>
#include <boost/log/trivial.hpp>
#include <boost/log/expressions.hpp>
#include <boost/log/utility/setup/file.hpp>

#include <boost/property_tree/json_parser.hpp>

#include "LightController.hpp"

namespace pt = boost::property_tree;

void handle_timer(const boost::system::error_code&, 
                  boost::asio::steady_timer& timer,
                  LightController& controller)
{
  controller.run_poll();
  timer.expires_at(timer.expiry() + boost::asio::chrono::seconds(controller.poll_intervall()));
  timer.async_wait([&](const boost::system::error_code& ec){ handle_timer(ec, timer, controller); });
}

auto to_log_level(const std::string& log_level_string)
{
  if (log_level_string == "trace")
    return boost::log::trivial::trace;

  if (log_level_string == "debug")
    return boost::log::trivial::debug;

  if (log_level_string == "info")
    return boost::log::trivial::info;

  if (log_level_string == "warning")
    return boost::log::trivial::warning;

  if (log_level_string == "error")
    return boost::log::trivial::error;

  throw std::runtime_error("Unknown loglevel '" + log_level_string + "'");
}

int main(int argc, char** argv)
{

  try
  {
    pt::ptree config;
    std::ifstream config_file("jhue_config.json");
    pt::read_json(config_file, config);

    //boost::log::add_file_log("jhue.log");

    boost::log::core::get()->set_filter(
      boost::log::trivial::severity >= to_log_level(config.get<std::string>("general.loglevel"))
        );

    BOOST_LOG_TRIVIAL(info) << "Starting jhue";
    
    boost::asio::io_context ioc;

    boost::asio::signal_set signals(ioc, SIGINT, SIGTERM);

    signals.async_wait([&](const boost::system::error_code& error,int signal_number)
                       {
                         BOOST_LOG_TRIVIAL(info) << "Received signal, stopping";
                         ioc.stop();
                       });


    LightController controller{config, ioc};

    boost::asio::steady_timer timer(ioc, boost::asio::chrono::seconds(controller.poll_intervall()));

    timer.async_wait([&](const boost::system::error_code& ec)
                     { 
                       handle_timer(ec, timer, controller);
                     });

    ioc.run();
    
  }
  catch(std::exception const& e)
  {
    BOOST_LOG_TRIVIAL(error) << "Error: " << e.what();
    return EXIT_FAILURE;
  }
  return EXIT_SUCCESS;
}
