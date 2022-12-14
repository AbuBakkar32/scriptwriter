# -*- coding: utf-8 -*-
"""
Created on Mon May 31 01:51:09 2021

@author: George

Client SignUp functionality/Handler
"""
# Importing External Apps
from .Assembler import (replaceTOHtmlCharacter, generateid, render,
                        HttpResponseRedirect, Client, time, MiniClient, EmailApp
                        )
import requests


class ClientSignUp(object):
    def __init__(self, request):
        # initialize
        self.request = request
        self.content_context = {"title": "Script Writer"}
        self.err_email = {"err": ["Email Already Exist!!!", "alert alert-danger", "margin-bottom:1%"],
                          "title": self.content_context["title"]}
        # Initialization of the EmailApp component
        self.emailApp = EmailApp(self.request)

    def get_ip(self):
        response = requests.get('https://api64.ipify.org?format=json').json()
        return response["ip"]

    def get_location(self):
        ip_address = self.get_ip()
        response = requests.get(f'https://ipapi.co/{ip_address}/json/').json()
        location_data = {
            "country": response.get("country_name")
        }
        return location_data

    def signup(self):
        request = self.request
        # self.MY_URL = 'http://'+str(request.META.get('HTTP_HOST'))
        if request.method == "POST":
            page = str(request.POST['page'])
            if page == "registerpage":
                # save data
                fullname = replaceTOHtmlCharacter(request.POST['firstname']) + " " + replaceTOHtmlCharacter(
                    request.POST['lastname'])
                self.emailAddress = replaceTOHtmlCharacter(request.POST['email'])
                password = replaceTOHtmlCharacter(request.POST['password'])
                dateOfSignup = str(time.strftime("%d/%m/%Y, %H:%M:%S %p", time.localtime()))
                experience = replaceTOHtmlCharacter(request.POST['experience'])
                write = replaceTOHtmlCharacter(request.POST['write'])
                try:
                    country = self.get_location()["country"]
                except:
                    country = "Unknown"
                self.cookie = str(request.META.get('CSRF_COOKIE'))

                userID = generateid("newclient")

                checkExistEmail = Client.objects.filter(email=self.emailAddress)

                if checkExistEmail.exists():
                    return render(request, "registration.html", self.err_email)
                else:
                    addUp = Client(fullName=fullname, email=self.emailAddress,
                                   password=password, country=country, userID=userID, emailVerification=False,
                                   emailVerificationValue="", resetPasswordValue="", createdon=dateOfSignup,
                                   season=self.cookie, state="offline", authoredScript="[]", accountType='free',
                                   nightMode=False, onePageWriting=False, autoSaveTimeOut=5,
                                   waterMarkStatus=False, waterMarkDisplayText='', waterMarkDisplayOpacity=1.0,
                                   subscriptionMode='free', subscriptionID=0, experience=experience, write=write
                                   )
                    addUp.save()

                    miniAdd = MiniClient(fullName=fullname, email=self.emailAddress,
                                         createdon=dateOfSignup, userID=userID
                                         )
                    miniAdd.save()
                    print(fullname, self.emailAddress, userID, password)
                    self.emailApp.welcome_mail(fullname=fullname, email=self.emailAddress, user_id=userID, emailpin=password)

                    return HttpResponseRedirect("/client-home")

        elif request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                return HttpResponseRedirect("/client-home")
            else:
                return render(request, "registration.html", self.content_context)
