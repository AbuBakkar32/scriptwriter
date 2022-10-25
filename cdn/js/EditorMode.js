class EditorMode {
    editorModeList;
    editorModeItem;
    switch;
    pageHeight = 1130;
    switchStatus = false;
    currentLineList = {};
    // constants
    cons;
    // attribute name
    // attrName = `sw-editor-mode`;
    // new db array
    dbArray = {};
    // later ids
    idList = [];
    // loading content status
    loadStatus = true;
    // watcher completed status
    watcherStatus = true;
    // latest line created
    latestLine;
    // key pressed
    keyPressed = '';
    /**  current number of text on editor. this value will be used to 
     * measure when a character is added or removed in editor through
     * keydown event in other to determine backspace and enter key
     */
    textLength = 0;
    // number of new line
    totalNewLine = 0;
    // last edited line
    lastFocusEdit;
    constructor(attrName) {
        this.attrName = attrName;
        this.cons = {
            list: `[${this.attrName}="list"]`, 
            item: `[${this.attrName}="item"]`, 
            line: `[${this.attrName}-type]`,
            a: 'action', at: 'action-type', t: 'transition', tt:'transition-type',
            d: 'dialog', dt: 'dialog-type', pa: 'parent-article', pat:'parent-article-type',
            c: 'character', ct: 'character-type', sh: 'scene-heading', sht: 'scene-heading-type',
            editType: `${this.attrName}-type`, editID: `${this.attrName}-id`,
            editCharacterID: `${this.attrName}-character-id`, editColor: `${this.attrName}-color`,
        };
        this.editorModeList = document.querySelector(this.cons.list);
        this.editorModeItem = document.querySelector(this.cons.item);
        this.itemTemp = this.editorModeItem.cloneNode(true);
        const lineTemp = document.querySelector(this.cons.line);
        this.lineSignal(lineTemp);
        this.lineTemp = lineTemp.cloneNode(true);
        this.lastFocusEdit = lineTemp;
        // this must be an input element
        this.switch = document.querySelector(this.cons.switch);
        // current text length
        const totalText = this.editorModeList.innerText;
        this.textLength = totalText.replace(/\n/g, '').length;
        // Listeners of the editor list
        this.listener();
    }

    listener() {
        // page number dom
        this.anyWhereWrap = document.querySelector(`[sw-element-anywhere="wrap"]`);
        const pageNumber = document.querySelector(`[sw-page-number="item"]`);
        this.pageNumberClone = pageNumber.cloneNode(true);
        pageNumber?.remove();
        // icons dom
        const leftIcon = document.querySelector(`[sw-icon="left"]`);
        const rightIcon = document.querySelector(`[sw-icon="right"]`);
        this.leftIconClone = leftIcon?.cloneNode(true);
        this.rightIconClone = rightIcon?.cloneNode(true);
        leftIcon?.remove();
        rightIcon?.remove();

        this.editorModeList.addEventListener('input', async(e)=> {
            e.stopImmediatePropagation();
            e.stopPropagation();
            const currentTextLength = this.editorModeList.innerText.replace(/\n/g, '').length;
            if (currentTextLength >= this.textLength) this.keyPressed = 'Enter';
            //else if (currentTextLength +2 < this.textLength) this.keyPressed = 'Enter';
            else if (currentTextLength < this.textLength) this.keyPressed = 'Backspace';
            //else if (currentTextLength > this.textLength) this.keyPressed = ''

            if (this.keyPressed === 'Enter'){
                this.watcherStatus = true;
                this.watcher();
            }else if (this.keyPressed === 'Backspace'){
                this.watcherStatus = true;
                this.keyPressed = '';
                this.rearrangePageBack();
                this.removeBlankPage();
                // update the element focus edit
                this.updateLastFocusEdit();
                // save content
                window.ScriptAdapter.autoSave();
                // arrange page number
                this.calculatePageNumbers();
            } else {
                this.watcherStatus = false;
                this.watcher();
            }
            this.textLength = this.editorModeList.innerText.replace(/\n/g, '').length;
        });

        // calculate page number
        this.calculatePageNumbers();
    }

    lineSignal(line = this.lineTemp) {
        line.addEventListener('click', (e)=>{
            //e.stopPropagation();
            //e.stopImmediatePropagation();
            this.lastFocusEdit = line;
            this.formatContentLine(line);
            //console.log('click',line)
        });
    
        /* line.addEventListener('focus', (e)=>{
            e.stopImmediatePropagation();
            e.stopPropagation();
            console.log('focus',line.getAttribute(this.cons.editID))
        });
        line.addEventListener('blur', (e)=>{
            e.stopImmediatePropagation();
            e.stopPropagation();
            console.log('==>\nblur',line.getAttribute(this.cons.editID))
        }); */
    }

    calculatePageNumbers() {
        // list of pages
        const pageList = [...this.editorModeList.children];
        // list of existing page numbers
        const prevPageNumbers = document.querySelectorAll(`[sw-page-number="item"]`);
        // remove all existing page numbers from dom
        prevPageNumbers.forEach(e => e.remove());
        // add new page numbers
        let count = 1;
        pageList.forEach((page) => {
            let pageTop = page.offsetTop + 55;
            const newPageNumber = this.pageNumberClone.cloneNode(true);
            // set top
            newPageNumber.style.top = String(pageTop)+'px';
            newPageNumber.textContent = String(count)+'.';
            this.anyWhereWrap.append(newPageNumber);
            // increase count
            count += 1;
        });
    }

    generateID() {
        let id = '0';
        const lineList = document.querySelectorAll(this.cons.line);
        const lastLine = lineList[(lineList.length - 1)];
        if (lastLine) {
            const xid = lastLine.getAttribute(this.cons.editID);
            if (xid) id += String(Number(xid.substr(1)) + 1);
            else id += '0';
        } else id += '0';
        
        const lineIDList = [];
        document.querySelectorAll(this.cons.line).forEach((i) => { lineIDList.push(i.getAttribute(this.cons.editID)); });
        let count = 0;
        while (true) {
            count += 1;
            if (lineIDList.includes(id)) {
                id = '0';
                if (lastLine) {
                    const xid = lastLine.getAttribute(this.cons.editID);
                    if (xid) id += String(Number(xid.substr(1)) + count);
                    else id += String(count);
                } else id += String(count);
            } else break;
        }
        return id;
    }

    watcher() {
        // if writing script, remove the note
        document.querySelectorAll('.sw_editor_class').forEach((el) => {
            el.remove();
        });
        document.querySelectorAll('.sw_editor_class2').forEach((el) => {
            el.remove();
        });


        // make sure lines are well arranged
        const rangeLinesWaiter = new Promise((resolve, reject)=>{ resolve(1) });
        rangeLinesWaiter.then(async ()=>{
            await this.rangeLines();
        }).then(() => {
            if (this.keyPressed !== 'Enter') return;
            this.rearrangePage(this.cons.item);
        }).then(() => {
            //if (this.keyPressed !== 'Enter') return;
            if (!this.watcherStatus) return;
            setTimeout(()=>{
                // trap to catch newly created line
                for (let i = 0; i < this.idList.length; i++) {
                    const x = this.idList[i]; // might be the duplicated id
                    //const lenth = this.idList.filter( d => d === x ).length;
                    //console.log(`[${this.cons.editID}="${x}"]`)
                    const duplicates = document.querySelectorAll(`[${this.cons.editID}="${x}"]`);
                    if (duplicates.length > 1) {
                        console.log(duplicates);
                        const newID = this.generateID(); // Check if its a another new line created
                        const target = duplicates[0]; // previous line
                        const newCreatedElement = duplicates[1]; // the newly created element
                        this.formatContentLine(target); // format previous line
                        // set color
                        const color = window.BackgroundColor.randomBg();
                        newCreatedElement.setAttribute(this.cons.editColor, color);

                        newCreatedElement.textContent = "";
        
                        // formate new line
                        this.formatContentLine(newCreatedElement);
                        // this.handleContentLineNuetral(newCreatedElement);
                        newCreatedElement.setAttribute(this.cons.editID, newID);
                        //newCreatedElement.focus();
                        this.lineSignal(newCreatedElement);
                        // remove the duplicated id
                        this.idList.pop(x)
                        // Add the new created id
                        this.idList.push(newID);

                        /* setTimeout(() => {
                            const mainEditor = newCreatedElement.parentElement.parentElement;
                            mainEditor.setAttribute('contenteditable', 'false');
                            // click on the script body
                            newCreatedElement.click();
                            newCreatedElement.focus();
                            mainEditor.setAttribute('contenteditable', 'true');
                        }, 50); */

                        break;
                    }
                }
            });
        }).then(() => {
            const line = document.querySelector(this.cons.line);
            // if lines is empty
            if (line) return;
            const newPage = this.itemTemp.cloneNode(true);
            [...newPage.children].forEach((e) => {e.remove()});
            const newLine = this.lineTemp.cloneNode(true);
            newLine.textContent = '';
            newPage.append(newLine);
            this.editorModeList.append(newPage);
        }).then(async ()=>{
            this.watcherStatus = true;
            //console.log('watcher completed', new Date().getMilliseconds());
            await this.calculatePageNumbers();
            window.ScriptAdapter.autoSave();
            //if (this.keyPressed != '') window.MapAndReactOnContent.mapreact();
            this.keyPressed = '';

            // update the element focus edit
            this.updateLastFocusEdit()
        })
        return rangeLinesWaiter;
    }

    rangeLines() {
        this.idList = [];
        const pageList = [...this.editorModeList.children];
        // last id
        let lastID = 0;
        // rearrange page status
        let rearrange = false;
        const rangePromise = new Promise((resolve, reject) => {resolve(1)})
        rangePromise.then(()=> {
            pageList.forEach((page) => {
                const contentLines = [...page.children];
                contentLines.forEach((conl) => {
                    const getTheId = conl.getAttribute(this.cons.editID);
                    if (!this.idList.includes(getTheId)) this.idList.push(getTheId);
    
                    let textList = conl.innerText.split('\n');

                    const lastLine = textList.pop();
                    if (lastLine) textList.push(lastLine);
                    if (textList.length <= 1) return;
    
                    if (textList.length > 1) {
                        rearrange = true;
                        for (let index = 0; index < textList.length; index++) {
                            const text = textList[index];    
                            const div = this.lineTemp.cloneNode(true);
                            div.textContent = '';
                            // generate new id and assign it
                            //const newID = this.generateID();
                            let newID = '';
                            if (!lastID) {newID = this.generateID(); lastID = Number(newID.substring(1));}
                            else {newID = '0'+(lastID+1); lastID = lastID + 1;}
                        
                            div.setAttribute(this.cons.editID, newID);

                            this.lineSignal(div);

                            div.innerText = text;

                            if (index === 0) {
                                conl.insertAdjacentElement('afterend', div);
                                conl.remove();
                            } else this.latestLine.insertAdjacentElement('afterend', div);
                            // set latest accessed line
                            this.latestLine = div;
                            // format new line
                            this.formatContentLine(div);
                            // set color
                            const color = window.BackgroundColor.randomBg();
                            div.setAttribute(this.cons.editColor, color);
                        }
                    }
                });
            });
        }).then(async()=> {
            if (!rearrange) return;
            // re arrange pages
            await this.rearrangePage();
            //await window.MapAndReactOnContent.mapreact();
        })
        return rangePromise;
    }

    updateLastFocusEdit(){
        if (this.lastFocusEdit && this.lastFocusEdit.innerHTML) {
            const getReactPosID = this.lastFocusEdit.getAttribute('react-pos');
            if (!getReactPosID) return;
            const allReacters = document.querySelectorAll(`[react-pos="${getReactPosID}"]`);
            //console.log(allReacters.length);
            allReacters.forEach((rect) => {
                if (rect != this.lastFocusEdit) {
                    rect.innerHTML = this.lastFocusEdit.innerHTML;
                }
            });
            // if the element is a character update its name
            if (this.lastFocusEdit.getAttribute(this.cons.editType) != 'character') return;
            const getCharacterID = this.lastFocusEdit.getAttribute(this.cons.editCharacterID)
            if (getCharacterID) window.CharacterHandle.update(getCharacterID);
        }
        if (this.lastFocusEdit) this.formatContentLine(this.lastFocusEdit);
    }

    formatContentLine(newLine) {
        const line = this.handleContentLineNuetral(newLine);
        if (this.handleSceneHeadingType(line));
        else if (this.handleCharater(line));
        else if (this.handleParentArticle(line));
        else if (this.handleDialog(line));
        else if (this.handleTransition(line));
    }

    handleSceneHeadingType (line, direct=false) {
        // for direct formatting of content line
        if (direct) {
            line.classList.replace(this.cons.at, this.cons.sht);
            line.setAttribute(this.cons.editType, this.cons.sh);
            return;
        }
        // INT. or EXT.
        // Checker if action on script content line execute successfully
        let verify = false;
        if (line.innerText.toLowerCase().startsWith('int.') || line.innerText.toLowerCase().startsWith('ext.')) {
            line.classList.replace(this.cons.at, this.cons.sht);
            // Add content Line signature
            line.setAttribute(this.cons.editType, this.cons.sh);
            // confirm checker
            verify = true;
        }
        return verify;
    }
    
    handleDialog (line, direct=false) {
        // for direct formatting of content line
        if (direct) {
            line.classList.replace(this.cons.at, this.cons.dt);
            line.setAttribute(this.cons.editType, this.cons.d);
            return;
        }
        // Checker if action on script content line execute successfully
        let verify = false;
        // targeting charater or parent article element
        const upperLine = line.previousElementSibling;
        // previous page last child
        const upperPageLastLine = line.parentElement?.previousElementSibling?.lastElementChild; 
        if (upperLine || upperPageLastLine) {
            const contentLineAbove = upperLine || upperPageLastLine;
            const metaType = contentLineAbove.getAttribute(this.cons.editType);

            if (metaType === 'character' || metaType === 'parent-article') {
                line.classList.replace(this.cons.at, this.cons.dt);
                // Add content Line signature
                line.setAttribute(this.cons.editType, this.cons.d);
                // confirm checker
                verify = true;
            }
        }
        return verify
    }
    
    handleCharater (line, direct=false) {
        // for direct formatting of content line
        if (direct) {
            line.classList.replace(this.cons.at, this.cons.ct);
            line.setAttribute(this.cons.editType, this.cons.c);
            return;
        }
        // Checker if action on script content line execute successfully
        let verify = false;
        const num = '0123456789';
        const lineText = line.innerText;
        const transitionNames = ['fade in:', 'cut to:', 'back to:', 'fade out:'];
        if (lineText && lineText.split('').length >= 3 && lineText.toUpperCase() === lineText && 
            !num.includes(lineText[0]) && !transitionNames.includes(lineText.toLowerCase())) {
            line.classList.replace(this.cons.at, this.cons.ct);
            // Add content Line signature
            line.setAttribute(this.cons.editType, this.cons.c);
            // validate line to character line
            window.CharacterHandle.lineValidator(line);
            // confirm checker
            verify = true;
        }
        return verify
    }

    handleTransition (line, direct=false) {
        // for direct formatting of content line
        if (direct) {
            line.classList.replace(this.cons.at, this.cons.tt);
            line.setAttribute(this.cons.editType, this.cons.t);
            return;
        }
        // Checker if action on script content line execute successfully
        let verify = false;
        const transitionNames = ['fade in:', 'cut to:', 'back to:', 'fade out:'];
        const sbText = line.innerText.toLowerCase();
        if (transitionNames.includes(sbText)) {
            line.classList.replace(this.cons.at, this.cons.tt);
            // Add content Line signature
            line.setAttribute(this.cons.editType, this.cons.t);
            // confirm checker
            verify = true;
        }
        return verify
    }
    
    handleParentArticle (line, direct=false) {
        // for direct formatting of content line
        if (direct) {
            line.classList.replace(this.cons.at, this.cons.pat);
            line.setAttribute(this.cons.editType, this.cons.pa);
            return;
        }
        // Checker if action on script content line execute successfully
        let verify = false;
        const sbText = line.innerText;
        if (sbText.startsWith('(') && sbText.endsWith(')')) {
            line.classList.replace(this.cons.at, this.cons.pat);
            // Add content Line signature
            line.setAttribute(this.cons.editType, this.cons.pa);
            // confirm checker
            verify = true;
        }
        return verify;
    }
    
    handleContentLineNuetral (line) {
        // Adjust script body
        line.classList.remove(this.cons.sht);
        line.classList.remove(this.cons.ct);
        line.classList.remove(this.cons.pat);
        line.classList.remove(this.cons.dt);
        line.classList.remove(this.cons.tt);
        line.classList.add(this.cons.at);
        line.setAttribute(this.cons.editType, '');
        line.setAttribute(this.cons.editType, this.cons.a);
        return line;
    }

    rearrangePage(pageAttr=this.cons.item) {
        const allPage = document.querySelectorAll(pageAttr);
        // get total number of pages
        const tnp = allPage.length;
        //
        for (let index = 0; index < tnp; index++) {
            const page = allPage[index]; // The Page
            //Get the page scroll height
            const currentScrollHeight = page.scrollHeight;
            // Condition for new page
            if (currentScrollHeight > this.pageHeight) {
                // Check if the page has a sibling. If no sibling then create a new page, else append last content-line to the sibling
                const nextPage = page.nextElementSibling;
                //the last content-line in the page
                const lastContentLine = page.lastElementChild;
                if (nextPage) {
                    // will be append as the first content-line in this nextpage
                    if (lastContentLine) nextPage.insertAdjacentElement('afterbegin', lastContentLine);

                    if (page.scrollHeight > this.pageHeight) {
                        while (true) {
                            if (page.scrollHeight > this.pageHeight) {
                                nextPage.insertAdjacentElement('afterbegin', page.lastElementChild);
                            } else break;
                        }
                    }
                } else {
                    let newPage = this.itemTemp.cloneNode(true);//Remove all previous children from the new page
                    [...newPage.children].forEach((cl) => {cl.remove()});
                    // Append new page to Page List
                    this.editorModeList.append(newPage);
                        
                    while (true) {
                        if (page.scrollHeight > this.pageHeight) {
                            if (newPage.scrollHeight <= this.pageHeight) {
                                // Append the last content-line to the new page
                                newPage.insertAdjacentElement('afterbegin', page.lastElementChild)
                            } else {
                                page.append(newPage.firstElementChild);
                                const latestPage = this.itemTemp.cloneNode(true);
                                //Remove all previous children from the new page
                                [...latestPage.children].forEach((cl) => {cl.remove()});
                                // Append new page to Page List
                                newPage.insertAdjacentElement('beforebegin', latestPage);
                                latestPage.insertAdjacentElement('afterbegin', page.lastElementChild)
                                newPage = latestPage;
                            }
                        } else break;
                    }
                }
            }
        }

        this.rearrangePageBack();
        this.removeBlankPage();
    }
    
    rearrangePageBack(pageAttr=this.cons.item) {
        const allPage = document.querySelectorAll(pageAttr); // [sw-editor="item"]
        // get total number of pages
        const tnp = allPage.length;

        for (let index = 0; index < tnp; index++) {
            const page = allPage[index]; // The Page

            // Condition for new page
            //Get the page scroll height
            const currentScrollHeight = page.scrollHeight;
            
            if (currentScrollHeight > this.pageHeight /* || page.childElementCount < 45 */) {
                // Check if the page has a sibling. If no sibling then end func., else append first content-line of the sibling to the page
                const nextPage = page.nextElementSibling;
                if (nextPage) {
                    const firstContentLine = nextPage.firstElementChild; //the first content-line in the nextpage
                    // will be append as the first content-line in this nextpage
                    if (firstContentLine) page.insertAdjacentElement('beforeend', firstContentLine);
                    while (true) {
                        if (currentScrollHeight > this.pageHeight /* || page.childElementCount < 45 */) {
                            const firstOfNextPage = nextPage.firstElementChild;
                            if (firstOfNextPage) page.insertAdjacentElement('beforeend', firstOfNextPage);
                            else break;
                        } else break;
                    }
                }
            }
        }
    }

    removeBlankPage(pageAttr=this.cons.item) {
        const allPage = document.querySelectorAll(pageAttr);
        allPage.forEach((page) => {
            if (![...page.children].length) page.remove();
        });
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.EditorMode = new EditorMode('sw-editor');
})
