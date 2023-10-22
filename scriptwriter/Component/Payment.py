# -*- coding: utf-8 -*-
"""
Created on Fri Mar 11 14:34:13 2022

@author: Abu Bakkar Siddikk

Stripe integration and transaction

"""
from .Assembler import (Client, JsonResponse, render, Transaction, generateid,
    replaceTOHtmlCharacter, time, Subscription, HttpResponseRedirect, arrayDBData
)
from datetime import datetime, timedelta

class Payment(object):
    def __init__(self, request):
        self.request = request
        self.units = {'1':{'amount': 15, 'plan': 'month'}, '2': {'amount': 180, 'plan': 'year'}}
        self.dateCreated = str(time.strftime("%d/%m/%Y, %H:%M:%S %p", time.localtime()))
        self.url = request.get_raw_uri().split(':')[0]+"://"+request._get_raw_host()
        
        self.stripeSecretKey = 'sk_test_51KbXSeJXVkce513A52dixazc7AGEN0NLsMq2ry1XLoXPoYp2JsPkunscJRiVTDyAYVQKO2MWdvCgfyivSz3Dsc8H00foyuwlxX'
    
    def createTransaction(self, cltID, cltName, amt, plan):
        transID = generateid('transaction')
        trans = Transaction(uniqueID=transID, userID=cltID, amount=amt,
            createdon=self.dateCreated, status="pending", data='nill', 
            clientName=cltName, plan=plan
        )
        trans.save()
        return transID
        
    def confirmTransaction(self, status, transactionID):
        #return None
        # Get the transaction
        trans = Transaction.objects.get(uniqueID=transactionID)
        if status == 'success':
            # change the transaction status to success
            trans.status = 'success'
            # Create the subscription for the client
            subID = generateid('subscription')
            # Subscription datetime setup
            currentTime = datetime.now()
            startD = str(datetime.strftime(currentTime, "%d/%m/%Y"))
            if trans.plan == 'year':
                nextD = currentTime + timedelta(365)
                endD = str(datetime.strftime(nextD, "%d/%m/%Y"))
            else:
                nextD = currentTime + timedelta(30)
                endD = str(datetime.strftime(nextD, "%d/%m/%Y"))
            
            sub = Subscription(uniqueID=subID, userID=trans.userID, amount=trans.amount, 
                createdon=trans.createdon, status='active', startingDate=startD, endingDate=endD, 
                transactionID=transactionID, clientName=trans.clientName, plan=trans.plan
            )
            sub.save()
            
            # Update the client account
            client = Client.objects.get(userID = trans.userID)
            client.accountType = 'pro'
            client.subscriptionMode = trans.plan
            client.subscriptionID = subID
            client.save()
            
            trans.save()
        else:
            # change the transaction status to failed
            trans.status = 'failed'
            trans.save()
    
    def initStripe(self):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                unit = replaceTOHtmlCharacter(request.POST['unit'])
                if unit not in self.units: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
                import stripe                
                actualAmount = self.units[unit]['amount']
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']
                clientName = datasuit['fullName']
                transactionID = self.createTransaction(accountID, clientName, actualAmount, self.units[unit]['plan'])
                
                # Stripe Secret Key
                stripe.api_key = self.stripeSecretKey
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price_data': {
                                'currency': 'gbp',
                                'unit_amount': actualAmount*100,
                                'product_data': {
                                    'name': "Scriptovate",
                                    'images': [self.url+"/cdn/image/product1.png"],
                                    },
                                },
                            'quantity': 1,
                            },
                        ],
                    mode='payment',
                    success_url= self.url + '/payment-success/' + transactionID,
                    cancel_url= self.url + '/payment-failed/' + transactionID,
                )
                return JsonResponse({'result':'success', 'message':'payment getway initiated successfully.',
                                     'id': checkout_session.id})                
            else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login2'})
        else: return JsonResponse({'result':'failed', 'message': 'not supported'})
         
    def successPage(self, transactionID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if str(user) != "<QuerySet []>":
                datasuit = arrayDBData(user, "Client")
                # clearify the transaction
                self.confirmTransaction('success', transactionID)
                # Render Datas to page
                return render(request, "sw-page/payment-success.html", datasuit)
            elif str(user) == "<QuerySet []>": return HttpResponseRedirect("/login")
    
    def failedPage(self, transactionID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if str(user) != "<QuerySet []>":
                datasuit = arrayDBData(user, "Client")
                # clearify the transaction
                self.confirmTransaction('failed', transactionID)
                # Render Datas to page
                return render(request, "sw-page/payment-failed.html", datasuit)
            elif str(user) == "<QuerySet []>": return HttpResponseRedirect("/login")

