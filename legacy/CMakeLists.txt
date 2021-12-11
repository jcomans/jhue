cmake_minimum_required(VERSION 3.15)

project(jhue VERSION 1.0.0)

set(Boost_USE_STATIC_LIBS ON)
find_package(Boost REQUIRED COMPONENTS log)

find_package(Threads REQUIRED)

find_package(Wt REQUIRED)

add_executable(jhue
  main.cpp
  HueBridge.cpp
  LightController.cpp
  )

target_link_libraries(jhue
  PRIVATE
  Threads::Threads
  Boost::log
  )

target_compile_features(jhue PRIVATE cxx_std_17)