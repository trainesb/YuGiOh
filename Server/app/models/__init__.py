from flask import Blueprint

bp = Blueprint('models', __name__)

from app.models import User, Card, CardSet, CardToSetMap, Archetype, Rarity, SetCategory
