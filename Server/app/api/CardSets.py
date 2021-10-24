import os
import re
import datetime
from app import db
from app.api import bp
from app.models.Card import Card
from app.models.Rarity import Rarity
from app.models.CardSet import CardSet
from app.models.CardSetInfo import CardSetInfo
from app.models.SetCategory import SetCategory
from app.models.UsersCard import UsersCard

# Get cards by set code
@bp.route('/api/set/cards/<string:code>', methods=['GET'])
def getCardsBySetCode(code):
    set = CardSet.query.filter_by(set_code=code).first()
    if set is None: return {'cards': None}

    cardInfos = CardSetInfo.query.with_parent(set).all()
    rtrn = []
    for card in cardInfos:
        rtrn.append(card._toDict())
    return {'cards': rtrn}

# Get Set By Code
@bp.route('/api/set/<string:code>', methods=['GET'])
def getSetBySetCode(code):
    set = CardSet.query.filter_by(set_code=code).first()
    if set is None: return {'set': None}
    return {'set': set._toDict()}
