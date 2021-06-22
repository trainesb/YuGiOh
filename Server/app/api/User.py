import os
import shutil
import random
import string
from app import db
from app.api import bp
from secrets import token_hex
from app.models.User import User
from flask_mail import Mail, Message
from app.models.CardSet import CardSet
from app.utils.email import send_email
from flask import request, current_app
from datetime import datetime, timedelta
from app.models.CardToSetMap import CardToSetMap
from flask_login import current_user, login_user, logout_user, login_required

# Get all users
@bp.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    rtrn = []
    if users:
        for user in users: rtrn.append(user._toDict())
    return{'users': rtrn}

# Get the current user
@bp.route('/api/user/current', methods=['GET'])
def get_current_user():
    print('\nCurrent User: ', current_user.username, '\n')
    return current_user._toDict()

# Get user by ID
@bp.route('/api/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.filter_by(id=id).first()
    return {'user': user._toDict()}

# Get all users email and username
@bp.route('/api/users/email/username', methods=['GET'])
def get_email_username():
    users = User.query.all()
    rtrn = []
    for user in users:
        if user.email is not None: rtrn.append({'email': user.email, 'username': user.username})
    return {'rtrn': rtrn}

# Get all users phone in email format and username
@bp.route('/api/users/phone_email/username', methods=['GET'])
def get_phone_email_username():
    users = User.query.all()
    rtrn = []
    for user in users:
        if user.phone is not None and len(user.phone) > 9:
            rtrn.append({'email': str(user.phone)+str(user.phone_provider), 'username': user.username})
    return {'rtrn': rtrn}

# Get user by username
@bp.route('/api/user/<string:username>', methods=['GET'])
def get_username(username):
    user = User.query.filter_by(username=username).first()
    return user._toDict()

# Get all users
@bp.route('/api/users', methods=['GET'])
def get_time():
    users = User.query.all()
    rtrn = {'users': []}
    if users is not None:
        for user in users:
            rtrn['users'].append(user._toDict())
    return rtrn

# Create a new user
@bp.route('/api/user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user: return {'status': False, 'error': 'Username, `' + data.get('username') + '` has already been used!'}
        user = User()
        user.username = data.get('username')
        user.set_password(data.get('password'))
        user.email = data.get('email')
        user.phone = data.get('phone')
        user.phone_provider = data.get('phone_provider')
        user.invited = datetime.now()
        user.invited_code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))
        db.session.add(user)
        db.session.commit()
        return {'status': True}
    except Exception as err:
        print('Create User Error: ', err)
        return {'status': False, 'error': err}

# Send verification code to user
@bp.route('/api/register/verification/<string:method>/<string:username>', methods=['GET'])
def send_verification_code(method, username):
    user = User.query.filter_by(username=username).one()
    if not user: return {'status': False}
    if method == 'phone':
        print('Send Verification to phone')
        send_email('Verification Code', str(user.phone)+str(user.phone_provider), html=None, body='Verification Code: ' + user.invited_code)
    else:
        print('Send Verfication to email')
        send_email('Verification Code', user.email, html=None, body='Verification Code: ' + user.invited_code)

    return {'status': True}

# Check registration verification code
@bp.route('/api/register/code/<string:code>/<string:username>', methods=['GET'])
def check_verification_code(code, username):
    user = User.query.filter_by(username=username).first()
    if user is None: return {'status': False, 'error': 'User does not exist!'}
    if user.invited_code != code: return {'status': False, 'error': 'Incorrect Verification Code: ' + code}

    # Create folder for user
    dir = 'user_' + str(user.id)
    os.mkdir(os.path.join(os.getcwd(), 'users_card_data', dir))
    user.card_folder = dir

    # Cetae and init file for user card data
    card_sets = CardSet.query.all()
    for card_set in card_sets:
        file_name = os.path.join(os.getcwd(), 'users_card_data', dir, str(card_set.id) + ".txt")
        f = open(file_name, 'w')

        # Add card data to file for set
        cards = CardToSetMap.query.filter_by(card_set_id=card_set.id).all()
        for card in cards:
            f.write(str(card.id) + ':' + str(0) + ',')
        f.close()

    user.created = datetime.now()
    db.session.add(user)
    db.session.commit()
    return {'status': True}

# Delete a user by id
@bp.route('/api/user/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    user = User.query.filter_by(id=id).first()

    print("Delete Users Card Data")
    dir = 'user_' + str(user.id)
    folder = os.path.join(os.getcwd(), 'users_card_data', dir)
    shutil.rmtree(folder)
    db.session.delete(user)

    db.session.commit()
    return {'status': True}

# Check if a user is logged in
@bp.route('/api/user/loggedin', methods=['GET'])
def check_user_loggedin():
    try:
        user = current_user.username
        print("User: ", user)
        if user is not None: return {'status': True, 'user': current_user._toDict()}
        else: return {'status': False}
    except Exception as err:
        return {'status': False}

# User login
@bp.route('/api/user/login', methods=['POST'])
def user_login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user is None: return {'status': False, 'error': 'User, `' + data.get('username') + '` does not exist!'}
    if not user.check_password(data.get('password')): return {'status': False, 'error': 'Incorrect password!'}

    user.last_active = datetime.now()
    db.session.add(user)
    login_user(user, remember=False)
    db.session.commit()
    return {'status': True, 'user': user._toDict()}

# User Logout
@bp.route('/api/user/logout', methods=['GET'])
@login_required
def user_logout():
    logout_user()
    return {'status': True}

# Update a user by id
@bp.route('/api/user/<int:id>', methods=['PUT'])
@login_required
def edit_user(id):
    data = request.get_json()
    user = User.query.filter_by(id=id).first()
    user.username = data.get('username')
    user.email = data.get('email')
    user.phone = data.get('phone')
    user.phone_provider = data.get('phone_provider')
    db.session.add(user)
    db.session.commit()
    return {'status': True}

# Update user password by id
@bp.route('/api/user/password/<int:id>', methods=['PUT'])
@login_required
def update_password(id):
    data = request.get_json()
    user = User.query.filter_by(id=id).first()

    if not user.check_password(data.get('old_password')): return {'status': False, 'error': 'Old password is incorrect'}
    user.set_password(data.get('new_password'))
    db.session.add(user)

    db.session.commit()
    return {'status': True}
