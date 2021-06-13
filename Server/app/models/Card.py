from app import db

class Card(db.Model):
    __tablename__ = 'cards'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250))
    type = db.Column(db.String(50))
    desc = db.Column(db.String(2000))
    atk = db.Column(db.Integer)
    defense = db.Column(db.Integer)
    level = db.Column(db.Integer)
    race = db.Column(db.String(50))
    attribute = db.Column(db.String(150))
    archetype_id = db.Column(db.Integer, index=True)

    image = db.Column(db.String(500))
    image_small = db.Column(db.String(500))

    def __init__(self, name, type, desc, atk, defense, level, race, attribute, archetype_id, image, image_small):
        self.name = name
        self.type = type
        self.desc = desc
        self.atk = atk
        self.defense = defense
        self.level = level
        self.race = race
        self.attribute = attribute
        self.archetype_id = archetype_id
        self.image = image
        self.image_small = image_small

    def __repr__(self):
        return '<Card id:{} Name:{} Type:{} Desc:{} ATK:{} DEF:{} Level:{} Race:{} Attribute:{} Archtype-ID:{} Image:{} Image-Small:{}>'.format(self.id, self.name, self.type, self.desc, self.atk, self.defense, self.level, self.race, self.attribute, self.archetype_id, self.image, self.image_small)

    def _toDict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'desc': self.desc,
            'atk': self.atk,
            'defense': self.defense,
            'level': self.level,
            'race': self.race,
            'attribute': self.attribute,
            'archetype_id': self.archetype_id,
            'image': self.image,
            'image_small': self.image_small
        }
