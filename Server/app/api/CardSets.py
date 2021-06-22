import os
import datetime
from app import db
from app.api import bp
from app.models.Card import Card
from flask_login import current_user
from app.models.Rarity import Rarity
from app.models.CardSet import CardSet
from app.models.Archetype import Archetype
from app.models.SetCategory import SetCategory
from app.models.CardToSetMap import CardToSetMap

# Get all categories
@bp.route('/api/categories', methods=['GET'])
def get_categories():
    categories = SetCategory.query.all()
    rtrn = []
    if categories:
        for category in categories:
            rtrn.append(category._toDict())
    return {'categories': rtrn}

# Get Category by id
@bp.route('/api/category/<int:id>', methods=['GET'])
def get_category_by_id(id):
    category = SetCategory.query.filter_by(id=id).first()
    if category: return {'status': True, 'category': category._toDict()}
    return {'status': False, 'category': None}

# Get most completed categories
@bp.route('/api/top/categories', methods=['GET'])
def get_top_sets():
    categories = SetCategory.query.all()
    if not categories: return {'status': False}
    rtrn = []
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
    for category in categories:
        set = CardSet.query.filter_by(set_category_id=category.id).order_by(CardSet.tcg_date.desc()).all()
        if set:
            for s in set:
                s = s._toDict()
                if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")

                f = open(os.path.join(dir, str(s['id']) + '.txt'), 'r')
                lines = f.readlines()
                if lines: lines = lines[0].split(',')
                data = {}
                for line in lines[:-1]:
                    line = line.split(':')
                    data[int(line[0].strip())] = int(line[1].strip())

                cards = CardToSetMap.query.filter_by(card_set_id=s['id']).all()
                s['num_owned'] = 0
                if cards:
                    for card in cards:
                        if data[card.id] > 0: s['num_owned'] += 1

                check = s['num_owned'] / s['num_of_cards']
                if check > 0.25: rtrn.append(s)

    return {'status': True, 'top_sets': rtrn}

# Get card sets by category
@bp.route('/api/category/to/set/<int:id>', methods=['GET'])
def get_set_by_category_id(id):
    tmp = []
    set = CardSet.query.filter_by(set_category_id=id).order_by(CardSet.tcg_date.desc()).all()
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
    if set:
        for s in set:
            s = s._toDict()
            if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")

            # Get the number of cards owned from that set
            f = open(os.path.join(dir, str(s['id']) + '.txt'), 'r')
            lines = f.readlines()
            if lines: lines = lines[0].split(',')
            data = {}
            for line in lines[:-1]:
                line = line.split(':')
                data[int(line[0].strip())] = int(line[1].strip())

            cards = CardToSetMap.query.filter_by(card_set_id=s['id']).all()
            s['num_owned'] = 0
            if cards:
                for card in cards:
                    if data[card.id] > 0: s['num_owned'] += 1
            tmp.append(s)
    return {'status': True, 'sets': tmp}

# Get all set categories and their sets
@bp.route('/api/setCategories', methods=['GET'])
def get_set_categories():
    categories = SetCategory.query.all()
    if not categories: return {'status': False}
    rtrn = []
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
    for category in categories:
        tmp = []
        set = CardSet.query.filter_by(set_category_id=category.id).order_by(CardSet.tcg_date.desc()).all()
        if set:
            for s in set:
                s = s._toDict()
                if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")

                # Get the number of cards owned from that set
                f = open(os.path.join(dir, str(s['id']) + '.txt'), 'r')
                lines = f.readlines()
                if lines: lines = lines[0].split(',')
                data = {}
                for line in lines[:-1]:
                    line = line.split(':')
                    data[int(line[0].strip())] = int(line[1].strip())

                cards = CardToSetMap.query.filter_by(card_set_id=s['id']).all()
                s['num_owned'] = 0
                if cards:
                    for card in cards:
                        if data[card.id] > 0: s['num_owned'] += 1
                tmp.append(s)
            rtrn.append((category.category_name, tmp))
    return {'status': True, 'categories': rtrn}

# Get total worth
@bp.route('/api/totalWorth', methods=['GET'])
def get_totla_worth():
    categories = SetCategory.query.all()
    if not categories: return {'status': False}
    ttl = 0

    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
    for category in categories:
        set = CardSet.query.filter_by(set_category_id=category.id).order_by(CardSet.tcg_date.desc()).all()
        if set:
            for s in set:
                s = s._toDict()

                # Get the number of cards owned from that set
                f = open(os.path.join(dir, str(s['id']) + '.txt'), 'r')
                lines = f.readlines()
                if lines: lines = lines[0].split(',')
                data = {}
                for line in lines[:-1]:
                    line = line.split(':')
                    data[int(line[0].strip())] = int(line[1].strip())

                cards = CardToSetMap.query.filter_by(card_set_id=s['id']).all()
                if cards:
                    for card in cards:
                        if data[card.id] > 0: ttl += data[card.id] * card.card_price

    print('total: ', ttl)
    return {'status': True, 'total': ttl}

# Get all card sets
@bp.route('/api/cardsets', methods=['GET'])
def get_cardsets():
    cardsets = CardSet.query.all()
    rtrn = []
    if cardsets:
        for set in cardsets:
            rtrn.append(set._toDict())
    return {'cardsets': rtrn}

# Get card set by id
@bp.route('/api/cardset/<int:id>', methods=['GET'])
def get_cardSet(id):
    set = CardSet.query.filter_by(id=id).first()
    if set:
        s = set._toDict()
        if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")
        return {'status': True, 'cardset': s}
    return {'status': False, 'cardset': None}

# Add owned card by map id
@bp.route('/api/addOwnedCard/<int:id>', methods=['GET'])
def add_owned_card(id):
    print('Add Card Owned')
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
    map = CardToSetMap.query.filter_by(id=id).first()
    f = open(os.path.join(dir, str(map.card_set_id) + '.txt'), 'r')
    lines = f.readlines()
    if lines: lines = lines[0].split(',')
    data = {}
    for line in lines[:-1]:
        line = line.split(':')
        data[int(line[0].strip())] = int(line[1].strip())

    print('DATA ==> ', data)
    data[map.id] += 1

    f = open(os.path.join(dir, str(map.card_set_id) + '.txt'), 'w')
    for key, val in data.items():
        f.write(str(key) + ':' + str(val) + ',')
    f.close()

    return {'status': True, 'num_owned': data[map.id]}

# Remove owned card by map id
@bp.route('/api/removeOwnedCard/<int:id>', methods=['GET'])
def remove_owned_card(id):
    print('Remove Card Owned')
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))
    map = CardToSetMap.query.filter_by(id=id).first()
    f = open(os.path.join(dir, str(map.card_set_id) + '.txt'), 'r')
    lines = f.readlines()
    if lines: lines = lines[0].split(',')
    data = {}
    for line in lines[:-1]:
        line = line.split(':')
        data[int(line[0].strip())] = int(line[1].strip())
    data[map.id] -= 1

    f = open(os.path.join(dir, str(map.card_set_id) + '.txt'), 'w')
    for key, val in data.items():
        f.write(str(key) + ':' + str(val) + ',')
    f.close()
    return {'status': True, 'num_owned': data[map.id]}

# Get cardToSetMap by setId
@bp.route('/api/cards/from/setMap/<int:id>', methods=['GET'])
def getCardsToSetMap(id):
    maps = CardToSetMap.query.filter_by(card_set_id=id).order_by(CardToSetMap.card_code.asc()).all()
    rtrn = []
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(current_user.id))

    f = open(os.path.join(dir, str(id) + '.txt'), 'r')
    lines = f.readlines()
    if lines: lines = lines[0].split(',')
    data = {}
    for line in lines[:-1]:
        line = line.split(':')
        data[int(line[0].strip())] = int(line[1].strip())

    if maps:
        for map in maps:
            map = map._toDict()
            map['num_owned'] = data[map['id']]
            rtrn.append(map)
    return {'maps': rtrn}

# Get Card to set Map by id
@bp.route('/api/setMap/<int:id>', methods=['GET'])
def getSetMapById(id):
    map = CardToSetMap.query.filter_by(id=id).first()
    if not map: return {'map': None}
    return {'map': map._toDict()}


# Get Card by id
@bp.route('/api/card/<int:id>', methods=['GET'])
def get_card_by_id(id):
    card = Card.query.filter_by(id=id).first()
    if card: return {'status': True, 'card': card._toDict()}
    return {'status': False, 'card': None}

# Get rarity by id
@bp.route('/api/rarity/<int:id>', methods=['GET'])
def get_rarity_by_id(id):
    rarity = Rarity.query.filter_by(id=id).first()
    if rarity: return {'status': True, 'rarity': rarity._toDict()}
    return {'status': False, 'rarity': None}

# Get Archetype by id
@bp.route('/api/archetype/<int:id>', methods=['GET'])
def get_archetype_by_id(id):
    archetype = Archetype.query.filter_by(id=id).first()
    if archetype: return {'status': True, 'archetype': archetype._toDict()}
    return {'status': False, 'archetype': None}
