# -*- coding: utf-8 -*-
"""
Created on Tue Jun  1 04:46:13 2021

@author: George

Hamdling Admin Login Access
"""

from .Assembler import (replaceTOHtmlCharacter, arrayDBData, render,
                        HttpResponseRedirect, App)


class AdminLogin(object):
    def __init__(self, request):
        # initialize
        self.request = request
        self.content_context = {"title": "Admin Login - Scriptwriter"}

        self.err_email = {"err": ["Incorrect Information!!!", "alert alert-danger", "margin-bottom:1%"],
                          "title": self.content_context["title"]}

        self.err_password = {"err": ["Incorrect password!!!", "alert alert-danger", "margin-bottom:1%"],
                             "title": self.content_context["title"]}

    def login(self):
        request = self.request
        if request.method == "POST":
            page = str(request.POST['page'])
            if page == "loginpage":
                username = replaceTOHtmlCharacter(request.POST['username'])
                password = replaceTOHtmlCharacter(request.POST['password'])
                admin = App.objects.filter(username=username)
                if admin.exists():
                    datasuit = arrayDBData(admin, "App")
                    if str(password) == datasuit['password']:
                        f = App.objects.get(username=str(datasuit['username']))
                        visitor_ip = str(request.META.get(
                            'CSRF_COOKIE'))  # for ip-address #(request.META.get('HTTP_X_FORWARDED_FOR')).split(',')[0]
                        f.season = str(visitor_ip)
                        f.save()
                        return HttpResponseRedirect("/app-home")
                    else:
                        return render(request, "admin/login.html", self.err_password)
                return render(request, "admin/login.html", self.err_email)
            else:
                return HttpResponseRedirect("/app-login")

        elif request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                return HttpResponseRedirect("/app-home")
            else:
                return render(request, "admin/login.html", self.content_context)
