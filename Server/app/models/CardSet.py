from app import db
from datetime import datetime


class CardSet(db.Model):
    __tablename__ = 'card_sets'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('set_category.id'))
    set_name = db.Column(db.String(250), unique=True)
    set_code = db.Column(db.String(25))
    num_of_cards = db.Column(db.Integer)
    image = db.Column(db.String(250))
    tcg_date = db.Column(db.DateTime)
    card_info_sets = db.relationship('CardSetInfo', lazy=True, backref=db.backref('card_sets'))

    def __init__(self, set_name, set_code, num_of_cards, tcg_date=None):
        self.set_name = set_name
        self.set_code = set_code
        self.num_of_cards = num_of_cards
        self.tcg_date = tcg_date

    def __repr__(self):
        return """{{
            id: {}
            Set-Name: {}
            Set-Code: {}
            Image: {}
            Num-Of-Cards: {}
            TCG Date: {}
        }}
        """.format(self.id, self.set_name, self.set_code, self.image, self.num_of_cards, self.tcg_date)

    def _toDict(self):
        time = None
        if self.tcg_date is not None: time = self.tcg_date.strftime("%d %b, %Y")
        return {
            'id': self.id,
            'category_id': self.category_id,
            'set_name': self.set_name,
            'set_code': self.set_code,
            'num_of_cards': self.num_of_cards,
            'tcg_date': time,
            'image': self.image
        }
