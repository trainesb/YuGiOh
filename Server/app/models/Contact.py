from app import db
from datetime import datetime

class Contact(db.Model):
    __tablename__ = 'contact'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    phone = db.Column(db.String(20), index=True, unique=True)
    phone_provider = db.Column(db.String(30))
    msg = db.Column(db.String(10000))
    timestamp = db.Column(db.DateTime)

    def __init__(self, username, email, phone, phone_provider, msg):
        self.username = username
        self.email = email
        self.phone = phone
        self.phone_provider = phone_provider
        self.msg = msg
        self.timestamp = datetime.now()

    def __repr__(self):
        return '<Contact id:{} username:{} email:{} phone:{} phone_provider:{} msg:{} timestamp:{}>'.format(self.id, self.username, self.email, self.phone, self.phone_provider, self.msg, self.timestamp)

    def _toDict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'phone_provider': self.phone_provider,
            'msg': self.msg,
            'timestamp': self.timestamp
        }
