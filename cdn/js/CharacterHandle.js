class CharacterHandle {
    /**Attribute Name*/
    attrName = `character-data`;
    /**Map and react Arrtibute Name*/
    mrAttrName = `mapreact-data`;
    /**Right side bar character Attribute name*/
    rsAttrName = `rs-character`;
    /**React Position Attribute Name*/
    rpAttr = `react-pos`;
    /** Constant */
    vars;
    /** Right Side Bar Character List Wrapper Template */
    rsCharacterListTemp;
    /** Right Side Bar Character Item Wrapper Template */
    rsCharacterItemTemp;
    /** main charater page, List Character Wrapper Template */
    mainCharacterListTemp;
    /** main charater page, Item Character Wrapper Template */
    mainCharacterItemTemp;
    /**List of content Line will be assigned to this store*/
    contentStore = [];
    /** Image change Indicator */
    imageChangeIndicator = false;

    constructor() {
        // mr means mapreact
        this.vars = {
            mainMrList: `[${this.mrAttrName}="character-list"]`,
            mainMrItem: `[${this.mrAttrName}="character-item"]`,
            rsMrList: `[${this.mrAttrName}="rs-character-list"]`,
            rsMrItem: `[${this.mrAttrName}="rs-character-item"]`,
            createBtn: `[${this.attrName}="create-btn"]`,
            autoCreateBtn: `[${this.attrName}="auto-create-btn"]`,
            hideContentBtn: `[${this.attrName}="hide-content-btn"]`,
            image: `[${this.attrName}="image"]`,
            name: `[${this.attrName}="name"]`,
            archetype: `[${this.attrName}="archetype"]`,
            lineWidth: `[${this.attrName}="line-width"]`,
            possession: `[${this.attrName}="possession"]`,
            need: `[${this.attrName}="need"]`,
            trait: `[${this.attrName}="trait"]`,
            content: `[${this.attrName}="content"]`,
            age: `[${this.attrName}="age"]`,
            gender: `[${this.attrName}="gender"]`,
            interest: `[${this.attrName}="interest"]`,
            occupation: `[${this.attrName}="occupation"]`,
            index: `[${this.attrName}="index"]`,
            mockBodyMapList: `[${this.attrName}="mock-body-map-list"]`,
            mockBodyMapItem: `[${this.attrName}="mock-body-map-item"]`,
            openBodyMapBtn: `[${this.attrName}="open-body-map-btn"]`,
            want: `[${this.attrName}="want"]`,
            obstacle: `[${this.attrName}="obstacle"]`,
            resolvingObstacle: `[${this.attrName}="resolving-obstacle"]`,
            synopsis: `[${this.attrName}="synopsis"]`,
            sceneList: `[${this.attrName}="scene-list"]`,
            sceneItem: `[${this.attrName}="scene-item"]`,
            sceneItemIndex: `[${this.attrName}="scene-item-index"]`,
            sceneItemTitle: `[${this.attrName}="scene-item-title"]`,
            sceneItemPageNo: `[${this.attrName}="scene-item-page-no"]`,
            fillBodyMapBtn: `[${this.attrName}="fill-body-map-btn"]`,
            hideBodyMapBtn: `[${this.attrName}="hide-body-map-btn"]`,
            bodyMap: `[${this.attrName}="body-map"]`,
            bodyMapLeft: `[${this.attrName}="body-map-left"]`,
            bodyMapRight: `[${this.attrName}="body-map-right"]`,
            bodyMapCenter: `[${this.attrName}="body-map-center"]`,
            bodyMapItem: `[${this.attrName}="body-map-item"]`,
            id: `[${this.attrName}="id"]`,
            menu: `[${this.attrName}="menu"]`,
            commentOption: `[${this.attrName}="comment-option"]`,
            addOption: `[${this.attrName}="add-option"]`,
            deleteOption: `[${this.attrName}="delete-option"]`,
            rsImage: `[${this.rsAttrName}="image"]`,
            rsName: `[${this.rsAttrName}="name"]`,
            rsArchetype: `[${this.rsAttrName}="archetype"]`,
            rsWant: `[${this.rsAttrName}="want"]`,
            rsTrait: `[${this.rsAttrName}="trait"]`,
            rsBodyMapList: `[${this.rsAttrName}="body-map-list"]`,
            rsId: `[${this.rsAttrName}="id"]`,
            rsBodyMapItem: `[${this.rsAttrName}="body-map-item"]`,
            imageBtn: `[${this.attrName}="image-btn"]`,
        };
        setTimeout(() => {
            const characterList = document.querySelectorAll(this.vars.mainMrItem);
            let x = [];
            characterList.forEach((item, i) => {
                x.includes(item.querySelector(this.vars.name).innerHTML) ? 1 : x.push(item.querySelector(this.vars.name).innerHTML);
            });
            //console.log(x);
        }, 200);

        this.mainCharacterListTemp = document.querySelector(this.vars.mainMrList);
        this.mainCharacterItemTemp = document.querySelector(this.vars.mainMrItem).cloneNode(true);
        this.rsCharacterListTemp = document.querySelector(this.vars.rsMrList);
        this.rsCharacterItemTemp = document.querySelector(this.vars.rsMrItem).cloneNode(true);

        //Remove all template
        // [...this.rsCharacterListTemp.children].forEach((el) => {
        //     el.remove()
        // });
        // [...this.mainCharacterListTemp.children].forEach((el) => {
        //     el.remove()
        // });

        // Listener
        this.listener();
    }

    listener() {
        // Resize the All character maps
        //this.characterMapResize();
        // Event listener for windows resize
        window.onresize = () => {
            this.characterMapResize()
        };

        // General create character button
        const createCharacterBtn = document.querySelector(this.vars.createBtn);
        createCharacterBtn?.addEventListener('click', () => {
            // create on db
            const newCharacterID = this.create();
            const mapreactID = window.MapAndReactOnContent.geneateUniqueID();
            const pos = document.querySelectorAll(this.vars.mainMrItem).length + 1;
            const dataset = {
                name: newCharacterID.toUpperCase(),
                id: mapreactID,
                position: pos,
                scenes: [],
                cid: newCharacterID
            };
            this.characterRenderTemplate(dataset);
            //this.activateMapReact(mapreactID)
            window.ScriptAdapter.autoSave();
        });

        // General auto create character button
        const createCharacterAutoBtn = document.querySelector(this.vars.autoCreateBtn);
        createCharacterAutoBtn?.addEventListener('click', () => {
            // create on db
            const newCharacterID = this.create();
            // New name
            const newName = ('test' + newCharacterID).toUpperCase();
            //Update name in web db
            window.ScriptDataStore.character[newCharacterID].name = newName;

            const mapreactID = window.MapAndReactOnContent.geneateUniqueID();
            const pos = document.querySelectorAll(this.vars.mainMrItem).length + 1;
            const dataset = {name: newName, id: mapreactID, position: pos, scenes: [], cid: newCharacterID};
            this.characterRenderTemplate(dataset);
            //this.activateMapReact(mapreactID)
            window.ScriptAdapter.autoSave();
        });

        //Load already existing Characters first
        const ids = Object.keys(window.ScriptDataStore.character);
        ids.forEach((i) => {
            const character = window.ScriptDataStore.character[i];
            const mapreactID = Math.random().toString(36).substr(2);
            const pos = document.querySelectorAll(this.vars.mainMrItem).length + 1;
            const dataset = {name: character.name, id: mapreactID, position: pos, scenes: [], cid: character.id};
            this.characterRenderTemplate(dataset);
            //this.activateMapReact(mapreactID);
        });

    }

    quickID() {
        return Math.random().toString(36).substring(2)
    }

    activateMapReact(mapreactID = '', isImage = false) {
        if (!mapreactID) return;
        const allReacters = document.querySelectorAll(`[react-pos="${mapreactID}"]`);

        // Get the character id
        let characterID = '';
        for (let index = 0; index < allReacters.length; index++) {
            const ele = allReacters[index];
            const item = ele.closest(this.vars.mainMrItem);
            if (item) {
                const cidEle = item.querySelector(this.vars.id);
                characterID = cidEle.textContent;
                break;
            }
        }

        if (!isImage) {
            allReacters.forEach((el) => {
                el.addEventListener('input', () => {
                    allReacters.forEach((it) => {
                        if (el != it) {
                            it.innerText = el.innerText.toUpperCase();
                        }
                    });
                    // Update the charater in the web DB
                    this.update(characterID);
                });
            });
        } else {
            allReacters.forEach((el) => {
                // Callback function to execute when mutations are observed
                const callback = (mutationsList, observer) => {
                    // Use traditional 'for loops' for IE 11
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'attributes') {
                            if (mutation.attributeName === 'src') {
                                if (this.imageChangeIndicator) {
                                    //const modifElement = mutation.target;
                                    this.imageChangeIndicator = false;
                                    const imageUrl = window.ScriptDataStore.character[characterID].image;
                                    allReacters.forEach((it) => {
                                        if (el !== it) it.src = imageUrl;
                                    });
                                    // Update the charater in the web DB
                                    this.update(characterID);
                                }
                            }
                        }
                    }
                }
                const observer = new MutationObserver(callback);
                observer.observe(el, {attributes: true});
            });
        }
    }

    setUp(item = document.querySelector(this.vars.mainMrItem)) {
        const hideContentBtn = item.querySelector(this.vars.hideContentBtn);
        const openBodyMapBtn = item.querySelector(this.vars.openBodyMapBtn);
        const fillBodyMapBtn = item.querySelector(this.vars.fillBodyMapBtn);
        const hideBodyMapBtn = item.querySelector(this.vars.hideBodyMapBtn);
        const bodyMap = item.querySelector(this.vars.bodyMap);
        const menu = item.querySelector(this.vars.menu);
        const commentOptionBtn = item.querySelector(this.vars.commentOption);
        const addOptionBtn = item.querySelector(this.vars.addOption);
        const deleteOptionBtn = item.querySelector(this.vars.deleteOption);
        const cid = item.querySelector(this.vars.id)?.textContent;
        const characterMainContent = item.querySelector(this.vars.content);
        const imageBtn = item.querySelector(this.vars.imageBtn);
        const imageAll = item.querySelectorAll(this.vars.image);
        const rsImage = this.rsCharacterListTemp.querySelector(`[rs-character-id="${cid}"]`)?.closest(
            this.vars.rsMrItem)?.querySelector(this.vars.rsImage);

        /** Event Listeners for charater on Main Character Page */
        item?.addEventListener('click', () => {
            if (bodyMap) {
                if (bodyMap?.classList.contains('hide')) characterMainContent?.classList.remove('hide');
            } else characterMainContent?.classList.remove('hide');
            // Make menu visible
            menu?.classList.remove('hide');
            // Hide other character menus
            document.querySelectorAll(this.vars.mainMrItem).forEach((x) => {
                if (x != item) {
                    const xMenu = x.querySelector(this.vars.menu);
                    xMenu?.classList.add('hide');
                }
            });
        });
        item?.addEventListener('mousemove', () => {
            hideContentBtn?.classList.remove('hide');
        });
        item?.addEventListener('mouseout', () => {
            hideContentBtn?.classList.add('hide');
        });
        item?.addEventListener('keyup', () => {
            if (cid) setTimeout(() => {
                this.update(cid)
            }, 20);
        });

        /** Event Listener for closing the main charater content */
        hideContentBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            characterMainContent?.classList.add('hide');
        });

        /** Event Listener for opening body map  */
        openBodyMapBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            characterMainContent?.classList.add('hide');
            bodyMap?.classList.remove('hide');
            this.characterMapResize();
        });

        /** Event Listener for closing body map  */
        hideBodyMapBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            characterMainContent?.classList.remove('hide');
            bodyMap?.classList.add('hide');
        });

        /** Event Listener for filling details in the character body map */
        fillBodyMapBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            alert('work in progress for filling random data');
        });

        commentOptionBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            alert('work in progress in adding comment or whatever')
        });

        addOptionBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.add(cid)
        });

        deleteOptionBtn?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.delete(item);
        });

        /** Image Listener and Upload image */
        imageAll.forEach((img) => {
            img?.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                imageBtn.click();
            });
        });
        imageBtn?.addEventListener('change', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.uploadImage(item);
        });

        /** Right Side Bar image icon click */
        rsImage?.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            imageBtn.click();
        })
    }

    uploadImage(item = document.querySelector(this.vars.mainMrItem)) {
        const cid = item.querySelector(this.vars.id)?.textContent;
        const imageBtn = item.querySelector(this.vars.imageBtn);
        const image = item.querySelector(this.vars.image);
        if (!imageBtn.files.length) return;
        // get crsf token
        const crsftokenValue = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;
        // create form and supply the inputs
        const formData = new FormData();
        formData.append('img', imageBtn.files[0]);
        formData.append('csrfmiddlewaretoken', crsftokenValue);

        // Send the data to store
        fetch(location.origin + '/script/image', {method: 'POST', body: formData,})
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Ensure image url is allowed to be add to src
                    this.imageChangeIndicator = true;
                    // Add the image url to web db
                    window.ScriptDataStore.character[cid].image = data.message;
                    // Add the image url to the main image element
                    image.src = data.message
                    // clear image Btn values
                    imageBtn.value = "";
                } else alert(data.message);
            }).catch((error) => {
            console.log('Error:', error);
        });
    }

    generateID() {
        let id = '0';
        const lastCharacter = this.mainCharacterListTemp.lastElementChild;
        if (lastCharacter) {
            const xid = lastCharacter.querySelector(this.vars.id).textContent;
            id += String(Number(xid.substr(1)) + 1);
        } else id += '0';

        const scriptIDList = [];
        document.querySelectorAll(this.vars.id).forEach((i) => {
            scriptIDList.push(i.textContent);
        });
        let count = 1;

        while (true) {
            count += 1;
            if (scriptIDList.includes(id)) {
                id = '0';
                if (lastCharacter) {
                    const xid = lastCharacter.querySelector(this.vars.id).textContent;
                    id += String(Number(xid.substr(1)) + count);
                } else id += String(count);
            } else break;
        }
        return id;
    }


    possession(name) {
        // all character meta-type content line
        const metaTypeCharacterList = document.querySelectorAll(`[sw-editor-type="character"]`);
        let count = 0;
        metaTypeCharacterList.forEach((line) => {
            const lineText = line.innerText;
            if (lineText.toLowerCase() === name.toLowerCase()) count += 1;
        });
        // Possession will be
        const pos = (count / metaTypeCharacterList.length * 100).toFixed(0);
        if (count) return pos + '%';
        else return '0%';
    }

    create(name = '') {
        const uid = this.generateID();
        window.ScriptDataStore.character[uid] = {
            id: uid,
            name: name || uid,
            archetype: '',
            possession: '0%',
            need: '',
            want: '',
            obstacle: '',
            resolvingObstacle: '',
            synopsis: '',
            trait: '',
            occupation: '',
            color: window.BackgroundColor.randomBg(),
            image: '',
            age: '',
            gender: '',
            interest: '',
            item1: 'nill',
            item2: 'nill',
            item3: 'nill',
            item4: 'nill',
            item5: 'nill',
            item6: 'nill',
            item7: 'nill',
            item8: 'nill',
            item9: 'nill',
            item10: 'nill',
            item11: 'nill',
            item12: 'nill',
            item13: 'nill',
            item14: 'nill',
        }

        return uid;
    }

    update(uid, isAddId = '') {
        if (!window.ScriptDataStore.character[uid]) return;
        let idValue;
        if (isAddId) idValue = document.querySelector(`[character-idvalue="${isAddId}"]`);
        else idValue = document.querySelector(`[character-idvalue="${uid}"]`);

        if (!idValue) return;
        // Now target the particular main character item element
        const character = idValue.closest(this.vars.mainMrItem);
        if (!character) return;
        // List of character Properties or item
        const itemList = character.querySelectorAll(this.vars.bodyMapItem);
        //window.ScriptDataStore.character[uid].id = uid;
        if (!isAddId) window.ScriptDataStore.character[uid].name = character.querySelector(this.vars.name)?.innerText || '';
        window.ScriptDataStore.character[uid].archetype = character.querySelector(this.vars.archetype)?.innerText || '';
        if (!isAddId) window.ScriptDataStore.character[uid].possession = character.querySelector(this.vars.possession)?.innerText || '0%';
        window.ScriptDataStore.character[uid].need = character.querySelector(this.vars.need)?.innerText || '';
        window.ScriptDataStore.character[uid].want = character.querySelector(this.vars.want)?.innerText || '';
        window.ScriptDataStore.character[uid].obstacles = character.querySelector(this.vars.obstacle)?.innerText || '';
        window.ScriptDataStore.character[uid].resolvingObstacle = character.querySelector(this.vars.resolvingObstacle)?.innerText || '';
        window.ScriptDataStore.character[uid].synopsis = character.querySelector(this.vars.synopsis)?.innerText || '';
        window.ScriptDataStore.character[uid].trait = character.querySelector(this.vars.trait)?.innerText || '';
        window.ScriptDataStore.character[uid].occupation = character.querySelector(this.vars.occupation)?.innerText || '';
        //window.ScriptDataStore.character[uid].color = window.BackgroundColor.randomBg();
        if (!isAddId) window.ScriptDataStore.character[uid].image = character.querySelector(this.vars.image).src || '';
        window.ScriptDataStore.character[uid].age = character.querySelector(this.vars.age)?.innerText || '';
        window.ScriptDataStore.character[uid].gender = character.querySelector(this.vars.gender)?.innerText || '';
        window.ScriptDataStore.character[uid].interest = character.querySelector(this.vars.interest)?.innerText || '';
        window.ScriptDataStore.character[uid].item1 = itemList[0]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item2 = itemList[1]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item3 = itemList[2]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item4 = itemList[3]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item5 = itemList[4]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item6 = itemList[5]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item7 = itemList[6]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item8 = itemList[7]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item9 = itemList[8]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item10 = itemList[9]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item11 = itemList[10]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item12 = itemList[11]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item13 = itemList[12]?.querySelector('div')?.innerText || 'nill';
        window.ScriptDataStore.character[uid].item14 = itemList[13]?.querySelector('div')?.innerText || 'nill';
        // Automatically save the script data.
        window.ScriptAdapter.autoSave();
    }

    delete(item = document.querySelector(this.vars.mainMrItem)) {
        const ask = confirm(`Do you want to delete this character. 
        By deleting this character you agree to remove it from all scenes permanetly.`);
        if (!ask) return;

        const uid = item.querySelector(this.vars.id)?.textContent;

        if (window.ScriptDataStore.character[uid]) delete window.ScriptDataStore.character[uid];

        const contentLineWithId = document.querySelectorAll(`[sw-editor-character-id="${uid}"]`);
        contentLineWithId.forEach((xter) => {
            xter?.remove();
        });

        item.remove();

        document.querySelector(`[rs-character-id="${uid}"]`)?.closest(this.vars.rsMrItem)?.remove()

        // Automatically save the script data.
        window.ScriptAdapter.autoSave();
    }

    add(uid) {
        if (!window.ScriptDataStore.character[uid]) return;
        const idValue = document.querySelector(`[character-idvalue="${uid}"]`);
        if (!idValue) return;
        // Now target the particular main character item element
        const character = idValue.closest(this.vars.mainMrItem);
        if (!character) return;
        // List of character Properties or item
        const itemList = character.querySelectorAll(this.vars.bodyMapItem);

        // create new character and fill the details with the previous character details
        const newCharacterID = this.create();
        this.update(newCharacterID, uid);
        const mapreactID = window.MapAndReactOnContent.geneateUniqueID();
        const pos = document.querySelectorAll(this.vars.mainMrItem).length + 1;
        const dataset = {name: newCharacterID, id: mapreactID, position: pos, scenes: [], cid: newCharacterID};
        this.characterRenderTemplate(dataset);
        //this.activateMapReact(mapreactID)
    }

    characterMapResize() {
        // Character Body
        const mainWrapList = document.querySelectorAll(this.vars.bodyMap);
        mainWrapList.forEach((mainWrap) => {
            // get the charater body left wrapper
            const leftWrap = mainWrap.querySelector(this.vars.bodyMapLeft);
            // get the charater body right wrapper
            const rightWrap = mainWrap.querySelector(this.vars.bodyMapRight);
            // get the charater body center wrapper (containing image)
            const centertWrap = mainWrap.querySelector(this.vars.bodyMapCenter);
            // get current width and height of center wrap to determine item positioning
            const height = centertWrap.getBoundingClientRect().height;
            const width = centertWrap.getBoundingClientRect().width;
            // Get the character body items. (its 14)
            const bodyItems = mainWrap.querySelectorAll(this.vars.bodyMapItem);
            bodyItems.forEach((item) => {
                const line = item.querySelector('span');
                const text = item.querySelector('div');
                const index = getEleId(item, bodyItems) + 1;
                if (index === 1) {
                    item.style.top = (height / 20) - 10 + 'px';
                    line.style.width = (width * 1.15) + 'px';
                    line.style.transform = `translateX(${(width / 4) * 1.15}px)`
                } else if (index === 2) {
                    item.style.top = (height / 20) * 2.8 + 'px';
                    line.style.width = (width * 1.15) + 'px';
                    line.style.transform = `translateX(${(width / 4) * 1.15}px)`
                } else if (index === 3) {
                    item.style.top = (height / 20) * 5.5 + 'px';
                    line.style.width = (width + 15) + 'px';
                    line.style.transform = `translateX(${(width / 4) + 15}px)`
                } else if (index === 4) {
                    item.style.top = (height / 20) * 7.5 + 'px';
                    line.style.width = width + 'px';
                    line.style.transform = `translateX(${(width / 4)}px)`
                } else if (index === 5) {
                    item.style.top = (height / 20) * 11 + 'px';
                    line.style.width = (width - 25) + 'px';
                    line.style.transform = `translateX(${(width / 4)}px)`
                } else if (index === 6) {
                    item.style.top = (height / 20) * 13.5 + 'px';
                    line.style.width = (width + 25) + 'px';
                    line.style.transform = `translateX(${(width / 4) + 15}px)`
                } else if (index === 7) {
                    item.style.top = (height / 20) * 16.5 + 'px';
                    line.style.width = (width + 25) + 'px';
                    line.style.transform = `translateX(${(width / 4) + 15}px)`
                } else if (index === 8) {
                    item.style.top = (height / 20) * 19 + 'px';
                    line.style.width = (width + 25) + 'px';
                    line.style.transform = `translateX(${(width / 4) + 15}px)`
                } else if (index === 9) {
                    item.style.top = (height / 20) + 10 + 'px';
                    line.style.width = (width / 2) - 5 + 'px';
                    line.style.transform = `translateX(-${(width / 2) - 25}px)`
                } else if (index === 10) {
                    item.style.top = (height / 20) * 3.6 + 'px';
                    line.style.width = (width / 2.3) - 5 + 'px';
                    line.style.transform = `translateX(-${(width / 2.3) - 25}px)`
                } else if (index === 11) {
                    item.style.top = (height / 20) * 7 + 'px';
                    line.style.width = (width / 2.7) - 5 + 'px';
                    line.style.transform = `translateX(-${(width / 2.7) - 25}px)`
                } else if (index === 12) {
                    item.style.top = (height / 20) * 12.5 + 'px';
                    line.style.width = (width / 2.3) - 5 + 'px';
                    line.style.transform = `translateX(-${(width / 2.3) - 25}px)`
                } else if (index === 13) {
                    item.style.top = (height / 20) * 15 + 'px';
                    line.style.width = (width / 2.35) - 5 + 'px';
                    line.style.transform = `translateX(-${(width / 2.35) - 25}px)`
                } else if (index === 14) {
                    item.style.top = (height / 20) * 17.5 + 'px';
                    line.style.width = (width / 2.4) - 5 + 'px';
                    line.style.transform = `translateX(-${(width / 2.4) - 25}px)`
                }
            })
        })
    }

    characterHandle(contenStore) {
        // Clear template
        [...this.rsCharacterListTemp.children].forEach((el) => {
            el.remove()
        });
        [...this.mainCharacterListTemp.children].forEach((el) => {
            el.remove()
        });

        // Set new content store value
        this.contentStore = contenStore;
        const listOfCharacter = [];
        // Get the character dataset keys
        let count = 1;
        const cKeys = Object.keys(window.ScriptDataStore.character);
        cKeys.forEach((key) => {
            const cdata = window.ScriptDataStore.character[key];

            let nameC = cdata.name;
            let idC = this.quickID();
            let posC = count;
            let characterIDC = cdata.id;
            //Get all scene heading that the character Name appear
            let characterAppearedScenes = [];

            // Match data in contentStore
            for (let index = 0; index < this.contentStore.length; index++) {
                const sdata = this.contentStore[index];
                if (sdata.type === 'character') {
                    if (sdata.cid === cdata.id) {
                        // Update the mapReact id;
                        idC = sdata.id;
                        this.contentStore.forEach((it) => {
                            if (it.type === 'scene-heading') {
                                for (let i = it.index + 1; i < this.contentStore.length; i++) {
                                    const tem = this.contentStore[i];
                                    if ((tem.type === 'character') && (nameC === tem.content.innerText)) {
                                        characterAppearedScenes.push(it);
                                        break;
                                    } else if (tem.type === 'scene-heading') break;
                                }
                            }
                        });
                        break;
                    }
                }
            }
            // Append character
            listOfCharacter.push({
                name: nameC,
                id: idC,
                position: posC,
                scenes: characterAppearedScenes,
                cid: characterIDC
            });

            count += 1;
        });

        // Render character data to template
        listOfCharacter.forEach(charater => this.characterRenderTemplate(charater));
    }

    lineValidator(line) {
        const lineText = line.innerText;
        const color = line.getAttribute('sw-editor-color');
        const isCharacterNameExist = this.checkStore(lineText);
        if (isCharacterNameExist.valid) { /*this means character name exist, 
            render the character id on the previous content-line */
            line.setAttribute('sw-editor-character-id', isCharacterNameExist.id);
        } else {
            // create new charater
            const newCharacterId = this.create(lineText);
            line.setAttribute('sw-editor-character-id', newCharacterId);
            // Update the Character store color
            window.ScriptDataStore.character[newCharacterId].color = color;
        }
    }

    characterRenderTemplate(data) {
        // data {name: name, id: id, position: pos, scenes: characterAppearedScenes, cid: characterID};
        //Get character possession
        const cPossession = this.possession(data.name);
        // Get character database data
        const cDB = window.ScriptDataStore.character[data.cid];
        // Update character new possession
        window.ScriptDataStore.character[data.cid].possession = cPossession;
        // Capture new mapreact ids for activation
        const mapReactIDList = {
            name: '',
            need: '',
            trait: '',
            want: '',
            image: '',
            archetype: '',
            item1: '',
            item2: '',
            item3: '',
            item4: '',
            item5: '',
            item6: '',
            item7: '',
            item8: '',
            item9: '',
            item10: '',
            item11: '',
            item12: '',
            item13: '',
            item14: ''
        };
        // current main page character item template
        let currentCharacterItemTemplate;
        if (1) {
            const template = this.mainCharacterItemTemp.cloneNode(true);
            currentCharacterItemTemplate = template;
            /** Update name element*/
            const nameElements = template.querySelectorAll(this.vars.name);
            nameElements.forEach((cname) => {
                cname.textContent = data.name;
                cname.setAttribute(this.rpAttr, data.id);
                mapReactIDList.name = data.id;
            });

            /** Update character need Element*/
            const needElements = template.querySelectorAll(this.vars.need);
            needElements.forEach((need) => {
                need.textContent = cDB.need;
                need.setAttribute(this.rpAttr, data.id + '1');
                mapReactIDList.need = data.id + '1';
            });

            /** Update character Archetype Element*/
            const archetype = template.querySelector(this.vars.archetype);
            if (archetype) {
                archetype.textContent = cDB.archetype;
                archetype.setAttribute(this.rpAttr, data.id + '2');
                mapReactIDList.archetype = data.id + '2'
            }
            ;

            /** Update character Trait Element*/
            const trait = template.querySelector(this.vars.trait);
            if (trait) {
                trait.textContent = cDB.trait;
                trait.setAttribute(this.rpAttr, data.id + '3');
                mapReactIDList.trait = data.id + '3';
            }
            ;

            /** Update character Image Element*/
            const imageElements = template.querySelectorAll(this.vars.image);
            imageElements.forEach((img) => {
                if (cDB.image) img.src = cDB.image;
                img.setAttribute(this.rpAttr, data.id + '4');
                mapReactIDList.image = data.id + '4';
            });

            /** Update character Age Element*/
            const age = template.querySelector(this.vars.age);
            if (age) age.innerText = cDB.age;

            /** Update character Gender Element*/
            const gender = template.querySelector(this.vars.gender);
            if (gender) gender.innerText = cDB.gender;

            /** Update character Interest Element*/
            const interest = template.querySelector(this.vars.interest);
            if (interest) interest.innerText = cDB.interest;

            /** Update character Occupation Element*/
            const occupation = template.querySelector(this.vars.occupation);
            if (occupation) occupation.innerText = cDB.occupation;

            /** Update character Possession Element*/
            const posEle = template.querySelector(this.vars.possession);
            if (posEle) posEle.textContent = cPossession;


            /** Update character ID Element*/
            const idElement = template.querySelector(this.vars.id);
            if (idElement) {
                idElement.textContent = data.cid;
                idElement.setAttribute('character-idvalue', data.cid);
            }
            ;

            /** Update character Index Number Element */
            const index = template.querySelector(this.vars.index);
            if (index) index.textContent = data.position;

            /** Update character Line width Element*/
            const lineWidth = template.querySelector(this.vars.lineWidth);
            if (lineWidth) {
                lineWidth.style.maxWidth = cPossession;
                lineWidth.style.width = cPossession;
                if (cDB.color && lineWidth.classList.contains('bg-orange'))
                    lineWidth.classList.replace('bg-orange', cDB.color);
            }
            ;

            /** Update character Mock Body Map List Element*/
            const mockBodyMapList = template.querySelector(this.vars.mockBodyMapList);
            if (mockBodyMapList) {
                const mockBodyMapItem = template.querySelector(this.vars.mockBodyMapItem).cloneNode(true);
                mockBodyMapItem.textContent = '';
                [...mockBodyMapList.children].forEach((e) => {
                    e.remove()
                });

                let count = 0;
                for (let index = 1; index <= 14; index++) {
                    const mItem = mockBodyMapItem.cloneNode(true);
                    mItem.innerText = cDB['item' + index];
                    mockBodyMapList.append(mItem);
                    mapReactIDList['item' + index] = data.id + (count + 5);
                    mItem.setAttribute(this.rpAttr, data.id + (count + 5))
                    count += 1;
                }
                // MapReactID will stop at 18 here
            }

            /** Update character Want Element*/
            const want = template.querySelector(this.vars.want);
            if (want) {
                want.textContent = cDB.want;
                want.setAttribute(this.rpAttr, data.id + '19');
                mapReactIDList.want = data.id + '19'
            }
            ;

            /** Update character Obstacle Element*/
            const obstacle = template.querySelector(this.vars.obstacle);
            if (obstacle) obstacle.textContent = cDB.obstacle;

            /** Update character Resolving Obstacle Element*/
            const resolvingObstacle = template.querySelector(this.vars.resolvingObstacle);
            if (resolvingObstacle) resolvingObstacle.textContent = cDB.resolvingObstacle;

            /** Update character synopsis Element*/
            const synopsis = template.querySelector(this.vars.synopsis);
            if (synopsis) obstacle.textContent = cDB.synopsis;

            /**Update scenes*/
            const sceneWrapper = template.querySelector(`[character-data="scene-list"]`);
            // clone scene heading template
            const sceneItemTemplate = sceneWrapper.querySelector(`[character-data="scene-item"]`).cloneNode(true);
            //Remove dummy scene template
            [...sceneWrapper.children].forEach(sh => sh.remove());
            // Render scene headings
            let count = 0;
            data.scenes.forEach((scene) => {
                count += 1;
                const sceneTemp = sceneItemTemplate.cloneNode(true);
                //Update title
                const titleEle = sceneTemp.querySelector(`[character-data="scene-item-title"]`);
                titleEle.textContent = scene.content.innerText;
                titleEle.setAttribute(this.rpAttr, scene.id);

                //Update the index
                const indexEle = sceneTemp.querySelector(`[character-data="scene-item-index"]`);
                indexEle.textContent = count;

                // Update the page number
                const pageNoElement = sceneTemp.querySelector(`[character-data="scene-item-page-no"]`);
                pageNoElement.textContent = scene.pageNumber;

                //Append to Scene Wrapper
                sceneWrapper.append(sceneTemp);
            });

            /** Update Body Map Data */
            const bodyMap = template.querySelector(this.vars.bodyMap);
            if (bodyMap) {
                // Create Body map item template
                const bodyMapItem = bodyMap.querySelector(this.vars.bodyMapItem).cloneNode(true);
                bodyMapItem.querySelector('div').textContent = '';

                // get the left side of the body map
                const bodyMapLeft = bodyMap.querySelector(this.vars.bodyMapLeft);
                [...bodyMapLeft.children].forEach((e) => {
                    e.remove()
                });
                // get the left side of the body map
                const bodyMapRight = bodyMap.querySelector(this.vars.bodyMapRight);
                [...bodyMapRight.children].forEach((e) => {
                    e.remove()
                });

                for (let index = 1; index <= 14; index++) {
                    const item = bodyMapItem.cloneNode(true);
                    item.querySelector('div').innerText = cDB['item' + index];
                    if (index <= 8) bodyMapLeft.append(item);
                    else bodyMapRight.append(item);
                    item.setAttribute(this.rpAttr, mapReactIDList['item' + index]);
                }
            }

            //Append character template to List wrapper
            this.mainCharacterListTemp.append(template);
        }

        // Render Character data on right side bar space
        if (2) {
            const rsTemplate = this.rsCharacterItemTemp.cloneNode(true);
            /** Update name */
            const rsName = rsTemplate.querySelector(this.vars.rsName);
            rsName.textContent = data.name;
            rsName.setAttribute(this.rpAttr, data.id);

            /** Update image */
            const rsImage = rsTemplate.querySelector(this.vars.rsImage);
            if (rsImage) {
                if (cDB.image) rsImage.src = cDB.image;
                rsImage.setAttribute(this.rpAttr, mapReactIDList.image);
            }

            /** Update Want */
            const rsWant = rsTemplate.querySelector(this.vars.rsWant);
            if (rsWant) {
                rsWant.innerText = cDB.want;
                rsWant.setAttribute(this.rpAttr, mapReactIDList.want)
            }
            ;

            /** Update Archetype */
            const rsArchetype = rsTemplate.querySelector(this.vars.rsArchetype);
            if (rsArchetype) {
                rsArchetype.innerText = cDB.archetype;
                rsArchetype.setAttribute(this.rpAttr, mapReactIDList.archetype)
            }
            ;

            /** Update Trait */
            const rsTrait = rsTemplate.querySelector(this.vars.rsTrait);
            if (rsTrait) {
                rsTrait.innerText = cDB.trait;
                rsTrait.setAttribute(this.rpAttr, mapReactIDList.trait);
            }
            ;

            /** Update Body Map List*/
            const rsBodyMapList = rsTemplate.querySelector(this.vars.rsBodyMapList);
            if (rsBodyMapList) {
                const rsBodyMapItem = rsBodyMapList.querySelector(this.vars.rsBodyMapItem).cloneNode(true);
                [...rsBodyMapList.children].forEach((e) => {
                    e.remove()
                });

                for (let index = 1; index <= 14; index++) {
                    const item = rsBodyMapItem.cloneNode(true);
                    item.innerText = cDB['item' + index];
                    rsBodyMapList.append(item);
                    item.setAttribute(this.rpAttr, mapReactIDList['item' + index]);
                }
            }
            ;

            /** Set character id */
            const rsCharacterID = rsTemplate.querySelector(this.vars.rsId);
            if (rsCharacterID) {
                rsCharacterID.textContent = data.cid;
                rsCharacterID.setAttribute('rs-character-id', data.cid);
            }

            //Append to it List Wrapper
            this.rsCharacterListTemp.append(rsTemplate);

            // A hide and show function from app.js
            hideAndShowDropable('hideable-part', 'showable-part');
        }

        // SetUp functionality to the new template
        this.setUp(currentCharacterItemTemplate);

        // Activate map react on the rest properties except name
        const mapReactIDListKeys = Object.keys(mapReactIDList);
        mapReactIDListKeys.forEach((key) => {
            const mrID = mapReactIDList[key];
            if (key !== 'image') /* this.activateMapReact(mrID) */;
            else this.activateMapReact(mrID, true);
        });
    }

    characterExistChecker(name) {
        let validity = false;
        let cid = '';
        //Loop through content store to find out is character name already exist.
        for (let index = 0; index < this.contentStore.length; index++) {
            const data = this.contentStore[index];
            if (data.type === 'character' && data.content.innerText === name) {
                validity = true;
                cid = data.index;
                break
            }
        }
        return {valid: validity, id: cid};
    }

    checkStore(name) {
        let validity = false;
        let cid = '';
        const keys = Object.keys(window.ScriptDataStore.character);

        //Loop through character store to find out is character name already exist.
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const character = window.ScriptDataStore.character[key];
            if (character.name === name) {
                validity = true;
                cid = character.id;
                break
            }
        }
        return {valid: validity, id: cid};
    }

}

document.addEventListener("DOMContentLoaded", function () {
    window.CharacterHandle = new CharacterHandle();
})