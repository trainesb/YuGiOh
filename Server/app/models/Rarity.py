from app import db

class Rarity(db.Model):
    __tablename__ = 'raritiy'

    id = db.Column(db.Integer, primary_key=True)
    rarity = db.Column(db.String(50))
    rarity_code = db.Column(db.String(25))
    card_info_sets = db.relationship('CardSetInfo', lazy=True, backref=db.backref('raritiy'))

    def __init__(self, rarity, rarity_code):
        self.rarity = rarity
        self.rarity_code = rarity_code

    def __repr__(self):
        return """{{
                id: {}
                rarity: {}
                rarity-code: {}
            }}
        """.format(self.id, self.rarity, self.rarity_code)

    def _toDict(self):
        return {
            'id': self.id,
            'rarity': self.rarity,
            'rarity_code': self.rarity_code
        }
