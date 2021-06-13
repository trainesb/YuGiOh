import React from 'react'
import Clock from './Clock'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Header = () => {
  return (
    <Container fluid className="header text-center">
      <Row>
        <Col sm={12} className="clock">
          <Clock />
        </Col>
      </Row>
    </Container>
  )
}
export default Header
