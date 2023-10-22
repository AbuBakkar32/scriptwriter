# -*- coding: utf-8 -*-
"""
Created on Sun Jan 16 15:43:15 2022

@author: Abu Bakkar Siddikk

Managing all script authors and their comments
"""
from .Assembler import ( replaceTOHtmlCharacter, reverseReplaceTOHtmlCharacter,
    convertDBDataTOArray, render, HttpResponseRedirect, Client,
    arrayDBData, Script, generateid, time, JsonResponse, getDictKey
)


class ScriptAuthors(object):
    def __init__(self, request):
        #initialize
        self.request = request
        
    def joinScriptAuthor(self, scriptID, emailAddress, cookie):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            author = Client.objects.filter(season=sea)
            if author.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(author, "Client")
                # Get Client Email
                email = datasuit['email']
                # Add author
                return self.addAuthor(email, cookie, scriptID)
            else: return HttpResponseRedirect("/client-home")
            
        elif request.method == "POST":
            # Add author
            return self.addAuthor(emailAddress, cookie, scriptID)
            
    def addAuthor(self, emailAddress, cookie, scriptID):
        # get the user account of the userID
        user = Client.objects.get(email = emailAddress)
        # get user authored script id
        authoredScript = eval(user.authoredScript) # value is a list object
        # Check if user is already a author in the script or user is the owner of the script
        # Get the user id and compare it to the user id in the script
        uId = user.userID
        # Script full content
        scDB = Script.objects.get(uniqueID = scriptID)
        # get script userID
        scUserID = scDB.userID
        # get authors id
        authorsID = eval(scDB.authorsID) # value is a list object
            
        # check if script owner is same as invited user before adding details to script author
        if uId == scUserID: return HttpResponseRedirect("/client-home")
        elif uId in authorsID: return HttpResponseRedirect("/client-home")
        else:
            # Add script id to user authored script list # update modified datas on user
            authoredScript.append(scDB.uniqueID)
            user.authoredScript = str(authoredScript)
            user.season = cookie
            user.save()
            
            # Add the user id to script authorsID # update modified datas on script
            authorsID.append(uId)
            scDB.authorsID = str(authorsID)
            scDB.save()
            
            return HttpResponseRedirect("/author-script/"+scriptID)
    
    def scriptAuthoredDashBoard(self, scriptID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                
                # Get authored script list and check if current script id is found in the list
                authoredScript = eval(datasuit['authoredScript'])
                
                # Ensuring that the right author is accessing the right script
                if scriptID in authoredScript:
                    # Script full content
                    scDB = Script.objects.filter(uniqueID = scriptID)
                    scriptSuit = arrayDBData(scDB, "Script")
                    datasuit["ScriptContent"] = reverseReplaceTOHtmlCharacter(scriptSuit['body'])
                    
                    # Set the subscription type
                    scriptOwner = Client.objects.get(userID = scriptSuit['userID'])
                    datasuit["SubscriptionType"] = scriptOwner.subscriptionMode
                    
                    datasuit["anAuthor"] = 'true'
                    datasuit["authorName"] = datasuit['fullName']
                    datasuit["authorID"] = datasuit["userID"]
                    return render(request, "author-newproject.html", datasuit)
                else:
                    return HttpResponseRedirect("/client-home")
                
            else: return HttpResponseRedirect("/login")
        
    def saveCommentAndNote(self, scriptID):
        request = self.request
        if request.method == "POST":
            cookie = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=cookie)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']
                accountName = datasuit['fullName']
                # Get authored script list and check if current script id is found in the list
                authoredScript = eval(datasuit['authoredScript'])
                
                text = request.POST['text']
                index = request.POST['content-line-index']
                draftID = request.POST['draftID']
                date = request.POST['date']
                tip = request.POST['type'] # note or comment

                # Update Script Content
                scDB = Script.objects.get(uniqueID = scriptID)
                body = eval(reverseReplaceTOHtmlCharacter(scDB.body))
                if tip == 'note':
                    color = request.POST['color']
                    body['draft'][draftID]['data'][index]['note']['text'] = text
                    body['draft'][draftID]['data'][index]['note']['authorID'] = accountID
                    body['draft'][draftID]['data'][index]['note']['authorName'] = accountName
                    body['draft'][draftID]['data'][index]['note']['date'] = date
                    body['draft'][draftID]['data'][index]['note']['color'] = color
                elif tip == 'comment':
                    body['draft'][draftID]['data'][index]['comment']['text'] = text
                    body['draft'][draftID]['data'][index]['comment']['authorID'] = accountID
                    body['draft'][draftID]['data'][index]['comment']['authorName'] = accountName
                    body['draft'][draftID]['data'][index]['comment']['date'] = date
                    
                # Ensuring that the right author is accessing the right script
                if scriptID in authoredScript:
                    scDB.body = replaceTOHtmlCharacter(body)
                    scDB.save()
                    return JsonResponse({'data':'success', 'message': tip.capitalize()+' saved!!!'})
                else:
                    return JsonResponse({'data':'failed', 'message': 'Failed to authenticate login'})
                    
        
