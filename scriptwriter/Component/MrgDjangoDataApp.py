# -*- coding: utf-8 -*-
"""
Created on Fri May 28 02:21:44 2021

@author: George
"""


class MrgDjangoDataApp():
    def __init__(self):
        # initialize
        pass

    def replaceTOHtmlCharacter(self, mydata):
        """Covert raw character to html type"""
        return str(mydata).replace('&', '&amp;').replace("'", '&apos;').replace('"', '&quot;').replace("\\",
                                                                                                       "&bsol;").replace(
            "\r", "").replace("\n", "&#10;").replace(">", "&gt;").replace("<", "&lt;")

    def reverseReplaceTOHtmlCharacter(self, mydata):
        """ Convert html type of data to raw character"""
        return str(mydata).replace('&amp;', '&').replace('&apos;', "'").replace('&quot;', '"').replace("&bsol;",
                                                                                                       "\\").replace(
            "&#10;", "\n").replace("&gt;", ">").replace("&lt;", "<")

    def convertDBDataTOArray(self, db_data, classname):
        st1 = str(db_data).replace("<QuerySet", "{'QuerySet':").replace("<" + classname + ":", "").replace("']>",
                                                                                                           "']").replace(
            ">", "}")
        return eval(st1)

    def convertDBDataTOList(self, db_data, classname):
        data = eval(str(list(db_data)).replace(
            "<QuerySet", "{'QuerySet':").replace("<" + classname + ":", "").replace("']>", "']").replace(">", "}"))
        return data

    def getDictKey(self, dict):
        list = []
        for key in dict.keys():
            list.append(key)
        return list

    def arrayDBData(self, db_data, classname):
        prepareString = str(db_data).replace("<QuerySet", "{'QuerySet':").replace("<" + classname + ":", "").replace(
            "]>", "]}").replace(">", "")
        evalString = eval(prepareString)
        return evalString['QuerySet'][0]

    def listDBData(self, db_data, classname):
        prepareString = str(list(db_data)).replace("<QuerySet", "{'QuerySet':").replace(
            "<" + classname + ":", "").replace("]>", "]}").replace(">", "")
        evalString = eval(prepareString)
        return evalString

    def uploadFileHandler(self, f, filename, fileUploadPath):
        """where f is the file posted, example request.FILES['img'], \
            filename is either the name of the file posted or a new name that we like and \
                fileUploadPath is the system location to store the file."""
        import os
        filePath = os.path.join(fileUploadPath, filename)
        try:
            with open(filePath, 'wb+') as destination:
                for chunk in f.chunks():
                    destination.write(chunk)
            return True
        except:
            return False
