import os
import datetime
from app import db
from app.api import bp
from app.models.Card import Card
from app.models.Rarity import Rarity
from app.models.CardSet import CardSet
from app.models.Archetype import Archetype
from app.models.SetCategory import SetCategory
from app.models.CardToSetMap import CardToSetMap

# Get searched card by card id and user id
@bp.route('/api/searched/card/<int:cardId>/user/<int:userId>', methods=['GET'])
def get_card_searched_by_id_for_user(cardId, userId):
    card = Card.query.filter_by(id=cardId).first()
    if card: card = card._toDict()

    cardMap = CardToSetMap.query.filter_by(card_id=cardId).all()
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
                dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(userId))
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

# Get total worth
@bp.route('/api/totalWorth/<int:id>', methods=['GET'])
def get_totla_worth_for_user(id):
    categories = SetCategory.query.all()
    if not categories: return {'status': False}
    ttl = 0

    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(id))
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

# Get all set categories and their sets for user with id
@bp.route('/api/user/public-profile/<int:id>', methods=['GET'])
def get_set_categories_for_user(id):
    categories = SetCategory.query.all()
    if not categories: return {'status': False}
    rtrn = []
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(id))
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

# Get most completed categories for user with id
@bp.route('/api/user/<int:id>/top', methods=['GET'])
def get_top_set_for_user(id):
    categories = SetCategory.query.all()
    if not categories: return {'status': False}
    rtrn = []
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(id))
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

# Get Total Number of Cards Owned, unique by user id
@bp.route('/api/user/<int:id>/numCardsOwned', methods=['GET'])
def get_num_of_cards_by_userID(id):
    categories = SetCategory.query.all()
    if not categories: return {'status': False}

    num_cards = 0
    unique_cards = 0

    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(id))
    for category in categories:
        set = CardSet.query.filter_by(set_category_id=category.id).order_by(CardSet.tcg_date.desc()).all()
        if set:
            for s in set:
                f = open(os.path.join(dir, str(s.id) + '.txt'), 'r')
                lines = f.readlines()
                if lines: lines = lines[0].split(',')
                data = {}
                for line in lines[:-1]:
                    line = line.split(':')
                    num = int(line[1].strip())
                    num_cards += num
                    if num > 0: unique_cards += 1
    return {'num_cards': num_cards, 'num_unique_cards': unique_cards}

# Get all cards owned by user id
@bp.route('/api/user/<int:id>/allCardsOwned', methods=['GET'])
def get_all_of_cards_by_userID(id):
    categories = SetCategory.query.all()
    if not categories: return {'status': False}

    rtrn = []
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(id))
    for category in categories:
        set = CardSet.query.filter_by(set_category_id=category.id).order_by(CardSet.tcg_date.desc()).all()
        if set:
            for s in set:
                s = s._toDict()
                if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")

                f = open(os.path.join(dir, str(s['id']) + '.txt'), 'r')
                lines = f.readlines()
                if lines: lines = lines[0].split(',')
                tmp = []
                for line in lines[:-1]:
                    line = line.split(':')
                    num = int(line[1].strip())
                    cardMapId = int(line[0].strip())
                    if num > 0:
                        map = CardToSetMap.query.filter_by(id=cardMapId).first()
                        map = map._toDict()
                        map['num_owned'] = num

                        card = Card.query.filter_by(id=map['card_id']).first()
                        map['card'] = card._toDict()
                        tmp.append(map)
                if tmp:
                    s['cards_owned'] = tmp
                    rtrn.append(s)
    return {'cards': rtrn}

# Get 10 Most Expinsive Cards
@bp.route('/api/user/<int:id>/topCardsOwned', methods=['GET'])
def get_top_of_cards_by_userID(id):
    categories = SetCategory.query.all()
    if not categories: return {'status': False}

    rtrn = []
    dir = os.path.join(os.getcwd(), 'users_card_data', 'user_' + str(id))
    for category in categories:
        set = CardSet.query.filter_by(set_category_id=category.id).order_by(CardSet.tcg_date.desc()).all()
        if set:
            for s in set:
                s = s._toDict()
                if s['tcg_date']: s['tcg_date'] = datetime.date.strftime(s['tcg_date'], "%m/%d/%Y")

                f = open(os.path.join(dir, str(s['id']) + '.txt'), 'r')
                lines = f.readlines()
                if lines: lines = lines[0].split(',')

                for line in lines[:-1]:
                    line = line.split(':')
                    num = int(line[1].strip())
                    cardMapId = int(line[0].strip())
                    if num > 0:
                        print('Card Owned')
                        map = CardToSetMap.query.filter_by(id=cardMapId).first()
                        map = map._toDict()
                        map['num_owned'] = num
                        map['set'] = s

                        card = Card.query.filter_by(id=map['card_id']).first()
                        print('Card: ', card.name)
                        map['card'] = card._toDict()
                        if rtrn:
                            print('rtrn not empty')
                            bool = False
                            tmp = []
                            for r in rtrn:
                                print('tmp len: ', len(tmp))
                                if len(tmp) > 9: break
                                print('new card price: ', map['card_price'])
                                print('old card price: ', r['card_price'])
                                if map['card_price'] > r['card_price'] and not bool:
                                    bool = True
                                    print('Card: ', card.name, ' added')
                                    tmp.append(map)
                                    tmp.append(r)
                                else: tmp.append(r)
                            if not bool and len(tmp) < 10:
                                print('Card: ', card.name, ' added')
                                tmp.append(map)
                            rtrn = tmp
                        else:
                            print('rtrn empty')
                            rtrn.append(map)

    return {'cards': rtrn}
