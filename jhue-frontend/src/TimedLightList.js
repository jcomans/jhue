import React from 'react';

import Table from 'react-bootstrap/Table'

class TimedLightList extends React.Component {

    constructor(props) {
        super(props)
        this.state = { timed_light_list: [] }
    }

    update_data() {
        if (!this.props.cache_valid) {
            fetch('http://localhost:8000/api/timed_lights')
                .then(res => res.json())
                .then((light_list) => {
                    this.setState({timed_light_list:light_list});
                    this.props.setCache();
                })
                .catch(console.log)

        }
    }
    render() {
        this.update_data();

        return (
            <>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Short ID</th>
                            <th>Unique ID</th>
                            <th>Interval</th>
                            <th>Enabled</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.timed_light_list.map((entry) => <LightLine key={entry.unique_id} data={entry} />)}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default TimedLightList;

function LightLine(props) {
  return (
  <>
  <tr>
    <td>{props.data.name}</td>
    <td>{props.data.short_id}</td>
    <td>{props.data.unique_id}</td>
    <td>{props.data.interval}</td>
    <td><input type='checkbox' checked={props.data.active} readOnly/></td>
  </tr>
  </>
  );
}