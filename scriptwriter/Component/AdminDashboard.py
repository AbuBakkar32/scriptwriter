# -*- coding: utf-8 -*-
"""
Created on Sun July 4 04:46:13 2021

@author: George

Hamdling Admin Dashboard Logic
"""

from .Assembler import (convertDBDataTOArray, render, HttpResponseRedirect,
    App, reverseReplaceTOHtmlCharacter, Client,
    generateid, time, replaceTOHtmlCharacter, JsonResponse, arrayDBData, listDBData)
#from .Assembler import AdminNotification

class AdminDashboard(object):
    def __init__(self, request):
        #initialize
        self.request = request
        self.content_context = {"title": "Admin Dashboard - Scriptwriter"}
        # Initialization of Admin Notification
        #self.adminNotification = AdminNotification(self.request)
        self.dateCreated = str(time.strftime("%d/%m/%Y, %H:%M:%S %p", time.localtime()))
        
    
    def getTotalNumberOfMembers(self):
        p = Client.objects.all()
        pList = listDBData(p, "Client")
        return len(pList)
    #def getTotalNumberOfNewNotification(self): return len(self.adminNotification.getNewNotification("admin"))
    
    def getNewNotificationTitle(self):
        notife = []#self.adminNotification.getNewNotification("admin")
        captureTitles = []
        for i in notife:
            captureTitles.append(i[0])
        return captureTitles
    
    def dashboard(self):    
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                # Returns a dict of App
                datasuit = arrayDBData(admin, "App")
                # Get Admin
                accountID = "admin"
                # Get Total Number of Members
                # datasuit["TotalMembers"] = self.getTotalNumberOfMembers()
                # Get Total Number of New Notification
                # datasuit["TotalNewNotification"] = self.getTotalNumberOfNewNotification()
                # Get New Notification Title
                # datasuit["TotalNotificationTitle"] = self.getNewNotificationTitle()
                return render(request, "admin/dashboard.html", datasuit)
            else: return HttpResponseRedirect("/app-login")
            
    def profile(self):    
        request = self.request
        sea = str(request.META.get('CSRF_COOKIE'))
        admin = App.objects.filter(season=sea)
        if request.method == "GET":
            if admin.exists():
                # Returns a dict of App
                datasuit = arrayDBData(admin, "App")
                datasuit['username'] = reverseReplaceTOHtmlCharacter(datasuit['username'])
                datasuit['password'] = reverseReplaceTOHtmlCharacter(datasuit['password'])
                datasuit['name'] = reverseReplaceTOHtmlCharacter(datasuit['name'])
                return render(request, "admin/profile.html", datasuit)
            else: return HttpResponseRedirect("/app-login")
        
        elif request.method == "POST":
            #page = str(request.POST['page'])
            #if page == "updateprofile":
            username = replaceTOHtmlCharacter(request.POST['username'])
            password = replaceTOHtmlCharacter(request.POST['password'])
            name = replaceTOHtmlCharacter(request.POST['name'])
            if str(admin) != "<QuerySet []>":
                app = App.objects.get(season=sea)
                app.username = username
                app.password = password
                app.name = name
                app.save()
                return JsonResponse({'result':'success', 'message': 'profile data updated successfully'}) #HttpResponseRedirect("/app-profile")
            else: return JsonResponse({'result':'failed', 'message': 'profile data failed to update'}) #HttpResponseRedirect("/app-login")
            
    def users(self):    
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                # Returns a dict of App
                datasuit = arrayDBData(admin, "App")
                # Get List of members
                members = Client.objects.all()
                listOfMembers = listDBData(members, "Client")
                datasuit["AllMembers"] = listOfMembers
                datasuit["TotalMembers"] = len(listOfMembers)
                # Render Users Array data to webpage
                return render(request, "admin/users.html", datasuit)
            else: return HttpResponseRedirect("/app-login")
            

