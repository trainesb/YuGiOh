import React, { useState, useEffect } from 'react'

import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const PublicCardSearch = (props) => {
  const [cardId] = useState(props.cardId)
  const [userId] = useState(props.userId)
  const [card, setCard] = useState(null)
  const [sets, setSets] = useState(null)

  useEffect(() => {
    fetch('/api/searched/card/' + cardId + '/user/' + userId)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data.status) {
          setCard(data.card)
          setSets(data.maps)
        }
      })
  }, [])

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{card !== null && card.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="searched-card-wrapper">

      {card !== null &&
        <Card>
          <Card.Header>
            <Card.Title className="text-center"></Card.Title>
          </Card.Header>
          <Card.Body>


            <div>
              <p><img src={'../../' + card.image} /></p>
            </div>


            <div>
              <div className="info">
                <p><strong>Type:</strong> {card.type}</p>


                <p><strong>Level:</strong> {card.level}</p>
                <p><strong>Race:</strong> {card.race}</p>
                <p><strong>Attribute:</strong> {card.attribute}</p>


                <p><strong>Atk:</strong> {card.atk} <strong className="def">Def:</strong> {card.defense}</p>

                <p><strong>Description:</strong> {card.desc}</p>
              </div>


            </div>


          </Card.Body>
          <Card.Footer>
            {sets &&
              <div className="map-info">
                <p className="map-info-title"><strong>Sets</strong></p>
                <hr />
                <ul>
                  {sets.map((cardMap) => (
                    <li>{cardMap.set && cardMap.set.set_name} - ({cardMap.card_code}) - {cardMap.rarity && cardMap.rarity.rarity_code} - ${cardMap.card_price.toFixed(2)} - Num Owned: {cardMap.num_owned}</li>
                  ))}
                </ul>
              </div>
            }
          </Card.Footer>
        </Card>
      }

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
export default PublicCardSearch
