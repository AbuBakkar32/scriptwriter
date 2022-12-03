# -*- coding: utf-8 -*-
"""
Created on Fri Oct  1 15:06:44 2021

@author: George

For managing all Script Project
"""
import json

from fpdf import FPDF

from .Assembler import (replaceTOHtmlCharacter, reverseReplaceTOHtmlCharacter,
                        render, HttpResponseRedirect, arrayDBData, Client, Script, generateid,
                        time, JsonResponse, os, MAIN_DIR, getDictKey, MiniScript, HttpResponse,
                        uploadFileHandler, AudioStore, listDBData, convertDBDataTOList
                        )

from .ClientSignup import ClientSignUp
from .ScriptAuthors import ScriptAuthors
from random import choice


class ScriptProject(object):
    def __init__(self, request):
        # initialize
        self.request = request
        self.title = {"title": "Script Project Section"}
        self.createdon = str(time.strftime("%d/%m/%Y, %H:%M:%S %p", time.localtime()))
        # list of class names containing background color in custom.css
        self.bgNames = ['bg-yellow', 'bg-green', 'bg-blue', 'bg-purple', 'bg-orange', 'bg-pink']
        self.url = request.get_raw_uri().split(':')[0] + "://" + request._get_raw_host()
        self.privateFilePath = os.path.join(MAIN_DIR, 'private')

    def createScript(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                datasuit = arrayDBData(user, "Client")
                # Get Client ID
                accountID = datasuit['userID']
                # generate id for new script
                ID = generateid("newscript")
                # choose a color
                scriptColor = choice(self.bgNames)

                data = {
                    'id': ID,
                    'title': '',
                    # where all script line will be stored
                    'draft': {
                        'draft1': {
                            'name': 'Draft 1',
                            'active': 'true',
                            'data': {
                                '00': {
                                    'id': '00',
                                    'content': '',
                                    'type': '',
                                    'color': scriptColor,
                                    'others': {},
                                    'note': {
                                        'text': '',
                                        'authorID': '',
                                        'authorName': '',
                                        'date': '',
                                        'color': scriptColor,
                                        'list': {}
                                    }
                                }
                            }
                        }
                    },
                    'location': {},
                    'storydos': {},
                    'character': {},
                    'pinboard': {},
                    'color': scriptColor,
                    'titlePage': {
                        'title': '',
                        'writtenBy': '',
                        'contactName': '',
                        'emailAddress': '',
                        'phoneNumber': ''
                    },
                    'pageSet': [1]  #
                }

                newScript = Script(title="", body=replaceTOHtmlCharacter(data), uniqueID=ID,
                                   createdon=self.createdon, status="seen", userID=accountID,
                                   authorsID="[]", color=scriptColor
                                   )
                newScript.save()

                # create and save new data to shortcut
                miniScript = MiniScript(title="", scriptID=ID, createdon=self.createdon, userID=accountID,
                                        color=scriptColor)
                miniScript.save()

                return HttpResponseRedirect("/scriptwork/" + ID)

    def getAllScriptJson(self, userID):
        request = self.request
        sea = str(request.META.get('CSRF_COOKIE'))
        user = Client.objects.filter(season=sea)
        if request.method == "GET":
            if user.exists():
                # Returns a dict of Client
                script = Script.objects.filter(userID=userID)
                unique_id = []
                if script.exists():
                    for i in script:
                        unique_id.append(i.uniqueID)
                return JsonResponse(unique_id, safe=False)
            elif str(user) == "<QuerySet []>":
                return JsonResponse({'status': 'Out off service'})

    def getAuthorsDetail(self, listOfAuthorIds):
        profiles = []

        for i in listOfAuthorIds:
            author = Client.objects.filter(userID=i)
            if author.exists():
                datasuit = arrayDBData(author, "Client")
                # Get the user full name and id
                fullName, userID, bgColor = (datasuit['firstName'],
                                             datasuit['userID'], choice(self.bgNames))
                # capture the details in profiles
                profiles.append([fullName, userID, bgColor])

        return profiles

    def scriptDashboard(self, scriptID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                datasuit = arrayDBData(user, "Client")
                # create a new key in the datasuit dict and set value of account type
                datasuit["title"] = self.title["title"]
                # Get Client ID
                accountID = datasuit['userID']
                # Script full content
                scDB = Script.objects.filter(uniqueID=scriptID)
                scriptSuit = arrayDBData(scDB, "Script")
                # Get profile of the authors
                datasuit["AuthorsProfiles"] = self.getAuthorsDetail(eval(scriptSuit['authorsID']))
                # Get the main script content array
                datasuit["ScriptContent"] = reverseReplaceTOHtmlCharacter(scriptSuit["body"])

                datasuit["SubscriptionType"] = datasuit["accountType"]

                datasuit['AudioStore'] = listDBData(AudioStore.objects.all(), 'AudioStore')

                # Get url and add "/invite"
                datasuit["href"] = request.build_absolute_uri() + "/invite"
                datasuit["scriptTitle"] = scriptSuit["title"]

                # Ensuring that the script is being accessed by the rightful owner
                if scriptSuit["userID"] == accountID:
                    return render(request, "script-page.html", datasuit)  # render(request, "newproject.html", datasuit)
                return HttpResponseRedirect("/client-home")
            return HttpResponseRedirect("/login")

    def inviteAuthor(self, scriptID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get Client Email
                email = datasuit['email']

                # Join Author
                return ScriptAuthors(request).joinScriptAuthor(scriptID, email, sea)
            else:
                # Script full content
                scDB = Script.objects.get(uniqueID=scriptID)
                # get the user id of the script
                userid = scDB.userID
                # get the user account of the userID
                user = Client.objects.get(userID=userid)
                datasuit = {'name': user.fullName, 'invitetitle': scDB.title}
                return render(request, "invite.html", datasuit)

        elif request.method == "POST":
            # Sign up client
            client = ClientSignUp(request)
            client.signup()

            # Join Author
            return ScriptAuthors(request).joinScriptAuthor(scriptID, client.emailAddress, client.cookie)

    def saveScript(self, scriptID):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")

                # Get client unique ID
                accountID = datasuit["userID"]

                content = request.POST['content']
                # Update Script Content
                scDB = Script.objects.get(uniqueID=scriptID)

                # postContent = eval(content)
                # vcontent = reverseReplaceTOHtmlCharacter(scDB.body)
                # Get the current scriptdata
                # scriptData = eval(vcontent)['data']
                # get script data content keys. Each key represent a content line.
                # getScriptKeys = getDictKey(scriptData)

                # Ensuring that the script was save by the rightful owner
                if scDB.userID == accountID:
                    scDB.title = str(request.POST['title'])
                    scDB.body = replaceTOHtmlCharacter(content)
                    scDB.save()

                    miniScDB = MiniScript.objects.get(scriptID=scriptID)
                    miniScDB.title = str(request.POST['title'])
                    miniScDB.save()

                    return JsonResponse({'data': 'success', 'message': 'Success'})
                else:
                    return JsonResponse({'data': 'failed', 'message': 'Failed to authenticate login'})
            else:
                return JsonResponse({'data': 'failed', 'message': 'Failed to authenticate login'})

    def downloadScript(self, scriptID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']

                # Get Script Content
                scDB = Script.objects.get(uniqueID=scriptID)
                title = scDB.title
                scriptOwnerId = scDB.userID

                # Ensure this script is not download by anyone else apart from the owner
                if accountID != scriptOwnerId:
                    return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})

                content = reverseReplaceTOHtmlCharacter(scDB.body)

                # location to store pdf after creating it
                storePdfLocation = os.path.join(os.path.join(MAIN_DIR, 'cdn'), 'store')

                # Get the current scriptdata
                scriptData = eval(content)['data']


                # get script data content keys. Each key represent a content line.
                getScriptKeys = getDictKey(scriptData)

                # Prepare PDF
                pdf = FPDF()
                # Add a page
                pdf.add_page()
                # Add a Unicode system font (using full path)
                fontPath = os.path.join(os.path.join(os.path.join(MAIN_DIR, 'cdn'), 'fonts'), 'courier_prime')
                fontFamily = "Courier"
                # print(r'' + os.path.join(fontPath,"CourierPrime-Regular.ttf"))
                # pdf.add_font('Courier Prime', '', os.path.join(fontPath,"CourierPrime-Regular.ttf"), uni=True)
                # pdf.add_font('Courier Prime', '', os.path.join(fontPath, "CourierPrime-Italic.ttf"), uni=True)
                # pdf.add_font('Courier Prime', '', os.path.join(fontPath, "CourierPrime-Bold.ttf"), uni=True)
                # pdf.add_font('Courier Prime', '', os.path.join(fontPath, "CourierPrime-BoldItalic.ttf"), uni=True)
                # set font family and size of font # Courier Prime                
                pdf.set_font(fontFamily, size=13)

                # Set title on pdf
                if title:
                    pdf.set_font(fontFamily, size=25, style='B')
                    pdf.multi_cell(200, 30, txt=title, align='C')

                # Set all other content 
                for key in getScriptKeys:
                    # Example of each key contains the following
                    """
                    id:{
                        id:'scriptBody id',
                        content: 'the content text with html',
                        type: 'the type of script body',# scene-heading,action,dialog,parathentical,character,transition
                        note: {
                            text: 'text box content of the left side message-icon in the content line.',
                            author: 'author id'
                            }
                        }
                    """
                    scriptLine = scriptData[key]

                    # Add the content base
                    if scriptLine['type'] == "scene-heading":
                        pdf.set_font(fontFamily, style='B', size=18)
                        pdf.multi_cell(200, 10, txt=scriptLine['content'], align='C')

                    elif scriptLine['type'] == "character":
                        pdf.set_font(fontFamily, style='B', size=15)
                        pdf.multi_cell(200, 10, txt=scriptLine['content'], align='C')

                    elif scriptLine['type'] == "dialog":
                        pdf.set_font(fontFamily, style='', size=13)
                        pdf.multi_cell(150, 10, txt=scriptLine['content'], align='C')

                    elif scriptLine['type'] == "parathentical":
                        pdf.set_font(fontFamily, style='', size=13)
                        pdf.multi_cell(180, 10, txt=scriptLine['content'], align='C')

                    elif scriptLine['type'] == "transition":
                        pdf.set_font(fontFamily, style='', size=13)
                        pdf.multi_cell(200, 10, txt=scriptLine['content'], align='R')

                    elif scriptLine['type'] == "action":
                        pdf.set_font(fontFamily, style='', size=13)
                        try:
                            pdf.multi_cell(200, 10, txt=scriptLine['content'], align='L')
                        except KeyError:
                            return JsonResponse({'result': 'failed', 'message': 'Failed to Find the body'})

                # PDF output
                outFile = os.path.join(storePdfLocation, scriptID + '.pdf')
                pdf.output(outFile)

                return JsonResponse({'result': 'success', 'message': 'link to download', 'file': scriptID + '.pdf'})
            else:
                return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login'})

    def uploadCharacterProfilePics(self):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                # datasuit = convertDBDataTOArray(p, "Client")
                imageID = generateid('pics')
                # the posted img
                img = request.FILES['img']
                extention = str(img.name).split('.')[-1]
                fID = extention.upper() + '_' + imageID
                fName = fID + '.' + extention
                # Upload the image
                isSaveImage = uploadFileHandler(img, fName, self.privateFilePath)
                # return the image url
                if isSaveImage:
                    imageUrl = self.url + '/script/image/' + fID
                    return JsonResponse({'result': 'success', 'message': imageUrl})
                else:
                    return JsonResponse({'result': 'failed', 'message': 'Unable to upload image at this moment.'})
            else:
                return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})
        else:
            return JsonResponse({'result': 'failed', 'message': 'not supported'})

    def getCharacterProfilePics(self, fID):
        # fID is the file id, it is the file extention in upper case '_' the imageID
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                # datasuit = convertDBDataTOArray(p, "Client")
                extention = fID.split('_')[0].lower()
                theFileName = fID + '.' + extention
                imagePath = os.path.join(self.privateFilePath, theFileName)
                # return the image itself
                image_data = open(imagePath, "rb").read()
                return HttpResponse(image_data, content_type="image/" + extention)
            else:
                return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})
        else:
            return JsonResponse({'result': 'failed', 'message': 'not supported'})

    def createScriptViaJson(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                datasuit = arrayDBData(user, "Client")
                # Get Client ID
                accountID = datasuit['userID']
                ID = generateid("newscript")
                scriptColor = choice(self.bgNames)

                data = {
                    'id': ID,
                    'title': '',
                    # where all script line will be stored
                    'draft': {
                        'draft1': {
                            'name': 'Draft 1',
                            'active': 'true',
                            'data': {
                                '00': {
                                    'id': '00',
                                    'content': '',
                                    'type': '',
                                    'color': scriptColor,
                                    'others': {},
                                    'note': {
                                        'text': '',
                                        'authorID': '',
                                        'authorName': '',
                                        'date': '',
                                        'color': scriptColor,
                                        'list': {}
                                    }
                                }
                            }
                        }
                    },
                    'location': {},
                    'storydos': {},
                    'character': {},
                    'pinboard': {},
                    'color': scriptColor,
                    'titlePage': {
                        'title': '',
                        'writtenBy': '',
                        'contactName': '',
                        'emailAddress': '',
                        'ph'
                        'oneNumber': ''
                    },
                    'pageSet': [1]  #
                }

                newScript = Script(title="", body=replaceTOHtmlCharacter(data),
                                   uniqueID=ID, createdon=self.createdon, status="seen",
                                   userID=accountID, authorsID="[]", color=scriptColor
                                   )
                newScript.save()

                # create and save new data to shortcut
                miniScript = MiniScript(title="", scriptID=ID,
                                        createdon=self.createdon, userID=accountID, color=scriptColor)
                miniScript.save()

                return JsonResponse({'result': 'success', 'message': 'script created', 'color': scriptColor, 'id': ID})
            else:
                return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})
        else:
            return JsonResponse({'result': 'failed', 'message': 'not supported'})

    def updateScriptViaJson(self, scriptID):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit["userID"]

                color = replaceTOHtmlCharacter(request.POST['color'])
                title = replaceTOHtmlCharacter(request.POST['title'])

                # get the script
                script = Script.objects.filter(uniqueID=scriptID)
                if script.exists():
                    scriptSuite = arrayDBData(script, "Script")
                    scriptOwnerId = scriptSuite['userID']
                    # Ensure another author don't delete 
                    if scriptOwnerId == accountID:
                        scriptUpdate = Script.objects.get(uniqueID=scriptID)
                        scriptUpdate.color = color
                        scriptUpdate.title = title
                        body = eval(reverseReplaceTOHtmlCharacter(scriptUpdate.body))
                        body["title"] = title
                        body["color"] = color
                        scriptUpdate.body = replaceTOHtmlCharacter(body)
                        scriptUpdate.save()

                        miniScriptUpdate = MiniScript.objects.get(scriptID=scriptID)
                        miniScriptUpdate.color = color
                        miniScriptUpdate.title = title
                        miniScriptUpdate.save()
                        return JsonResponse({'result': 'success', 'message': 'script updated'})
                    else:
                        return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})
                else:
                    return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login2'})
            else:
                return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})
        else:
            return JsonResponse({'result': 'failed', 'message': 'not supported'})

    def deleteScriptViaJson(self, scriptID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']
                # get the script
                script = Script.objects.filter(uniqueID=scriptID)
                if script.exists():
                    scriptSuite = arrayDBData(script, "Script")
                    scriptOwnerId = scriptSuite['userID']
                    listOfAuthorsIdOnScript = eval(scriptSuite['authorsID'])
                    # Ensure another author don't delete 
                    if scriptOwnerId == accountID:
                        # remove the script id from the users authored id
                        for i in listOfAuthorsIdOnScript:
                            clt = Client.objects.get(userID=i)
                            lsOfAuthoredScriptIDs = eval(clt.authoredScript)
                            lsOfAuthoredScriptIDs.remove(scriptID)
                            clt.authoredScript = str(lsOfAuthoredScriptIDs)
                            clt.save()
                        script.delete()

                        miniScDB = MiniScript.objects.filter(scriptID=scriptID)
                        miniScDB.delete()

                        return JsonResponse({'result': 'success', 'message': 'script deleted'})
                    else:
                        return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})
                else:
                    return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login2'})
            else:
                return JsonResponse({'result': 'failed', 'message': 'Failed to authenticate login1'})
        else:
            return JsonResponse({'result': 'failed', 'message': 'not supported'})
