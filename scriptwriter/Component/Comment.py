from datetime import datetime
from .Assembler import Client, Comment as CommentModel, JsonResponse, Script

class Comment(object):
    def __init__(self, request):
        self.request = request

    def addComment(self):
        request = self.request
        if request.method == 'POST':
            title = request.POST.get('noteTitle')
            comment = request.POST.get('noteDescription')
            scriptId = request.POST.get('scriptId')
            swEditorId = request.POST.get('sw_editor_id')
            
            sea = str(request.META.get('CSRF_COOKIE'))
            user = Client.objects.filter(season=sea)
            if not user.exists():
                return JsonResponse({'data': 'failed', 'message': 'Failed to authenticate login'})
            userID = user[0].userID
            
            script = Script.objects.get(uniqueID=scriptId)
            if not script:
                return JsonResponse({'data': 'failed', 'message': 'Failed to find script'})

            comment = CommentModel(title=title, comment=comment, scriptID=scriptId, sw_editor_id=swEditorId, createdon=datetime.now(), userID=userID)
            comment.save()

            user_fullname = user[0].fullName
            # time formate: 24 Oct, 2022
            createdon = comment.createdon.strftime('%d %b, %Y')

            return JsonResponse({'data': 'success', 'message': 'Comment added successfully', 'user_fullname': user_fullname, 'createdon': createdon})
    
    def getComments(self, scriptId):
        comments = CommentModel.objects.filter(scriptID=scriptId)
        if not comments.exists():
            return JsonResponse({'data': 'failed', 'message': 'Failed to find comments'})

        comments_list = []
        for comment in comments:
            comment_dict = {}
            comment_dict['title'] = comment.title
            comment_dict['comment'] = comment.comment
            createdon = comment.createdon
            # createdon is a string. Convert it to datetime object
            createdon = datetime.strptime(createdon, '%Y-%m-%d %H:%M:%S.%f')
            # time formate: 24 Oct, 2022
            createdon = createdon.strftime('%d %b, %Y')
            comment_dict['createdon'] = createdon
            comment_dict['sw_editor_id'] = comment.sw_editor_id
            comment_dict['bg_color'] = comment.bg_color

            user = Client.objects.get(userID=comment.userID)
            user_fullname = user.fullName
            comment_dict['user_fullname'] = user_fullname

            comments_list.append(comment_dict)

        return JsonResponse({'data': 'success', 'message': 'Comments fetched successfully', 'comments': comments_list})

    def getLineComments(self, scriptId, lineId):
        comments = CommentModel.objects.filter(scriptID=scriptId, sw_editor_id=lineId)
        if not comments.exists():
            return JsonResponse({'data': 'failed', 'message': 'Failed to find comments'})

        comments_list = []
        for comment in comments:
            comment_dict = {}
            comment_dict['title'] = comment.title
            comment_dict['comment'] = comment.comment
            createdon = comment.createdon
            # createdon is a string. Convert it to datetime object
            createdon = datetime.strptime(createdon, '%Y-%m-%d %H:%M:%S.%f')
            # time formate: 24 Oct, 2022
            createdon = createdon.strftime('%d %b, %Y')
            comment_dict['createdon'] = createdon
            comment_dict['sw_editor_id'] = comment.sw_editor_id
            comment_dict['bg_color'] = comment.bg_color

            user = Client.objects.get(userID=comment.userID)
            user_fullname = user.fullName
            comment_dict['user_fullname'] = user_fullname

            comments_list.append(comment_dict)

        return JsonResponse({'data': 'success', 'message': 'Comments fetched successfully', 'comments': comments_list})

    def changeBGColor(self, scriptId, lineId, color):
        comments = CommentModel.objects.filter(scriptID=scriptId, sw_editor_id=lineId)
        if not comments.exists():
            return JsonResponse({'data': 'failed', 'message': 'Failed to find comments'})

        for comment in comments:
            comment.bg_color = color
            comment.save()

        return JsonResponse({'data': 'success', 'message': 'Comments color changed successfully'})

    def autherFullname(self, request):
        sea = str(request.META.get('CSRF_COOKIE'))
        user = Client.objects.filter(season=sea)
        if user.exists():
            user_fullname = user[0].fullName
            return JsonResponse({'data': 'success', 'message': 'User fullname fetched successfully', 'fullname': user_fullname})
        else:
            return JsonResponse({'data': 'failed', 'message': 'Failed to authenticate login'})

