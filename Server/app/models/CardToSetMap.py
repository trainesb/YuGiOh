from app import db

class CardToSetMap(db.Model):
    __tablename__ = 'cards_to_sets_map'

    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, index=True)
    card_set_id = db.Column(db.Integer, index=True)
    rarity_id = db.Column(db.Integer, index=True)
    card_code = db.Column(db.String(50))
    card_price = db.Column(db.Float)

    def __init__(self, card_id, card_set_id, rarity_id, card_code, card_price):
        self.card_id = card_id
        self.card_set_id = card_set_id
        self.rarity_id = rarity_id
        self.card_code = card_code
        self.card_price = card_price

    def __repr__(self):
        return '<Card_To_Set_Map id:{} card-id:{} card-set-id:{} rarity-id:{} card-code:{} card-price:{}>'.format(self.id, self.card_id, self.card_set_id, self.rarity_id, self.card_code, self.card_price)

    def _toDict(self):
        return {
            'id': self.id,
            'card_id': self.card_id,
            'card_set_id': self.card_set_id,
            'rarity_id': self.rarity_id,
            'card_code': self.card_code,
            'card_price': self.card_price
        }
