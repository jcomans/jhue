#ifndef LIGHTCONTROLLER_H
#define LIGHTCONTROLLER_H

#include <memory>

#include <boost/property_tree/ptree_fwd.hpp>

namespace boost::asio
{
class io_context;
}

class LightController
{
public:
  LightController(const boost::property_tree::ptree& config,
                  boost::asio::io_context& ioc);
  ~LightController();

  int poll_intervall() const;

  void run_poll();

private:
  struct Impl;
  std::unique_ptr<Impl> pimpl;
};

#endif /* LIGHTCONTROLLER_H */
