# -*- coding: utf-8 -*-
"""
Created on Sun July 4 04:46:13 2021

@author: George

Hamdling Client Dashboard Logic
"""
import os

from .Assembler import (convertDBDataTOArray, render, HttpResponseRedirect,
                        Client, reverseReplaceTOHtmlCharacter, convertDBDataTOList, generateid,
                        replaceTOHtmlCharacter, time, Script, JsonResponse, NotePad, MiniScript,
                        getDictKey, arrayDBData, listDBData
                        )


class ClientDashboard(object):
    def __init__(self, request):
        # initialize
        self.request = request
        self.content_context = {"title": "Script Writer"}
        # Initializing Client Class
        self.dateCreated = str(time.strftime("%d/%m/%Y, %H:%M:%S %p", time.localtime()))

    def getLatestScript(self, clientID):
        sct = MiniScript.objects.filter(userID=clientID)
        listOfScript = listDBData(sct, "MiniScript")
        listOfScript.reverse()
        # count = 0
        # newList = []
        # for i in listOfScript: newList.append({'title': i[0], 'color': i[4], 'uniqueID': i[1]})
        # if len(newList) != 0: return newList
        if len(listOfScript):
            return listOfScript
        else:
            return None
        # return newList

    def getAuthoredScript(self, listOfScriptIDs):
        scriptList = []

        for scriptID in listOfScriptIDs:
            miniScriptQuery = MiniScript.objects.filter(scriptID=scriptID)
            data = arrayDBData(miniScriptQuery, "MiniScript")
            # scriptList.append({'title': st["QuerySet"][0][0], 'color': st["QuerySet"][0][4], 'uniqueID': st["QuerySet"][0][1]})
            scriptList.append(data)

        if len(scriptList) != 0:
            return scriptList
        else:
            return None
        # return scriptList

    def getNotes(self, accountID):
        notes = NotePad.objects.filter(userID=accountID)
        myArrayList = []
        if notes.exists():
            notesuite = listDBData(notes, "NotePad")
            for i in notesuite:
                # myArrayList.append({'title': i[0], 'body': i[1], 'color': i[3], 'uniqueID': i[4]})
                myArrayList.append(i)
            if len(myArrayList) != 0:
                return myArrayList
            else:
                return None
        else:
            return None

    def dashboard(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']

                # Set only first Name
                datasuit['fullName'] = datasuit['fullName'].split()[0]

                # Get 3 recent latest Script Work
                scriptWork = self.getLatestScript(accountID)
                datasuit["RecentScriptWork"] = scriptWork

                # Get authored Script
                authoredScript = eval(datasuit['authoredScript'])
                datasuit["AuthoredScriptWork"] = self.getAuthoredScript(authoredScript)

                # Get and Set notes
                notes = self.getNotes(accountID)
                datasuit["Notes"] = notes
                datasuit["log"] = True

                # Render Datas to page
                return render(request, "dashboard.html", datasuit)
            elif str(user) == "<QuerySet []>":
                return HttpResponseRedirect("/login")

    def profile(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # user profile details to display
                profile = {}
                # Set first Name
                profile["firstName"] = reverseReplaceTOHtmlCharacter(datasuit['fullName'].split()[0])
                # Set last Name
                profile["lastName"] = reverseReplaceTOHtmlCharacter(datasuit['fullName'].split()[1])
                # Set Email
                profile["email"] = reverseReplaceTOHtmlCharacter(datasuit['email'])
                # Set Password
                profile["password"] = reverseReplaceTOHtmlCharacter(datasuit['password'])

                # Render Datas to page
                return render(request, "static-profile.html", profile)
            else:
                return HttpResponseRedirect("/client-home")
        elif request.method == "POST":
            firstName = replaceTOHtmlCharacter(request.POST['firstName'])
            lastName = replaceTOHtmlCharacter(request.POST['lastName'])
            fullName = firstName + " " + lastName
            password = replaceTOHtmlCharacter(request.POST['password'])
            email = replaceTOHtmlCharacter(request.POST['email'])
            authorReminders = request.POST['authorReminders']
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                clt = Client.objects.get(season=sea)
                clt.fullName = fullName
                clt.password = password
                clt.email = email
                clt.authorReminders = authorReminders
                clt.save()
                return JsonResponse({'result': 'success',
                                     'message': 'profile data updated successfully'})  # HttpResponseRedirect("/app-profile")
            else:
                return JsonResponse({'result': 'failed',
                                     'message': 'profile data failed to update'})  # HttpResponseRedirect("/app-login")

    def upgrade(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # get the account type, which is either free | pro
                # Render Datas to page
                return render(request, "static-upgrade.html", datasuit)
            elif str(user) == "<QuerySet []>":
                return HttpResponseRedirect("/client-home")

    def clientSettingJson(self):
        request = self.request
        sea = str(request.META.get('CSRF_COOKIE'))
        user = Client.objects.filter(season=sea)
        if request.method == "GET":
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # set data
                data = {
                    'nightMode': datasuit['nightMode'].lower(),
                    'onePageWriting': datasuit['onePageWriting'].lower(),
                    'waterMarkStatus': datasuit['waterMarkStatus'].lower(),
                    'accountType': datasuit["accountType"],
                    'waterMarkDisplayOpacity': datasuit["waterMarkDisplayOpacity"],
                    'waterMarkDisplayText': datasuit["waterMarkDisplayText"],
                    'autoSaveTimeOut': datasuit["autoSaveTimeOut"],
                    'userID': user[0].userID,
                    'authorReminders': user[0].authorReminders,
                }
                # Render Datas to page
                return JsonResponse(data)
            elif str(user) == "<QuerySet []>":
                return JsonResponse({'status': 'Out off service'})

        elif request.method == "POST":
            if user.exists():
                pGet = Client.objects.get(season=sea)
                # Set the Night Data
                night = str(request.POST['nightMode']).capitalize()
                onePageWriting = str(request.POST['onePageWriting']).capitalize()
                waterMarkStatus = str(request.POST['waterMarkStatus']).capitalize()
                opacity = request.POST['waterMarkDisplayOpacity']
                waterMarkDisplayText = str(request.POST['waterMarkDisplayText'])
                autoSaveTimeOut = request.POST['autoSaveTimeOut']
                pGet.waterMarkDisplayOpacity = opacity
                pGet.waterMarkDisplayText = waterMarkDisplayText
                pGet.autoSaveTimeOut = autoSaveTimeOut
                # get all posted data key
                # listOfPostedDataKey = getDictKey(request.POST)

                # Set Night mode
                if night == "True" or night == "False": pGet.nightMode = night
                if onePageWriting == "True" or onePageWriting == "False": pGet.onePageWriting = onePageWriting
                if waterMarkStatus == "True" or waterMarkStatus == "False": pGet.waterMarkStatus = waterMarkStatus

                # Set AccountType
                """ if 'accountType' in listOfPostedDataKey:
                    accountType = str(request.POST['accountType'])
                    if accountType == 'pro' or accountType == "free":
                        if pGet.accountType == "pro": pGet.subscriptionMode = accountType
                 """
                # Save settings
                pGet.save()

                # Render Datas to page
                return JsonResponse({"result": "success", 'message': 'Setting updated successfully'})
            elif str(user) == "<QuerySet []>":
                return JsonResponse({'result': 'failed', 'message': 'Out off service'})
