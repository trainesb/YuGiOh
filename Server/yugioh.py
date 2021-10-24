import os
import click
import shutil
import requests
from flask import session, json
from app import create_app, db
from datetime import datetime, timedelta

from app.models.User import User
from app.models.Card import Card
from app.models.Rarity import Rarity
from app.models.CardSet import CardSet
from app.models.CardSetInfo import CardSetInfo
from app.models.SetCategory import SetCategory
from app.models.UsersCard import UsersCard

app = create_app()

# Create Admin
@app.cli.command('init_admin')
def init_admin():
    User.query.delete()
    user = User()
    user.username = 'admin'
    user.set_password('admin')
    user.role = 'A'
    db.session.add(user)
    db.session.commit()

# Init Set Categories
@app.cli.command('init_set_category')
def init_set_category():
    print('Init Set Category')
    SetCategory.query.delete()
    file = os.path.join(os.getcwd(), 'etc', 'category_list.json')
    file = open(file)
    data = json.load(file)
    for category in  data['category_list']:
        cat = SetCategory(category)
        db.session.add(cat)
    db.session.commit()
    print('Done!')

# Map Categories to Set
@app.cli.command('map_categories_to_set')
def map_categories_to_set():
    file = os.path.join(os.getcwd(), 'etc', 'category_to_set.json')
    file = open(file)
    data = json.load(file)
    data = data['category_to_set']
    for category in  data:
        set_codes = data[category]
        set_category = SetCategory.query.filter_by(category_name=category).first()
        for set_code in set_codes:
            set = CardSet.query.filter_by(set_code=set_code).first()
            if set is not None:
                set_category.card_sets.append(set)
        db.session.add(set_category)
    db.session.commit()

# Init Rarities
@app.cli.command('init_rarities')
def init_rarities():
    print('Init rarities')
    Rarity.query.delete()
    file = os.path.join(os.getcwd(), 'etc', 'rarity_list.json')
    file = open(file)
    data = json.load(file)
    for key, value in data['rarity_list'].items():
        rarity = Rarity(key, value)
        db.session.add(rarity)
    db.session.commit()
    print('Done!')

# Delte All Rarities
@app.cli.command('del_rarities')
def del_rarities():
    print('Delete rarities')
    Rarity.query.delete()
    db.session.commit()
    print('Done!')

# Get All Rarities
@app.cli.command('get_rarities')
def get_rarities():
    print('Get Rarities')
    rarities = Rarity.query.all()
    if rarities is not None:
        for rarity in rarities: print(rarity)
    print('Done!')

# Init Card Sets
@app.cli.command('init_card_sets')
def init_card_sets():
    print('Initializeing Card Set Table')
    CardSetInfo.query.delete()
    CardSet.query.delete()

    data = requests.get('https://db.ygoprodeck.com/api/v7/cardsets.php').json()

    for set in data:
        print('Data ==> ', set)
        dt = None
        if 'tcg_date' in set: dt = set['tcg_date']
        cardset = CardSet.query.filter_by(set_code=set['set_code']).first()
        if cardset is None: cardset = CardSet(set['set_name'], set['set_code'], set['num_of_cards'], dt)
        else: cardset.num_of_cards += set['num_of_cards']
        db.session.add(cardset)

    db.session.commit()
    print('\nDone!')

# Delete All Cards
@app.cli.command('del_all_cards')
def del_all_cards():
    Card.query.delete()
    db.session.commit()

# Init Cards
@app.cli.command('init_cards')
def init_cards():
    print('Initializing Cards Table.')
    Card.query.delete()
    img_folder = os.path.abspath(os.path.join(os.getcwd(), '..', 'Client', 'src', 'images'))
    print('img_folder: ', img_folder)

    data = requests.get('https://db.ygoprodeck.com/api/v7/cardinfo.php').json()['data']
    for dt in data:
        atk = None
        defense = None
        level = None
        attribute = None
        archetype = None
        scale = None
        linkval = None
        linkmarkers = None
        if 'atk' in dt: atk = dt['atk']
        if 'def' in dt: defense = dt['def']
        if 'level' in dt: level = dt['level']
        if 'attribute' in dt: attribute = dt['attribute']
        if 'archetype' in dt: archetype = dt['archetype']
        if 'scale' in dt: scale = dt['scale']
        if 'linkval' in dt: linkval = dt['linkval']
        if 'linkmarkers' in dt:
            linkmarkers = ''
            for link in dt['linkmarkers']:
                linkmarkers += link + ','
            linkmarkers = linkmarkers[:-1]

        image = None
        image_small = None


        if 'card_images' in dt:
            card_images = dt['card_images'][0]
            if 'image_url' in card_images:
                image = os.path.abspath(os.path.join(os.getcwd(), '..', 'Client', 'public', 'images', 'images', 'cards', card_images['image_url'].split('/')[-1]))
                print('Image URL: ', image)
                if not os.path.exists(image):
                    r = requests.get(card_images['image_url'], stream=True)
                    if r.status_code == 200:
                        r.raw.decode_content = True
                        with open(image, 'wb') as f:
                            shutil.copyfileobj(r.raw, f)
                        print('Image successfully downloaded: ', image)
                    else:
                        print('Image couldn\'t be retrived')
            if 'image_url_small' in card_images:
                image_small = os.path.abspath(os.path.join(os.getcwd(), '..', 'Client', 'public', 'images', 'images', 'cards_small', card_images['image_url_small'].split('/')[-1]))
                if not os.path.exists(image_small):
                    r = requests.get(card_images['image_url_small'], stream=True)
                    if r.status_code == 200:
                        r.raw.decode_content = True
                        with open(image_small, 'wb') as f:
                            shutil.copyfileobj(r.raw, f)
                        print('Image successfully downloaded: ', image_small)
                    else:
                        print('Image couldn\'t be retrived')

            card = Card(dt['name'], dt['type'], dt['desc'], atk, defense, level, dt['race'], attribute, archetype, scale, linkval, linkmarkers, image, image_small)
            db.session.add(card)
    db.session.commit()
    print('Done!')

# Get All Cards
@app.cli.command('get_cards')
def get_cards():
    cards = Card.query.all()
    if cards:
        for card in cards: print(card)
    else: print('Card Table Is Empty!')
    print('\nDone!')

# Init Card To Set Map
@app.cli.command('init_card_to_set_map')
def init_card_to_set_map():
    print('Initializing Card To Set Map.')
    CardSetInfo.query.delete()
    data = requests.get('https://db.ygoprodeck.com/api/v7/cardinfo.php').json()['data']
    for dt in data:
        card = Card.query.filter_by(name=dt['name']).first()
        if card:
            if 'card_sets' in dt:
                for st in dt['card_sets']:

                    set = CardSet.query.filter_by(set_name=st['set_name']).first()
                    if set is not None:
                        print('Card Set ==> ', st)
                        card_map = CardSetInfo()
                        card_map.card_code = st['set_code']
                        card_map.card_price = st['set_price']
                        db.session.add(card_map)

                        if st['set_rarity_code'] != '': rarity = Rarity.query.filter_by(rarity_code=st['set_rarity_code']).first()
                        else: rarity = Rarity.query.filter_by(rarity_code='(' + st['set_rarity'] + ')').first()
                        if rarity is None: rarity = Rarity(st['set_rarity'], st['set_rarity_code'])
                        rarity.card_info_sets.append(card_map)
                        db.session.add(rarity)

                        card.card_info_sets.append(card_map)
                        db.session.add(card)



                        set.card_info_sets.append(card_map)
                        db.session.add(set)


    db.session.commit()
    print('Done!')
