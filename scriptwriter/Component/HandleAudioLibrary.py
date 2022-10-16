"""
Created on Sun May 29 02:00:15 2022

@author: George

Managing text to audio for users and background songs uploaded by admin
"""
from .Assembler import (JsonResponse, render, generateid,
    HttpResponseRedirect, App, arrayDBData, listDBData, AudioStore,
    uploadFileHandler, os, IDManager, STATICFILE_DIR,
    replaceTOHtmlCharacter
)

class HandleAudioLibrary(object):
    def __init__(self, request):
        #initialize
        self.request = request
        self.cookies = str(request.META.get('CSRF_COOKIE'))

    def page(self):    
        request = self.request
        if request.method == "GET":
            admin = App.objects.filter(season=self.cookies)
            if admin.exists():
                # Returns a dict of App
                datasuit = arrayDBData(admin, "App")
                datasuit['AudioStore'] = listDBData(AudioStore.objects.all(), 'AudioStore')
                # Render Users Array data to webpage
                return render(request, "admin/audio.html", datasuit)
            else: return HttpResponseRedirect("/app-login")

    def create(self):
        if self.request.method == "POST":
            admin = App.objects.filter(season=self.cookies)
            if admin.exists():
                uniqueID = generateid('pics')
                audioName = replaceTOHtmlCharacter(self.request.POST['audioName'])
                audioFile = self.request.FILES['audioFile']
                extention = str(audioFile.name).split('.')[-1]
                fID = extention.upper() + '_' + uniqueID
                fName = fID + '.' + extention
                # Upload file
                isFileSaved = uploadFileHandler(audioFile, fName, STATICFILE_DIR)
                # return the image url
                if isFileSaved: 
                    #imageUrl = self.url + '/cdn/staticfiles/' + fName
                    dbAudio = AudioStore(uniqueID=uniqueID, name=audioName, fileName=fName)
                    dbAudio.save()
                    return JsonResponse({'result':'success', 'name':fName, 'id': uniqueID}) #, 'message': imageUrl})
                return JsonResponse({'result':'failed', 'message': 'Unable to upload file at this moment.'})
            return JsonResponse({'result':'failed', 'message': 'Failed to authenticate login1'})
        return JsonResponse({'result':'failed', 'message': 'not supported'})

    def delete(self, audioID):
        if self.request.method == "GET":
            admin = App.objects.filter(season=self.cookies)
            if admin.exists():
                query = AudioStore.objects.filter(uniqueID = audioID)
                # if order is filtered by it id and not found, then return a failed response
                if str(query) == "<QuerySet []>": return JsonResponse({'result': 'failed'})
                # delete the file
                datasuit = arrayDBData(query, 'AudioStore')
                os.remove(os.path.join(STATICFILE_DIR, datasuit['fileName']))
                # delete the invoice
                query.delete()
                
                # also delete it in the id storage
                idQuery = IDManager.objects.filter(idValue = audioID)
                if idQuery.exists(): idQuery.delete()

                return JsonResponse({'result': 'success'})
            return JsonResponse({'result': 'failed'})
        return JsonResponse({'result': 'happy test'})

    def update(self, audioID):
        if self.request.method == "POST":
            admin = App.objects.filter(season=self.cookies)
            if admin.exists():
                query = AudioStore.objects.filter(uniqueID = audioID)
                if not query.exists(): return JsonResponse({'result': 'failed'})
                newAudioName = replaceTOHtmlCharacter(self.request.POST['audioName'])
                if not newAudioName: return JsonResponse({'result': 'failed'})
                getAudio = AudioStore.objects.get(uniqueID = audioID)
                getAudio.name = newAudioName
                getAudio.save()
                return JsonResponse({'result': 'success'})
            return JsonResponse({'result': 'failed'})
        return JsonResponse({'result': 'happy test'})
    