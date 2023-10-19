"""
Created on Sun May 29 02:00:15 2022

@author: Abu Bakkar Siddikk

Managing all transactions done by users
"""

from .Assembler import (Client, JsonResponse, render, Transaction,
    convertDBDataTOList, generateid, replaceTOHtmlCharacter, time, 
    Subscription, convertDBDataTOArray, HttpResponseRedirect,
    arrayDBData, listDBData, App
)
                        
class HandleTransaction(object):
    def __init__(self, request):
        #initialize
        self.request = request

    def page(self):    
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            admin = App.objects.filter(season=sea)
            if admin.exists():
                # Returns a dict of App
                datasuit = arrayDBData(admin, "App")
                
                # Render Users Array data to webpage
                return render(request, "admin/transaction.html", datasuit)
            else: return HttpResponseRedirect("/app-login")
    
