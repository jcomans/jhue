#ifndef HUEBRIDGE_H
#define HUEBRIDGE_H

#include <memory>
#include <string>

#include <boost/property_tree/ptree_fwd.hpp>

namespace boost::asio
{
class io_context;
}

class HueBridge
{
public:
  HueBridge(const boost::property_tree::ptree& config,
            boost::asio::io_context& ioc);
  ~HueBridge();

  boost::property_tree::ptree lightsStatus() const;

  void setLightState(const std::string& id, bool on) const;

private:
  struct Impl;
  std::unique_ptr<Impl> pimpl;
};

#endif /* HUEBRIDGE_H */
