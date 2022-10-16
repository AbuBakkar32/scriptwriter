# -*- coding: utf-8 -*-
"""
Created on Fri Mar  4 07:59:27 2022

@author: George

To manage all notepad logic
"""

from .Assembler import (NotePad, generateid, time, Client, convertDBDataTOArray,
    JsonResponse, replaceTOHtmlCharacter, arrayDBData)
from random import choice

class NotePadApp(object):
    def __init__(self, request):
        #initialize
        self.request = request
        self.createdon = str(time.strftime("%d/%m/%Y, %H:%M:%S %p", time.localtime()))
        # list of class names containing background color in custom.css
        self.bgNames = ['bg-yellow','bg-green','bg-blue', 'bg-purple', 'bg-orange', 'bg-pink']
    
    def userCreateNote(self):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']
                
                #create new note
                thisColor = choice(self.bgNames)
                uid = generateid('notepad')
                newNote = NotePad(createdon=self.createdon, color=thisColor, uniqueID=uid,
                    userID=accountID)
                newNote.save()
                
                return JsonResponse({'result':'success', 'message': 'note created', 'color':thisColor, 'id':uid})
            else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
        else: return JsonResponse({'result':'failed', 'message': 'not supported'})
               
    def userDeleteNote(self, noteID):
        request = self.request
        if request.method == "GET":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']
                
                # get the note
                note = NotePad.objects.filter(uniqueID = noteID)
                if note.exists():
                    notesuite = arrayDBData(note, "NotePad")
                    noteOwnerId = notesuite['userID']
                    
                    # Ensure another author don't delete 
                    if noteOwnerId == accountID:
                        note.delete()
                        return JsonResponse({'result':'success', 'message': 'note deleted'})
                    else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
                else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login2'})
            else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login3'})
        else: return JsonResponse({'result':'failed', 'message': 'not supported'})
    
    def userUpdateNote(self, noteID):
        request = self.request
        if request.method == "POST":
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if user.exists():
                # Returns a dict of Client
                datasuit = arrayDBData(user, "Client")
                # Get client unique ID
                accountID = datasuit['userID']
                # data to be saved
                color = replaceTOHtmlCharacter(request.POST['color'])
                title = replaceTOHtmlCharacter(request.POST['title'])
                body = replaceTOHtmlCharacter(request.POST['body'])
                # get the note
                note = NotePad.objects.filter(uniqueID = noteID)
                if note.exists():
                    notesuite = arrayDBData(note, "NotePad")
                    noteOwnerId = notesuite['userID']
                    # Ensure another author don't delete 
                    if noteOwnerId == accountID:
                        noteUpdate = NotePad.objects.get(uniqueID = noteID)
                        noteUpdate.color = color
                        noteUpdate.title = title
                        noteUpdate.body = body
                        noteUpdate.save()
                        return JsonResponse({'result':'success', 'message': 'note updated'})
                    else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
                else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login2'})
            else: return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login3'})
        else: return JsonResponse({'result':'failed', 'message': 'not supported'})

