# -*- coding: utf-8 -*-
"""
Created on Sat Mar 12 16:28:54 2022

@author: George

Manage all email logic
"""

from scriptwriter.settings import EMAIL_HOST_USER
from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


class EmailApp(object):
    """ Manage all email activities"""

    def __init__(self, request):
        # initialize
        self.request = request
        self.MY_URL = request.get_raw_uri().split(':')[0] + "://" + request._get_raw_host()
        self.fromEmail = EMAIL_HOST_USER

    def sender(self, subject, htmlMessage, email):
        plain_message = strip_tags(htmlMessage)
        to = email
        mail.send_mail(subject, plain_message, self.fromEmail, [to], html_message=htmlMessage, fail_silently=False)

    def welcome_mail(self, fullname, email, user_id, emailpin):
        # Welcome Email message
        try:
            1 / 0
            subject = 'Getting Started with Scriptovate'
            message = 'Hi ' + fullname + ',\n\
            Welcome to Scriptovate, your tool for writing and preparing movie script!\n\
            Like a pro, you can now:\n\
            \t\t Top-Up your Scriptovate balance.\n\
            \t\t Transfer funds.\n\
            \t\t Withdraw funds.\n\n\
            Thank you for choosing Scriptovate.\n\
            Please secure your login details always and do not disclose it by phone, email, or on suspicious websites.\n\
            Our spcialist will never ask you for your password at any point in time.'
            html_message = render_to_string('mail/welcome_message.html',
                                            {'context': message, 'typepage': 3, "myurl": self.MY_URL,
                                             "userid": user_id, "emailpin": emailpin})

            self.sender(subject, html_message, email)
        except:
            print("There is an error")
            print(self.MY_URL + "/verify/" + user_id + "/" + emailpin)

    def reverify_mail(self, user_id, email, emailpin):
        try:
            1 / 0
            subject = 'Scriptovate - Email Validation'
            message = 'Click the button below to validate your email address with us.'
            html_message = render_to_string('mail/welcome_message.html',
                                            {'context': message, 'typepage': 2,
                                             "myurl": self.MY_URL, "userid": user_id, "emailpin": emailpin})
            self.sender(subject, html_message, email)
        except:
            print("error in email sending")

    def password_reset_mail(self, rpv, email):
        try:
            1 / 0
            subject = 'Scriptovate - Password Reset'
            message = 'Click the button below to Reset your account password.'
            html_message = render_to_string('mail/welcome_message.html', {'context': message, 'typepage': 33,
                                                                          "myurl": self.MY_URL, "resetpin": rpv})
            self.sender(subject, html_message, email)
        except:
            print("error in email sending")
            print(self.MY_URL + "/resetpassword/" + rpv)
