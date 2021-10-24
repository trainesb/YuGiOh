import os
import datetime
from app import db
from app.api import bp
from flask import request
from app.models.Card import Card
from flask_login import current_user
from app.models.Rarity import Rarity
from app.models.CardSet import CardSet
from app.models.SetCategory import SetCategory
from app.models.UsersCard import UsersCard

# Card Search
@bp.route('/api/search', methods=['POST'])
def card_search():
    data = request.get_json()
    search = data.get('search')
    cards = Card.query.filter(Card.name.contains(search)).all()
    rtrn = []
    if cards:
        for card in cards: rtrn.append(card._toDict())

    return {'status': True, 'cards': rtrn}

# Get searched card by card id
@bp.route('/api/searched/card/<int:id>', methods=['GET'])
def get_card_searched_by_id(id):
    card = Card.query.filter_by(id=id).first()
    if card: card = card._toDict()

    cardMap = UsersCard.query.filter_by(card_id=id).all()
    maps = []
    if cardMap:
        for map in cardMap:
            set = CardSet.query.filter_by(id=map.card_set_id).first()
            rarity = Rarity.query.filter_by(id=map.rarity_id).first()

            map = map._toDict()
            map['set'] = None
            if set: map['set'] = set._toDict()
            map['rarity'] = None
            if rarity: map['rarity'] = rarity._toDict()

            maps.append(map)
    return {'status': True, 'card': card, 'maps': maps}
