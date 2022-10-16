# -*- coding: utf-8 -*-
"""
Created on Fri May 28 02:26:52 2021

@author: George

For managing/processing Admin login access
"""

from .Assembler import render, HttpResponseRedirect, App

class AdminAccessApp(object):
    def __init__(self, request):
        #initialize
        self.request = request
        self.contentContext = {"title": "Recover Your Account Back"}
        
        self.errResetSent = {"err":["Password reset access has been sent to your email, Check your inbox to comfirm!!!",
                              "alert alert-success","margin-bottom:1%"], "title":  self.contentContext["title"] }
        
        self.errResetFailed = {"err":["Email address not found!!!","alert alert-danger","margin-bottom:1%"], 
                       "title": self.contentContext["title"] }
        
        self.login_context = {"title": "Login to CyptoTrade 360 Admin"}
        
        self.err_logout = {"err":["Successfully Logged Out!!!","alert alert-success","margin-bottom:1%"], 
                       "title": self.login_context["title"]}
        
        self.reset_title = {"title" : "Resetting Your Account Password -CyptoTrade 360 "}
     
    def logout(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                f = App.objects.get(season=sea)
                f.season = "0.0"
                f.save()
                return render(request, "admin/login.html" , self.err_logout)
            else: return HttpResponseRedirect("/app-login")
            
        
