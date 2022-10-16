class OutlineHandle {
    /**Attribute Name*/
    attrName = `outline-data`;
    /**Map and react Arrtibute Name*/
    mrAttrName = `mapreact-data`;
    /**Right side bar outline Attribute name*/
    rsAttrName = `rs-outline`;
    /**React Position Attribute Name*/
    rpAttr = `react-pos`;
    /**script id attribute name */
    scriptIdAttr = `[outline-data-id="%s"]`;
    /**Constant*/
    vars;
    /** Right Side Bar Outline List Wrapper Template */
    rsOutlineListTemp;
    /** Right Side Bar Outline Item Wrapper Template */
    rsOutlineItemTemp;
    /** main outline page, List outline Wrapper Template */
    mainOutlineListTemp;
    /** main outline page, Item outline Wrapper Template */
    mainOutlineItemTemp;
    /**List of content Line will be assigned to this store*/
    contentStore = [];
    // main page changes
    mainPageChanges = false;
    constructor() {
        this.vars = {
            editorID: `[sw-editor-id="%s"]`,
            mainMrList: `[${this.mrAttrName}="outline-list"]`, mainMrItem: `[${this.mrAttrName}="outline-item"]`,
            rsMrList: `[${this.mrAttrName}="rs-outline-list"]`, rsMrItem: `[${this.mrAttrName}="rs-outline-item"]`,
            rsTitle: `[${this.rsAttrName}="title"]`, rsList: `[${this.rsAttrName}="list"]`, rsItem: `[${this.rsAttrName}="item"]`,
            sceneList: `[${this.attrName}="scene-list"]`, sceneTitle: `[${this.attrName}="scene-title"]`, index: `[${this.attrName}="index"]`,
            sceneGoal: `[${this.attrName}="scene-goal"]`, ev: `[${this.attrName}="emotional-value"]`, page: `[${this.attrName}="page"]`, 
            sceneItemTitle: `[${this.attrName}="scene-item-title"]`, sceneItem: `[${this.attrName}="scene-item"]`, 
            menu: `[${this.attrName}="menu"]`, commentOpt: `[${this.attrName}="comment-option"]`, addOpt: `[${this.attrName}="add-option"]`,
            deleteOpt: `[${this.attrName}="delete-option"]`, colorOpt: `[${this.attrName}="color-option"]`,
            colorWrap: `[${this.attrName}="color-wrap"]`, bgValue: `[bg-value="%s"]`, bgAttr: `bg-value`, idAttrName: 'outline-data-id',
            hideBtn:  `[${this.attrName}="hide-content-btn"]`, contentLineID: `[sw-script-body-idvalue="%s"]`, rsIdAttrName: `rs-outline-id`,
            rsIdAttr: `[rs-outline-id="%s"]`, content: `[${this.attrName}="content"]`,
        };

        this.rsOutlineListTemp = document.querySelector(this.vars.rsMrList);
        this.rsOutlineItemTemp = document.querySelector(this.vars.rsMrItem).cloneNode(true);

        this.mainOutlineListTemp = document.querySelector(this.vars.mainMrList);
        this.mainOutlineItemTemp = document.querySelector(this.vars.mainMrItem).cloneNode(true);

        //Remove all template
        [...this.rsOutlineListTemp.children].forEach((el) => {el.remove()});
        [...this.mainOutlineListTemp.children].forEach((el) => {el.remove()});

    }

    setUp(item = document.querySelector(this.vars.mainMrItem)) {
        const content = item.querySelector(this.vars.content);
        const hide = item.querySelector(this.vars.hideBtn);
        const menu = item.querySelector(this.vars.menu);
        const colorWrap = item.querySelector(this.vars.colorWrap);
        const commentBtn = item.querySelector(this.vars.commentOpt);
        const addBtn = item.querySelector(this.vars.addOpt);
        const deleteBtn = item.querySelector(this.vars.deleteOpt);
        const colorBtn = item.querySelector(this.vars.colorOpt);
        const sceneID = item.querySelector(this.vars.sceneItemTitle).getAttribute(this.vars.idAttrName);
        const sceneGoal = item.querySelector(this.vars.sceneGoal);
        const emotionalValue = item.querySelector(this.vars.ev);

        /** Event Listeners on Outline Page Items*/
        item?.addEventListener('click', ()=> { 
            // Make menu visible
            if (menu?.classList.contains('hide')) menu?.classList.remove('hide');
            // Hide other outline item menu
            document.querySelectorAll(this.vars.mainMrItem).forEach((x) => {
                if (x != item) {
                    const xMenu = x.querySelector(this.vars.menu);
                    if (!xMenu?.classList.contains('hide')) xMenu?.classList.add('hide');
                    // xMenu?.classList.add('hide');
                }
            });
            if (content.classList.contains('hide')) content.classList.remove('hide');
        });

        item?.addEventListener('mousemove', ()=> { 
            //if (menu?.classList.contains('hide')){ menu?.focus(); menu?.classList.remove('hide'); };
            if (hide?.classList.contains('hide')) hide?.classList.remove('hide');
        });

        item?.addEventListener('mouseout', ()=> { 
            if (!hide?.classList.contains('hide')) hide?.classList.add('hide'); 
        });

        hide?.addEventListener('click', (e)=> {
            e.stopImmediatePropagation(); e.stopPropagation();
            if (!content.classList.contains('hide')) content.classList.add('hide');
        });

        /* menu?.addEventListener('focusout', ()=> {
            if (!menu?.classList.contains('hide')) menu?.classList.add('hide');
        }); */

        colorWrap?.addEventListener('focusout', ()=> {
            if (!colorWrap?.classList.contains('hide')) colorWrap?.classList.add('hide');
        });

        colorWrap?.querySelectorAll(`[${this.vars.bgAttr}]`).forEach((color) => {
            if (color.getAttribute(this.vars.bgAttr)){
                color.addEventListener('click', (e)=> {
                    e.stopImmediatePropagation(); e.stopPropagation();
                    // new color to set
                    const newColorValue = color.getAttribute(this.vars.bgAttr);
                    /**Set this new color value to the item, colorBtn and contentLine itself */
                    const itemColor = item.getAttribute(this.vars.bgAttr);

                    item.querySelectorAll(this.vars.bgValue.replace('%s', itemColor)).forEach((x) =>{
                        if (x != color) {
                            x.classList.replace(itemColor, newColorValue);
                            x.setAttribute(this.vars.bgAttr, newColorValue);
                        }
                    });

                    item.classList.replace(itemColor, newColorValue);
                    item.setAttribute(this.vars.bgAttr, newColorValue);

                    // Navigate to the particular content line through the content line id and target the contentLine element
                    const line = document.querySelector(this.vars.editorID.replace('%s', sceneID));
                    line.setAttribute('sw-editor-color',newColorValue);

                    // make sure the color is saved
                    this.updateDB();
                    if (!colorWrap?.classList.contains('hide')) colorWrap?.classList.add('hide');
                });
            }
        });

        commentBtn?.addEventListener('click', (e)=>{
            e.stopImmediatePropagation(); e.stopPropagation(); 
            alert('comment button in progress');
        });

        addBtn?.addEventListener('click', (e)=> {
            e.stopImmediatePropagation(); e.stopPropagation();
            this.add(item);
        });

        deleteBtn?.addEventListener('click', (e)=> {
            e.stopImmediatePropagation(); e.stopPropagation();
            this.delete(item);
        });

        colorBtn?.addEventListener('click', (e)=> {
            e.stopImmediatePropagation(); e.stopPropagation();
            if (colorWrap?.classList.contains('hide')) colorWrap?.classList.remove('hide'); 
        });

        emotionalValue?.addEventListener('keyup', ()=>{
            setTimeout(() => {
                const draftKey = window.ScriptAdapter.currentDraftKey;
                window.ScriptDataStore.draft[draftKey].data[sceneID].others.ev = emotionalValue.textContent;
                window.ScriptDataStore.draft[draftKey].data[sceneID].others.scenegoal = sceneGoal.textContent;
                this.updateDB();
            }, 700);
        });

        sceneGoal?.addEventListener('keyup', ()=>{
            setTimeout(() => {
                const draftKey = window.ScriptAdapter.currentDraftKey;
                window.ScriptDataStore.draft[draftKey].data[sceneID].others.ev = emotionalValue.textContent;
                window.ScriptDataStore.draft[draftKey].data[sceneID].others.scenegoal = sceneGoal.textContent;
                this.updateDB();
            }, 700);
        });
    }

    updateDB() {
        window.ScriptAdapter.autoSave();
    }

    add(item = document.querySelector(this.vars.mainMrItem)) {
        const ask = confirm(`Do you want to add a new Scene?`);
        if (!ask) return;
        window.Watcher.mainPageAwait();
        setTimeout(() => {
            const addOutlinePromise = new Promise((resolve, reject)=>{resolve(1)});
            addOutlinePromise.then(()=>{
                const contentLineID = item.querySelector(this.vars.sceneItemTitle).getAttribute(this.vars.idAttrName);
                const sceneList = item.querySelector(this.vars.sceneList);
                // get the content line id of the last Line
                const lastLineElement = sceneList.lastElementChild;
                const lastLineID = lastLineElement.getAttribute(this.vars.idAttrName);
                // Get the content line element of the last line ID
                const lastLineContentElement = document.querySelector(this.vars.editorID.replace('%s', lastLineID));
                // Navigate to the particular content line through the content line id and target the contentLine element
                // window.EditorFuncs
                // new scene heading content line
                const headingFunc = window.MapAndReactOnContent.sceneHeadingType;
                const sceneHeadingContentLine = window.EditorFuncs.createNewLine(
                    lastLineContentElement, headingFunc, true, 'INT. New Scene '+quickID());
    
                // new action content line
                const actionContentLine = window.EditorFuncs.createNewLine(
                    sceneHeadingContentLine, (b)=>{}, true, 'new action line '+quickID());
                //sceneHeadingContentLine.insertAdjacentElement('afterend', actionContentLine);
    
            }).then(()=>{
                window.MapAndReactOnContent.mapreact();
            }).then(()=> {
                window.Watcher.mainPageAwait(false);
                window.Watcher.conditionState();
                this.updateDB();
                this.mainPageChanges = true;
            });
        });
    }

    delete(item = document.querySelector(this.vars.mainMrItem)) {
        const ask = confirm(`Do you want to delete this Scene?\nThis action is not revertable`);
        if (!ask) return;

        window.Watcher.mainPageAwait();
        setTimeout(() => {
            const deleteOutlinePromise = new Promise((resolve, reject)=>{resolve(0)});
            deleteOutlinePromise.then(()=>{
                const contentLineID = item.querySelector(this.vars.sceneItemTitle).getAttribute(this.vars.idAttrName);
                const sceneList = item.querySelector(this.vars.sceneList);
                // Get the list of contentLine ids
                let contentLineIDList = [];
                [...sceneList.children].forEach((line) => { contentLineIDList.push(line.getAttribute(this.vars.idAttrName)); });
    
                contentLineIDList.forEach((cid) => {
                    // Navigate to the particular content line through the content line id and target the contentLine element
                    const line = document.querySelector(this.vars.editorID.replace('%s', cid));
                    line.remove();
                    //const draftKey = window.ScriptAdapter.currentDraftKey;
                    //delete window.ScriptDataStore.draft[draftKey].data[cid];
                    window.Watcher.removeLine(cid);
                });
                item.remove();
                document.querySelector(this.vars.rsIdAttr.replace('%s', contentLineID))?.remove();
            }).then(()=> {
                this.updateDB();
                window.MapAndReactOnContent.mapreact();
            }).then(()=>{
                window.Watcher.mainPageAwait(false);
                window.Watcher.conditionState();
                this.mainPageChanges = true;
                //const draftKey = window.ScriptAdapter.currentDraftKey;
                //window.ScriptAdapter.renderDraftContent(draftKey)
            });
        });
    }

    outlineHandle(contenStore) {
        // Clear template
        [...this.rsOutlineListTemp.children].forEach((el) => {el.remove()});
        [...this.mainOutlineListTemp.children].forEach((el) => {el.remove()});
        
        // Set new content store value
        this.contenStore = contenStore;

        const listOfOutline = [];
        
        let count = 0;
        this.contentStore.forEach((item) => {
            if (item.type === 'scene-heading') {
                count += 1;
                const name = item.content.innerText;
                const id = item.id;
                const pos = item.index;
                const color = item.color;
                const scriptBodyID = item.sbID;
                const pageNumber = item.pageNumber;

                //Get all other scene type that is under this scene heading
                const otherSceneType = [];
                
                for (let i = pos+1; i < this.contentStore.length; i++) {
                    const tem = this.contentStore[i];
                    if (tem.type === 'scene-heading') break;
                    else otherSceneType.push(tem);       
                }
                    
                // Append outline
                listOfOutline.push({
                    name: name, id: id, position: count, scenes: otherSceneType,
                    color: color, sbID: scriptBodyID, pageNumber: pageNumber, 
                    type: item.type,
                });
            }
        });

        //Render outline data to template
        listOfOutline.forEach(outline => this.outlineRenderTemplate(outline));
    }

    outlineRenderTemplate(data) {
        // the data parameter is an array of {name,  id, position, scenes, color, sbID, pageNumber }
        // current main page outLine item template
        let currentItemTemplate;
        if (1) {
            const template = this.mainOutlineItemTemp.cloneNode(true);
            currentItemTemplate = template;
            //Update title
            const title = template.querySelector(this.vars.sceneTitle);
            title.textContent = data.name;
            title.setAttribute('react-pos', data.id);

            //Update Index
            const indexEle = template.querySelector(this.vars.index);
            indexEle.textContent = data.position;

            // Update Page Number
            template.querySelector(this.vars.page).textContent = data.pageNumber;
            // Update the color
            if (data.color && template.classList.contains('bg-green')) {
                template.classList.replace('bg-green', data.color);
                template.setAttribute(this.vars.bgAttr, data.color);
                const colorOption = template.querySelector(this.vars.colorOpt);
                colorOption.classList.replace('bg-green', data.color);
                colorOption.setAttribute(this.vars.bgAttr, data.color);
            }

            //Update Scene goal and Emotional Value
            const sceneGoal = template.querySelector(this.vars.sceneGoal);
            const emotionalValue = template.querySelector(this.vars.ev);
            const draftKey = window.ScriptAdapter.currentDraftKey;
            const dataset = window.ScriptDataStore.draft[draftKey].data[data.sbID];
            if (dataset && dataset?.others?.ev) {
                emotionalValue.textContent = dataset.others.ev;
                sceneGoal.innerText = dataset.others.scenegoal;
            } else {
                window.ScriptDataStore.draft[draftKey].data[data.sbID] = {
                    id: data.sbID, content: data.name, type: 'scene-heading',  
                    color: data.color, others: {ev: '0', scenegoal: ''},
                    note:{text:'', authorID: '', authorName: '', date: '', color: ''}, 
                }
            }

            //Update scenes List
            const sceneWrapper = template.querySelector(this.vars.sceneList);
            /**new scene heading template*/
            const sceneItemTitle = sceneWrapper.querySelector(this.vars.sceneItemTitle).cloneNode(true);
            /**new scene item template*/
            const sceneItem = sceneWrapper.querySelector(this.vars.sceneItem).cloneNode(true);

            //Remove dummy scene template
            [...sceneWrapper.children].forEach(sh => sh.remove());

            //Update and Append scene heading
            sceneItemTitle.textContent = data.name;
            sceneItemTitle.setAttribute(this.rpAttr, data.id);
            sceneItemTitle.setAttribute(this.vars.idAttrName, data.sbID); // Set script body id

            sceneWrapper.append(sceneItemTitle);

            // Render and Update scene item
            data.scenes.forEach((scene) => {
                const otherSceneItem = sceneItem.cloneNode(true);
                otherSceneItem.textContent = scene.content.innerText;
                otherSceneItem.setAttribute(this.rpAttr, scene.id); // Set map react id
                otherSceneItem.setAttribute(this.vars.idAttrName, scene.sbID); // Set script body id
                //Append to Scene Wrapper
                sceneWrapper.append(otherSceneItem);
            });

            //Append character template to List wrapper
            this.mainOutlineListTemp.append(template);
        }

        if (2) {
            const template = this.rsOutlineItemTemp.cloneNode(true);
            if (data.color && template.firstElementChild.classList.contains('bg-blue'))
                template.firstElementChild.classList.replace('bg-blue', data.color);
            // update the template id
            template.setAttribute(this.vars.rsIdAttrName, data.sbID)
            //Update title
            const title = template.querySelector(this.vars.rsTitle);
            title.textContent = data.name;
            title.setAttribute('react-pos', data.id);

            //Update other scene
            const rsOutlineList = template.querySelector(this.vars.rsList);
            const rsOutlineItem = template.querySelector(this.vars.rsItem).cloneNode(true);
            //Remove dummy template
            [...rsOutlineList.children].forEach(itm => itm.remove());

            // Render scene headings
            data.scenes.forEach((scene) => {
                //Update other type of scene
                const newRsOutlineItem = rsOutlineItem.cloneNode(true);
                newRsOutlineItem.textContent = scene.content.innerText;
                newRsOutlineItem.setAttribute('react-pos', scene.id);

                //Append to Scene Wrapper
                rsOutlineList.append(newRsOutlineItem);
            });

            //Append
            this.rsOutlineListTemp.append(template);
        }

        // Enable outLine functionality
        this.setUp(currentItemTemplate);
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.OutlineHandle = new OutlineHandle();
})
