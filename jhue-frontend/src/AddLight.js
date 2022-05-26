import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

class PopUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {short_id:"", unique_id:"", name:"", interval:"5", enabled: true};

    this.handleOption = this.handleOption.bind(this);
    this.handleInterval = this.handleInterval.bind(this);
    this.handleEnable = this.handleEnable.bind(this);

    this.handleAdd = this.handleAdd.bind(this);
    
  }

  handleOption(event){

    const idx = event.target.selectedIndex;
    const opt = event.target.options[idx]

    this.setState({
      short_id: opt.value,
      unique_id: opt.getAttribute('unique_id'),
      name: opt.text
    })
  }

  handleInterval(event){
    this.setState({value: event.target.value});
  }

  handleEnable(event){
    this.setState({enabled: event.target.checked});
  }

  handleAdd(event) {
    event.preventDefault();
    
    var url = new URL('http://localhost:8000/api/timed_lights/create');
    var params = {
      name: this.state.name,
      short_id: this.state.short_id,
      unique_id: this.state.unique_id,
      interval: this.state.interval,
      enabled: this.state.enabled
    };
    url.search = new URLSearchParams(params).toString();

    fetch(url, {method: 'POST'})
    .then(()=>{console.log("Created timed_light")})
    .catch(()=>{console.log("Failed to create timed_light")})

    this.props.handleAdd();
  }

  render() {

    return (
      <Modal show={this.props.show} onHide={this.props.handleCancel} animation={false}>

        <Modal.Header>
          <Modal.Title>Add Light</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select name="light_selection" onChange={this.handleOption}>
            {this.props.light_data.map(light => <option key={light.unique_id} unique_id={light.unique_id} value={light.short_id}>{light.name}</option>)}
          </Form.Select>
          <Form.Group controlId="myform.interval">
            <Form.Label>Interval</Form.Label>
            <Form.Control type="input" onChange={this.handleInterval} defaultValue={this.state.interval} />
          </Form.Group>
          <Form.Group controlId="myform.enabled">
            <Form.Label>Enabled</Form.Label>
            <Form.Control type="checkbox" onChange={this.handleEnable} defaultChecked={this.state.enabled} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleCancel}>
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

    this.handleOpen   = this.handleOpen.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAdd    = this.handleAdd.bind(this);
  }

  handleOpen() {
    fetch('http://localhost:8000/api/lights')
      .then(res => res.json())
      .then((data) => {
        this.setState({ show: true, light_data: data })

      })
      .catch(console.log)

  }

  handleCancel() {
    this.setState({show:false})
  }

  handleAdd() {
    this.setState({show:false})
  }

  render() {
    return (
      <>
        <Button variant="primary" onClick={this.handleOpen}>Add Light</Button>
        <PopUp show={this.state.show} light_data={this.state.light_data} handleCancel={this.handleCancel} handleAdd={this.handleAdd} />
      </>
    )
  }
}

export default AddLight
