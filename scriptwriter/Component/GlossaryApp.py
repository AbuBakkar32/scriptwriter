# -*- coding: utf-8 -*-
"""
Created on Fri Mar  4 08:00:28 2022

@author: Abu Bakkar Siddikk

To manage all glossary logic
"""
from .Assembler import (convertDBDataTOArray, render, HttpResponseRedirect, App,
    reverseReplaceTOHtmlCharacter, convertDBDataTOList, Client, generateid, time,
    replaceTOHtmlCharacter, JsonResponse, Glossary, arrayDBData, listDBData)

class GlossaryApp(object):
    def __init__(self, request):
        #initialize
        self.request = request
        self.content_context = {"title": "Glossary - Scriptwriter"}
        self.dateCreated = str(time.strftime("%d/%m/%Y, %H:%M:%S %p", time.localtime()))

    def adminGlossaryDashboard(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = App.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of App
                datasuit = arrayDBData(user, "App")
                # List of all Glossary
                gloList = listDBData(Glossary.objects.all(), 'Glossary')
                # glossaryList = []

                # for i in gloList: glossaryList.append({"title": i[0], "body": i[1], "id": i[3]})
                # if len(glossaryList) != 0: datasuit["Glossary"] = glossaryList
                if len(gloList) != 0: datasuit["Glossary"] = gloList
                else: datasuit["Glossary"] = None
                return render(request, "admin/glossary.html", datasuit)
            elif str(user) == "<QuerySet []>": return HttpResponseRedirect("/app-login")
    
    def adminCreate(self):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                # Create new glossary
                title = replaceTOHtmlCharacter(request.POST['title'])
                body = replaceTOHtmlCharacter(request.POST['body'])
                uid = generateid('glossary')
                newGlosssary = Glossary(title=title, body=body, createdon=self.dateCreated, uniqueID=uid)
                newGlosssary.save()
                return JsonResponse({'result':'success', 'message': 'Glossary Created', 'id':uid})
            else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
        else: return JsonResponse({'result':'failed', 'message': 'not supported'})
    
    def adminDelete(self, glossaryID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                # get the note
                glo = Glossary.objects.filter(uniqueID = glossaryID)
                if glo.exists():
                    glo.delete()
                    return JsonResponse({'result':'success', 'message': 'Glossary deleted'})
                else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
            else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login2'})
        else: return JsonResponse({'result':'failed', 'message': 'not supported'})
    
    def adminUpdate(self, glossaryID):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                # get the glossary
                glo = Glossary.objects.filter(uniqueID = glossaryID)
                if glo.exists():
                    title = replaceTOHtmlCharacter(request.POST['title'])
                    body = replaceTOHtmlCharacter(request.POST['body'])
                    gloUpdate = Glossary.objects.get(uniqueID = glossaryID)
                    gloUpdate.title = title
                    gloUpdate.body = body
                    gloUpdate.save()
                    return JsonResponse({'result':'success', 'message': 'Glossary Updated'})
                else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
            else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login2'})
        else: return JsonResponse({'result':'failed', 'message': 'not supported'})
    
    def userGlossaryDashboard(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of App
                datasuit = arrayDBData(user, "Client")
                # List of all Glossary
                gloList = listDBData(Glossary.objects.all(), 'Glossary')
                # glossaryList = []
                #for i in gloList: glossaryList.append({"title": i[0], "body": i[1]})
                #if len(glossaryList) != 0: datasuit["Glossary"] = glossaryList
                if len(gloList) != 0: datasuit["Glossary"] = gloList
                else: datasuit["Glossary"] = None
                
                return render(request, "static-glossary.html", datasuit)
            elif str(user) == "<QuerySet []>": return HttpResponseRedirect("/login")
            
    
