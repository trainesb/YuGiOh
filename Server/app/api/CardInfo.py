from app import db
from app.api import bp
from app.models.CardSetInfo import CardSetInfo
from app.models.Rarity import Rarity

# Get all cards for set
@bp.route('/api/CardSetInfo/<string:set>', methods=['GET'])
def get_cards_by_set(set):
    card = CardSetInfo.query.first()
    print(card)

    return {'status': True}
