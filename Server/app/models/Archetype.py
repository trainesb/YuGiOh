from app import db

class Archetype(db.Model):
    __tablename__ = 'archetypes'

    id = db.Column(db.Integer, primary_key=True)
    archetype_name = db.Column(db.String(100), unique=True)

    def __init__(self, archetype_name):
        self.archetype_name = archetype_name

    def __repr__(self):
        return '<Archetype id:{} Archetype-Name:{}>'.format(self.id, self.archetype_name)

    def _toDict(self):
        return {
            'id': self.id,
            'archetype_name': self.archetype_name,
        }
