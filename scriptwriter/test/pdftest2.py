# -*- coding: utf-8 -*-
"""
Created on Wed Jan 26 12:04:16 2022

@author: George
"""

html = """
<font face="Courier">
<H1 align="center">html2fpdf</H1>
<h2>Basic usage</h2>
<p>You can now easily print text mixing different styles : <B>bold</B>, <I>italic</I>, <U>underlined</U>, or 
<B><I><U>all at once</U></I></B>!<BR>You can also insert links on text, such as <A HREF="http://www.fpdf.org">www.fpdf.org</A>,
or on an image: click on the logo.<br>

<h3>Sample List</h3>
<ul>
    <li>option 1</li>
    <ol>
        <li>option 2</li>
    </ol>
    <li>option 3</li>
</ul>

<br>

<table border="0" align="center" width="100%">
    <thead>
        <tr>
            <th width="30%"></th>
            <th width="70%"></th>
        </tr>
    </thead>
    <tbody border="0">
        <tr border="0"><td>cell 1</td><td>cell 2</td></tr>
        <tr border="0"><td>cell 2</td><td>cell 3</td></tr>
    </tbody>
</table>
</font>
"""

import os
MAIN_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))

from fpdf import FPDF, HTMLMixin
class MyFPDF(FPDF, HTMLMixin): pass
pdf = MyFPDF()

# Add a page
pdf.add_page()

# Add a Unicode system font (using full path)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-Regular.ttf", uni=True)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-Italic.ttf", uni=True)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-Bold.ttf", uni=True)
pdf.add_font('Courier Prime', '', r''+MAIN_DIR+"\cdn\\fonts\courier_prime\CourierPrime-BoldItalic.ttf", uni=True)

pdf.set_font("Courier Prime", size = 13)


pdf.write_html(html)
pdf.output('testhtml.pdf', 'F')