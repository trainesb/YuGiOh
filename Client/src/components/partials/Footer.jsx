import React from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Footer = () => {
  return (
    <Container fluid className="footer text-center">
      <Row>
        <Col sm={12}>
          <p>&copy; Copyright 2021, Ben Traines</p>
        </Col>
      </Row>
    </Container>
  )
}
export default Footer
