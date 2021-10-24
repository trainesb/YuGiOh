from app import db
from app.api import bp
from app.models.SetCategory import SetCategory
from app.models.CardSet import CardSet
from flask import request

# Get all Categories
@bp.route('/api/catgeories', methods=['GET'])
def getCategories():
    categories = SetCategory.query.all()
    rtrn = []
    if categories:
        for categorie in categories:
            rtrn.append(categorie._toDict())
    return {'status': True, 'categories': rtrn}

# Get all sets by category
@bp.route('/api/category/sets/<int:id>', methods=['GET'])
def get_sets_by_category_id(id):
    category = SetCategory.query.filter_by(id=id).first()

    sets = CardSet.query.with_parent(category).all()
    rtrn = []
    for set in sets:
        rtrn.append(set._toDict())

    return {'status': True, 'sets': rtrn}

# Get Sets by Category Name
@bp.route('/api/category/sets', methods=['POST'])
def get_sets_by_category_name():
    data = request.get_json()
    category = SetCategory.query.filter_by(category_name=data.get('name')).first()

    sets = CardSet.query.with_parent(category).all()
    rtrn = []
    for set in sets:
        rtrn.append(set._toDict())

    return {'status': True, 'sets': rtrn}
