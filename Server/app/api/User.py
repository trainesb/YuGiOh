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
from app.models.UsersCard import UsersCard
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
@bp.route('/api/username/<string:username>', methods=['GET'])
def get_username(username):
    user = User.query.filter_by(username=username).first()
    if user: return {'status': True, 'user': user._toDict()}
    return {'status': False, 'user': None}

# Get all users
@bp.route('/api/api/users', methods=['GET'])
def get_time():
    users = User.query.all()
    rtrn = {'users': []}
    if users is not None:
        for user in users:
            rtrn['users'].append(user._toDict())
    return rtrn

# User Registration
@bp.route('/api/register', methods=['POST'])
def user_registration():
    data = request.get_json()

    if User.query.filter_by(username=data.get('username')).first() is not None:
        return {'status': False, 'error': 'User, ' + data.get('username') + ' already exists!'}
    if User.query.filter_by(email=data.get('email')).first() is not None:
        return {'status': False, 'error': 'Email, ' + data.get('email') + ' already used by another account!'}
    if User.query.filter_by(phone=data.get('phone')).first() is not None:
        return {'status': False, 'error': 'Phone, ' + data.get('phone') + ' already used by another account!'}
    user = User()
    user.username = data.get('username')
    user.set_password(data.get('password'))
    user.email = data.get('email')
    user.phone = data.get('phone')
    user.phone_provider = data.get('phoneProvider')
    user.role = 'U'
    user.invited = datetime.now()
    user.two_factor = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    db.session.add(user)
    db.session.commit()

    subject = "ConsultNet Group LLC Confirmation"
    body = None
    url = 'https://consultnetgroup.com/validate/' + user.username + '/' + user.two_factor
    link = 'https://consultnetgroup.com/validate/' + user.username
    html = """\
    <html>
        <head><h2>ConsultNet Group Account Confirmatrion</h2></head>
        <body>
            <p>Please confirm your account by clicking this <a href={url}>link</a> or enter the code: <strong>{code}</strong> at <a href={link}>consultnetgroup.com/validate/{username}</a></p>
        </body>
    </html>
    """.format(url=url, code=user.two_factor, link=link, username=user.username)
    send_email(subject, [user.email], body, html)
    return {'status': True}

# Send verification code to user
@bp.route('/api/register/verification/<string:method>/<string:username>', methods=['GET'])
def send_verification_code(method, username):
    user = User.query.filter_by(username=username).one()
    if not user: return {'status': False}
    if method == 'phone':
        print('Send Verification to phone')
        msg = 'Verification Code: ' + user.invited_code
        send_email('Verification Code', str(user.phone)+str(user.phone_provider), html=None, body=msg)
    else:
        print('Send Verfication to email')
        send_email('Verification Code', user.email, html=None, body='Verification Code: ' + user.invited_code)

    return {'status': True}

# Validate User
@bp.route('/api/validate', methods=['POST'])
def validate_user():
    data = request.get_json()
    username = data.get('username')
    code = data.get('code')
    user = User.query.filter_by(username=username).first()
    if user is None: return {'status': False, 'error': 'User, ' + username + ' does not exist!'}
    if user.two_factor != code: return {'status': False, 'error': 'Code is not correct!'}
    if user.invited + timedelta(days = 2) < datetime.now(): return {'status': False, 'error': 'Confirmation has expired!'}
    user.created = datetime.now()
    db.session.add(user)
    db.session.commit()
    return {'status': True}

# Delete a user by id
@bp.route('/api/user/<int:id>', methods=['DELETE'])
@login_required
def delete_user(id):
    user = User.query.filter_by(id=id).first()
    db.session.delete(user)
    db.session.commit()
    return {'status': True}

# Check if a user is logged in
@bp.route('/api/loggedin', methods=['GET'])
def check_user_loggedin():
    try:
        user = current_user.username
        print("User: ", user)
        if user is not None: return {'status': True, 'user': current_user._toDict()}
        else: return {'status': False}
    except Exception as err:
        return {'status': False}

# User login
@bp.route('/api/login', methods=['POST'])
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
@bp.route('/api/logout', methods=['GET'])
@login_required
def user_logout():
    logout_user()
    return {'status': True}

# Update User
@bp.route('/api/user', methods=['PUT'])
@login_required
def update_user():
    data = request.get_json()

    user = User.query.filter_by(id=data.get('id')).first()
    if user.username != data.get('username') and User.query.filter_by(username=data.get('username')).first() is not None:
        return {'status': False, 'error': 'User, ' + data.get('username') + ' already exists!'}
    if user.email != data.get('email') and User.query.filter_by(email=data.get('email')).first() is not None:
        return {'status': False, 'error': 'Email, ' + data.get('email') + ' already used by another account!'}
    if user.phone != data.get('phone') and User.query.filter_by(phone=data.get('phone')).first() is not None:
        return {'status': False, 'error': 'Phone, ' + data.get('phone') + ' already used by another account!'}

    user.username = data.get('username')
    user.email = data.get('email')
    user.phone = data.get('phone')
    user.phone_provider = data.get('phoneProvider')
    user.last_updated = datetime.now()
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
