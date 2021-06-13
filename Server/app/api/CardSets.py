import datetime
from app import db
from app.api import bp
from app.models.Card import Card
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

# Get card sets by category
@bp.route('/api/category/to/set/<int:id>', methods=['GET'])
def get_set_by_category_id(id):
    tmp = []
    set = CardSet.query.filter_by(set_category_id=id).order_by(CardSet.tcg_date.desc()).all()
    if set:
        for s in set:
            s = s._toDict()
            if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")

            # Get the number of cards owned from that set
            cards = CardToSetMap.query.filter_by(card_set_id=s['id']).all()
            s['num_owned'] = 0
            if cards:
                for card in cards:
                    if card.num_owned > 0:
                        s['num_owned'] += 1
            tmp.append(s)
    return {'status': True, 'sets': tmp}

# Get all set categories and their sets
@bp.route('/api/setCategories', methods=['GET'])
def get_set_categories():
    categories = SetCategory.query.all()
    if not categories: return {'status': False}
    rtrn = []
    for category in categories:
        tmp = []
        set = CardSet.query.filter_by(set_category_id=category.id).order_by(CardSet.tcg_date.desc()).all()
        if set:
            for s in set:
                s = s._toDict()
                if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")

                # Get the number of cards owned from that set
                cards = CardToSetMap.query.filter_by(card_set_id=s['id']).all()
                s['num_owned'] = 0
                if cards:
                    for card in cards:
                        if card.num_owned > 0:
                            s['num_owned'] += 1
                tmp.append(s)
            rtrn.append((category.category_name, tmp))
    return {'status': True, 'categories': rtrn}

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
    map = CardToSetMap.query.filter_by(id=id).first()
    if not map: return {'status': False, 'num_owned': 0}
    map.num_owned += 1
    db.session.add(map)
    db.session.commit()
    return {'status': True, 'num_owned': map.num_owned}

# Remove owned card by map id
@bp.route('/api/removeOwnedCard/<int:id>', methods=['GET'])
def remove_owned_card(id):
    map = CardToSetMap.query.filter_by(id=id).first()
    if not map: return {'status': False}
    if map.num_owned > 0:
        map.num_owned -= 1
        db.session.add(map)
        db.session.commit()
    return {'status': True, 'num_owned': map.num_owned}

# Get cardToSetMap by setId
@bp.route('/api/cards/from/setMap/<int:id>', methods=['GET'])
def getCardsToSetMap(id):
    maps = CardToSetMap.query.filter_by(card_set_id=id).order_by(CardToSetMap.card_code.asc()).all()
    rtrn = []
    if maps:
        for map in maps:
            rtrn.append(map._toDict())
    return {'maps': rtrn}

# Get Card to set Map by id
@bp.route('/api/setMap/<int:id>', methods=['GET'])
def getSetMapById(id):
    map = CardToSetMap.query.filter_by(id=id).first()
    if map: return {'map': map._toDict()}
    return {'map': None}

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
