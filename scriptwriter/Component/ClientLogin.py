# -*- coding: utf-8 -*-
"""
Created on Sun July 4 04:46:13 2021

@author: Abu Bakkar Siddikk

Abu Client Login Access
"""
from django.shortcuts import redirect

from .Assembler import (replaceTOHtmlCharacter, convertDBDataTOArray, render,
                        HttpResponseRedirect, Client, arrayDBData
                        )
class ClientLogin(object):
    def __init__(self, request):
        # initialize
        self.request = request
        self.content_context = {"title": "Login Access - Script Writer"}
        self.is_login = {"log": False}
        self.err_email = {"err": ["Invalid Email Information!!!", "alert alert-danger", "margin-bottom:1%", False],
                          "title": self.content_context["title"]}

        self.err_password = {"err": ["Incorrect password!!!", "alert alert-danger", "margin-bottom:1%", False],
                             "title": self.content_context["title"]}

    def login(self):
        request = self.request
        if request.method == "POST":
            page = str(request.POST['page'])
            if page == "loginpage":
                email = replaceTOHtmlCharacter(request.POST['email'])
                password = replaceTOHtmlCharacter(request.POST['password'])
                user = Client.objects.filter(email=email)

                if not user.exists():
                    return render(request, "dashboard.html", self.err_email)
                else:
                    # k = str(p).replace("<QuerySet" , "{'QuerySet':").replace("<Client:", "").replace("']>","']").replace(">","}")
                    datasuit = arrayDBData(user, "Client")
                    if password == datasuit['password']:
                        f = Client.objects.get(email=datasuit['email'])
                        cookie = str(request.META.get(
                            'CSRF_COOKIE'))  # for ip-address #(request.META.get('HTTP_X_FORWARDED_FOR')).split(',')[0]
                        f.season = "%s" % (str(cookie))
                        f.save()
                        return HttpResponseRedirect("/client-home")
                    else:
                        return render(request, "dashboard.html", self.err_password)
            else:
                return HttpResponseRedirect("/client-home")
        elif request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                return redirect("/client-home")
            else:
                return render(request, "dashboard.html", self.content_context)


