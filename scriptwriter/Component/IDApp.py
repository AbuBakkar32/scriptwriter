# -*- coding: utf-8 -*-
"""
Created on Fri May 28 02:12:43 2021

@author: George

For managing and handling of I.D for the app
"""
from scriptwriter.models import IDManager
from random import choice

class IDApp():
    def __init__(self):
        #initialize
        pass
    def generateid(self, typ):
        """typ may contain the following parameter: 
            newclient : Generate code for new registered user\n
            transaction : Generate code for Transaction.\n
            passwordreset: Generate code during password reset.\n
        """
        if typ == "newclient":
            while True:
                id_range = range(0, 9999999)
                new_gen_id = "C"+str(choice(id_range))
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName="student")
                    idm.save()
                    return new_gen_id
                else: pass     
            
        elif typ == "newscript":
            while True:
                n , l = range(0, 10), "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                new_gen_id = str(choice(n))+str(choice(n))+str(choice(l))+str(choice(n))+str(choice(l))+str(
                    choice(l))+str(choice(n))+str(choice(n))+str(choice(l))+str(choice(n))+str(choice(l))
                #new_gen_id = "CT"+str(choice(range(0, 1000000)))
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                else: pass
        
        elif typ == "notepad":
            while True:
                n  = range(0, 10)
                new_gen_id = "NP"+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))
                #new_gen_id = "CT"+str(choice(range(0, 1000000)))
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                else: pass
            
        elif typ == "glossary":
            while True:
                n  = range(0, 10)
                new_gen_id = "GS"+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))
                #new_gen_id = "CT"+str(choice(range(0, 1000000)))
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                else: pass
            
        elif typ == "transaction":
            while True:
                n  = range(0, 20)
                new_gen_id = "T"+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))+str(choice(n))
                #new_gen_id = "CT"+str(choice(range(0, 1000000)))
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                else: pass
        
        elif typ == "passwordreset":
            while True:
                id_range = range(100000, 999999)
                id_l = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                new_gen_id = "PR"+str(choice(id_range))+str(choice(id_l))+str(choice(id_l))+str(choice(id_l))+str(choice(id_l))
                p_id = IDManager.objects.filter(idValue= new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                    break
                else: pass
        
        elif typ == "emailpin":
            while True:
                id_range = range(1000, 100000)
                id_l = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
                new_gen_id = "SW-"+str(choice(id_range))+str(choice(id_l))+str(choice(id_l))+str(choice(id_l))
                p_id = IDManager.objects.filter(idValue= new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                    break
                else: pass
            
        elif typ == "subscription":
            while True:
                n , l = range(0, 10), "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                new_gen_id = "SS"+str(choice(n))+str(choice(n))+str(choice(l))+str(choice(n))+str(choice(l))+str(
                    choice(l))+str(choice(n))+str(choice(n))+str(choice(l))+str(
                        choice(n))+str(choice(n))+str(choice(l))+str(choice(l))
                #new_gen_id = "CT"+str(choice(range(0, 1000000)))
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                else: pass
        
        elif typ == "pics":
            while True:
                n , l = range(0, 10), "PICIMAGEIMAGECREATE"
                new_gen_id = "PIC"+str(choice(n))+str(choice(n))+str(choice(l))+str(choice(n))+str(choice(l))+str(
                    choice(l))+str(choice(n))+str(choice(n))+str(choice(l))+str(
                        choice(n))+str(choice(n))+str(choice(l))+str(choice(l))
                        
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                else: pass
            
        elif typ == "pdf":
            while True:
                n , l = range(0, 10), "PDFABCDEFGHPDFIJKPDF"
                new_gen_id = "PDF"+str(choice(n))+str(choice(n))+str(choice(l))+str(choice(n))+str(choice(l))+str(
                    choice(l))+str(choice(n))+str(choice(n))+str(choice(l))+str(choice(n))+str(choice(n))
                p_id = IDManager.objects.filter(idValue = new_gen_id)
                if str(p_id) == "<QuerySet []>":
                    idm = IDManager(idValue=new_gen_id, idName=typ)
                    idm.save()
                    return new_gen_id
                else: pass
                        
