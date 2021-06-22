from app import db, login
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    phone = db.Column(db.String(20), index=True, unique=True)
    phone_provider = db.Column(db.String(30))
    password_hash = db.Column(db.String(128))

    invited = db.Column(db.DateTime)
    created = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime)
    last_active = db.Column(db.DateTime)
    two_factor = db.Column(db.String(4))
    two_factor_timestamp = db.Column(db.DateTime)

    card_folder = db.Column(db.String(120), unique=True)

    def __repr__(self):
        return '<User ID:{} Username:{} Email:{} Phone:{} Phone Provider:{} Invited:{} Created:{} Last Updated:{} Last Active:{} Card Folder:{}>'.format(self.id, self.username, self.email, self.phone, self.phone_provider, self.invited, self.created, self.last_updated, self.last_active, self.card_folder)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_phone_provider(self):
        providers = {
            '@txt.att.net': 'AT&T',
            '@pm.sprint.com': 'Sprint',
            '@tmomail.net': 'T-Mobile',
            '@vtext.com': 'Verizon',
            '@myboostmobile.com': 'Boost Mobile',
            '@sms.mycricket.com': 'Cricket',
            '@mymetropcs.com': 'Metro PCS',
            '@mmst5.tracfone.com': 'Tracefone',
            '@email.uscc.net': 'U.S. Cellular',
            '@vmobl.com': 'Virgin Mobile'
        }
        return providers.get(self.phone_provider)

    def _toDict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'phone_provider': self.phone_provider,
            'phone_provider_text': self.get_phone_provider(),
            'password_hash': self.password_hash,
            'created': self.created,
            'last_updated': self.last_updated,
            'last_active': self.last_active,
            'invited': self.invited,
            'card_folder': self.card_folder
        }

@login.user_loader
def load_user(id):
    return User.query.get(int(id))
