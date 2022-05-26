import React from 'react';
import AddLight from './AddLight'
import TimedLightList from './TimedLightList';


class App extends React.Component {

  constructor(props){
    super(props);

    this.state = {cache_valid:false}

    this.unsetCache = this.unsetCache.bind(this);
    this.setCache = this.setCache.bind(this);
  }

  unsetCache() {
    this.setState({cache_valid : false});
  }

  setCache() {
    this.setState({cache_valid : true});
  }
  
  render() {
    return (
      <div className="App">
        <div className="container">
          <h1>jhue</h1>
          <TimedLightList cache_valid={this.state.cache_valid} setCache={this.setCache} />
          <AddLight unsetCache={this.unsetCache} />
        </div>

      </div>
    );
  }
}

export default App;
