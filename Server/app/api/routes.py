from app import db
from app.api import bp
from app.models.Card import Card

@bp.route('/api/test', methods=['GET'])
def get_test():
    print('Test')
    return {'status': True}
