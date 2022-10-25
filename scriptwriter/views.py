# -*- coding: utf-8 -*-

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
# from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render

from scriptwriter.Component.AdminAccessApp import AdminAccessApp
from scriptwriter.Component.AdminDashboard import AdminDashboard
from scriptwriter.Component.AdminLogin import AdminLogin
from scriptwriter.Component.ClientAccessApp import ClientAccessApp
from scriptwriter.Component.ClientDashboard import ClientDashboard
from scriptwriter.Component.ClientLogin import ClientLogin
from scriptwriter.Component.ClientSignup import ClientSignUp
from scriptwriter.Component.GlossaryApp import GlossaryApp
from scriptwriter.Component.HandleAudioLibrary import HandleAudioLibrary
from scriptwriter.Component.HandleCharacter import HandleCharacter
from scriptwriter.Component.HandleStructureSample import HandleStructureSample
from scriptwriter.Component.HandleTransaction import HandleTransaction
from scriptwriter.Component.HandleUsers import HandleUsers
from scriptwriter.Component.NotePadApp import NotePadApp
from scriptwriter.Component.Payment import Payment
from scriptwriter.Component.ScriptAuthors import ScriptAuthors
from scriptwriter.Component.ScriptProject import ScriptProject
from scriptwriter.Component.Comment import Comment


def editor(request):
    """ filePath = os.path.join(os.path.join(MAIN_DIR, 'private'), 'loading-dark.gif')
                # return the image itself
    fileData = open(filePath, "rb").read()
    return FileResponse(fileData) """
    return render(request, 'editor-sample.html')


def outline(request): return render(request, 'sw-outline.html')


def pinboard(request): return render(request, 'sw-pin-board.html')


def character(request): return render(request, 'sw-characters.html')


def structure(request): return render(request, 'sw-structure.html')


# def glossary(request): return render(request, 'static-glossary.html')

def upgrade(request): return ClientDashboard(request).upgrade()  # return render(request, 'static-upgrade.html')


def profile(request): return ClientDashboard(request).profile()  # return render(request, 'static-profile.html')


def login(request): return ClientLogin(request).login()  # return render(request, 'login.html')


def signup(request): return ClientSignUp(request).signup()  # return render(request, 'signup.html')


def forgetPassword(request): return render(request, 'forget-password.html')


def dashboard(request): return ClientDashboard(request).dashboard()  # return render(request, 'dashboard.html')


def clientLogout(request): return ClientAccessApp(request).logout()


def clientHome(request): return ClientDashboard(request).dashboard()


def clientLogout(request): return ClientAccessApp(request).logout()


def newproject(request): return ScriptProject(request).createScript()


# def newproject(request): return render(request, 'newproject.html')
def scriptwork(request, slug1): return ScriptProject(request).scriptDashboard(slug1)


def scriptSave(request, slug1): return ScriptProject(request).saveScript(slug1)


def downloadScript(request, slug1): return ScriptProject(request).downloadScript(slug1)


def updateScriptViaJson(request, scriptID): return ScriptProject(request).updateScriptViaJson(scriptID)


def deleteScriptViaJson(request, scriptID): return ScriptProject(request).deleteScriptViaJson(scriptID)


def clientSettingData(request): return ClientDashboard(request).clientSettingJson()


# Client Upload image
def uploadCharacterProfilePics(request): return ScriptProject(request).uploadCharacterProfilePics()


def getCharacterProfilePics(request, fid): return ScriptProject(request).getCharacterProfilePics(fid)


# Author views
def inviteAuthor(request, slug1): return ScriptProject(request).inviteAuthor(slug1)


def authorScriptDashboard(request, slug1): return ScriptAuthors(request).scriptAuthoredDashBoard(slug1)


def authorSaveCommentOrNote(request, slug1): return ScriptAuthors(request).saveCommentAndNote(slug1)


def getAuthorAllScripts(request, slug1): return ScriptProject(request).getAllScriptJson(slug1)


# Notepad views
def createNote(request): return NotePadApp(request).userCreateNote()


def deleteNote(request, noteid): return NotePadApp(request).userDeleteNote(noteid)


def updateNote(request, noteid): return NotePadApp(request).userUpdateNote(noteid)


# Glossary For user
def clientGlossaryDashboard(request): return GlossaryApp(request).userGlossaryDashboard()


# Payment GateWay
def paymentInitiate(request): return Payment(request).initStripe()


def paymentSuccess(request, pid): return Payment(request).successPage(pid)


def paymentFailed(request, pid): return Payment(request).failedPage(pid)


# Admin views
def appLogin(request): return AdminLogin(request).login()


def appLogout(request): return AdminAccessApp(request).logout()


def appHome(request): return AdminDashboard(request).dashboard()


def appProfile(request): return AdminDashboard(request).profile()


def appUsers(request): return HandleUsers(request).users()


def appSubscribers(request): return HandleUsers(request).subscribers()


def appTransaction(request): return HandleTransaction(request).page()


def appStructureSample(request): return HandleStructureSample(request).page()


def appCharacter(request): return HandleCharacter(request).page()


# Glossary For Admin
def appGlossary(request): return GlossaryApp(request).adminGlossaryDashboard()


def appCreateGlossary(request): return GlossaryApp(request).adminCreate()


def appUpdateGlossary(request, glossaryID): return GlossaryApp(request).adminUpdate(glossaryID)


def appDeleteGlossary(request, glossaryID): return GlossaryApp(request).adminDelete(glossaryID)


# Audio Section
def appAudio(request): return HandleAudioLibrary(request).page()


def appCreateAudio(request): return HandleAudioLibrary(request).create()


def appUpdateAudio(request, audioID): return HandleAudioLibrary(request).update(audioID)


def appDeleteAudio(request, audioID): return HandleAudioLibrary(request).delete(audioID)

# Comment Section
def addComment(request): return Comment(request).addComment()
def getComments(request, scriptID): return Comment(request).getComments(scriptID)

"""
# Time stamp
>>> from datetime import datetime, timedelta
>>> yesterday = datetime.now() - timedelta(1)

>>> type(yesterday)                                                                                                                                                                                    
>>> datetime.datetime    

>>> datetime.strftime(yesterday, '%Y-%m-%d')
'2015-05-26'

# On django shell
from scriptwriter.models import Client, Script, NotePad, Glossary, Transaction, MiniScript, MiniClient, Subscription, IDManager
Client.objects.all().delete()
MiniClient.objects.all().delete()
Script.objects.all().delete()
MiniScript.objects.all().delete()
NotePad.objects.all().delete()
Glossary.objects.all().delete()
Transaction.objects.all().delete()
Subscription.objects.all().delete()
IDManager.objects.all().delete()

To create an admin by defualt; set value to the defualt parameter in the model.
then import the model on shell and run the following:
    a = App()
    a.save()
    
    
# -*- coding: utf-8 -*-
def forgetPassword(request): return ClientAccessApp(request).forget_password()

def resetPassword(request, slug1): return ClientAccessApp(request).resetpassword(slug1)
"""
