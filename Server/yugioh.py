import os
import click
import shutil
import requests
from app import create_app, db
from app.models.Card import Card
from app.models.Rarity import Rarity
from app.models.CardSet import CardSet
from app.models.Archetype import Archetype
from app.models.SetCategory import SetCategory
from app.models.CardToSetMap import CardToSetMap

app = create_app()


@app.cli.command('init_set_category')
def init_set_category():
    print('Init Set Category')
    categories = ['Booster Pack', 'Special Edition Boxes', 'Starter Decks', 'Structure Decks', 'Tins', 'Spped Duel', 'Duelist Packs', 'Duel Terminal Cards', 'Others']
    for cat in categories:
        c = SetCategory(cat)
        db.session.add(c)
    db.session.commit()
    print('Done!')

@app.cli.command('init_archetypes')
def init_archetypes():
    print('Initializeing Archetypes Table...', end='')
    data = requests.get('https://db.ygoprodeck.com/api/v7/archetypes.php').json()
    archetypes = Archetype.query.all()
    if archetypes:
        for typ in data:
            if Archetype.query.filter_by(archetype_name=typ['archetype_name']).first() is None:
                archetype = Archetype(typ['archetype_name'])
                db.session.add(archetype)
    else:
        for typ in data:
            archetype = Archetype(typ['archetype_name'])
            db.session.add(archetype)

    db.session.commit()
    print('\nDone!')

@app.cli.command('get_archetypes')
def get_archetypes():
    archetypes = Archetype.query.all()
    if archetypes:
        for arch in archetypes: print(arch)
    else: print('Archetype Table Is Empty!')
    print('\nDone!')


rarity_list = [
    ('Common', '(C)'),
    ('Rare', '(R)'),
    ('Super Rare', '(SR)'),
    ('Holofoil Rare', '(HFR)'),
    ('Ultra Rare', '(UR)'),
    ('Ultimate Rare', '(UtR)'),
    ('Secret Rare', '(ScR)'),
    ('Ultra Secret Rare', '(UScR)'),
    ('Secret Ultra Rare', '(ScUR)'),
    ('Prismatic Secret Rare', '(PScR)'),
    ('Parallel Rare', '(PR)'),
    ('Parallel Common', '(PC)'),
    ('Super Parallel Rare', '(SPR)'),
    ('Ultra Parallel Rare', '(UPR)'),
    ('Starfoil Rare', '(SFR)'),
    ('Ghost Rare', '(GR)'),
    ('Gold Ultra Rare', '(GUR)')
]
@app.cli.command('init_rarities')
def init_rarities():
    global rarity_list
    print('Initializeing Rarity Table...', end='')
    rarities = Rarity.query.all()
    if rarities:
        for rar in rarity_list:
            if Rarity.query.filter_by(rarity=rar[0]).first() is None:
                rarity = Rarity(rar[0], rar[1])
                db.session.add(rarity)
    else:
        for rar in rarity_list:
            rarity = Rarity(rar[0], rar[1])
            db.session.add(rarity)
    db.session.commit()
    print('Done!')

@app.cli.command('get_rarities')
def get_rarities():
    rarities = Rarity.query.all()
    if rarities:
        for rar in rarities: print(rar)
    else: print('Rarity Table Is Empty!')
    print('\nDone!')


@app.cli.command('init_card_sets')
def init_card_sets():
    print('Initializeing Card Set Table...', end='')
    data = requests.get('https://db.ygoprodeck.com/api/v7/cardsets.php').json()
    cardsets = CardSet.query.all()
    if cardsets:
        for set in data:
            if CardSet.query.filter_by(set_name=set['set_name']).first() is None:
                dt = None
                if 'tcg_date' in set: dt = set['tcg_date']
                cardset = CardSet(set['set_name'], set['set_code'], set['num_of_cards'], dt)
                db.session.add(cardset)
    else:
        for set in data:
            print('Data ==> ', set)
            dt = None
            if 'tcg_date' in set: dt = set['tcg_date']
            cardset = CardSet(set['set_name'], set['set_code'], set['num_of_cards'], dt)
            db.session.add(cardset)

    db.session.commit()
    print('\nDone!')

@app.cli.command('get_card_sets')
def get_card_sets():
    cardsets = CardSet.query.all()
    if cardsets:
        for set in cardsets: print(set)
    else: print('Card Set Table Is Empty!')
    print('\nDone!')


@app.cli.command('del_all_cards')
def del_all_cards():
    Card.query.delete()
    db.session.commit()

@app.cli.command('init_cards')
def init_cards():
    print('Initializing Cards Table...', end='')
    img_folder = os.path.abspath(os.path.join(os.getcwd(), '..', 'Client', 'src', 'images'))
    print('img_folder: ', img_folder)

    data = requests.get('https://db.ygoprodeck.com/api/v7/cardinfo.php').json()['data']
    for dt in data:
        archetype_id = None
        atk = None
        defense = None
        level = None
        attribute = None
        image = None
        image_small = None

        if 'archetype' in dt:
            archetype_id = Archetype.query.filter_by(archetype_name=dt['archetype']).first()
            if archetype_id is not None: archetype_id = archetype_id.id
        if 'atk' in dt: atk = dt['atk']
        if 'def' in dt: defense = dt['def']
        if 'level' in dt: level = dt['level']
        if 'attribute' in dt: attribute = dt['attribute']

        if 'card_images' in dt:
            card_images = dt['card_images'][0]
            if 'image_url' in card_images:
                image = os.path.join('cards', card_images['image_url'].split('/')[-1])
                # r = requests.get(card_images['image_url'], stream=True)
                # if r.status_code == 200:
                #     r.raw.decode_content = True
                #     with open(image, 'wb') as f:
                #         shutil.copyfileobj(r.raw, f)
                #     print('Image successfully downloaded: ', image)
                # else:
                #     print('Image couldn\'t be retrived')
            if 'image_url_small' in card_images:
                image_small = os.path.join('cards_small', card_images['image_url_small'].split('/')[-1])
                # r = requests.get(card_images['image_url_small'], stream=True)
                # if r.status_code == 200:
                #     r.raw.decode_content = True
                #     with open(image_small, 'wb') as f:
                #         shutil.copyfileobj(r.raw, f)
                #     print('Image successfully downloaded: ', image_small)
                # else:
                #     print('Image couldn\'t be retrived')

        card = Card(dt['name'], dt['type'], dt['desc'], atk, defense, level, dt['race'], attribute, archetype_id, image, image_small)

        if 'atk' in dt:
            print(atk)
            print(card)
        db.session.add(card)
    db.session.commit()
    print('Done!')

@app.cli.command('get_cards')
def get_cards():
    cards = Card.query.all()
    if cards:
        for card in cards: print(card)
    else: print('Card Table Is Empty!')
    print('\nDone!')

@app.cli.command('del_all_card_map')
def del_card_set_map():
    CardToSetMap.query.delete()
    db.session.commit()

@app.cli.command('init_card_to_set_map')
def init_card_to_set_map():
    print('Initializing Card To Set Map...')
    data = requests.get('https://db.ygoprodeck.com/api/v7/cardinfo.php').json()['data']
    for dt in data:
        card = Card.query.filter_by(name=dt['name']).first()
        if card:
            if 'card_sets' in dt:
                for st in dt['card_sets']:
                    print('Card Set ==> ', st)
                    set = CardSet.query.filter_by(set_name=st['set_name']).first()
                    if set: set = set.id
                    rarity = Rarity.query.filter_by(rarity_code=st['set_rarity_code']).first()
                    if rarity: rarity = rarity.id
                    card_map = CardToSetMap(card.id, set, rarity, st['set_code'], st['set_price'])
                    db.session.add(card_map)
    db.session.commit()
    print('Done!')

@app.cli.command('get_card_to_set_map')
def get_card_to_set_map():
    card_to_set_maps = CardToSetMap.query.all()
    if card_to_set_maps:
        for ctsm in card_to_set_maps: print(ctsm)
    else: print('CardTo Set Map Table Is Empty!')
    print('\nDone!')


@app.cli.command('fix_card_images')
def fix_card_images():
    print('Fixing Card Images')
    cards = Card.query.all()
    img_folder = os.path.abspath(os.path.join(os.getcwd(), '..', 'Client', 'src', 'images'))
    if cards:
        for card in cards:
            card.image = os.path.join('images', 'cards', card.image.split("\\")[-1])
            card.image_small = os.path.join('images', 'cards_small', card.image_small.split("\\")[-1])
            db.session.add(card)
        db.session.commit()
    print('\nDone!')
