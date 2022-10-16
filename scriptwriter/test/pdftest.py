# -*- coding: utf-8 -*-
"""
Created on Wed Jan 26 02:53:03 2022

@author: George
"""

# Python program to create
# a pdf file


from fpdf import FPDF
import os
MAIN_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

#print(os.path.dirname(MAIN_DIR))

# save FPDF() class into a
# variable pdf
pdf = FPDF()
#from fpdf import FPDF, HTMLMixin
#class MyFPDF(FPDF, HTMLMixin): pass
#pdf = MyFPDF()

# Add a page
pdf.add_page()

# Add a Unicode system font (using full path)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-Regular.ttf", uni=True)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-Italic.ttf", uni=True)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-Bold.ttf", uni=True)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-BoldItalic.ttf", uni=True)

pdf.set_font("Courier Prime", size = 13)
# set style and size of font # Courier Prime
# that you want in the pdf Arial
#pdf.set_font("Arial", size = 15)

# create a cell
pdf.cell(200, 10, txt = "GeeksforGeeks", ln = 1, align = 'C')

# add another cell
pdf.set_font("Courier", size = 13, style="B")
pdf.rect(100, 10, 500, 30)
pdf.multi_cell(200, 10, txt = """
FPDF is a Python class that allows generating PDF files with Python code. It is free to use and it does not require any API keys.
         """, align = 'L')

#pdf.write_html('<font face="Courier">Hello guys <b>working test</b></font>')


# insert the texts in pdf
#for x in f:
#    pdf.multi_cell(200, 8, txt = x, align = 'L')
    #pdf.cell(200, 10, txt = x, ln = 1, align = 'L')
    
# save the pdf with name .pdf
pdf.output("test.pdf")

