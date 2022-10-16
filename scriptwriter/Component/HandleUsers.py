# -*- coding: utf-8 -*-
"""
Created on Sun May 29 02:00:15 2022

@author: George

Handle user data by admin
"""

from .Assembler import (Client, render, App, arrayDBData, listDBData,
    HttpResponseRedirect)

class HandleUsers(object):
    def __init__(self, request):
        #initialize
        self.request = request

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
    
    def subscribers(self):    
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                # Returns a dict of App
                datasuit = arrayDBData(admin, "App")

                # Render Users Array data to webpage
                return render(request, "admin/subscribers.html", datasuit)
            else: return HttpResponseRedirect("/app-login")
    