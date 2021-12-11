#include "HueBridge.hpp"

#include <boost/asio.hpp>

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>

#include <boost/log/trivial.hpp>

#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

namespace pt   = boost::property_tree;
namespace http = boost::beast::http;

using tcp = boost::asio::ip::tcp;

using namespace std::string_literals;

struct HueBridge::Impl
{
  tcp::resolver resolver_;
  tcp::socket socket_;

  const std::string hue_api_key;
  const std::string host;
  const std::string port;

  Impl(const boost::property_tree::ptree& config,
       boost::asio::io_context& ioc)
    : resolver_{ioc}
    , socket_{ioc}
    , hue_api_key{config.get<std::string>("api_key")}
    , host{config.get<std::string>("host")}
    , port{config.get<std::string>("port")}
  {
  }

  pt::ptree request(http::verb verb, const std::string& request, const std::string& body="")
  {
    auto const target = "/api/"+ hue_api_key + "/" + request;

    http::request<http::string_body> req{verb, target, 11};

    req.set(http::field::host, host);
    req.set(http::field::user_agent, BOOST_BEAST_VERSION_STRING);

    if(body.size())
    {
      req.set(http::field::content_length, body.size());
      req.body() = body;
    }

    auto const results = resolver_.resolve(host, port);
    boost::asio::connect(socket_, results.begin(), results.end());
    http::write(socket_, req);

    http::response<http::dynamic_body> res;
    boost::beast::flat_buffer buffer;
    http::read(socket_, buffer, res);

    boost::property_tree::ptree json_resp;
    std::stringstream ss(boost::beast::buffers_to_string(res.body().data()));
    boost::property_tree::read_json(ss, json_resp);

    return json_resp;
  }
};

HueBridge::HueBridge(const boost::property_tree::ptree& config, boost::asio::io_context& ioc)
  : pimpl(std::make_unique<Impl>(config, ioc))
{
}

HueBridge::~HueBridge() = default;

boost::property_tree::ptree HueBridge::lightsStatus() const
{
  BOOST_LOG_TRIVIAL(trace) << "Getting all light states";
  return pimpl->request(http::verb::get, "lights");
}

void HueBridge::setLightState(const std::string& id, bool on) const
{
  const std::string body = "{\"on\":"s + (on ? "true" : "false") + "}";

  BOOST_LOG_TRIVIAL(trace) << "Sending: " << body << " for light " << id;

  pimpl->request(http::verb::put, "lights/" + id + "/state", body);
}
