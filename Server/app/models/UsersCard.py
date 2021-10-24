from app import db

class UsersCard(db.Model):
    __tablename__ = 'users_card'

    id = db.Column(db.Integer, primary_key=True)
    card = db.relationship('CardSetInfo', backref='users_card')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    num_owned = db.Column(db.Integer)
