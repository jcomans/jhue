import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

class PopUp extends React.Component {
  render() {

    return (
      <Modal show={this.props.show} onHide={this.props.handleCancel} animation={false}>
        <Modal.Header>
          <Modal.Title>Add Light</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select>
            {this.props.light_data.map(light => <option key={light.id} value={light.id}>{light.name}</option>)}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.props.handleAdd}>
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