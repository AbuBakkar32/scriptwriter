"""scriptwriter URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
from django.urls import path
# from django.conf.urls import url

from django.conf import settings
from django.conf.urls.static import static

from scriptwriter import views

urlpatterns = [
    path('', views.signup),
    path('editor', views.editor),
    path('login', views.login),
    path('signup', views.signup),
    path('forget-password', views.forgetPassword),
    path('dashboard', views.dashboard),
    path('client-home', views.clientHome),
    path('logout', views.clientLogout),
    path('newscript', views.newproject),
    path('scriptwork/<slug:slug1>', views.scriptwork),
    path('scriptwork/<slug:slug1>/save', views.scriptSave),
    path('scriptwork/<slug:slug1>/download', views.downloadScript),
    path('scriptwork/<slug:slug1>/invite', views.inviteAuthor),
    path('script-work-update/<slug:scriptID>', views.updateScriptViaJson),
    path('script-work-delete/<slug:scriptID>', views.deleteScriptViaJson),
    # Client manage image
    path('script/image', views.uploadCharacterProfilePics),
    path('script/image/<slug:fid>', views.getCharacterProfilePics),
    path('outline', views.outline),
    path('pinboard', views.pinboard),
    path('character', views.character),
    path('structure', views.structure),

    path('newproject', views.newproject),
    path('glossary', views.clientGlossaryDashboard),
    path('profile', views.profile),
    path('upgrade', views.upgrade),
    path('clientsetting', views.clientSettingData),
    path('author-script/<slug:slug1>', views.authorScriptDashboard),
    path('author-script/<slug:slug1>/save-tip', views.authorSaveCommentOrNote),
    path('get-all-script/<slug:slug1>/', views.getAuthorAllScripts),
    # notepade urls
    path('note-create', views.createNote),
    path('note-delete/<slug:noteid>', views.deleteNote),
    path('note-update/<slug:noteid>', views.updateNote),
    # Payment Section
    path('payment-initiate', views.paymentInitiate),
    path('payment-success/<slug:pid>', views.paymentSuccess),
    path('payment-failed/<slug:pid>', views.paymentFailed),
    # Admin section
    path('app-login', views.appLogin),
    path('app-logout', views.appLogout),
    path('app-home', views.appHome),
    path('app-profile', views.appProfile),
    path('app-users', views.appUsers),
    path('app-transaction', views.appTransaction),
    path('app-subscribers', views.appSubscribers),
    path('app-structure', views.appStructureSample),
    path('app-character', views.appCharacter),
    # Glossary section
    path('app-glossary', views.appGlossary),
    path('app-glossary-create', views.appCreateGlossary),
    path('app-glossary-update/<slug:glossaryID>', views.appUpdateGlossary),
    path('app-glossary-delete/<slug:glossaryID>', views.appDeleteGlossary),
    # Audio section
    path('app-audio', views.appAudio),
    path('app-audio/create', views.appCreateAudio),
    path('app-audio/update/<slug:audioID>', views.appUpdateAudio),
    path('app-audio/delete/<slug:audioID>', views.appDeleteAudio),
    # Comment section
    path('add-comment', views.addComment),
    path('get-comments/<slug:scriptID>', views.getComments),
]
if settings.DEBUG:
    urlpatterns += static(settings.CDN_URL, document_root=settings.CDN_ROOT)
else:
    urlpatterns += static(settings.CDN_URL, document_root=settings.CDN_ROOT)
