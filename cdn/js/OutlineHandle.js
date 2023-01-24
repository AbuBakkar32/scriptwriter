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
    storeName = [];
    count = 1;
    index = 1;

    constructor() {
        this.vars = {
            editorID: `[sw-editor-id="%s"]`,
            mainMrList: `[${this.mrAttrName}="outline-list"]`,
            mainMrItem: `[${this.mrAttrName}="outline-item"]`,
            rsMrList: `[${this.mrAttrName}="rs-outline-list"]`,
            rsMrItem: `[${this.mrAttrName}="rs-outline-item"]`,
            rsTitle: `[${this.rsAttrName}="title"]`,
            rsList: `[${this.rsAttrName}="list"]`,
            rsItem: `[${this.rsAttrName}="item"]`,
            sceneList: `[${this.attrName}="scene-list"]`,
            sceneTitle: `[${this.attrName}="scene-title"]`,
            index: `[${this.attrName}="index"]`,
            sceneGoal: `[${this.attrName}="scene-goal"]`,
            ev: `[${this.attrName}="emotional-value"]`,
            page: `[${this.attrName}="page"]`,
            sceneItemTitle: `[${this.attrName}="scene-item-title"]`,
            sceneItem: `[${this.attrName}="scene-item"]`,
            menu: `[${this.attrName}="menu"]`,
            commentOpt: `[${this.attrName}="comment-option"]`,
            addOpt: `[${this.attrName}="add-option"]`,
            deleteOpt: `[${this.attrName}="delete-option"]`,
            colorOpt: `[${this.attrName}="color-option"]`,
            colorWrap: `[${this.attrName}="color-wrap"]`,
            bgValue: `[bg-value="%s"]`,
            bgAttr: `bg-value`,
            idAttrName: 'outline-data-id',
            hideBtn: `[${this.attrName}="hide-content-btn"]`,
            contentLineID: `[sw-script-body-idvalue="%s"]`,
            rsIdAttrName: `rs-outline-id`,
            rsIdAttr: `[rs-outline-id="%s"]`,
            content: `[${this.attrName}="content"]`,
            add: `[${this.attrName}="add"]`,
            lock: `[${this.attrName}="lock"]`,
            unlock: `[${this.attrName}="unlock"]`,
        };

        this.rsOutlineListTemp = document.querySelector(this.vars.rsMrList);
        this.rsOutlineItemTemp = document.querySelector(this.vars.rsMrItem).cloneNode(true);

        this.mainOutlineListTemp = document.querySelector(this.vars.mainMrList);
        this.mainOutlineItemTemp = document.querySelector(this.vars.mainMrItem).cloneNode(true);

        //Remove all template
        [...this.rsOutlineListTemp.children].forEach((el) => {
            el.remove()
        });
        [...this.mainOutlineListTemp.children].forEach((el) => {
            el.remove()
        });

        setTimeout(() => {
            if (window.ScriptAdapter.scriptDataStore.draft[window.ScriptAdapter.currentDraftKey].lock === 'True') {
                this.lockOutline();
            }
        }, 100)

        //Add event listener
        const unlockBtn = document.querySelector(this.vars.unlock)
        const lockBtn = document.querySelector(this.vars.lock)
        const addBtn = document.querySelector(this.vars.add)

        addBtn.addEventListener("click", () => {
            let data = document.querySelectorAll(this.vars.mainMrItem)
            this.add(data[data.length - 1]);
            ChangeAndSaveData(`[mapreact-data="outline-item"]`);
        });

        unlockBtn.addEventListener('click', () => {
            if (lockBtn?.classList.contains("hidden")) {
                lockBtn?.classList.remove("hidden");
                unlockBtn?.classList.add("hidden");
                addBtn?.classList.add("hidden");
                setTimeout(() => {
                    // Disable to edit any outline
                    document.querySelectorAll(this.vars.mainMrItem).forEach((el, index) => {
                        el.removeAttribute("draggable");
                        document.querySelectorAll(this.vars.sceneTitle)[index].setAttribute("contenteditable", "false");
                        document.querySelectorAll(this.vars.sceneGoal)[index].setAttribute("contenteditable", "false");
                        document.querySelectorAll(this.vars.ev)[index].setAttribute("contenteditable", "false");
                    });
                }, 100)
            } else {
                lockBtn?.classList.add("hidden");
                unlockBtn?.classList.remove("hidden");
                addBtn?.classList.remove("hidden");
            }
            window.ScriptAdapter.scriptDataStore.draft[window.ScriptAdapter.currentDraftKey]["lock"] = 'True';
            window.ScriptAdapter.autoSave();
        })

        lockBtn.addEventListener('click', () => {
            if (!lockBtn?.classList.contains("hidden")) {
                lockBtn?.classList.add("hidden");
                unlockBtn?.classList.remove("hidden");
                addBtn?.classList.remove("hidden")

                setTimeout(() => {
                    // Disable to edit any outline
                    document.querySelectorAll(this.vars.mainMrItem).forEach((el, index) => {
                        el.setAttribute("draggable", "true");
                        document.querySelectorAll(this.vars.sceneTitle)[index].setAttribute("contenteditable", "true");
                        document.querySelectorAll(this.vars.sceneGoal)[index].setAttribute("contenteditable", "true");
                        document.querySelectorAll(this.vars.ev)[index].setAttribute("contenteditable", "true");
                    });
                }, 100)
            }
            window.ScriptAdapter.scriptDataStore.draft[window.ScriptAdapter.currentDraftKey]["lock"] = 'False';
            window.ScriptAdapter.autoSave();
        })
    }

    lockOutline() {
        const unlockBtn = document.querySelector(this.vars.unlock)
        const lockBtn = document.querySelector(this.vars.lock)
        const addBtn = document.querySelector(this.vars.add)
        if (lockBtn?.classList.contains("hidden")) {
            lockBtn?.classList.remove("hidden");
            unlockBtn?.classList.add("hidden");
            addBtn?.classList.add("hidden");
        }
    }

    lockContent() {
        setTimeout(() => {
            if (window.ScriptAdapter.scriptDataStore.draft[window.ScriptAdapter.currentDraftKey].lock === 'True') {
                // Disable to edit any outline
                document.querySelectorAll(this.vars.mainMrItem).forEach((el, index) => {
                    el.removeAttribute("draggable");
                    document.querySelectorAll(this.vars.sceneTitle)[index]?.setAttribute("contenteditable", "false");
                    document.querySelectorAll(this.vars.sceneGoal)[index]?.setAttribute("contenteditable", "false");
                    document.querySelectorAll(this.vars.ev)[index]?.setAttribute("contenteditable", "false");
                });
            } else {
                document.querySelectorAll(this.vars.mainMrItem).forEach((el, index) => {
                    if (el.classList.contains('relative')) {
                        el.setAttribute("draggable", "true");
                        document.querySelectorAll(this.vars.sceneTitle)[index]?.setAttribute("contenteditable", "true");
                        document.querySelectorAll(this.vars.sceneGoal)[index]?.setAttribute("contenteditable", "true");
                        document.querySelectorAll(this.vars.ev)[index]?.setAttribute("contenteditable", "true");
                    }
                });
            }
        }, 100)
    }

    setUp(item = document.querySelector(this.vars.mainMrItem)) {
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
        const sceneTitle = item.querySelector(this.vars.sceneTitle);
        this.lockContent();
        /** Event Listeners on Outline Page Items*/
        hide?.addEventListener('click', () => {
            // Make menu visible
            if (menu?.classList.contains('hide')) {
                menu?.classList.remove('hide');
            } else {
                menu?.classList.add('hide');
            }
            // Hide other outline item menu
            document.querySelectorAll(this.vars.mainMrItem).forEach((x) => {
                if (x != item) {
                    const xMenu = x.querySelector(this.vars.menu);
                    if (!xMenu?.classList.contains('hide')) xMenu?.classList.add('hide');
                }
            });
        });

        item?.addEventListener('mousemove', () => {
            if (window.ScriptAdapter.scriptDataStore.draft[window.ScriptAdapter.currentDraftKey].lock === 'True') {
                hide?.classList.add('hide');
            } else {
                if (hide?.classList.contains('hide')) hide?.classList.remove('hide');
            }
        });

        item?.addEventListener('mouseout', () => {
            if (!hide?.classList.contains('hide')) hide?.classList.add('hide');
        });

        hide?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
        });

        colorWrap?.addEventListener('focusout', () => {
            if (!colorWrap?.classList.contains('hide')) colorWrap?.classList.add('hide');
        });

        colorWrap?.querySelectorAll(`[${this.vars.bgAttr}]`).forEach((color) => {
            if (color.getAttribute(this.vars.bgAttr)) {
                color.addEventListener('click', (e) => {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    // new color to set
                    const newColorValue = color.getAttribute(this.vars.bgAttr);
                    /**Set this new color value to the item, colorBtn and contentLine itself */
                    const itemColor = item.getAttribute(this.vars.bgAttr);

                    item.querySelectorAll(this.vars.bgValue.replace('%s', itemColor)).forEach((x) => {
                        if (x != color) {
                            x.classList.replace(itemColor, newColorValue);
                            x.setAttribute(this.vars.bgAttr, newColorValue);
                        }
                    });

                    item.classList.replace(itemColor, newColorValue);
                    item.setAttribute(this.vars.bgAttr, newColorValue);

                    // Navigate to the particular content line through the content line id and target the contentLine element
                    const line = document.querySelector(this.vars.editorID.replace('%s', sceneID));
                    line.setAttribute('sw-editor-color', newColorValue);

                    // make sure the color is saved
                    this.updateDB();
                    if (!colorWrap?.classList.contains('hide')) colorWrap?.classList.add('hide');
                });
            }
        });

        commentBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            alert('comment button in progress');
        });

        addBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.add(item);
        });

        deleteBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.delete(item);
        });

        colorBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            if (colorWrap?.classList.contains('hide')) colorWrap?.classList.remove('hide');
        });

        sceneTitle?.addEventListener('keyup', () => {
            this.updateDB();
        });

        emotionalValue?.addEventListener('keyup', () => {
            setTimeout(() => {
                if (parseInt(emotionalValue.textContent) > 10 || parseInt(emotionalValue.textContent) < -10) {
                    alert('Emotional Value must be between -10 and 10', 'Error');
                    emotionalValue.textContent = 0;
                } else {
                    ChangeAndSaveDataOutline(`[mapreact-data="outline-item"]`);
                    const draftKey = window.ScriptAdapter.currentDraftKey;
                    window.ScriptDataStore.draft[draftKey].data[sceneID].others.ev = emotionalValue.textContent;
                    window.ScriptDataStore.draft[draftKey].data[sceneID].others.scenegoal = sceneGoal.textContent;
                    this.updateDB();
                }
            }, 200);
        });

        sceneGoal?.addEventListener('keyup', () => {
            setTimeout(() => {
                ChangeAndSaveDataOutline(`[mapreact-data="outline-item"]`);
                const draftKey = window.ScriptAdapter.currentDraftKey;
                window.ScriptDataStore.draft[draftKey].data[sceneID].others.ev = emotionalValue.textContent;
                window.ScriptDataStore.draft[draftKey].data[sceneID].others.scenegoal = sceneGoal.textContent;
                this.updateDB();
            }, 200);
        });
    }

    updateCardList() {
        window.ScriptAdapter.scriptDataStore.outline = {};
        window.ScriptAdapter.autoSave();
        let listData = document.querySelectorAll(swData);
        let data = window.ScriptAdapter.scriptDataStore.outline;

        listData.forEach((card, index) => {
            let id = card?.querySelector(`[outline-data="index"]`)?.innerText ?? 0;
            let title = card?.querySelector(`[outline-data="scene-item-title"]`)?.innerText ?? card?.querySelector(`[outline-data="scene-title"]`)?.innerText ?? "";
            let goal = card?.querySelector(`[outline-data="scene-goal"]`)?.innerText ?? "";
            let emotional_value = card?.querySelector(`[outline-data="emotional-value"]`)?.innerText ?? 0;
            let page_no = card?.querySelector(`[outline-data="page"]`)?.innerText ?? 0;
            let bgColor = card?.getAttribute("bg-value") ?? "";
            let sbID = card?.querySelector(`[outline-data="scene-title"]`)?.getAttribute("react-sbid") ?? "";
            let scene = card?.querySelectorAll(`[outline-data="scene-item"]`)
            const sceneID = {};
            scene.forEach((item, index) => {
                const id = item?.getAttribute("outline-data-id");
                sceneID[id] = id;
            })

            let obj = {
                id: index,
                title: title,
                goal: goal,
                emotional_value: emotional_value,
                page_no: page_no,
                color: bgColor,
                sbID: sbID,
                sceneListId: sceneID
            }
            data[index] = obj;
        });
    }

    updateDB() {
        this.updateCardList();
        window.ScriptAdapter.autoSave();
    }

    add(item = document.querySelector(this.vars.mainMrItem)) {
        const ask = confirm(`Do you want to add a new Scene?`);
        if (!ask) return;
        window.Watcher.mainPageAwait();
        setTimeout(() => {
            const addOutlinePromise = new Promise((resolve, reject) => {
                resolve(1)
            });
            addOutlinePromise.then(() => {
                const contentLineID = item?.querySelector(this.vars?.sceneItemTitle).getAttribute(this.vars?.idAttrName);
                const sceneList = item?.querySelector(this.vars?.sceneList);
                // get the content line id of the last Line
                const lastLineElement = sceneList?.lastElementChild;
                const lastLineID = lastLineElement?.getAttribute(this.vars?.idAttrName);
                // Get the content line element of the last line ID
                const lastLineContentElement = document.querySelector(this.vars?.editorID.replace('%s', lastLineID));
                // new scene heading content line
                const headingFunc = window.MapAndReactOnContent.sceneHeadingType;
                const sceneHeadingContentLine = window.EditorFuncs.createNewLine(lastLineContentElement, headingFunc, true, 'INT. New Scene ' + quickID());

                // new action content line
                const actionContentLine = window.EditorFuncs.createNewLine(sceneHeadingContentLine, (b) => {
                }, true, 'new action line ' + quickID());
                sceneHeadingContentLine.insertAdjacentElement('afterend', actionContentLine);
            }).then(() => {
                this.updateDB();
                enableDragSort('drag-sort-enable-outline');
                window.MapAndReactOnContent.mapreact();
                window.MapAndReactOnContent.mapContents();
            }).then(() => {
                window.Watcher.mainPageAwait(false);
                window.Watcher.conditionState();
                this.mainPageChanges = true;
            });
        });
    }

    delete(item = document.querySelector(this.vars.mainMrItem)) {
        const ask = confirm(`Do you want to delete this Scene?\nThis action is not revertable`);
        if (!ask) return;

        window.Watcher.mainPageAwait();
        setTimeout(() => {
            const deleteOutlinePromise = new Promise((resolve, reject) => {
                resolve(0)
            });
            deleteOutlinePromise.then(() => {
                const contentLineID = item.querySelector(this.vars.sceneItemTitle).getAttribute(this.vars.idAttrName);
                const sceneList = item.querySelector(this.vars.sceneList);
                // Get the list of contentLine ids
                let contentLineIDList = [];
                [...sceneList.children].forEach((line) => {
                    contentLineIDList.push(line.getAttribute(this.vars.idAttrName));
                });

                contentLineIDList.forEach((cid) => {
                    // Navigate to the particular content line through the content line id and target the contentLine element
                    const line = document.querySelector(this.vars.editorID.replace('%s', cid));
                    line.remove();
                    window.Watcher.removeLine(cid);
                });
                item.remove();
                document.querySelector(this.vars.rsIdAttr.replace('%s', contentLineID))?.remove();
            }).then(() => {
                this.updateDB();
                enableDragSort('drag-sort-enable-outline');
                window.MapAndReactOnContent.mapreact();
            }).then(() => {
                window.Watcher.mainPageAwait(false);
                window.Watcher.conditionState();
                this.mainPageChanges = true;
            });
        });
    }

    outlineHandle(contentStore) {
        // Clear template
        [...this.rsOutlineListTemp.children].forEach(el => {
            el.remove();
        });
        [...this.mainOutlineListTemp.children].forEach(el => {
            el.remove();
        });
        // Set new content store value
        this.contentStore = contentStore;
        let count = 0;
        let saveData = {};
        let listOfOutline = [];
        this.count = 1;
        this.index = 1;
        const isExist = this.contentStore.some(item => item.type === 'scene-heading' || item.type === 'act');
        if (!isExist) {
            window.ScriptAdapter.scriptDataStore.outline = {};
            window.ScriptAdapter.autoSave();
        }
        try {
            saveData = Object.keys(window?.ScriptAdapter?.scriptDataStore?.outline).map(
                key => window?.ScriptAdapter?.scriptDataStore?.outline[key]
            );
            this.storeName = saveData
                .map(item => item?.title?.toLowerCase())
                .filter(name => name);
        } catch (e) {
            saveData = {};
        }
        this.storeName = [...new Set(this.storeName)];
        this.contentStore.forEach((item, index) => {
            let draftKey = window.ScriptAdapter.currentDraftKey;
            let dataset = window.ScriptDataStore.draft[draftKey].data[item.sbID]
            if (item.type === 'scene-heading' || item.type === 'act') {
                count += 1;
                const otherSceneType = [];
                if (!this.storeName.includes(item.content.innerText.toLowerCase())) {
                    // get all the content before the first scene heading
                    const name = item?.content.innerText;
                    const id = item?.id;
                    const color = item?.color;
                    const scriptBodyID = item?.sbID;
                    const pageNumber = item?.pageNumber;
                    const scene_goal = dataset?.others?.scenegoal ? dataset?.others?.scenegoal : '';
                    const evaluation_value = dataset?.others?.ev ? dataset?.others?.ev : 0;

                    //Get all other scene type that is under this scene heading
                    for (let i = index + 1; i < this.contentStore.length; i++) {
                        const tem = this.contentStore[i];
                        if (tem.type === 'scene-heading' || tem.type === 'act') break; else otherSceneType.push(tem);
                    }
                    // Append outline
                    listOfOutline.push({
                        name: name,
                        id: id,
                        position: count,
                        scenes: otherSceneType,
                        color: color,
                        sbID: scriptBodyID,
                        pageNumber: pageNumber,
                        type: item.type,
                        index: count - 1,
                        scene_goal: scene_goal,
                        evaluation_value: evaluation_value,
                    });
                } else {
                    const name = item?.content.innerText;
                    const id = item?.id;
                    const color = saveData[count - 1]?.color;
                    const scriptBodyID = saveData[count - 1]?.sbID;
                    const pageNumber = saveData[count - 1]?.page_no;
                    const scene_goal = saveData[count - 1]?.goal;
                    const evaluation_value = saveData[count - 1]?.emotional_value;
                    for (let i = index + 1; i < this.contentStore.length; i++) {
                        const tem = this.contentStore[i];
                        if (tem.type === 'scene-heading' || tem.type === 'act') break; else otherSceneType.push(tem);
                    }

                    // Append outline
                    listOfOutline.push({
                        name: name,
                        id: id,
                        position: count,
                        scenes: otherSceneType,
                        color: color,
                        sbID: scriptBodyID,
                        pageNumber: pageNumber,
                        type: item.type,
                        index: count - 1,
                        scene_goal: scene_goal,
                        evaluation_value: evaluation_value,
                    });
                }
            }
        });
        listOfOutline.forEach(outline => this.outlineRenderTemplate(outline));
    }

    outlineRenderTemplate(data) {
        // current main page outLine item template
        let currentItemTemplate;
        if (1) {
            const template = this.mainOutlineItemTemp.cloneNode(true);
            currentItemTemplate = template;
            if (data.type !== 'scene-heading') {
                template.remove();
                const div = document.createElement('div');
                div.setAttribute('react-pos', data?.id);
                div.setAttribute('react-sbid', data?.sbID);
                div.setAttribute('mapreact-data', "outline-item");
                div.setAttribute('type', 'act');
                div.setAttribute('bg-value', data?.color);
                div.classList.add('act-name');
                div.style.fontSize = '16px';
                div.style.fontWeight = 'bold';
                div.style.marginLeft = '10px';
                if (this.count === 1) {
                    div.style.marginTop = '10px'
                } else {
                    div.style.marginTop = '60px'
                }
                this.count += 1;
                div.innerHTML = data?.name.toUpperCase();
                this.mainOutlineListTemp.appendChild(div);
                // Add outline scene Title div
                const outlineSceneTitle = document.createElement('div');
                outlineSceneTitle.setAttribute('outline-data', "scene-title");
                outlineSceneTitle.setAttribute('react-sbid', data?.sbID);
                outlineSceneTitle.classList.add('hide');
                div.append(outlineSceneTitle);

                // Add outline goal div
                const outlineGoal = document.createElement('div');
                outlineGoal.setAttribute('outline-data', "scene-goal");
                outlineGoal.classList.add('hide');
                outlineGoal.innerText = data?.scene_goal;
                div.append(outlineGoal);

                // Add outline emotional value div
                const outlineEmotionalValue = document.createElement('div');
                outlineEmotionalValue.setAttribute('outline-data', "emotional-value");
                outlineEmotionalValue.classList.add('hide');
                outlineEmotionalValue.innerText = data?.evaluation_value;
                div.append(outlineEmotionalValue);

                // Add outline page section
                const page = document.createElement('div');
                page.setAttribute('outline-data', "page");
                page.classList.add('hide');
                page.innerText = data.pageNumber;
                div.append(page);

                // Add outline data index div
                const outlineDataIndex = document.createElement('div');
                outlineDataIndex.setAttribute('outline-data', "index");
                outlineDataIndex.classList.add('hide');
                div.append(outlineDataIndex);

                // Add Scene List
                const sceneList = document.createElement('div');
                sceneList.classList.add('hide');
                sceneList.setAttribute('outline-data', "scene-list");
                div.append(sceneList);

                // add scene-item-title div element
                const sceneItemTitle = document.createElement('div');
                sceneItemTitle.setAttribute('outline-data', "scene-item-title");
                sceneItemTitle.classList.add('hide');
                sceneItemTitle.innerText = data?.name?.toUpperCase();
                sceneList.append(sceneItemTitle);

                // Render and Update scene item
                data?.scenes.forEach((scene) => {
                    const div = document.createElement('div');
                    div.setAttribute('outline-data', "scene-item");
                    div.textContent = scene.content.innerText;
                    div.setAttribute(this.rpAttr, scene.id); // Set map react id
                    div.setAttribute(this.vars.idAttrName, scene.sbID); // Set script body id
                    //Append to Scene Wrapper
                    sceneList.append(div);
                });
            } else {
                //Update title
                const title = template.querySelector(this.vars.sceneTitle);
                title.textContent = data?.name?.toUpperCase();
                title.setAttribute('react-pos', data?.id);
                title.setAttribute('react-sbid', data?.sbID);

                //Update Index
                const indexEle = template.querySelector(this.vars.index);
                indexEle.textContent = this.index;
                this.index += 1;

                // Update Page Number
                template.querySelector(this.vars.page).textContent = data?.pageNumber;
                // Update the color
                if (data?.color && template.classList.contains('bg-green')) {
                    template.classList.replace('bg-green', data?.color);
                    template.setAttribute(this.vars.bgAttr, data?.color);
                    const colorOption = template.querySelector(this.vars.colorOpt);
                    colorOption.classList.replace('bg-green', data?.color);
                    colorOption.setAttribute(this.vars.bgAttr, data?.color);
                }

                //Update Scene goal and Emotional Value
                const sceneGoal = template.querySelector(this.vars.sceneGoal);
                const emotionalValue = template.querySelector(this.vars.ev);
                const draftKey = window.ScriptAdapter.currentDraftKey;
                if (data?.scene_goal || data?.evaluation_value) {
                    emotionalValue.innerText = data?.evaluation_value;
                    sceneGoal.innerText = data?.scene_goal;
                } else {
                    window.ScriptDataStore.draft[draftKey].data[data?.sbID] = {
                        id: data?.sbID,
                        content: data?.name.toUpperCase(),
                        type: data?.type,
                        color: data?.color,
                        unique_key: data?.position,
                        others: {ev: '0', scenegoal: ''},
                        note: {text: '', authorID: '', authorName: '', date: '', color: ''},
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
                sceneItemTitle.textContent = data?.name.toUpperCase();
                sceneItemTitle.setAttribute(this.rpAttr, data?.id);
                sceneItemTitle.setAttribute(this.vars.idAttrName, data?.sbID); // Set script body id

                sceneWrapper.append(sceneItemTitle);
                // Render and Update scene item
                data?.scenes.forEach((scene) => {
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
        }

        if (2) {
            if (data.type === 'scene-heading') {
                const template = this.rsOutlineItemTemp.cloneNode(true);
                if (data?.color && template.firstElementChild.classList.contains('bg-blue')) template.firstElementChild.classList.replace('bg-blue', data?.color);
                // update the template id
                template.setAttribute(this.vars.rsIdAttrName, data?.sbID)
                //Update title
                const title = template.querySelector(this.vars.rsTitle);
                title.textContent = data?.name?.toUpperCase();
                title.setAttribute('react-pos', data?.id);
                title.setAttribute('react-sbid', data?.sbID);

                //Update other scene
                const rsOutlineList = template.querySelector(this.vars.rsList);
                const rsOutlineItem = template.querySelector(this.vars.rsItem).cloneNode(true);
                //Remove dummy template
                [...rsOutlineList.children].forEach(itm => itm.remove());

                // Render scene headings
                data?.scenes.forEach((scene) => {
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
        }
        // Enable outLine functionality
        this.setUp(currentItemTemplate);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.OutlineHandle = new OutlineHandle();
});