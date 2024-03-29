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
    waterMarkTemp;
    waterMarkText;
    inputFieldNumber;
    hasChange;

    constructor(attrName) {
        this.attrName = attrName;
        this.cons = {
            list: `[${this.attrName}="list"]`,
            item: `[${this.attrName}="item"]`,
            line: `[${this.attrName}-type]`,
            a: 'action',
            at: 'action-type',
            t: 'transition',
            tt: 'transition-type',
            d: 'dialog',
            dt: 'dialog-type',
            pa: 'parent-article',
            pat: 'parent-article-type',
            c: 'character',
            ct: 'character-type',
            sh: 'scene-heading',
            sht: 'scene-heading-type',
            editType: `${this.attrName}-type`,
            editID: `${this.attrName}-id`,
            editCharacterID: `${this.attrName}-character-id`,
            editColor: `${this.attrName}-color`,
            ac: 'act',
            act: 'act-type',
            he: 'heading',
            het: 'heading-type',
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
        const loadSettings = window.ClientSetting.loadSetting();
        this.anyWhereWrap = document.querySelector(`[sw-element-anywhere="wrap"]`);
        const pageNumber = document.querySelector(`[sw-page-number="item"]`);
        this.pageNumberClone = pageNumber.cloneNode(true);
        const waterMark = document.querySelector(".water-marks");
        this.waterMarkTemp = waterMark.cloneNode(true);
        pageNumber?.remove();
        // icons dom
        const leftIcon = document.querySelector(`[sw-icon="left"]`);
        const rightIcon = document.querySelector(`[sw-icon="right"]`);
        this.leftIconClone = leftIcon?.cloneNode(true);
        this.rightIconClone = rightIcon?.cloneNode(true);
        leftIcon?.remove();
        rightIcon?.remove();
        //store WaterMark text
        const getWaterMarkText = window.localStorage.getItem('data');
        this.waterMarkText = JSON.parse(getWaterMarkText);

        // save right sidebar outline content
        try {
            document.querySelector(`[mapreact-data="rs-outline-list"]`).addEventListener('input', async (e) => {
                window.ScriptAdapter.autoSave();
            });
        } catch (e) {
        }
        this.editorModeList.addEventListener('input', async (e) => {
            // if adding note, do not add text to the page
            const target = e.target;
            const targetClass = target.className;
            if (targetClass.includes('noteInput')) {
                return;
            }
            // this.updateCardList();
            e.stopImmediatePropagation();
            e.stopPropagation();
            const currentTextLength = this.editorModeList.innerText.replace(/\n/g, '').length;
            if (currentTextLength >= this.textLength) this.keyPressed = 'Enter';
            //else if (currentTextLength +2 < this.textLength) this.keyPressed = 'Enter';
            else if (currentTextLength < this.textLength) this.keyPressed = 'Backspace';
            //else if (currentTextLength > this.textLength) this.keyPressed = ''
            if (this.keyPressed === 'Enter') {
                loadSettings.then((res) => {
                    if (res.onePageWriting === 'true') {
                        this.watcherStatus = true;
                        this.watcherOnePage();
                        setTimeout(() => {
                            window.MapAndReactOnContent.mapreact();
                        });
                        ChangeAndSaveData(`[mapreact-data="outline-item"]`);
                    } else {
                        this.watcherStatus = true;
                        this.watcher();
                        setTimeout(() => {
                            window.MapAndReactOnContent.mapreact();
                        });
                        ChangeAndSaveData(`[mapreact-data="outline-item"]`);
                    }
                });


            } else if (this.keyPressed === 'Backspace') {
                this.watcherStatus = true;
                this.keyPressed = '';
                this.rearrangePageBack();
                this.removeBlankPage();
                // update the element focus edit
                this.updateLastFocusEdit();
                setTimeout(() => {
                    window.MapAndReactOnContent.mapreact();
                });
                // save content
                window.ScriptAdapter.autoSave();
                // arrange page number
                this.calculatePageNumbers();
                ChangeAndSaveData(`[mapreact-data="outline-item"]`);
            } else {
                this.watcherStatus = false;
                this.watcher();
                ChangeAndSaveData(`[mapreact-data="outline-item"]`);
            }
            this.textLength = this.editorModeList.innerText.replace(/\n/g, '').length;
            ChangeAndSaveData(`[mapreact-data="outline-item"]`);
        });

        // calculate page number
        this.calculatePageNumbers();
    }

    lineSignal(line = this.lineTemp) {
        line.addEventListener('click', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.lastFocusEdit = line;
            this.formatContentLine(line);
        });

        line.addEventListener('focus', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
        line.addEventListener('blur', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
        });
    }

    calculatePageNumbers() {
        // list of pages
        const pageList = [...this.editorModeList.children];
        // list of existing page numbers
        const prevPageNumbers = document.querySelectorAll(`[sw-page-number="item"]`);
        const prevWaterMarks = document.querySelectorAll(".water-marks");
        // remove all existing waterMark from dom
        prevWaterMarks.forEach(e => e.remove());
        // remove all existing page numbers from dom
        prevPageNumbers.forEach(e => e.remove());
        // add new page numbers
        let count = 1;
        pageList.forEach((page) => {
            let pageTop = page.offsetTop + 55;
            const newPageNumber = this.pageNumberClone.cloneNode(true);
            const newWaterMark = this.waterMarkTemp.cloneNode(true);
            // set top
            newWaterMark.style.top = String(pageTop) + 'px';
            // newWaterMark.style.opacity = this.waterMarkText.waterMarkDisplayOpacity;
            // newWaterMark.textContent = this.waterMarkText.waterMarkDisplayText;
            // set top
            newPageNumber.style.top = String(pageTop) + 'px';
            newPageNumber.textContent = String(count) + '.';
            this.anyWhereWrap.append(newPageNumber);
            // this.anyWhereWrap.append(newWaterMark);
            // increase count
            count += 1;
        });
    }

    generateID() {
        const lineList = document.querySelectorAll(this.cons.line);
        const lineIDList = [];

        // Add the line IDs to lineIDList
        lineList.forEach((i) => {
            lineIDList.push(i.getAttribute(this.cons.editID));
        });

        // Get the last line
        const lastLine = lineList[(lineList.length - 1)];

        // Get the next id to be used
        let nextId = lastLine ?
            (Number(lastLine.getAttribute(this.cons.editID).substring(1)) + 1) :
            0;

        // Check if the id is already in use, if so increment it
        while (lineIDList.includes(`0${nextId}`)) {
            nextId++;
        }

        return `0${nextId}`;
    }


    watcherOnePage() {
        // if writing script, remove the note
        document.querySelectorAll('.sw_editor_class').forEach((el) => {
            if (el.querySelector('.relative')) {
                el.querySelector('.relative').remove();
            }
        });
        document.querySelectorAll('.sw_editor_class2').forEach((el) => {
            if (el.querySelector('.relative')) {
                el.querySelector('.relative').remove();
                el.classList.remove('sw_editor_class2');
                el.classList.add('sw_editor_class');
            }
        });

        // make sure lines are well arranged
        const rangeLinesWaiter = new Promise((resolve, reject) => {
            resolve(1)
        });
        rangeLinesWaiter.then(async () => {
            await this.rangeLines();
        }).then(() => {
            if (this.keyPressed !== 'Enter') return;
            //this.rearrangePage(this.cons.item);
        }).then(() => {
            //if (this.keyPressed !== 'Enter') return;
            if (!this.watcherStatus) return;
            setTimeout(() => {
                // trap to catch newly created line
                for (const element of this.idList) {
                    const x = element; // might be the duplicated id
                    const duplicates = document.querySelectorAll(`[${this.cons.editID}="${x}"]`);
                    if (duplicates.length > 1) {
                        const newID = this.generateID(); // Check if its a another new line created
                        const target = duplicates[0]; // previous line
                        const newCreatedElement = duplicates[1]; // the newly created element
                        this.formatContentLine(target); // format previous line
                        // set color
                        const color = window.BackgroundColor.randomBg();
                        newCreatedElement.setAttribute(this.cons.editColor, color);

                        newCreatedElement.textContent = "";

                        setTimeout(() => {
                            // get the last child of the element which attribute is sw-editor="item"
                            const lastChild = document.querySelector(`[sw-editor="item"]`).lastElementChild;
                            let sw_editor_id = lastChild.getAttribute('sw-editor-id');
                            if (!sw_editor_id) {
                                let myId = lastChild.getAttribute('id');// sw-editor-id-0256
                                myId = myId.split('-')[3];
                                // add one to the id
                                myId = String(Number(myId) + 1);
                                // add leading zero
                                sw_editor_id = '0' + myId;

                            }

                            const commentIcon = '<img onclick="showNoteContainer(this)" style="width: 25px; cursor: pointer; transform: scaleX(-1);" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABMklEQVRoge3ZQUrDQBiG4afiuisXYjfiATyF7lt3Ip7DGxXcufcYXqCCiuAqF2hd2JASEk0icfrjvBDCJAN5v8wM/MwQnEmtPcMFjhO4dOEdj3hrenmFAps9vwos6vInQeR3Q8zgYBvgEtOmYdlTpphTBThN5zKYI6oA9cUcgQlVgLDkAKk57NF3jSVeR3IpmeFGx3XZJ8ASt0OMBjDxFeJH/tUUKof1aSSXknNcd+3cJ0DnYf1Lwk+hHCA1OUBqcoDU5FpoJHIt1ESuhcYg/BTKAVJTBtgktRjGhirAKqHIUD52G2E3d3dZBAlR2G7s0nzAMd/e2xb4XcvzJla479H/O9Z4wYOWA46udP1Tzzj7zYfGIrQ8weUJLk9weYLLE1ye4PIElye4PMHliXkovr98AnUlCYg7xE0PAAAAAElFTkSuQmCC">'
                            const note = `<div style="position: absolute; left: -29%; bottom: -33%; box-shadow: 2px 2px 5px;">
                                <div class="com-color" style="background-color:yellow; padding: 12px; max-width: 250px; position: relative;  max-height: 150px; overflow-y: scroll; z-index: 100;">
                                    <div onclick="hideNoteContainer(this)" style="position: absolute; top: 0; right: 10px; font-size: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; cursor: pointer; font-weight: bolder;">x</div>
                                    <div class="noteContainer"></div>

                                    <div style="color: black;">
                                        <input id="noteTitle" class="noteInput" type="text" placeholder="Title here..." style="padding: 8px; border: none; outline: none; background-color: inherit; font-weight: bold; font-size: 13px; color: black;"/>
                                        <textarea id="noteDescription" class="noteInput" rows="2" placeholder="Note here..." style="padding: 8px; border: none; outline: none; margin-bottom: 8px; background-color: inherit; font-weight: bold; width: 90%; color: black; font-size: 12px"></textarea>
                                        <button onclick="addComment(this)" style="background-color: rgb(0, 0, 226); color: white; border: none; padding: 0 8px; font-size: 12px;">Add Note</button>
                                    </div>

                                    <div style="position: sticky; bottom: 0; right: 0; width: 30px; height: 100px; padding: 10px; float: right;">
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: yellow; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: red; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: green; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: blue; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: orange; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                    </div>
                                </div>
                                </div>`

                            const abs = `<div onmouseout="hideElement('sw-editor-id-${sw_editor_id}')" id="sw-editor-id-${sw_editor_id}" class="absolute sw_editor_class" style="left: -36px; margin-top: -24px; width: 100%; z-index:0; " contenteditable="false">${commentIcon}<div class="relative hidden" style="margin-top: -30px;">${note}</div></div>`;
                            lastChild.addEventListener('mouseover', function () {
                                // add to next sibling
                                lastChild.insertAdjacentHTML('afterend', abs);
                            });

                            lastChild.addEventListener('mouseout', function () {
                                // remove from next sibling
                                const abs = document.getElementById(`sw-editor-id-${sw_editor_id}`);
                                const is_show = abs.classList.contains('show');
                                if (event.relatedTarget.id != `sw-editor-id-${sw_editor_id}` && !is_show) {
                                    abs.remove();
                                }
                            });
                        }, 1000);

                        // formate new line
                        this.formatContentLine(newCreatedElement);
                        this.handleContentLineNuetral(newCreatedElement);
                        newCreatedElement.setAttribute(this.cons.editID, newID);
                        newCreatedElement.focus();
                        this.lineSignal(newCreatedElement);
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
            [...newPage.children].forEach((e) => {
                e.remove()
            });
            const newLine = this.lineTemp.cloneNode(true);
            newLine.textContent = '';
            newPage.append(newLine);
            this.editorModeList.append(newPage);
        }).then(async () => {
            this.watcherStatus = true;
            await this.calculatePageNumbers();
            window.ScriptAdapter.autoSave();
            this.keyPressed = '';
            // update the element focus edit
            this.updateLastFocusEdit()
        })
        return rangeLinesWaiter;
    }

    watcher() {
        // if writing script, remove the note
        document.querySelectorAll('.sw_editor_class').forEach((el) => {
            if (el.querySelector('.relative')) {
                el.querySelector('.relative').remove();
            }
        });
        document.querySelectorAll('.sw_editor_class2').forEach((el) => {
            if (el.querySelector('.relative')) {
                el.querySelector('.relative').remove();
                el.classList.remove('sw_editor_class2');
                el.classList.add('sw_editor_class');
            }
        });


        // make sure lines are well arranged
        const rangeLinesWaiter = new Promise((resolve, reject) => {
            resolve(1)
        });
        rangeLinesWaiter.then(async () => {
            await this.rangeLines();
        }).then(() => {
            if (this.keyPressed !== 'Enter') return;
            this.rearrangePage(this.cons.item);
        }).then(() => {
            if (!this.watcherStatus) return;
            setTimeout(() => {
                // trap to catch newly created line
                for (const element of this.idList) {
                    const x = element; // might be the duplicated id
                    //const lenth = this.idList.filter( d => d === x ).length;
                    const duplicates = document.querySelectorAll(`[${this.cons.editID}="${x}"]`);
                    if (duplicates.length > 1) {
                        const newID = this.generateID(); // Check if its a another new line created
                        const target = duplicates[0]; // previous line
                        const newCreatedElement = duplicates[1]; // the newly created element
                        this.formatContentLine(target); // format previous line
                        // set color
                        const color = window.BackgroundColor.randomBg();
                        newCreatedElement.setAttribute(this.cons.editColor, color);
                        newCreatedElement.textContent = "";

                        setTimeout(() => {
                            // get the last child of the element which attribute is sw-editor="item"
                            const lastChild = document.querySelector(`[sw-editor="item"]`).lastElementChild;
                            let sw_editor_id = lastChild.getAttribute('sw-editor-id');
                            if (!sw_editor_id) {
                                let myId = lastChild.getAttribute('id');// sw-editor-id-0256
                                myId = myId.split('-')[3];
                                // add one to the id
                                myId = String(Number(myId) + 1);
                                // add leading zero
                                sw_editor_id = '0' + myId;
                            }

                            const commentIcon = '<img onclick="showNoteContainer(this)" style="width: 25px; cursor: pointer; transform: scaleX(-1);" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABMklEQVRoge3ZQUrDQBiG4afiuisXYjfiATyF7lt3Ip7DGxXcufcYXqCCiuAqF2hd2JASEk0icfrjvBDCJAN5v8wM/MwQnEmtPcMFjhO4dOEdj3hrenmFAps9vwos6vInQeR3Q8zgYBvgEtOmYdlTpphTBThN5zKYI6oA9cUcgQlVgLDkAKk57NF3jSVeR3IpmeFGx3XZJ8ASt0OMBjDxFeJH/tUUKof1aSSXknNcd+3cJ0DnYf1Lwk+hHCA1OUBqcoDU5FpoJHIt1ESuhcYg/BTKAVJTBtgktRjGhirAKqHIUD52G2E3d3dZBAlR2G7s0nzAMd/e2xb4XcvzJla479H/O9Z4wYOWA46udP1Tzzj7zYfGIrQ8weUJLk9weYLLE1ye4PIElye4PMHliXkovr98AnUlCYg7xE0PAAAAAElFTkSuQmCC">'
                            const note = `<div style="position: absolute; left: -29%; bottom: -33%; box-shadow: 2px 2px 5px;">
                                <div class="com-color" style="background-color:yellow; padding: 12px; max-width: 250px; position: relative;  max-height: 150px; overflow-y: scroll; z-index: 100;">
                                    <div onclick="hideNoteContainer(this)" style="position: absolute; top: 0; right: 10px; font-size: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; cursor: pointer; font-weight: bolder;">x</div>
                                    <div class="noteContainer"></div>

                                    <div style="color: black;">
                                        <input id="noteTitle" class="noteInput" type="text" placeholder="Title here..." style="padding: 8px; border: none; outline: none; background-color: inherit; font-weight: bold; font-size: 13px; color: black;"/>
                                        <textarea id="noteDescription" class="noteInput" rows="2" placeholder="Note here..." style="padding: 8px; border: none; outline: none; margin-bottom: 8px; background-color: inherit; font-weight: bold; width: 90%; color: black; font-size: 12px"></textarea>
                                        <button onclick="addComment(this)" style="background-color: rgb(0, 0, 226); color: white; border: none; padding: 0 8px; font-size: 12px;">Add Note</button>
                                    </div>

                                    <div style="position: sticky; bottom: 0; right: 0; width: 30px; height: 100px; padding: 10px; float: right;">
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: yellow; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: red; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: green; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: blue; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                        <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: orange; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                    </div>
                                </div>
                                </div>`

                            const abs = `<div onmouseout="hideElement('sw-editor-id-${sw_editor_id}')" id="sw-editor-id-${sw_editor_id}" class="absolute sw_editor_class" style="left: -36px; margin-top: -24px; width: 100%; z-index:0; " contenteditable="false">${commentIcon}<div class="relative hidden" style="margin-top: -30px;">${note}</div></div>`;
                            lastChild.addEventListener('mouseover', function () {
                                // add to next sibling
                                lastChild.insertAdjacentHTML('afterend', abs);
                            });

                            lastChild.addEventListener('mouseout', function () {
                                // remove from next sibling
                                const abs = document.getElementById(`sw-editor-id-${sw_editor_id}`);
                                const is_show = abs.classList.contains('show');
                                if (event.relatedTarget.id !== `sw-editor-id-${sw_editor_id}` && !is_show) {
                                    abs.remove();
                                }
                            });
                        }, 100);

                        // formate new line
                        this.formatContentLine(newCreatedElement);
                        this.handleContentLineNuetral(newCreatedElement);
                        newCreatedElement.setAttribute(this.cons.editID, newID);
                        newCreatedElement.focus();
                        this.lineSignal(newCreatedElement);
                        // remove the duplicated id
                        this.idList.pop(x)
                        // Add the new created id
                        this.idList.push(newID);

                        setTimeout(() => {
                            const mainEditor = newCreatedElement.parentElement.parentElement;
                            mainEditor.setAttribute('contenteditable', 'false');
                            // click on the script body
                            newCreatedElement.click();
                            newCreatedElement.focus();
                            mainEditor.setAttribute('contenteditable', 'true');
                        }, 50);
                        break;
                    }
                }
            });
        }).then(() => {
            const line = document.querySelector(this.cons.line);
            // if lines is empty
            if (line) return;
            const newPage = this.itemTemp.cloneNode(true);
            [...newPage.children].forEach((e) => {
                e.remove()
            });
            const newLine = this.lineTemp.cloneNode(true);
            newLine.textContent = '';
            newPage.append(newLine);
            this.editorModeList.append(newPage);
        }).then(async () => {
            this.watcherStatus = true;
            await this.calculatePageNumbers();
            window.ScriptAdapter.autoSave();
            if (this.keyPressed !== '') window.MapAndReactOnContent.mapreact();
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
        const rangePromise = new Promise((resolve, reject) => {
            resolve(1)
        })
        rangePromise.then(() => {
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
                            if (!lastID) {
                                newID = this.generateID();
                                lastID = Number(newID.substring(1));
                            } else {
                                newID = '0' + (lastID + 1);
                                lastID = lastID + 1;
                            }

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
        }).then(async () => {
            if (!rearrange) return;
            // re arrange pages
            await this.rearrangePage();
            await window.MapAndReactOnContent.mapreact();
        })
        return rangePromise;
    }

    // START - Suggestion Function For on time character suggestion
    onSuggestion(line) {
        const slist = document.querySelector('[sw-editor-suggetion="list"]');
        const characters = Object.values(window.ScriptAdapter.scriptDataStore.character);
        const suggestionList = characters.filter((character) => character.name.match(line.innerText)).map((character) => character.name);

        if (line.textContent !== '' && line.textContent.toUpperCase() === line.textContent) {
            slist.classList.remove('hide');
        } else {
            slist.classList.add('hide');
        }

        if (suggestionList.length === 0) {
            slist.classList.add('hide');
        }

        const listDiv = document.createElement('div');
        listDiv.classList.add('suggestion-list');
        listDiv.setAttribute('contenteditable', 'false');
        listDiv.setAttribute('id', 'suggestion-list');

        suggestionList.forEach((suggestion) => {
            const div = document.createElement('div');
            div.classList.add('suggestion-item');
            div.setAttribute('contenteditable', 'false');
            div.setAttribute('tabindex', '1');
            div.textContent = suggestion;
            div.addEventListener('click', () => {
                line.textContent = suggestion;
                listDiv.remove();
                slist.classList.add('hide');
                line.click();
                line.click();
                window.ScriptAdapter.autoSave();
            });
            listDiv.append(div);
        });

        slist.innerHTML = '';
        slist.append(listDiv);
    }


// END - Suggestion Function For on time character suggestion

    updateLastFocusEdit() {
        if (this.lastFocusEdit && this.lastFocusEdit.innerHTML) {
            const getReactPosID = this.lastFocusEdit.getAttribute('react-pos');
            this.onSuggestion(this.lastFocusEdit);
            if (!getReactPosID) return;
            const allReacters = document.querySelectorAll(`[react-pos="${getReactPosID}"]`);
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
        let type = newLine.getAttribute(this.cons.editType);
        if (type === '') type = 'action';
        newLine.setAttribute(this.cons.editType, type);
        // get all element with sw-focused attribute
        const focusedElements = document.querySelectorAll('[sw-focused]');
        // remove all sw-focused attribute
        focusedElements.forEach((e) => {
            e.removeAttribute('sw-focused');
        });
        newLine.setAttribute("sw-focused", "edit")

        const line = this.handleContentLineNuetral(newLine, type);
        if (this.handleSceneHeadingType(line)) ; else if (this.handleCharater(line)) ; else if (this.handleParentArticle(line)) ; else if (this.handleDialog(line)) ; else if (this.handleTransition(line)) ; else if (this.handleActType(line)) ;
    }

    handleActType(line, direct = false) {
        if (direct) {
            line.classList.replace(this.cons.at, this.cons.act);
            line.setAttribute(this.cons.editType, this.cons.ac);
            return;
        }
        let verify = false;
        if (line.innerText.toLowerCase().startsWith('act.') || line.innerText.toLowerCase().startsWith('act')) {
            line.classList.replace(this.cons.at, this.cons.act);
            // Add content Line signature
            line.setAttribute(this.cons.editType, this.cons.ac);
            // confirm checker
            verify = true;
        }
        return verify;
    }

    // handleHeadingType(line, direct = false) {
    //     if (direct) {
    //         line.classList.replace(this.cons.he, this.cons.het);
    //         line.setAttribute(this.cons.editType, this.cons.ac);
    //         return;
    //     }
    //     let verify = false;
    //     if (line.innerText.toLowerCase().startsWith('head')) {
    //         line.classList.replace(this.cons.he, this.cons.het);
    //         // Add content Line signature
    //         line.setAttribute(this.cons.editType, this.cons.ac);
    //         // confirm checker
    //         verify = true;
    //     }
    //     return verify;
    // }

    handleSceneHeadingType(line, direct = false) {
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

    handleDialog(line, direct = false) {
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

    handleCharater(line, direct = false) {
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
        if (lineText && lineText.split('').length >= 3 && !lineText.toLowerCase().startsWith('act') && lineText.toUpperCase() === lineText && !num.includes(lineText[0]) && !transitionNames.includes(lineText.toLowerCase())) {
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

    handleTransition(line, direct = false) {
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

    handleParentArticle(line, direct = false) {
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

    handleContentLineNuetral(line, type = 'action') {
        if (type === '') type = 'action';
        // Adjust script body
        line.classList.remove(this.cons.sht);
        line.classList.remove(this.cons.ct);
        line.classList.remove(this.cons.pat);
        line.classList.remove(this.cons.dt);
        line.classList.remove(this.cons.tt);
        line.classList.remove(this.cons.at);
        line.classList.remove(this.cons.act);
        line.classList.remove(this.cons.het);
        if (type === 'action') line.classList.add(this.cons.at); else if (type === 'dialog') line.classList.add(this.cons.dt); else if (type === 'character') line.classList.add(this.cons.ct); else if (type === 'parent-article') line.classList.add(this.cons.pat); else if (type === 'transition') line.classList.add(this.cons.tt); else if (type === 'scene-heading') line.classList.add(this.cons.sht); else if (type === 'act') line.classList.add(this.cons.act);
        line.setAttribute(this.cons.editType, '');
        if (type === 'action') line.setAttribute(this.cons.editType, this.cons.a); else if (type === 'dialog') line.setAttribute(this.cons.editType, this.cons.d); else if (type === 'character') line.setAttribute(this.cons.editType, this.cons.c); else if (type === 'parent-article') line.setAttribute(this.cons.editType, this.cons.pa); else if (type === 'transition') line.setAttribute(this.cons.editType, this.cons.t); else if (type === 'scene-heading') line.setAttribute(this.cons.editType, this.cons.sh); else if (type === 'act') line.setAttribute(this.cons.editType, this.cons.ac);
        return line;
    }

    rearrangePage(pageAttr = this.cons.item) {
        const allPage = document.querySelectorAll(pageAttr);
        const totalPages = allPage.length;
        for (let index = 0; index < totalPages; index++) {
            const page = allPage[index];
            if (this.isPageOverflowing(page)) {
                const nextPage = page.nextElementSibling;
                if (nextPage) {
                    this.moveContentToSibling(page, nextPage);
                } else {
                    this.createNewPage(page);
                }
            }
        }

        this.rearrangePageBack();
        this.removeBlankPage();
    }

    isPageOverflowing(page) {
        return page.scrollHeight > this.pageHeight;
    }

    moveContentToSibling(page, nextPage) {
        const lastContentLine = page.lastElementChild;
        if (lastContentLine) {
            nextPage.insertAdjacentElement('afterbegin', lastContentLine);
        }
        while (this.isPageOverflowing(page)) {
            nextPage.insertAdjacentElement('afterbegin', page.lastElementChild);
        }
    }

    createNewPage(page) {
        let newPage = this.itemTemp.cloneNode(true);
        [...newPage.children].forEach((cl) => {
            cl.remove()
        });
        this.editorModeList.append(newPage);
        while (this.isPageOverflowing(page)) {
            if (this.isPageOverflowing(newPage)) {
                this.createNewPageBefore(page, newPage);
            } else {
                newPage.insertAdjacentElement('afterbegin', page.lastElementChild);
            }
        }
    }

    createNewPageBefore(page, newPage) {
        page.append(newPage.firstElementChild);
        const latestPage = this.itemTemp.cloneNode(true);
        [...latestPage.children].forEach((cl) => {
            cl.remove()
        });
        newPage.insertAdjacentElement('beforebegin', latestPage);
        latestPage.insertAdjacentElement('afterbegin', page.lastElementChild)
    }


    rearrangePageBack(pageAttr = this.cons.item) {
        const allPages = document.querySelectorAll(pageAttr);
        const totalPages = allPages.length;

        for (let i = 0; i < totalPages; i++) {
            const page = allPages[i];
            const currentScrollHeight = page.scrollHeight;

            if (currentScrollHeight > this.pageHeight) {
                const nextPage = page.nextElementSibling;
                if (nextPage) {
                    let firstContentLine = nextPage.firstElementChild;
                    while (firstContentLine) {
                        page.insertAdjacentElement('beforeend', firstContentLine);
                        if (page.scrollHeight <= this.pageHeight) break;
                        firstContentLine = nextPage.firstElementChild;
                    }
                }
            }
        }
    }


    removeBlankPage(pageAttr = this.cons.item) {
        const allPage = document.querySelectorAll(pageAttr);
        allPage.forEach((page) => {
            if (![...page.children].length) page.remove();
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.EditorMode = new EditorMode('sw-editor');
})
