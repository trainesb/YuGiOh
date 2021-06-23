import os
import datetime
from app import db
from app.api import bp
from flask import request
from app.models.Card import Card
from flask_login import current_user
from app.models.Rarity import Rarity
from app.models.CardSet import CardSet
from app.models.Archetype import Archetype
from app.models.SetCategory import SetCategory
from app.models.CardToSetMap import CardToSetMap

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

# Get # owned of card by cardMapId
@bp.route('/api/card/numOwned/<int:setId>/<int:mapId>', methods=['GET'])
def get_num_owned_by_map_id(setId, mapId):
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
    f = open(os.path.join(dir, str(setId) + '.txt'), 'r')
    lines = f.readlines()
    if lines: lines = lines[0].split(',')
    data = {}
    num_owned = 0
    for line in lines[:-1]:
        line = line.split(':')
        data[int(line[0].strip())] = int(line[1].strip())
    if data[mapId] > 0: num_owned = data[mapId]
    return {'num_owned': num_owned}


# Get searched card by card id
@bp.route('/api/searched/card/<int:id>', methods=['GET'])
def get_card_searched_by_id(id):
    card = Card.query.filter_by(id=id).first()
    if card: card = card._toDict()

    cardMap = CardToSetMap.query.filter_by(card_id=id).all()
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

            map['num_owned'] = 0
            if set:
                dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
                f = open(os.path.join(dir, str(set.id) + '.txt'), 'r')
                lines = f.readlines()
                if lines: lines = lines[0].split(',')
                data = {}
                for line in lines[:-1]:
                    line = line.split(':')
                    data[int(line[0].strip())] = int(line[1].strip())
                if data[map['id']] > 0: map['num_owned'] = data[map['id']]

            maps.append(map)
    return {'status': True, 'card': card, 'maps': maps}
