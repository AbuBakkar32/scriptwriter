# -*- coding: utf-8 -*-
"""
Created on Fri May 28 02:26:52 2021

@author: George

For managing/processing Client login access
"""

from .Assembler import (replaceTOHtmlCharacter, generateid, render,
                        HttpResponseRedirect, Client, arrayDBData, EmailApp
                        )


class ClientAccessApp(object):
    def __init__(self, request):
        # initialize
        self.request = request
        self.contentContext = {"title": "Recover Your Account Back"}

        self.errResetSent = {
            "err": ["Password reset access has been sent to your email, Check your inbox to comfirm!!!",
                    "alert alert-success", "margin-bottom:1%"], "title": self.contentContext["title"]}

        self.errResetFailed = {"err": ["Email address not found!!!", "alert alert-danger", "margin-bottom:1%"],
                               "title": self.contentContext["title"]}

        self.login_context = {"title": "Login to Script Writer"}

        self.err_logout = {"err": ["Successfully Logged Out!!!", "alert alert-success", "margin-bottom:1%"],
                           "title": self.login_context["title"]}

        self.reset_title = {"title": "Resetting Your Account Password, Choose new password"}

        # Initialization of the EmailApp component
        self.emailApp = EmailApp(self.request)

    def logout(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                f = Client.objects.get(season=sea)
                f.season = "0.0"
                f.save()
                return render(request, "dashboard.html", self.err_logout)
            else:
                return render(request, "dashboard.html")

    def forget_password(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                return HttpResponseRedirect("/client-home")
            else:
                return render(request, "forget_password.html", self.contentContext)

        elif request.method == "POST":
            page = str(request.POST['page'])
            if page == "apply":
                email = replaceTOHtmlCharacter(request.POST['email'])
                rpv = generateid("passwordreset")
                casted_email = Client.objects.filter(email=email)
                if not casted_email.exists(): return render(request, "forget_password.html", self.errResetFailed)
                f = Client.objects.get(email=email)
                f.resetPasswordValue = str(rpv)
                f.save()
                return HttpResponseRedirect("/reset-password/" + rpv)

    def resetpassword(self, slug1):
        request = self.request
        reset_password_value = str(slug1)
        if request.method == "GET":
            user = Client.objects.filter(resetPasswordValue=reset_password_value)
            if not user.exists():
                return HttpResponseRedirect("/forget-password")
            else:
                datasuit = arrayDBData(user, "Client")
                datasuit["uservalue"] = reset_password_value
                datasuit["title"] = self.reset_title["title"]
                return render(request, "resetpassword_form.html", datasuit)

        if request.method == "POST":
            page = str(request.POST['page'])
            if page == "passwordsubmit":
                password1 = replaceTOHtmlCharacter(request.POST['password1'])
                password2 = replaceTOHtmlCharacter(request.POST['password2'])
                if password1 == password2:
                    f = Client.objects.get(resetPasswordValue=reset_password_value)
                    f.resetPasswordValue = ""
                    f.password = password1
                    f.save()
                    return HttpResponseRedirect("/client-home")
                else:
                    datasuit = {}
                    datasuit["err"] = [
                        "New password doesn't match each other, please take note of case sensitivity !!!",
                        "alert alert-danger", "margin-bottom:1%"]
                    datasuit["uservalue"] = reset_password_value
                    datasuit["title"] = self.reset_title["title"]

                    return render(request, "resetpassword_form.html", datasuit)
            return HttpResponseRedirect("/client-home")

    def Nforget_password(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            p = Client.objects.filter(season=sea)
            if str(p).startswith("<QuerySet []>") == False:
                return HttpResponseRedirect("/client-home")
            elif str(p).startswith("<QuerySet []>") == True:
                return render(request, "forget_password.html", self.contentContext)
            else:
                return render(request, "forget_password.html", self.contentContext)

        if request.method == "POST":
            page = str(request.POST['page'])
            if page == "apply":
                email = replaceTOHtmlCharacter(request.POST['email'])
                rpv = generateid("passwordreset")
                casted_email = Client.objects.filter(email=email)
                if str(casted_email) == "<QuerySet []>": return render(request, "forget_password.html",
                                                                       self.errResetFailed)
                f = Client.objects.get(email=email)
                f.resetPasswordValue = str(rpv)
                f.save()
                # Password Reset Email Sender
                self.emailApp.passwordReset_mail(rpv, email)
                return render(request, "forget_password.html", self.errResetSent)

    def Nclient_verify_email(self, slug1, slug2):
        request = self.request
        content_context = {"title": " Sign In to your account - Scriptwriter"}
        if request.method == "GET":
            user_id = str(slug1)
            email_pin = str(slug2)
            p = Client.objects.filter(userID=user_id)
            if str(p) == "<QuerySet []>":
                return HttpResponseRedirect("/client-home")
            else:
                datasuit = arrayDBData(p, 'Client')
                if email_pin == datasuit['emailVerificationValue']:
                    f = Client.objects.get(userID=user_id)
                    f.emailVerification = True
                    f.emailVerificationValue = ""
                    f.save()
                    return HttpResponseRedirect("/client-home")
                else:
                    datasuit["err"] = ["Incorrect Email pin!!!", "alert alert-danger", "margin-bottom:1%"]
                    datasuit["title"] = " Sign In to your account - Scriptwriter"
                    return render(request, "z_login.html", datasuit)

    def Nclient_reverifyemail(self):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE')) + ":login"
            user = Client.objects.filter(season=sea)
            if user.exists():
                datasuit = arrayDBData(user, 'Client')
                user_id = datasuit['userID']
                emailpin = generateid("emailpin")
                email = replaceTOHtmlCharacter(request.POST['email'])
                f = Client.objects.get(season=sea)
                f.email = email
                f.emailVerificationValue = str(emailpin)
                f.save()
                # reverify email sender
                self.emailApp.reverify_mail(user_id, email, emailpin)
                return HttpResponseRedirect("/client-home")
            # else: return render(request,"login.html")
            else:
                return HttpResponseRedirect("/client-home")

    def Nclient_resetpassword(self, slug1):
        request = self.request
        reset_password_value = str(slug1)
        if request.method == "GET":
            p = Client.objects.filter(resetPasswordValue=reset_password_value)
            if str(p) == "<QuerySet []>":
                return HttpResponseRedirect("/forget-password")
            else:
                datasuit = arrayDBData(p, 'Client')
                datasuit["uservalue"] = reset_password_value
                datasuit["title"] = "Resetting Your Account Password - Scriptwriter"
                return render(request, "reset_new_password.html", datasuit)

        if request.method == "POST":
            page = str(request.POST['page'])
            if page == "passwordsubmit":
                password1 = replaceTOHtmlCharacter(request.POST['password1'])
                password2 = replaceTOHtmlCharacter(request.POST['password2'])
                if password1 == password2:
                    f = Client.objects.get(resetPasswordValue=reset_password_value)
                    f.resetPasswordValue = ""
                    f.password = password1
                    f.save()
                    return HttpResponseRedirect("/client-home")
                else:
                    datasuit = {}
                    datasuit["err"] = [
                        "New password doesn't match each other, please take note of case sensitivity !!!",
                        "alert alert-danger", "margin-bottom:1%"]
                    datasuit["title"] = "Resetting Your Account Password - Scriptwriter"

                    return render(request, "reset_new_password.html", datasuit)
            return HttpResponseRedirect("/client-home")
