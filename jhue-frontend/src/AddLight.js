import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

class PopUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = { short_id: "", unique_id: "", name: "", interval: "5", enabled: true, light_data: [] };

    this.handleOption = this.handleOption.bind(this);
    this.handleInterval = this.handleInterval.bind(this);
    this.handleEnable = this.handleEnable.bind(this);

    this.handleAdd = this.handleAdd.bind(this);

  }

  componentDidMount() {

    fetch('http://localhost:8000/api/lights')
      .then(res => res.json())
      .then((data) => {
        this.setState({ light_data: data })
        if (data.length) {
          const fl = data[0];
          this.setState({ short_id: fl.short_id, unique_id: fl.unique_id, name: fl.name })
        }

      })
      .catch(console.log)


  }

  handleOption(event) {

    const idx = event.target.selectedIndex;
    const opt = event.target.options[idx]

    this.setState({
      short_id: opt.value,
      unique_id: opt.getAttribute('unique_id'),
      name: opt.text
    })
  }

  handleInterval(event) {
    this.setState({ interval: event.target.value });
  }

  handleEnable(event) {
    this.setState({ enabled: event.target.checked });
  }

  handleAdd(event) {
    event.preventDefault();

    var url = new URL('http://localhost:8000/api/timed_lights/create');
    var params = {
      name: this.state.name,
      short_id: this.state.short_id,
      unique_id: this.state.unique_id,
      interval: this.state.interval,
      active: this.state.enabled
    };
    url.search = new URLSearchParams(params).toString();

    fetch(url, { method: 'POST' })
      .then((resp) => {
        if (resp.ok) {
          console.log("Created timed_light");
        }
        else {
          console.log("Failed to create timed_light")
        }
        return resp.json();
      })
      .then(jsdata => {console.log(jsdata);})
      .catch(console.log);

    this.props.unsetCache();
    this.props.handleClose();
  }

  render() {

    return (
      <Modal show={this.props.show} onHide={this.props.handleCancel} animation={false}>

        <Modal.Header>
          <Modal.Title>Add Light</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select name="light_selection" onChange={this.handleOption}>
            {this.state.light_data.map(light => <option key={light.unique_id} unique_id={light.unique_id} value={light.short_id}>{light.name}</option>)}
          </Form.Select>
          <Form.Group>
            <Form.Label>Interval</Form.Label>
            <Form.Control type="input" onChange={this.handleInterval} value={this.state.interval} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Enabled</Form.Label>
            <Form.Control type="checkbox" onChange={this.handleEnable} checked={this.state.enabled} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.handleAdd}>
            Add
          </Button>
        </Modal.Footer>

      </Modal>
    );
  }

}

class AddLight extends React.Component {

  constructor(props) {
    super(props);

    this.state = { show: false, light_data: [] };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false })
  }
  render() {

    return (
      <>
        <Button variant="primary" onClick={this.handleOpen}>Add Light</Button>
        {this.state.show && <PopUp show='true' handleClose={this.handleClose} unsetCache={this.props.unsetCache} />}
      </>
    )
  }
}

export default AddLight
