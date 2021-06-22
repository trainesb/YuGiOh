from flask import current_app
from flask_mail import Message, Mail

def send_email(subject, recipients, html=None, body=None):
    try:
        print('\nSending email to: ', recipients, '\n')

        print('Mail config')
        current_app.config['MAIL_DEBUG'] = 1
        current_app.config['MAIL_SERVER'] = 'smtp.gmail.com'
        current_app.config['MAIL_PORT'] = 587
        current_app.config['MAIL_USERNAME'] = 'trainesben68@gmail.com'
        current_app.config['MAIL_PASSWORD'] = 'ispynkcrkhqtygrr'
        current_app.config['DEFAULT_SENDER'] = 'trainesben68@gmail.com'
        current_app.config['MAIL_USE_TLS'] = True
        current_app.config['MAIL_USE_SSL'] = False
        print('Config done')
        mail = Mail(current_app)
        msg = Message(subject, sender='trainesben68@gmail.com', recipients=[recipients])

        if body is not None: msg.body = body
        if html is not None: msg.html = html


        print('Start Email send')
        mail.send(msg)
        print('Email has been sent')

    except Exception as err:
        print('Error: ', err)
