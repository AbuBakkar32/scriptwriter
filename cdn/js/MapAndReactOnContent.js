//import { EditorFuncs } from "./EditorFuncs.js";
// Take Note: e.target will return the particular element which it content was adjust.
// Take Note: e.offsetX or Y only works for input element
// Introduced serveral functions from app.js: hideAndShowDropable('hideable-part', 'showable-part')
class MapAndReactOnContent {
    // Take note 'rs' means right side bar
    characterStore = [];
    contentStore = [];
    dataForGraph = [];
    /* Right Side Bar Template */
    // structure guide
    rsStructureList;
    /** container for each page script-bodys */
    rsStructureOption;
    /**will indicate each script-body */
    rsStructureItem
    /**icon that will be added to each structureItem when clicked*/
    rsStructureItemArrow
    /**script writer content page list wrapper*/
    swPageTemp
    /**Check status before setTimeout execute*/
    setTimeoutStatus = true;
    /** meta type mutation status trigger by changeTypeOfContentLine() */
    metaTypeMutationStatus = false;
    /** removed node mutation status */
    removeNodeMutationStatus = true;
    // page mutation status
    pageMutationStatus = true;

    specificLineList = []
    specificLineListStatus = false;
    specificActLineList = {};
    specificActLineListStatus = false;
    title1;
    lineGraph;
    maskGraph;
    candleStick1;
    candleStick2;
    hide = true;

    // ACT Structure
    actStructure = '3';
    showActLine = true;
    showLineChart = true;

    constructor(attrName = "sw-editor") {
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
            editColor: `${this.attrName}-color`,
            focused: `[sw-focused="edit"]`,
            editCharacterID: `${this.attrName}-character-id`,
            ac: 'act',
            act: 'act-type',
        };

        // structure guide
        this.rsStructureList = document.querySelector(`[sw-data="structure-list"]`);
        this.rsStructureOption = document.querySelector(`[sw-data="structure-option"]`).cloneNode(true);
        this.rsStructureItem = document.querySelector(`[sw-data="structure-item"]`).cloneNode(true);
        this.rsStructureItemArrow = document.querySelector(`[sw-data="structure-item-arrow"]`).cloneNode(true);
        // START - For Toggle Button
        this.title1 = document.querySelector(`[sw-graph="item-11"]`)
        this.lineGraph = document.querySelector(`[structure="line-chart"]`)
        this.maskGraph = document.querySelector(`[structure="mask-chart"]`)
        // script writer content page list wrapper
        this.swPageTemp = document.querySelector(this.cons.list);
        this.lineGraph.addEventListener('click', () => {
            this.showLineChart = !this.showLineChart;
            this.graphTemplateOne('[sw-graph="item-11"]');
        });

        // END - For Toggle Button
        // Delete the dummy templates of structure guide in right sider bar
        [...this.rsStructureList.children].forEach((el) => {
            el.remove()
        });
        [...this.rsStructureOption.children].forEach((el) => {
            el.remove()
        });

        //Init listener
        this.listener();
    }

    listener() {
        // Click listener for the page list wrapper
        this.swPageTemp.addEventListener('click', (e) => {
            const mainTarget = e.target.closest(this.cons.line);
            // Remove all previous target
            const previous = document.querySelector(this.cons.focused);
            if (previous) previous.removeAttribute('sw-focused');
            //Add focus edit to the current content line
            if (mainTarget) {
                mainTarget.setAttribute('sw-focused', 'edit');
                // get the meta type
                const metaType = mainTarget.getAttribute('sw-editor-type');
                if (document.querySelectorAll(`[sw-select-item="set"]`).length > 3) {
                    // position to set the name of the type of content line
                    const typeNamePos = document.querySelector(`[sw-select-item="set"]`);
                    if (metaType === 'action' && typeNamePos) typeNamePos.textContent = 'Action';
                    else if (metaType === 'dialog' && typeNamePos) typeNamePos.textContent = 'Dialog';
                    else if (metaType === 'scene-heading' && typeNamePos) typeNamePos.textContent = 'Scene Heading';
                    else if (metaType === 'parent-article' && typeNamePos) typeNamePos.textContent = 'Parent Article';
                    else if (metaType === 'character' && typeNamePos) typeNamePos.textContent = 'Character';
                    else if (metaType === 'transition' && typeNamePos) typeNamePos.textContent = 'Transition';
                    else if (metaType === 'act' && typeNamePos) typeNamePos.textContent = 'Act';
                    // else if (metaType === 'heading' && typeNamePos) typeNamePos.textContent = 'Heading';
                }
            }
        });
        //Function that can change any type of content line
        this.changeTypeOfContentLine();
    }

    geneateUniqueID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    structureGuideHandle(contentStore = []) {
        // Clear the structure guide wrapper
        [...this.rsStructureList.children].forEach((el) => {
            el.remove()
        });

        // List of scenes and their text length
        const scenesCals = {scenes: [], highestLenght: 0};

        const scenesTextLength = [];

        this.contentStore.forEach((item) => {
            if (item.type === 'scene-heading') {
                const content = item.content.innerText;
                const pos = item.index;

                //Get all other scene type that is under this scene heading
                let sceneTextLength = content.length;

                for (let i = pos + 1; i < this.contentStore.length; i++) {
                    const tem = this.contentStore[i];
                    if (tem.type === 'scene-heading') break;
                    else sceneTextLength += tem.content.innerText.length;
                }
                scenesCals.scenes.push({element: item.content, textLength: sceneTextLength});

                scenesTextLength.push(sceneTextLength);
            }
        });

        const highToLowSceneTextLength = scenesTextLength.sort((a, b) => b - a);
        if (highToLowSceneTextLength.length) scenesCals.highestLenght = highToLowSceneTextLength[0];

        // Render page content to the Structure Guide Template
        this.structureGuideHandleTemplate(scenesCals);
    }

    structureGuideHandleTextSize(num = 10) {
        if (num >= 96) return 'w-100'; else if (num >= 90) return 'w-95'; else if (num >= 85) return 'w-90'; else if (num >= 80) return 'w-85'; else if (num >= 75) return 'w-80'; else if (num >= 70) return 'w-75'; else if (num >= 65) return 'w-70'; else if (num >= 60) return 'w-65'; else if (num >= 55) return 'w-60'; else if (num >= 50) return 'w-55'; else if (num >= 45) return 'w-50'; else if (num >= 40) return 'w-45'; else if (num >= 35) return 'w-40'; else if (num >= 30) return 'w-35'; else if (num >= 25) return 'w-30'; else if (num >= 20) return 'w-25'; else if (num >= 15) return 'w-20'; else if (num >= 10) return 'w-15'; else if (num >= 5) return 'w-10'; else return 'w-5';
    }

    structureGuideHandleTemplate(scenesCals = {scenes: [], highestLenght: 0}, returnPageStructureWrap = false) {
        // the container representing each page in the structure guide
        const pageStructureWrap = this.rsStructureOption.cloneNode(true);
        // Add the structure option to the structure list
        this.rsStructureList.appendChild(pageStructureWrap);

        const highestTextLenght = scenesCals.highestLenght;

        scenesCals.scenes.forEach((scene) => {
            const pageTextPercentage = scene.textLength / highestTextLenght * 100;
            // get the width size of the text in the script body content
            const widSize = this.structureGuideHandleTextSize(pageTextPercentage);

            // create a structure guide item that will be under the structure option to represent the particular content line
            const structureItem = this.rsStructureItem.cloneNode(true);
            // add the text width size to the structure item
            structureItem.querySelector(`[sw-data="structure-item-size"]`).classList.replace('w-40', widSize);
            // Add the structure item to it structure option
            pageStructureWrap.appendChild(structureItem);

            // Add click event listener to the Stucture Item, so that each time it is been clicked, the structure arrow will indicate
            structureItem.addEventListener('click', () => {
                const arrowElement = document.querySelector(`[sw-data="structure-item-arrow"]`) || this.rsStructureItemArrow.cloneNode(true);
                structureItem.insertAdjacentElement('afterbegin', arrowElement);
                const mainEditor = scene.element.parentElement.parentElement;
                mainEditor.setAttribute('contenteditable', 'false');
                // Scroll to the particular script body
                window.scrollTo(0, scene.element.offsetTop + scene.element.parentElement.offsetTop);
                // click on the script body
                scene.element.click();
                scene.element.focus();
                mainEditor.setAttribute('contenteditable', 'true');
            });

        });

        if (returnPageStructureWrap) return pageStructureWrap;
    }

    mapreact() {
        this.cIdList = [];
        this.mapContents();
        this.structureGuideHandle(this.contentStore);
        window.CharacterHandle?.characterHandle(this.contentStore);
        window.OutlineHandle?.outlineHandle(this.contentStore);
        this.standAloneReactOnContent();
        try {
            this.graphRenderer();
        } catch (error) {
            console.log('Unable to render graph', error);
        }
        this.renderActDropdown();
    }

    mapContents() {
        /** this.contentStore structure must be a list of array with the this structure
         * {main: content-line element itself, 
         *  type: the type of content-line gotten from meta-type attribute value,
         *  id: the generated unique id for performing map and react(contentLineScriptBodyElemt.setAttribute('react-pos', .id)),
         *  index: the index position of the array in this.contentStore,
         *  other: [], 
         * //the other key is an optional key that is only available for charater type, and is used to store charater script body 
         * element of the same value.
         *  }
         **/
        //Clear previous stored contents
        this.contentStore = [];

        //Clear all previous stored data in the graph store
        this.dataForGraph = [];

        // reset the content store
        if (window.CharacterHandle) window.CharacterHandle.contentStore = this.contentStore;
        if (window.OutlineHandle) window.OutlineHandle.contentStore = this.contentStore;

        // start mapping element by content type
        let lineList = document.querySelectorAll(this.cons.line);
        if (this.specificLineListStatus) {
            lineList = this.specificLineList;
        }

        let count = 0;
        let dataForGraphCount = 0;
        let uidCount = 0;
        const pagePackList = document.querySelectorAll(this.cons.item);
        // ready cid
        let readyID = {};
        for (const element of lineList) {
            uidCount += 1;
            const el = element;
            const mainElement = el;
            const getType = el.getAttribute(this.cons.editType); // return either action or dialog or parenthetical or scene-heading etc.
            const scriptBodyElement = el;
            let uid = uidCount; //this.generateUniqueID();
            const ind = count;
            // script body id
            const sbID = el.getAttribute(this.cons.editID);
            // script body color
            const sbColor = el.getAttribute(this.cons.editColor);
            // Create/Append the array to contentStore
            if (getType === 'character') {
                // character id
                let cid = el.getAttribute(this.cons.editCharacterID);
                if (!cid) {
                    try {
                        window.CharacterHandle.lineValidator(el)
                        cid = el.getAttribute(this.cons.editCharacterID);
                    } catch (e) {

                    }
                }
                if (readyID[cid]) uid = readyID[cid].uid;
                else readyID[cid] = {uid: uid, cid: cid};
                // set the map react id on script body element
                scriptBodyElement.setAttribute('react-pos', uid);
                const cat = {
                    main: mainElement,
                    type: getType,
                    content: scriptBodyElement,
                    id: uid,
                    index: ind,
                    other: [],
                    cid: cid,
                    sbID: sbID,
                    color: sbColor
                };
                this.contentStore.push(cat);
                // Increase the count
                count += 1;
            } else if (getType !== 'character') {
                // Get the particular page number
                const pageNumber = getEleId(el.parentElement, pagePackList) + 1;
                // set the map react id on script body element
                scriptBodyElement.setAttribute('react-pos', uid);
                const cat = {
                    main: mainElement, type: getType, content: scriptBodyElement, id: uid, index: ind,
                    sbID: sbID, color: sbColor, pageNumber: pageNumber
                };
                this.contentStore.push(cat);
                // Increase the count
                count += 1;
            }

            //Append data to the DataForGraph Store
            if (getType === 'act') {
                this.dataForGraph.push({
                    type: 'act',
                    name: scriptBodyElement.innerText,
                    index: dataForGraphCount
                });
                dataForGraphCount += 1;
            } else if (getType === 'character') {
                this.dataForGraph.push({
                    type: 'character',
                    name: scriptBodyElement.innerText,
                    index: dataForGraphCount
                });
                dataForGraphCount += 1;
            } else if (getType === 'scene-heading') {
                this.dataForGraph.push({
                    type: 'scene-heading',
                    name: scriptBodyElement.innerText,
                    index: dataForGraphCount
                });
                dataForGraphCount += 1;
            }
        }
    }

    standAloneReactOnContent() {
        //const startTime = performance.now(); 
        document.querySelectorAll(`[react-pos]`).forEach((ele) => {
            ele.addEventListener('input', () => {
                const mrID = ele.getAttribute('react-pos');
                const reactSet = document.querySelectorAll(`[react-pos="${mrID}"]`);
                reactSet.forEach((it) => {
                    if (ele != it) it.innerText = ele.innerText;
                    else {
                        const isLine = it.hasAttribute(this.cons.editType);
                        if (isLine) {
                            const clID = it.getAttribute(this.cons.editID);
                            /** Watcher reaction */
                            window.Watcher.changeInLine(clID);
                        }
                    }
                });

                // if character
                if (ele.hasAttribute('character-data')) {
                    const characterItem = ele.closest(`[mapreact-data="character-item"]`);
                    if (!characterItem) return;
                    const characterIDElement = characterItem.querySelector(`[character-idvalue]`);
                    if (!characterIDElement) return;
                    const characterID = characterIDElement.getAttribute('character-idvalue');
                    if (characterID) window.CharacterHandle.update(characterID);
                } else if (ele.hasAttribute('rs-character')) {
                    const characterItem = ele.closest(`[mapreact-data="rs-character-item"]`);
                    if (!characterItem) return;
                    const characterIDElement = characterItem.querySelector(`[rs-character-id]`);
                    if (!characterIDElement) return;
                    const characterID = characterIDElement.getAttribute('rs-character-id');
                    if (characterID) window.CharacterHandle.update(characterID);
                } else if (ele.hasAttribute(this.cons.editCharacterID)) {
                    if (ele.getAttribute(this.cons.editType) !== 'character') return;
                    const getCharacterID = ele.getAttribute(this.cons.editCharacterID)
                    if (getCharacterID) window.CharacterHandle.update(getCharacterID);
                }
            });
        });
        // A hide and show function from app.js
        hideAndShowDropable('hideable-part', 'showable-part');
    }

    /* Change of content line type starts here */
    changeTypeOfContentLine() {
        //The switch menu
        const controlSwitch = document.querySelectorAll(`[sw-changer="content-line-type"]`);
        controlSwitch.forEach((stw) => {
            // List of content line type
            const typeList = [...stw.children];
            // Add click listener event that will trigger the change of the selected content
            typeList.forEach((typ) => {
                typ.addEventListener('click', () => {
                    const targetFocused = document.querySelector(this.cons.focused);
                    let targetFocusedPromise = new Promise((resolve, reject) => {
                        resolve(1)
                    });
                    targetFocusedPromise.then(() => {
                        if (typ.innerText.toLowerCase().startsWith('a') && targetFocused) this.actionType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('s') && targetFocused) this.sceneHeadingType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('p') && targetFocused) this.parentArticleType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('c') && targetFocused) this.characterType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('d') && targetFocused) this.dialogeType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('t') && targetFocused) this.transitionType(targetFocused);
                        else if (typ.innerText.toLowerCase().endsWith('t') && targetFocused) this.actType(targetFocused)
                        // else if (typ.innerText.toLowerCase().startsWith('he') && targetFocused) this.headingType(targetFocused)
                    }).then(() => {
                        if (!targetFocused) return;
                        const clID = targetFocused.getAttribute(this.cons.editID);
                        /** Watcher reaction */
                        window.Watcher.changeAttribute(clID);
                    })
                });
            });
        });
    }

    actType(line) {
        const {metaType, funcName} = {metaType: line.getAttribute(this.cons.editType), funcName: 'act'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'act');
        // set line into the act
        window.EditorMode.handleActType(line);
    }

    // headingType(line) {
    //     console.log(line);
    //     const {metaType, funcName} = {metaType: line.getAttribute(this.cons.editType), funcName: 'heading'};
    //     // if function name is same as metaType then end the function
    //     if (funcName === metaType) return;
    //     // clear character id
    //     window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
    //     // reset line to action
    //     window.EditorMode.handleContentLineNuetral(line, 'heading');
    //     // set line into the act
    //     window.EditorMode.handleHeadingType(line);
    // }

    sceneHeadingType(line) {
        // get the content line meta-type // function name
        let metaType = '';
        let funcName = 'scene-heading';
        try {
            metaType = line.getAttribute(this.cons.editType);
        } catch (error) {
            metaType = 'action'
        }
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'scene-heading');
        // set line type
        window.EditorMode.handleSceneHeadingType(line)
    }

    actionType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType: line.getAttribute(this.cons.editType), funcName: 'action'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'action');
        // set line type
        window.EditorMode.handleActType(line);
    }

    dialogeType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType: line.getAttribute(this.cons.editType), funcName: 'dialog'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'dialog');
        // set line type
        window.EditorMode.handleDialog(line);
    }

    parentArticleType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType: line.getAttribute(this.cons.editType), funcName: 'parent-article'};
        // if function name is same as metaType then end the function
        line.innerText = '(' + line.innerText + ')';
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'parent-article');
        // set line type
        window.EditorMode.handleParentArticle(line)
    }

    characterType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType: line.getAttribute(this.cons.editType), funcName: 'character'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // Script Body
        const scriptBody = line;
        // get the script Body text
        const currentText = line?.textContent.toUpperCase();
        // assign character id to it
        const isCharacterNameExist = window.CharacterHandle.checkStore(currentText);
        if (isCharacterNameExist.valid) { /*this means character name exist */
            line.setAttribute(this.cons.editCharacterID, isCharacterNameExist.id);
        } else { // create new charater
            const newCharacterId = window.CharacterHandle.create(currentText);
            line.setAttribute(this.cons.editCharacterID, newCharacterId);
        }
        ;
        //reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'character');
        // set line type
        window.EditorMode.handleCharater(line)
    }

    transitionType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType: line.getAttribute(this.cons.editType), funcName: 'transition'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'transition');
        // set line type
        window.EditorMode.handleTransition(line)
    }

    clearCharacterIdOnContentLine(line) {
        const characterIDValue = line?.getAttribute(this.cons?.editCharacterID);
        if (!characterIDValue) return;
        line.setAttribute(this.cons.editCharacterID, '');
    }

    /* Change of content line type ends here */

    /* Apply Graph starts from here */
    graphRenderer() {
        // Array used for character type
        const charactersPossession = [];
        const validatedCharacters = [];

        //Array used for scene heading
        const sceneCharacters = [];
        this.dataForGraph.forEach((item) => {
            if (item.type === 'character') {
                const name = item.name;
                //Get the number of times a character Name appear
                if (!validatedCharacters.includes(name)) {
                    let numberOfCharacterAppearance = 0;
                    this.dataForGraph.forEach((it) => {
                        if (it.type === 'character' && name === it.name) numberOfCharacterAppearance += 1;
                    });

                    validatedCharacters.push(name)
                    // Append character name and total appearance
                    charactersPossession.push([name, numberOfCharacterAppearance])
                }
            } else if (item.type === 'scene-heading') {
                const name = item.name;
                const pos = item.index;

                //Get all scene heading that the character Name appear
                let characterAppearedScene = '';
                for (let i = pos + 1; i < this.dataForGraph.length; i++) {
                    const tem = this.dataForGraph[i];
                    if ((tem.type === 'character') /* && !characterAppearedScene.includes(tem.name) */) characterAppearedScene += tem.name + ', ';
                    else if (tem.type === 'scene-heading') break;
                }

                // Append character
                sceneCharacters.push({name: name, characters: characterAppearedScene});
            }
        });

        // Render filtered data to their various graph
        if (charactersPossession.length > 0) this.graphTemplateThree(charactersPossession);
        if (sceneCharacters.length > 0) {
            // sceneCharacter Data Table arrangement
            const newTable = [];
            let count = 1;
            // explore list
            sceneCharacters.forEach((itm) => {
                const sceneItem = itm.characters.split(' ');
                sceneItem.pop();
                const noOfCharacters = sceneItem.length;
                // restructured character names
                let newSetNames = '';
                sceneItem.forEach((nam) => {
                    if (!newSetNames.includes(nam)) newSetNames += nam + ' ';
                });
                newTable.push([
                    count, noOfCharacters, noOfCharacters, -noOfCharacters, -noOfCharacters, this.graphTipDOMTemplate(itm.name.toUpperCase(), newSetNames)]
                );
                count += 1;
            });
            this.graphTemplateFour(newTable);
            this.graphTemplateOne(`[sw-graph="item-11"]`);
        }
    }

    graphTipDOMTemplate(sceneHeading, characterNames) {
        return `
        <div style="position: absolute; top: 220px; min-width: 150px; left: 20px;">
            <div style="position: relative;">
                <div class="p-8 text-cursive bg-four">
                    <b>${sceneHeading}</b><br>
                    <span>${characterNames}</span>
                </div>
                <div style="position: absolute; bottom: 100%; width: 2px; height: 110px; background-color: white; pointer-events: none;">
                </div>
            </div>
        </div>
        `
    }

    graphTemplateOne(qs) { //Line Chart graph
        const item11 = document.querySelector(qs);
        let item11OffsetWidth = 1200;
        if (window.innerWidth < item11OffsetWidth) item11OffsetWidth = window.innerWidth - 20;
        // while item11 has child node remove it
        while (item11.firstChild) item11.removeChild(item11.firstChild);
        // create a canvas element
        const canvas = document.createElement('canvas');
        // set canvas width and height full width and height of the item11 element and append it to the item11 element
        canvas.width = item11OffsetWidth;
        canvas.height = item11.offsetHeight;

        let outline
        if (this.specificActLineListStatus) {
            outline = this.specificActLineList;
        } else {
            outline = window.ScriptAdapter.scriptDataStore.outline;
        }

        let lengthList = []
        Object.keys(outline).forEach((key) => {
            try {
                if (!outline[key].title.startsWith('ACT')) {
                    lengthList.push(outline[key]);
                }
            } catch (e) {
            }
        });
        let outlineLength = lengthList.length + 1;

        let xPart = item11OffsetWidth / outlineLength
        let xValue = xPart + 20;

        // create a new chart
        const ctx = canvas.getContext('2d');
        // make a red line
        ctx.strokeStyle = 'red';
        // make the line 5 pixels wide
        ctx.lineWidth = 3;
        
        if (this.showLineChart) {
            if (qs === '[sw-graph="item-22"]') ctx.moveTo(30, 100);
            else ctx.moveTo(20, 100);

            lengthList.forEach((key, index) => {
                const item = lengthList[index];
                const emotionalValue = parseInt(item.emotional_value); // emotional value can be -10 to 10
                // if emotional value is 0 then y value is 100
                // if emotional value is 10 then y value is 0
                // if emotional value is -10 then y value is 200
                let yValue = 100 - (emotionalValue * 10);
                if (yValue > 195) yValue = 195;
                if (yValue < 5) yValue = 5;
                ctx.lineTo(xValue, yValue);

                if (index !== 0) {
                    xValue = xValue + xPart - (20 / index) / 2 + 2;
                } else {
                    xValue = xValue + xPart;
                }
            })

            if (qs === '[sw-graph="item-22"]') ctx.lineTo(item11OffsetWidth - 10, 100)
            else ctx.lineTo(item11OffsetWidth, 100)
            ctx.stroke();

            xPart = item11OffsetWidth / outlineLength
            xValue = xPart + 20;
            // draw small circle on the line
            lengthList.forEach((key, index) => {
                const item = lengthList[index];
                const emotionalValue = parseInt(item.emotional_value); // emotional value can be -10 to 10

                let yValue = 100 - (emotionalValue * 10);
                if (yValue > 195) yValue = 195;
                if (yValue < 5) yValue = 5;
                ctx.beginPath();
                ctx.arc(xValue, yValue, 5, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();

                if (index !== 0) {
                    xValue = xValue + xPart - (20 / index) / 2 + 2;
                } else {
                    xValue = xValue + xPart;
                }
            })

            ctx.beginPath();
            if (qs === '[sw-graph="item-22"]') ctx.arc(30, 100, 5, 0, 2 * Math.PI);
            else ctx.arc(20, 100, 5, 0, 2 * Math.PI);
            if (qs === '[sw-graph="item-22"]') ctx.arc(item11OffsetWidth - 10, 100, 5, 0, 2 * Math.PI);
            else ctx.arc(item11OffsetWidth - 3, 100, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
        }

        // append canvas to the item11 element
        item11.appendChild(canvas);

        if (this.showActLine) {
            // Adding ACT
            function drawYAxiStraightLine(ctx, xValue) {
                ctx.beginPath();
                ctx.moveTo(xValue, 0);
                ctx.lineTo(xValue, 200);
                ctx.stroke();
            }
            if (this.actStructure === '3'){
                // divide the item11 element into 3 parts with a y-axix straight line
                // first part width is 25%
                // second part width is 50%
                // third part width is 25%
                const width25 = item11OffsetWidth * 0.25;
                const width50 = item11OffsetWidth * 0.5;
                const width75 = item11OffsetWidth * 0.75;

                // draw a y-axix straight line
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                drawYAxiStraightLine(ctx, width25);
                drawYAxiStraightLine(ctx, width75);
            }
            else if (this.actStructure === '5'){
                // divide the item11 element into 5 parts with a y-axix straight line
                // first part width is 20%
                // second part width is 20%
                // third part width is 20%
                // fourth part width is 20%
                // fifth part width is 20%
                const width20 = item11OffsetWidth * 0.2;
                const width40 = item11OffsetWidth * 0.4;
                const width60 = item11OffsetWidth * 0.6;
                const width80 = item11OffsetWidth * 0.8;

                // draw a y-axix straight line
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 2;
                drawYAxiStraightLine(ctx, width20);
                drawYAxiStraightLine(ctx, width40);
                drawYAxiStraightLine(ctx, width60);
                drawYAxiStraightLine(ctx, width80);
            }
        }

    }

    //Pie Chart Graph
    graphTemplateThree(charactersPossession) {
        // format for charactersPossession parameter: [['German',  5.85]]
        const drawChart = () => {
            const data = google.visualization.arrayToDataTable([['Character Name', 'Possession'], ...charactersPossession]);
            let graph3Width = 500;
            if (window.innerWidth < 1200) graph3Width = window.innerWidth - 20;
            const options = {
                width: graph3Width,
                height: 400,
                legend: 'none',
                pieSliceText: 'label',
                title: '',
                pieHole: 0.4,
                pieSliceTextStyle: {
                    color: 'black'
                },
                backgroundColor: {
                    fill: 'none', // Change the background color.
                    stroke: 'none' // Change the vartical line color
                },
                pieSliceBorderColor: '#952aff',
                slices: {0: {color: '#952aff'}, 1: {color: '#fed59a'}, 3: {color: '#ffe6e9'}}, //Customize bgcolor for each data space
                // tooltip: { trigger: 'selection'} //trigger: selection => makes the tip display when click on the stroke.
            };
            const chart = new google.visualization.PieChart(document.querySelector(`[sw-graph="item-3"]`));
            chart.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawChart);
    }

    graphTemplateFour(tableData) {
        // format for tableData parameter: [[1, 28, 28, -38, -38, '<b>one<b>']]
        const drawCandleChart = () => {
            const data = new google.visualization.DataTable();
            data.addColumn('number', 'Y');
            data.addColumn('number', 'S');
            data.addColumn('number', 't');
            data.addColumn('number', 'p');
            data.addColumn('number', 'q');
            // A column for custom tooltip content
            data.addColumn({type: 'string', role: 'tooltip', p: {html: true}});
            data.addRows([...tableData]);
            // Configure the hAxis ticks
            const zeros = [];
            tableData.forEach((it) => {
                zeros.push(0)
            });

            let graph1Width = 1200;
            if (window.innerWidth < graph1Width) graph1Width = window.innerWidth - 20;

            const options = {
                width: graph1Width,
                tooltip: {isHtml: true, ignoreBounds: true},//, trigger: 'selection'},
                legend: 'none',
                // colors: ["transparent", "white"],
                bar: {groupWidth: '2%'}, // Remove space between bars.
                backgroundColor: {
                    fill: 'none', // Change the background color.
                    stroke: 'none' // Change the vertical line color
                },
                candlestick: {
                    fallingColor: {stroke: '#ffffff', strokeWidth: 5, fill: '#ffffff'}, // red: Applying color to the line bar
                    risingColor: {stroke: '#ffffff', strokeWidth: 5, fill: '#ffffff'}   // green:
                }, vAxis: {ticks: []}, //To hide all the horizontal lines.
                hAxis: {
                    ticks: [...zeros, tableData.length + 1],
                    baseline: tableData.length + 1,
                    gridlines: {color: '#000', minSpacing: 30}
                },
                chartArea: {left: 20, top: 0, width: '100%', height: '100%', stroke: '#fdc', strokeWidth: 5}
            };

            const chart = new google.visualization.CandlestickChart(document.querySelector(`[sw-graph="item-1"]`));
            chart.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawCandleChart);
    }

    renderActDropdown() {
        const actDropdown = document.getElementById('act-dropdown');
        const actDropdownLi = actDropdown.querySelectorAll('li');
        actDropdownLi.forEach((it) => {
            it.addEventListener('click', this.modifyGraphTemplateOne.bind(this));
        })
    }

    modifyGraphTemplateOne(e) {
        const structure = e.target.getAttribute('data-structure');
        this.actStructure = structure;

        this.mapreact();
    }
}


//init google graph
try {
    google.charts.load('current', {'packages': ['corechart']});
} catch (e) {
    console.log('An error error in google chart initialization.', e);
}
document.addEventListener("DOMContentLoaded", function () {
    window.MapAndReactOnContent = new MapAndReactOnContent();
});

