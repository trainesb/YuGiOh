from app import db
from app.api import bp
from app.models.Contact import Contact
from flask import request
from flask_login import current_user, login_required

# Submit contact
@bp.route('/api/contact', methods=['POST'])
@login_required
def submit_contact():
    data = request.get_json()
    msg = data.get('msg')

    contact = Contact(current_user.username, current_user.email, current_user.phone, current_user.phone_provider, msg)
    db.session.add(contact)
    db.session.commit()
    return {'status': True}
