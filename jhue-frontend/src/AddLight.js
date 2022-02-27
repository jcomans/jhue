import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

class AddLight extends React.Component {

  constructor(props) {
    super(props);

    this.state = { show: false };

    this.handleOpen   = this.handleOpen.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAdd    = this.handleAdd.bind(this);
  }

  handleOpen() {
    this.setState({show:true})
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
        <Button variant="primary" onClick={this.handleOpen}>
          Add Light
        </Button>
        <Modal show={this.state.show} onHide={this.handleCancel} animation={false}>
          <Modal.Header>
            <Modal.Title>Add Light</Modal.Title>
          </Modal.Header>
          <Modal.Body>We should show a list of lights here!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleAdd}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default AddLight