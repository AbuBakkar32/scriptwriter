# -*- coding: utf-8 -*-
"""
Created on Tue July  4 04:21:24 2021

@author: George

The assembler of all component for evaluation and integration
"""

import time
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse, FileResponse
from scriptwriter.models import (Client, Script, App, NotePad,
                                 Glossary, Transaction, MiniScript, MiniClient, Subscription,
                                 CharacterStore, StructureSampleStore, AudioStore, IDManager, Comment
                                 )
from scriptwriter.models import ( Client, Script, App, NotePad,
    Glossary, Transaction, MiniScript, MiniClient, Subscription,
    CharacterStore, StructureSampleStore, AudioStore, IDManager, Comment
)
import os

MAIN_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
STATICFILE_DIR = os.path.join(os.path.join(MAIN_DIR, 'cdn'), 'staticfiles')

######## I.D Logic
from .IDApp import IDApp

generateid = IDApp().generateid

######## MrG Data Handler
from .MrgDjangoDataApp import MrgDjangoDataApp

mrgDjangoDataApp = MrgDjangoDataApp()
replaceTOHtmlCharacter = mrgDjangoDataApp.replaceTOHtmlCharacter
convertDBDataTOArray = mrgDjangoDataApp.convertDBDataTOArray
convertDBDataTOList = mrgDjangoDataApp.convertDBDataTOList
reverseReplaceTOHtmlCharacter = mrgDjangoDataApp.reverseReplaceTOHtmlCharacter
getDictKey = mrgDjangoDataApp.getDictKey
uploadFileHandler = mrgDjangoDataApp.uploadFileHandler
arrayDBData = mrgDjangoDataApp.arrayDBData
listDBData = mrgDjangoDataApp.listDBData

######## Email Logic
try:
    from .EmailApp import EmailApp
except Exception as e:
    print('EmailApp Component Error:', e)

####### Payment Logic
try:
    from .Payment import Payment
except Exception as e:
    print('Payment Component Error', e)

######## NotePad logic
try:
    from .NotePadApp import NotePadApp
except Exception as e:
    print('NotePadApp Component Error:', e)

######## Glossary Logic
try:
    from .GlossaryApp import GlossaryApp
except Exception as e:
    print('GlossaryApp Component Error', e)

######## Client Signup Logic
try:
    from .ClientSignup import ClientSignUp
except Exception as e:
    print('Client Signup Component Error', e)

######## Client Login Logic
try:
    from .ClientLogin import ClientLogin
except Exception as e:
    print('Client Login Component Error', e)

####### Client Dashboard
try:
    from .ClientDashboard import ClientDashboard
except Exception as e:
    print('Client Dashboard Component Error', e)

####### Client Access App Logic
try:
    from .ClientAccessApp import ClientAccessApp
except Exception as e:
    print('Client AccessApp Component Error', e)

####### Client Script App Logic
try:
    from .ScriptProject import ScriptProject
except Exception as e:
    print('Script Project Component Error', e)

####### Author Script App Logic
try:
    from .ScriptAuthors import ScriptAuthors
except Exception as e:
    print('Script Authors Component Error', e)

####### Admin Login Logic
try:
    from .AdminLogin import AdminLogin
except Exception as e:
    print('Admin Login Component Error', e)

####### Admin Access App Logic
try:
    from .AdminAccessApp import AdminAccessApp
except Exception as e:
    print('Admin AccessApp Component Error', e)

####### Admin Dashboard
try:
    from .AdminDashboard import AdminDashboard
except Exception as e:
    print('Admin Dashboard Component Error', e)

###### Admin handle users
try:
    from .HandleUsers import HandleUsers
except Exception as e:
    print('Handle Users Component Error', e)

###### Admin handle transaction
try:
    from .HandleTransaction import HandleTransaction
except Exception as e:
    print('Handle Transaction Component Error', e)

###### Admin upload structure sample
try:
    from .HandleStructureSample import HandleStructureSample
except Exception as e:
    print('Handle Structure Sample Component Error', e)

###### Admin Character
try:
    from .HandleCharacter import HandleCharacter
except Exception as e:
    print('Handle Character Component Error', e)

###### Admin Background Audio
try:
    from .HandleAudioLibrary import HandleAudioLibrary
except Exception as e:
    print('Handle Audio Library Component Error', e)
