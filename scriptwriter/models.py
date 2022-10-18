# -*- coding: utf-8 -*-

from django.db import models

'''
Models incharge of database interaction between web app and database.
New thought: for instance instead of return "['%s', '%s']"%(self.idValue, self.idName) 
why not
return "{'idValue':'%s', 'idName':'%s'}"%(self.idValue, self.idName)
'''


class IDManager(models.Model):
    idValue = models.TextField(default="")
    idName = models.TextField(default="")

    def __str__(self):
        return "{'idValue':'''%s''', 'idName':'''%s'''}" % (self.idValue, self.idName)


class Subscription(models.Model):
    uniqueID = models.TextField(default="")  # 0
    userID = models.TextField(default="")  # 1
    amount = models.TextField(default="")  # 2
    createdon = models.TextField(default="")  # 3
    status = models.TextField(default="")  # 4 active | expired
    startingDate = models.TextField(default="")  # 5
    endingDate = models.TextField(default="")  # 6
    transactionID = models.TextField(default="")  # 7
    clientName = models.TextField(default="")  # 8
    plan = models.TextField(default="")  # month | year

    def __str__(self):
        return "{'uniqueID':'''%s''', 'userID':'''%s''', 'amount':'''%s''', 'createdon':'''%s''',\
            'status':'''%s''', 'startingDate':'''%s''', 'endingDate':'''%s''',\
            'transactionID':'''%s''', 'clientName':'''%s''', 'plan': '''%s'''}" % (
            self.uniqueID, self.userID, self.amount, self.createdon, self.status,
            self.startingDate, self.endingDate, self.transactionID, self.clientName, self.plan)


class Transaction(models.Model):
    uniqueID = models.TextField(default="")  # 0
    userID = models.TextField(default="")  # 1
    amount = models.TextField(default="")  # 2
    createdon = models.TextField(default="")  # 3
    status = models.TextField(default="")  # 4 success | failed | pending
    data = models.TextField(default="")  # 5
    clientName = models.TextField(default="")  # 6
    plan = models.TextField(default="")  # month | year

    def __str__(self):
        return "{'uniqueID':'''%s''', 'userID':'''%s''', 'amount':'''%s''', 'createdon':'''%s''',\
            'status':'''%s''', 'data':'''%s''', 'clientName':'''%s''', 'plan':'''%s'''}" % (
            self.uniqueID, self.userID, self.amount, self.createdon, self.status, self.data,
            self.clientName, self.plan)


class Glossary(models.Model):
    title = models.TextField(default="")  # 0
    body = models.TextField(default="")  # 1
    createdon = models.TextField(default="")  # 2
    uniqueID = models.TextField(default="")  # 3

    def __str__(self):
        return "{'title':'''%s''', 'body':'''%s''', 'createdon':'''%s''',\
            'uniqueID':'''%s'''}" % (self.title, self.body, self.createdon, self.uniqueID)


class NotePad(models.Model):
    title = models.TextField(default="")  # 0
    body = models.TextField(default="")  # 1
    createdon = models.TextField(default="")  # 2
    color = models.TextField(default="")  # 3
    uniqueID = models.TextField(default="")  # 4
    userID = models.TextField(default="")  # 5

    def __str__(self):
        return "{'title':'''%s''', 'body':'''%s''', 'createdon':'''%s''', 'color':'''%s''',\
            'uniqueID':'''%s''', 'userID':'''%s'''}" % (self.title, self.body, self.createdon,
                                                        self.color, self.uniqueID, self.userID)


class Script(models.Model):
    """Creating, updating and managing script datas"""
    title = models.TextField(default="")  # 0
    body = models.TextField(default="")  # 1
    uniqueID = models.TextField(default="")  # 2
    createdon = models.TextField(default="")  # 3
    status = models.TextField(default="")  # 4 #seen | unseen
    userID = models.TextField(default="")  # 5
    authorsID = models.TextField(default="")  # 6 [] client userID of each author
    color = models.TextField(default="")  # 7

    def __str__(self): return "{'title':'''%s''', 'body':'''%s''', 'uniqueID':'''%s''',\
        'createdon':'''%s''', 'status':'''%s''', 'userID':'''%s''', 'authorsID':'''%s''',\
        'color':'''%s'''}" % (self.title, self.body, self.uniqueID, self.createdon, self.status,
                              self.userID, self.authorsID, self.color)


class MiniScript(models.Model):
    title = models.TextField(default="")  # 0
    scriptID = models.TextField(default="")  # 1
    createdon = models.TextField(default="")  # 2
    userID = models.TextField(default="")  # 3
    color = models.TextField(default="")  # 4

    def __str__(self): return "{'title':'''%s''', 'scriptID':'''%s''', 'createdon':'''%s''',\
        'userID':'''%s''', 'color':'''%s'''}" % (self.title, self.scriptID, self.createdon,
                                                 self.userID, self.color)


class MiniClient(models.Model):
    fullName = models.CharField(max_length=200)  # 0
    email = models.TextField(default="")  # 1
    createdon = models.TextField(default="")  # 2
    userID = models.TextField(default="")  # 3

    def __str__(self): return "{'fullName':'''%s''', 'email':'''%s''', 'createdon':'''%s''',\
        'userID':'''%s'''}" % (self.fullName, self.email, self.createdon, self.userID)


class Client(models.Model):
    fullName = models.CharField(max_length=200)  # 0
    email = models.TextField(default="")  # 1
    password = models.TextField(default="")  # 2
    country = models.TextField(default="")  # 3
    userID = models.TextField(default="")  # 4
    emailVerification = models.TextField(default="")  # 5 true | false
    emailVerificationValue = models.TextField(default="")  # 6
    resetPasswordValue = models.TextField(default="")  # 7
    createdon = models.TextField(default="")  # 8
    season = models.TextField(default="")  # 9
    state = models.TextField(default="")  # 10
    authoredScript = models.TextField(default="")  # 11 [] list of script uniqueID that i a author in
    accountType = models.TextField(default="")  # 12 free | pro
    # Account Settings 
    nightMode = models.TextField(default="")  # 13 true | false
    onePageWriting = models.TextField(default="")  # 14 true | false
    autoSaveTimeOut = models.TextField(default="")  # 15
    waterMarkStatus = models.TextField(default="")  # 16 true | false
    waterMarkDisplayText = models.TextField(default="")  # 17
    waterMarkDisplayOpacity = models.TextField(default="")  # 18
    # Current Subscription
    subscriptionMode = models.TextField(default="")  # 19 month | year | free
    subscriptionID = models.TextField(default="")  # 20

    def __str__(self):
        return "{'fullName':'''%s''','email':'''%s''','password':'''%s''','country':'''%s''',\
            'userID':'''%s''', 'emailVerification':'''%s''', 'emailVerificationValue':'''%s''',\
            'resetPasswordValue':'''%s''', 'createdon':'''%s''', 'season':'''%s''', 'state':'''%s''',\
            'authoredScript':'''%s''', 'accountType':'''%s''', 'nightMode':'''%s''', 'onePageWriting':'''%s''',\
            'autoSaveTimeOut':'''%s''', 'waterMarkStatus':'''%s''', 'waterMarkDisplayText':'''%s''',\
            'waterMarkDisplayOpacity':'''%s''', 'subscriptionMode':'''%s''', 'subscriptionID':'''%s'''}" % (
            self.fullName, self.email, self.password, self.country, self.userID, self.emailVerification,
            self.emailVerificationValue, self.resetPasswordValue, self.createdon, self.season, self.state,
            self.authoredScript,
            self.accountType, self.nightMode, self.onePageWriting, self.autoSaveTimeOut, self.waterMarkStatus,
            self.waterMarkDisplayText, self.waterMarkDisplayOpacity, self.subscriptionMode, self.subscriptionID)


class App(models.Model):
    username = models.TextField(default="admin")  # 0
    password = models.TextField(default="pass")  # 1
    name = models.TextField(default="Admin")  # 2
    season = models.TextField(default="0.0")  # 3

    def __str__(self):
        return "{'username':'''%s''' , 'password':'''%s''', 'name':'''%s''',\
            'season':'''%s'''}" % (self.username, self.password, self.name, self.season)


class CharacterStore(models.Model):
    uniqueID = models.TextField(default="")  # 0
    name = models.TextField(default="")  # 1
    data = models.TextField(default="{}")  # 1

    def __str__(self):
        return "{'uniqueID':'''%s''' , 'name':'''%s''', 'data':'''%s'''}" % (
            self.uniqueID, self.name, self.data)


class AudioStore(models.Model):
    uniqueID = models.TextField(default="")  # 0
    name = models.TextField(default="")  # 1
    fileName = models.TextField(default="")  # 2

    def __str__(self):
        return "{'uniqueID':'''%s''' , 'name':'''%s''',  'fileName':'''%s'''}" % (
            self.uniqueID, self.name, self.fileName)


class StructureSampleStore(models.Model):
    uniqueID = models.TextField(default="")  # 0
    name = models.TextField(default="")  # 1
    data = models.TextField(default="")  # 2

    def __str__(self):
        return "{'uniqueID':'''%s''' , 'name':'''%s''',  'data':'''%s'''}" % (
            self.uniqueID, self.name, self.data)
