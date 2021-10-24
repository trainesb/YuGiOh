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
    archetype = db.Column(db.String(150))
    scale = db.Column(db.String(10))
    linkval = db.Column(db.String(150))
    linkmarkers = db.Column(db.String(150))

    image = db.Column(db.String(500))
    image_small = db.Column(db.String(500))
    card_info_sets = db.relationship('CardSetInfo', lazy=True, backref=db.backref('cards'))

    def __init__(self, name, type, desc, atk, defense, level, race, attribute, archetype, scale, linkval, linkmarkers, image, image_small):
        self.name = name
        self.type = type
        self.desc = desc
        self.atk = atk
        self.defense = defense
        self.level = level
        self.race = race
        self.attribute = attribute
        self.archetype = archetype
        self.scale = scale
        self.linkval = linkval
        self.linkmarkers = linkmarkers
        self.image = image
        self.image_small = image_small

    def __repr__(self):
        return """{{
            id: {}
            Name: {}
            Type: {}
            Desc: {}
            ATK: {}
            DEF: {}
            Level: {}
            Race: {}
            Attribute: {}
            Archtype: {}
            Image: {}
            Image-Small: {}
        }}
        """.format(self.id, self.name, self.type, self.desc, self.atk, self.defense, self.level, self.race, self.attribute, self.archetype, self.image, self.image_small)

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
            'archetype': self.archetype,
            'image': self.image,
            'image_small': self.image_small,
            'scale': self.scale,
            'linkval': self.linkval,
            'linkmarkers': self.linkmarkers
        }
