class EditorWriter {
    editorList;
    editorItem;
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
    constructor(attrName) {
        this.attrName = attrName;
        this.cons = {
            list: `[${this.attrName}="list"]`, 
            item: `[${this.attrName}="item"]`, 
            line: `[${this.attrName}-id]`,
            editID: `${this.attrName}-id`
        };
        this.editorList = document.querySelector(this.cons.list);
        this.editorItem = document.querySelector(this.cons.item);
        this.itemTemp = this.editorItem.cloneNode(true);
        const lineTemp = document.querySelector(this.cons.line);
        this.lineTemp = lineTemp.cloneNode(true);
        // current text length
        const totalText = this.editorList.innerText;
        this.textLength = totalText.replace(/\n/g, '').length;
        // Listeners of the editor list
        this.listener();
    }

    listener() {
        //listen for key pressed and react
        /* this.editorList.addEventListener('keydown', (e)=> {
            e.stopImmediatePropagation();
            e.stopPropagation();
            if (e.key === 'Enter' || e.keyCode == 13) {
                this.keyPressed = 'Enter';
                //setTimeout(() => {this.watcher()});
            } else if (e.key === 'Backspace' || e.keyCode == 8) {
                this.keyPressed = 'Backspace';
            } else {
                if (!e.key) return;
                const currentTextLength = this.editorList.innerText.replace(/\n/g, '').length;
                if (currentTextLength == this.textLength) this.keyPressed = 'Enter';
                else if (currentTextLength < this.textLength) this.keyPressed = 'Backspace';
            }
        }); */

        this.editorList.addEventListener('input', (e)=> {
            e.stopImmediatePropagation();
            e.stopPropagation();
            
            const currentTextLength = this.editorList.innerText.replace(/\n/g, '').length;
            if (currentTextLength >= this.textLength) this.keyPressed = 'Enter';
            //else if (currentTextLength +10 < this.textLength) this.keyPressed = 'Enter';
            else if (currentTextLength < this.textLength) this.keyPressed = 'Backspace';
            //else if (currentTextLength > this.textLength) this.keyPressed = '';
            
            if (this.keyPressed === 'Enter'){
                this.watcherStatus = true;
                this.watcher();
            }else if (this.keyPressed === 'Backspace'){
                this.watcherStatus = true;
                /* console.log(!this.editorList.innerText.replace(/\n/g, ''));
                if (!this.editorList.innerText.replace(/\n/g, '')) {
                    const newPage = this.itemTemp.cloneNode(true);
                    this.editorList.append(newPage);
                    console.log('created new page');
                    return;
                }; */
                this.keyPressed = '';
                this.rearrangePageBack();
                this.removeBlankPage();
                window.ScriptAdapter.autoSave();
            } else {
                if(!this.watcherStatus) return;
                this.watcherStatus = false;
                this.watcher();
            }
            this.textLength = this.editorList.innerText.replace(/\n/g, '').length;
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
        lineList.forEach((i) => { lineIDList.push(i.getAttribute(this.cons.editID)); });
        let count = 0;
        while (true) {
            count += 1;
            if (lineIDList.includes(id)) {
                id = '0';
                if (lastLine) {
                    const xid = lastLine.getAttribute(this.cons.editID);
                    if (xid) id += String(Number(xid.substring(1)) + count);
                    else id += String(count);
                } else id += String(count);
            } else break;
        }
        return id;
    }

    watcher() {
        // make sure lines are well arranged
        const rangeLinesWaiter = new Promise((resolve, reject)=>{ resolve(1) });
        rangeLinesWaiter.then(async ()=>{
            await this.rangeLines();
        }).then(async() => {
            if (this.keyPressed !== 'Enter') return;
            this.rearrangePage();
        }).then(() => {
            //if (this.keyPressed !== 'Enter') return;
            if (!this.watcherStatus) return;
            setTimeout(()=>{
                // trap to catch newly created line
                for (let i = 0; i < this.idList.length; i++) {
                    const x = this.idList[i]; // might be the duplicated id
                    //const length = this.idList.filter( d => d === x ).length;
                    const duplicates = document.querySelectorAll(`[${this.cons.editID}="${x}"]`);
                    if (duplicates.length > 1) {
                        const newID = this.generateID(); // Check if its a another new line created
                        const target = duplicates[0]; // previous line
                        const newCreatedElement = duplicates[1]; // the newly created element
                        newCreatedElement.setAttribute(this.cons.editID, newID);
                        newCreatedElement.textContent = '';
                        // remove the duplicated id
                        this.idList.pop(x)
                        // Add the new created id
                        this.idList.push(newID);
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
            newPage.append(newLine);
            newLine.textContent = '';
            this.editorList.append(newPage);
        }).then(()=>{
            this.watcherStatus = true;
            window.ScriptAdapter.autoSave();
            this.keyPressed = '';
        });
        return rangeLinesWaiter;
    }

    rangeLines() {
        this.idList = [];
        const pageList = [...this.editorList.children];
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
                            // generate new id and assign it
                            let newID = '';
                            if (!lastID) {newID = this.generateID(); lastID = Number(newID.substring(1));}
                            else {newID = '0'+(lastID+1); lastID = lastID + 1;}
                        
                            div.setAttribute(this.cons.editID, newID);

                            div.innerText = text;

                            if (index === 0) {
                                conl.insertAdjacentElement('afterend', div);
                                conl.remove(); 
                            } else this.latestLine.insertAdjacentElement('afterend', div);
                            // set latest accessed line
                            this.latestLine = div;
                        }
                    }
                });
            });
        }).then(async()=> {
            if (!rearrange) return;
            // re arrange pages
            await this.rearrangePage();
            await this.rearrangePageBack();
            await this.removeBlankPage();
        })
        return rangePromise;
    }

    rearrangePage(pageAttr=this.cons.item) {
        const allPage = document.querySelectorAll(pageAttr);
        // get total number of pages
        const tnp = allPage.length;
        //
        //console.log('lopp')
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
                    this.editorList.append(newPage);
                        
                    while (true) {
                        if (page.scrollHeight > this.pageHeight) {
                            if (newPage.scrollHeight <= this.pageHeight) {
                                // Append the last content-line to the new page
                                newPage.insertAdjacentElement('afterbegin', page.lastElementChild)
                            } else {
                                page.append(newPage.firstElementChild);
                                const latestPage = this.itemTemp.cloneNode(true);//Remove all previous children from the new page
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
        //console.log('rearrangePageBack');
        const tnp = allPage.length;
        for (let index = 0; index < tnp; index++) {
            const page = allPage[index]; // The Page
            // Condition for new page
            if (page.childElementCount < 45) {
                // Check if the page has a sibling. If no sibling then end func., else append first content-line of the sibling to the page
                const nextPage = page.nextElementSibling;
                if (nextPage) {
                    const firstContentLine = nextPage.firstElementChild; //the first content-line in the nextpage
                    // will be append as the first content-line in this nextpage
                    if (firstContentLine) page.insertAdjacentElement('beforeend', firstContentLine);
                    while (true) {
                        if (page.childElementCount < 45) {
                            const firstOfNextPage = nextPage.firstElementChild;
                            if (firstOfNextPage) {
                                page.insertAdjacentElement('beforeend', firstOfNextPage);
                            } else break;
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
