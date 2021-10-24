from app import db

class SetCategory(db.Model):
    __tablename__ = 'set_category'

    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(200), unique=True)
    card_sets = db.relationship('CardSet', backref='set_category')

    def __init__(self, category_name):
        self.category_name = category_name

    def __repr__(self):
        return '<Set Category id:{} category_name:{}>'.format(self.id, self.category_name)

    def _toDict(self):
        return {
            'id': self.id,
            'category_name': self.category_name,
        }
