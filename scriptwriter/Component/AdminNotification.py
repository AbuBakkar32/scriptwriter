# -*- coding: utf-8 -*-
"""
Not function at the moment.

Created on Sun July 4 04:46:13 2021

@author: George

Hamdling App App Logic
"""

from .Assembler import convertDBDataTOArray, render, HttpResponseRedirect, App,  convertDBDataTOList, Notification

class AdminNotification(object):
    def __init__(self, request):
        #initialize
        self.request = request
        self.title = {"title": " Notification Section"}
        
    def getNewNotification(self, userID):
        notif = Notification.objects.filter(userID = userID)
        datasuit = convertDBDataTOList(notif, "Notification")
        collectUnseenNotification = []
        for i in datasuit:
            if i[4] == "unseen":
                collectUnseenNotification.append(i)
        collectUnseenNotification.reverse()
        return collectUnseenNotification
    
    def getListNotification(self, userID):
        notif = Notification.objects.filter(userID = userID)
        datasuit = convertDBDataTOList(notif, "Notification")
        collectUnseenNotification = []
        count = 0
        for i in datasuit:
            if i[4] == "unseen":
                collectUnseenNotification.append(i)
                p = Notification.objects.get(uniqueID = i[2])
                p.status = "seen"
                p.save()
                count += 1
            else:
                collectUnseenNotification.append(i)
                count += 1
            if count == 100: break
        collectUnseenNotification.reverse()
        return collectUnseenNotification
    
   
    def notification(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            p = App.objects.filter(season=sea)
            if str(p) != "<QuerySet []>":
                # Returns a dict of App
                datasuit = convertDBDataTOArray(p, "App")
                # create a new key in the datasuit dict and set value of account type
                datasuit["title"] = self.title["title"]
                # Get admin
                accountID = "admin"
                # Notification handle
                newNotife = self.getListNotification( accountID)
                
                datasuit["NotificationSet"] = newNotife
                
                return render(request, "admin/notification.html", datasuit)
        
        