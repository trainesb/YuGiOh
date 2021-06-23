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
