from app import db

class Rarity(db.Model):
    __tablename__ = 'rarities'

    id = db.Column(db.Integer, primary_key=True)
    rarity = db.Column(db.String(50), unique=True)
    rarity_code = db.Column(db.String(25), unique=True)

    def __init__(self, rarity, rarity_code):
        self.rarity = rarity
        self.rarity_code = rarity_code

    def __repr__(self):
        return '<Rarity id:{} rarity:{} rarity-code:{}>'.format(self.id, self.rarity, self.rarity_code)

    def _toDict(self):
        return {
            'id': self.id,
            'rarity': self.rarity,
            'rarity_code': self.rarity_code
        }
