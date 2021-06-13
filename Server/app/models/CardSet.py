from app import db


class CardSet(db.Model):
    __tablename__ = 'card_sets'

    id = db.Column(db.Integer, primary_key=True)
    set_category_id = db.Column(db.Integer)
    set_name = db.Column(db.String(250), unique=True)
    set_code = db.Column(db.String(25))
    num_of_cards = db.Column(db.Integer)
    tcg_date = db.Column(db.DateTime)

    def __init__(self, set_name, set_code, num_of_cards, tcg_date=None):
        self.set_name = set_name
        self.set_code = set_code
        self.num_of_cards = num_of_cards
        self.tcg_date = tcg_date

    def __repr__(self):
        return '<CardSet id:{} set-category-id:{} Set-Name:{} Set-Code:{} Num-Of-Cards:{} TCG Date:{}>'.format(self.id, self.set_category_id, self.set_name, self.set_code, self.num_of_cards, self.tcg_date)

    def _toDict(self):
        return {
            'id': self.id,
            'set_name': self.set_name,
            'set_category_id': self.set_category_id,
            'set_code': self.set_code,
            'num_of_cards': self.num_of_cards,
            'tcg_date': self.tcg_date
        }
