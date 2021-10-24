from app import db
from app.models.Rarity import Rarity
from app.models.Card import Card
from app.models.CardSet import CardSet

class CardSetInfo(db.Model):
    __tablename__ = 'card_set_info'

    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'))
    card_set_id = db.Column(db.Integer, db.ForeignKey('card_sets.id'))

    rarity_id = db.Column(db.Integer, db.ForeignKey('raritiy.id'))
    card_code = db.Column(db.String(50))
    card_price = db.Column(db.Float)
    users_card_id = db.Column(db.Integer, db.ForeignKey('users_card.id'))


    def __repr__(self):
        return """CardSetInfo ==>
            id: {}
            Code: {}
            Price: {}
            """.format(self.id, self.card_code, self.card_price)

    def _toDict(self):
        card = Card.query.with_parent(self).first()
        rarity = Rarity.query.with_parent(self).first()
        set = CardSet.query.with_parent(self).first()
        time = None
        if set.tcg_date is not None: time = set.tcg_date.strftime("%d %b, %Y")
        return {
            'card_set_info_id': self.id,
            'card_code': self.card_code,
            'card_price': self.card_price,
            'card_id': card.id,
            'name': card.name,
            'type': card.type,
            'desc': card.desc,
            'atk': card.atk,
            'defense': card.defense,
            'level': card.level,
            'race': card.race,
            'attribute': card.attribute,
            'archetype': card.archetype,
            'image': card.image.split('\\')[-1],
            'image_small': card.image_small.split('\\')[-1],
            'scale': card.scale,
            'linkval': card.linkval,
            'linkmarkers': card.linkmarkers,
            'rarity': rarity.rarity,
            'rarity_code': rarity.rarity_code,
            'set_id': set.id,
            'category_id': set.category_id,
            'set_name': set.set_name,
            'set_code': set.set_code,
            'num_of_cards': set.num_of_cards,
            'tcg_date': time,
            'set_image': set.image
        }
