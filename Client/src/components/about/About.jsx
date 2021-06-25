import React, { useEffect, useState } from 'react'

import '../../styles/about.scss'

import Card from 'react-bootstrap/Card'

const About = () => {

  return (
    <Card className="about-wrapper">
      <Card.Header>
        <Card.Title className="text-center"><h2>About</h2></Card.Title>
      </Card.Header>
      <Card.Body>
        <p><strong>Note:</strong> this site was thrown togeather quickly, and is far from perfect! Considering how this site performs there may be updates to come.</p>
        <br />
        <p>The Goal of this site is to provide an easy way to manage your <i>Yu-Gi-Oh!</i> collection, by allowing users to track their cards by set, along with important card data.</p>
        <br />
        <ul>
          <h2> Future Update Ideas</h2>
          <hr />
          <li>Wish List</li>
          <li>Deck Builder</li>
          <li>Other TCG</li>
        </ul>
      </Card.Body>
    </Card>
  )
}
export default About
