/* Take note: window.EditorFuncs in EditorFuncs.js
window.MapAndReactOnContent in MapAndReactOnContent.js 
window.ScriptDataStore in newproject.html
*/
class ScriptAdapter {
    // EditorFuncs.js loaded
    editorFuncs = window.EditorFuncs;
    // MapAndReactOnContent.js loaded
    mapAndReactOnContent = window.MapAndReactOnContent;
    // newproject.html loaded. web database
    scriptDataStore = window.ScriptDataStore;
    // Template for draft item option
    draftItemOption = document.querySelector(`[sw-draft="item"]`).cloneNode(true);
    // current draft
    currentDraftKey;
    // save script indicator
    isToSave = false;

    keyList = [];

    constructor() {
        setTimeout(() => {
            window.MapAndReactOnContent.mapreact();
        });

        // Get current draft: capture all draft key
        if (this.scriptDataStore?.draft) {
            const allLoadedDraftKeys = Object.keys(this.scriptDataStore?.draft);
            for (let index = 0; index < allLoadedDraftKeys.length; index++) {
                const draft = this.scriptDataStore?.draft[allLoadedDraftKeys[index]];
                if (draft.active === 'true') {
                    this.currentDraftKey = allLoadedDraftKeys[index];
                    break
                }
            }
            // Activate Draft List
            this.draftList();
        }
    }

    autoSave() {
        if (!this.isToSave) {
            this.isToSave = true;
            setTimeout(() => {
                this.save();
                this.isToSave = false;
            }, 200);
        }
        ;
    }

    draftList() {
        // Initilize draft and it content on page finish loading
        this.initDraft();

        // Initilize other script content on page finish loading
        this.initContent();

        // Draft list containter
        const draftListWrapper = document.querySelector(`[sw-draft="list"]`);

        // Add click event to it.
        draftListWrapper.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
        });

        //draft items
        [...draftListWrapper.children].forEach((draftItem) => {
            this.draftItemEventListeners(draftItem);
        });
    }

    initDraft() {
        // Draft list container
        const draftListWrapper = document.querySelector(`[sw-draft="list"]`);
        //Delete dummy draft te
        // plate
        [...draftListWrapper.children].forEach((draftOption) => {
            draftOption.remove()
        });
        // Get current draft: capture all draft key
        const allLoadedDraftKeys = Object.keys(this.scriptDataStore.draft);
        // First set the active draft before setting other draft.
        for (let index = 0; index < allLoadedDraftKeys.length; index++) {
            const draft = this.scriptDataStore.draft[allLoadedDraftKeys[index]];
            if (draft.active === 'true') {
                // create the draft option element
                const newDraftOption = this.draftItemOption.cloneNode(true);
                // Add the name to the option
                newDraftOption.querySelector(`[sw-draft="item-text"]`).textContent = draft.name;
                // Append the element
                draftListWrapper.append(newDraftOption);
                break;
            }
        }
        // Set other draft apart from active
        allLoadedDraftKeys.forEach((dk) => {
            const draft = this.scriptDataStore.draft[dk];
            if (draft.active === 'false') {
                // create the draft option element
                const newDraftOption = this.draftItemOption.cloneNode(true);
                // Add the name to the option
                newDraftOption.querySelector(`[sw-draft="item-text"]`).textContent = draft.name;
                // Append the element
                draftListWrapper.append(newDraftOption);
            }
        });

        /* Render Draft content on page Loaded */
        // Get current active draft option element and make it selected
        [...draftListWrapper.children].forEach((draftOpt) => {
            const draftKey = draftOpt.querySelector(`[sw-draft="item-text"]`).textContent.toLowerCase().replace(' ', '');
            if (this.currentDraftKey === draftKey) draftOpt.classList.add('select-feature-draft');
        });
    }

    initContent() {
        // set the current draft content on page
        this.renderDraftContent(this.currentDraftKey);
        // Set the script title
        document.querySelector(`[sw-data-type="title"]`).innerText = this.scriptDataStore.title;
        document.querySelector(`[sw-data-type="title"]`).addEventListener('keyup', () => {
            // automatic save
            this.autoSave()
        });

        // Set location page content
        this.renderContentOf('location');

        // Set Storydos page content
        this.renderContentOf('storydos');

        window.LocationEditor = new EditorWriter('sw-location');
        window.StoryDocsEditor = new EditorWriter('sw-storydos');
    }

    draftItemEventListeners(draftItem = document.querySelector(`[sw-draft="item"]`)) {
        // Add click event to the draft item
        draftItem.addEventListener('click', (e) => {
            // Prevent defualt
            e.stopImmediatePropagation();
            e.stopPropagation();
            //Add selection indicator select-feature-draft
            if (!draftItem.classList.contains('select-feature-draft')) {
                // Previous selected draft
                const prevSelectedDraft = draftItem.parentElement.querySelector('.select-feature-draft');
                if (prevSelectedDraft) {
                    // Remove the select indicator
                    prevSelectedDraft.classList.remove('select-feature-draft');
                    // Add it to the current draft item option
                    draftItem.classList.add('select-feature-draft');
                } else {
                    draftItem.classList.add('select-feature-draft');
                }
            }

            /* Load the particular draft */
            // get the current script content on page
            const getCurrentContent = this.getContent();
            // Store the previous draft content
            this.scriptDataStore.draft[this.currentDraftKey].data = getCurrentContent;
            this.scriptDataStore.draft[this.currentDraftKey].active = 'false';

            //get the current selected draft key
            const draftKey = draftItem.querySelector(`[sw-draft="item-text"]`).textContent.toLowerCase().replace(' ', '');
            // Set current draft to active
            this.scriptDataStore.draft[draftKey].active = 'true';
            // set current draft key
            this.currentDraftKey = draftKey;
            // set the current draft content on page
            this.renderDraftContent(draftKey);
        });

        // Add click event to the draft item add button
        draftItem.querySelector(`[sw-draft="item-add"]`).addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();

            /* Create draft, apply, render, store and save content. */
            this.addDraft(draftItem);
        });

        // Add click event to the draft item delete button
        draftItem.querySelector(`[sw-draft="item-delete"]`).addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();

            /* Delete draft and it contents */
            this.removeDraft(draftItem);
        });

        // Show draft buttons when mouse move around draft
        draftItem.addEventListener('mousemove', () => {
            draftItem.querySelector(`[sw-draft="item-buttons"]`).classList.remove('hide');
        });

        // Hide draft buttons when mouse move around draft
        draftItem.addEventListener('mouseout', () => {
            draftItem.querySelector(`[sw-draft="item-buttons"]`).classList.add('hide');
        });
    }

    addDraft(draftItem = document.querySelector(`[sw-draft="item"]`)) {
        //Draft Name or text
        let draftName = 'Draft 1';
        const allText = [];
        [...document.querySelector(`[sw-draft="list"]`).children].forEach((eleItem) => {
            const getItemText = eleItem.querySelector(`[sw-draft="item-text"]`).textContent;
            allText.push(getItemText);
        });
        let count = 1;
        while (1 === 1) {
            if (allText.includes(draftName)) {
                draftName = 'Draft ' + String(allText.length + count);
            } else break;
            count += 1;
        }

        // Create new draft
        const newDraft = this.draftItemOption.cloneNode(true);
        // Set Name
        newDraft.querySelector(`[sw-draft="item-text"]`).textContent = draftName;
        // Append the newly created draft to list
        draftItem.insertAdjacentElement('afterend', newDraft);
        // Add to event
        this.draftItemEventListeners(newDraft);

        //Load Content of the previous draft and store on new draft
        //...
        // Get previous and new draft keys
        const prevDraftKey = draftItem.querySelector(`[sw-draft="item-text"]`).textContent.toLowerCase().replace(' ', '');
        const newDraftKey = draftName.toLowerCase().replace(' ', '');
        // Check if previous draft key is active b4 storing it data
        if (this.scriptDataStore.draft[prevDraftKey].active === 'true') {
            // get the current script content on page
            const getCurrentContent = this.getContent();
            // Store the previous draft content
            this.scriptDataStore.draft[prevDraftKey].data = getCurrentContent;
            // Store the previous draft content to the new draft content
            this.scriptDataStore.draft[newDraftKey] = {name: draftName, active: 'false', data: getCurrentContent}
        } else {
            // Store the previous draft content to the new draft content
            this.scriptDataStore.draft[newDraftKey] = {
                name: draftName,
                active: 'false',
                data: this.scriptDataStore.draft[prevDraftKey].data
            }
        }
    }

    removeDraft(draftItem = document.querySelector(`[sw-draft="item"]`)) {
        const allDraft = [...draftItem.parentElement.children];
        // Delete the draft option and content
        if (allDraft.length > 1) {
            // Set another draft content on the page by clicking another draft element which will trigger click event listener set for the element
            if (draftItem.previousElementSibling) draftItem.previousElementSibling.click();
            else if (draftItem.nextElementSibling) draftItem.nextElementSibling.click();

            //Get draft key through draft text
            const draftKey = draftItem.querySelector(`[sw-draft="item-text"]`).textContent.toLowerCase().replace(' ', '');
            // Delete this draft from the store
            delete this.scriptDataStore.draft[draftKey];
            // Delete Draft and it content
            draftItem.remove();
        }
    }

    renderContentLine(line, lineData) {
        // Render the script comment on right sider bar
        window.NoteHandle?.renderer(lineData);
        // Set the particular script line html content to the clone template
        line.innerHTML = lineData?.content;
        // Set the type of script line to the content-line element
        line.setAttribute('sw-editor-type', lineData?.type);
        // Set the id
        line.setAttribute('sw-editor-id', lineData?.id);
        // Set the color
        line.setAttribute('sw-editor-color', lineData?.color);

        // If character type of content line, then set the charater id
        if (lineData?.type === 'character') {
            try {
                window.CharacterHandle.lineValidator(line);
            } catch (e) {
                console.log(e);
            }
        }
        // format the line text
        if (lineData?.type === 'action') ;
        else if (lineData?.type === 'scene-heading') window.EditorMode.handleSceneHeadingType(line, true);
        else if (lineData?.type === 'dialog') window.EditorMode.handleDialog(line, true);
        else if (lineData?.type === 'character') window.EditorMode.handleCharater(line, true);
        else if (lineData?.type === 'transition') window.EditorMode.handleTransition(line, true);
        else if (lineData?.type === 'parent-article') window.EditorMode.handleParentArticle(line, true);
        else if (lineData?.type === 'act') window.EditorMode.handleActType(line, true);

        window.EditorMode.lineSignal(line);
    }

    async renderDraftContent(draftKey, callback = () => {
    }, skipObserver = false) {
        // const startTime = performance.now();
        /** Await Starts*/
        window.Watcher.bothAwait()
        // Disable page mutation
        //window.MapAndReactOnContent.pageMutationStatus = false;
        const renderDraftContentPromise = new Promise((resolve, reject) => {
            resolve(1)
        });
        renderDraftContentPromise.then(async () => {
            /** Await Point */
            window.Watcher.bothAwait(true, 'Rendering script text on page...');
            // clear all script comment in the right sider bar
            await window.NoteHandle?.clear();
            const draft = this.scriptDataStore.draft[draftKey];

            if (draft) {
                const data = Object.values(this.scriptDataStore?.outline ? this.scriptDataStore?.outline : {});
                if (data) {
                    data.forEach((item) => {
                        if (item.title) {
                            if(!this.keyList.includes(item.sbID)) {
                                this.keyList.push(item.sbID);
                            }
                            const scene = Object.values(item.sceneListId);
                            if (scene.length > 0) {
                                scene.forEach((item) => {
                                    if(!this.keyList.includes(item.sbID)) {
                                        this.keyList.push(item);
                                    }
                                });
                            }
                        }
                    });
                }
                const draftDataKeys = this.keyList;
                // EditorFuncs.js elements
                const pageList = this.editorFuncs.swPageListTemp;

                // Remove all page
                [...pageList.children].forEach((page) => {
                    page.remove()
                });
                // Create New Page for content
                let pageClone = this.editorFuncs.swPageTemp.cloneNode(true);
                // Append current page to it Page List
                pageList.append(pageClone);
                // Remove previous children or content-line from new page
                [...pageClone.children].forEach((cl) => {
                    cl.remove()
                });
                // Create a new content line
                let newLine = this.editorFuncs.lineTemp.cloneNode(true)
                // Kick of render
                let count = 0;
                for (let index = 0; index < draftDataKeys.length; index++) {
                    const clDetial = draft.data[draftDataKeys[index]];
                    // Clone content line template
                    newLine = this.editorFuncs.lineTemp.cloneNode(true);
                    // render the content line data to DOM
                    this.renderContentLine(newLine, clDetial)

                    // Check if page still maintain it size before rendering the new content-line
                    if (pageClone.scrollHeight > this.editorFuncs.swPageHeight) {
                        //the last content-line in the page
                        const lastContentLine = pageClone.lastElementChild;
                        // create new page
                        pageClone = this.editorFuncs.swPageTemp.cloneNode(true);
                        pageList.append(pageClone);
                        //Remove previous children or content-line from new page
                        [...pageClone.children].forEach((cl) => {
                            cl.remove()
                        });
                        // Append last content first on new page
                        pageClone.append(lastContentLine);
                        // Append content-line to current page
                        pageClone.append(newLine);
                    } else {
                        // Append content-line to current page
                        pageClone.append(newLine);
                    }
                    // Update count
                    count += 1;
                }

                //Append page if not appended to it Page List
                if (!count) {
                    newLine = window.EditorFuncs.createNewLine(newLine, (b) => {
                    }, false, '');
                    pageClone.append(newLine);
                }
            }
        }).then(async () => {
            /** Await Point */
            window.Watcher.bothAwait(true, 'loading comments and calculating pages...');
            // Help author be able to save comment and note
            this.saveCommentAndNote();
            // Event listener to manage open and closing of all comment
            this.handleCommentOpeningAndClosing();
            // EditorFuncs.js method: Refresh the total number of pages available.
            await this.editorFuncs.totalNumberOfPage();
        }).then(async () => {
            /** Await Point */
            window.Watcher.bothAwait(true, 'Re-arranging pages...');
            // EditorFuncs.js method: Make sure page is arrange
            await window.EditorMode.rearrangePage();
        }).then(() => {
            /** Await Point */
            window.Watcher.bothAwait(true, 'Activating Watcher on page...');
            const pageWrap = document.querySelector(`[sw-editor="list"]`);
            const pageList = pageWrap.querySelectorAll(`[sw-editor="item"]`);
            const contentLineList = pageWrap.querySelectorAll(`[sw-editor-type]`);
            const totalPage = pageList.length;
            const totalLine = contentLineList.length;
            // initiate watcher
            window.Watcher.reset(0, totalPage, totalLine, false);
        }).then(async () => {
            /** Await Point */
            window.Watcher.bothAwait(true, 'Mapping and linking of script text on page...');
            // if(!skipObserver) window.MapAndReactOnContent.mapreact();
            await window.MapAndReactOnContent.mapreact();
        }).then(async () => {
            /** Await Ends*/
            await window.Watcher.bothAwait(false);
            callback();
            window.EditorMode.calculatePageNumbers();
        });
        return renderDraftContentPromise;
    }

    saveCommentAndNote() {
        //To form this kind of date formate: 29th July, 2021
        const myDate = new Date();
        const year = myDate.getFullYear(); //2022
        //myDate.getMonth() //1
        const day = myDate.getDate(); //16
        //myDate // Wed Feb 16 2022 19:52:26 GMT+0100 (West Africa Standard Time)
        // Get month Name
        const monthName = String(myDate).split(' ')[1];
        const todayDate = day + ' ' + monthName + ', ' + year;

        // For notes
        document.querySelectorAll(`[sw-data-content="note-wrap"]`).forEach((nwrap) => {
            const noteSaveBtn = nwrap.querySelector(`[sw-data-content="note-btn-ok"]`);
            // Click event on the save button
            noteSaveBtn?.addEventListener('click', () => {
                // Get the note body
                const noteBody = nwrap.querySelector(`[sw-data-content="note-body"]`);
                // Get the particular content line
                const contentLine = nwrap.closest(`[sw-data="content-line"]`);
                // Get the content line number
                const clIndex = contentLine.querySelector(`[sw-script-body="id"]`).innerText;
                //console.log(clIndex, this.currentDraftKey);
                const dataset = this.scriptDataStore.draft[this.currentDraftKey].data[clIndex];
                if (dataset.note.text != noteBody.innerText) {
                    // Set the note data.
                    // Set the note text by the author
                    this.scriptDataStore.draft[this.currentDraftKey].data[clIndex].note.text = noteBody.innerText;
                    // Set the author name
                    this.scriptDataStore.draft[this.currentDraftKey].data[clIndex].note.authorName = window.AuthorName;
                    // Set the author id
                    this.scriptDataStore.draft[this.currentDraftKey].data[clIndex].note.authorID = window.AuthorID;
                    // Set the date
                    this.scriptDataStore.draft[this.currentDraftKey].data[clIndex].note.date = todayDate;
                    // Set the color
                    const myColor = window.BackgroundColor.randomBg();
                    this.scriptDataStore.draft[this.currentDraftKey].data[clIndex].note.color = myColor;
                    // Check id current draft is the active on then set the content
                    if (this.scriptDataStore.draft[this.currentDraftKey].active === 'true') {
                        // update the script data
                        this.scriptDataStore.data = this.scriptDataStore.draft[this.currentDraftKey].data;
                    }
                    // Update the template
                    nwrap.querySelector(`[sw-data-content="note-color"]`).textContent = myColor;
                    nwrap.querySelector(`[sw-data-content="note-name"]`).innerText = window.AuthorName;
                    nwrap.querySelector(`[sw-data-content="note-date"]`).innerText = todayDate;
                    nwrap.querySelector(`[sw-data-content="note-authorID"]`).innerText = window.AuthorID;
                    // create name logo
                    const nameLogo = window.AuthorName.split(' ');
                    nwrap.querySelector(`[sw-data-content="note-name-logo"]`).innerText = nameLogo[0][0].toUpperCase() + nameLogo[1][0].toUpperCase();
                    // make the detail wrapper visible
                    nwrap.querySelector(`[sw-data-content="note-detail-wrap"]`).classList.remove('hide');
                    // Adjust the note detail wrapper parent height
                    nwrap.querySelector(`[sw-data-content="note-detail-wrap"]`).parentElement.classList.replace('rem-h7', 'rem-h10');
                    // Save the note
                    this.sendCommentAndNote(clIndex, noteBody.innerText, this.currentDraftKey, todayDate, 'note', myColor).then((response) => {
                        if (response.data === 'success') alert(response.message);
                        else alert(response.message);
                    });
                }
            });
        });

    }

    async sendCommentAndNote(index, text, draft, date, type, color = 'bg-yellow') {
        // get crsf token
        const crsftokenValue = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

        // create form and supply the inputs
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', crsftokenValue);
        formData.append('text', text);
        formData.append('content-line-index', index);
        formData.append('draftID', draft); //Ex. draft1
        formData.append('date', date);
        formData.append('type', type); //note or comment
        if (type === 'note') formData.append('color', color); //set color if note type

        // Send the data to store
        const postData = await fetch(location.href + '/save-tip', {method: 'POST', body: formData,});
        return postData.json();
    }

    handleCommentOpeningAndClosing() {
        // Comment top menu dropdown
        document.querySelectorAll(`[sw-open-comment="list"]`).forEach((menu) => {
            [...menu.children].forEach((item) => {
                // Add click event to the children of the list element
                item.addEventListener('click', () => {
                    // If open all option is clicked then carry then open all comment box with content
                    if (item.querySelector(`[sw-open-comment="item-open-all"]`)) {
                        document.querySelectorAll(`[sw-data-content="note-wrap"]`).forEach((noteWrap) => {
                            // validate the comment wrapper before opening it.
                            const contentLine = noteWrap.closest(`[sw-data="content-line"]`); // The direct parent of the comment wrap
                            const scriptBodyIndex = contentLine.querySelector(`[sw-script-body="id"]`).innerText;
                            //const commentBody = commentWrap.querySelector(`[sw-data-content="note-body"]`);
                            //const commentAuthorId = commentWrap.querySelector(`[sw-data-content="note-authorID"]`);
                            const textInNoteFromDataSet = this.scriptDataStore.draft[this.currentDraftKey].data[scriptBodyIndex].note;

                            if (textInNoteFromDataSet.text) {
                                // show comment wrapper
                                noteWrap.classList.remove('hide');
                                const noteIcon = contentLine.querySelector(`[sw-data-content="note-icon"]`); // note icon
                                // light the bob icon
                                noteIcon.querySelector('svg').style.fill = 'gold';

                                // Make the comment icon visible
                                noteIcon.classList.replace('op-0', 'op-1');
                            }
                        });

                    } else if (item.querySelector(`[sw-open-comment="item-close-all"]`)) {
                        document.querySelectorAll(`[sw-data-content="note-wrap"]`).forEach((noteWrap) => {
                            // show comment wrapper
                            noteWrap.classList.add('hide');
                            const contentLine = noteWrap.closest(`[sw-data="content-line"]`); // The direct parent of the note wrap
                            const noteIcon = contentLine.querySelector(`[sw-data-content="note-icon"]`); // note icon
                            // remove the light from the bob icon
                            noteIcon.querySelector('svg').style.fill = '';

                            // Make the comment icon visible
                            noteIcon.classList.replace('op-1', 'op-0');
                        });
                    } else {
                        // get the author id from the menu item
                        const authorId = item.querySelector(`[sw-open-comment="item"]`).getAttribute('sw-open-comment-id');

                        // Open only comment wrapper with the above author id
                        document.querySelectorAll(`[sw-data-content="note-wrap"]`).forEach((noteWrap) => {
                            if (noteWrap.querySelector(`[sw-data-content="note-authorID"]`).textContent === authorId) {
                                // show comment wrapper
                                noteWrap.classList.remove('hide');
                                const contentLine = noteWrap.closest(`[sw-data="content-line"]`); // The direct parent of the note wrap
                                const noteIcon = contentLine.querySelector(`[sw-data-content="note-icon"]`); // note icon
                                // light the bob icon
                                noteIcon.querySelector('svg').style.fill = 'gold';

                                // Make the comment icon visible
                                noteIcon.classList.replace('op-0', 'op-1');

                                // hide other comment wrapper
                            } else noteWrap.classList.add('hide');
                        });
                    }
                })
            })
        })
    }

    renderContentOf(type) { /* location or storydos */
        // Get the particular content
        const content = this.scriptDataStore[type];
        // get the keys in the content data
        const contentDataKeys = Object.keys(content);
        // Render the content to the page {location or storypage}

        //const editor = new EditorWriter(`sw-${type}`);
        const pageList = document.querySelector(`[sw-${type}="list"]`);
        // Create New Page for content
        let pageClone = document.querySelector(`[sw-${type}="item"]`).cloneNode(true);
        // Create a new content line
        let newLine = document.querySelector(`[sw-${type}-id]`).cloneNode(true);
        // reusable templates
        const pageCloneDom = document.querySelector(`[sw-${type}="item"]`).cloneNode(true);
        const newLineDom = document.querySelector(`[sw-${type}-id]`).cloneNode(true);
        // Remove all page
        [...pageList.children].forEach((page) => {
            page.remove()
        });
        // Append current page to it Page List
        pageList.append(pageClone);
        // Remove previous children or content-line from new page
        [...pageClone.children].forEach((cl) => {
            cl.remove()
        });
        // Kick of render
        let countNew = 0;
        for (let index = 0; index < contentDataKeys.length; index++) {
            const contkey = contentDataKeys[index];
            const contentData = content[contkey];
            // Clone content line template
            newLine = newLineDom.cloneNode(true);
            newLine.innerHTML = contentData.content;
            newLine.setAttribute(`sw-${type}-id`, contentData.id);
            // Check if page still maintain it size before rendering the new content-line
            if (pageClone.scrollHeight > this.editorFuncs.swPageHeight) {
                //the last content-line in the page
                const lastContentLine = pageClone.lastElementChild;
                // create new page
                pageClone = pageCloneDom.cloneNode(true);
                pageList.append(pageClone);
                //Remove previous children or content-line from new page
                [...pageClone.children].forEach((cl) => {
                    cl.remove()
                });
                // Append last content first on new page
                pageClone.append(lastContentLine);
                // Append content-line to current page
                pageClone.append(newLine);
            } else {
                // Append line to current page
                pageClone.append(newLine);
            }
            // Update count
            countNew += 1;
        }
        //Append page if not appended to it Page List
        if (!countNew) {
            pageClone.append(newLineDom);
        }
    }

    getContent() {
        // Current Entire script content
        const data = {};
        // All content line
        const contentLines = document.querySelectorAll(`[sw-editor-type]`);

        contentLines.forEach((line, i) => {
            const htmlText = line.innerHTML;
            const lineType = line.getAttribute('sw-editor-type');
            const clID = line.getAttribute('sw-editor-id');
            const clColor = line.getAttribute('sw-editor-color');
            const characterID = line.getAttribute('sw-editor-character-id');

            //create the line array
            data[clID] = {
                id: clID, content: htmlText, type: lineType, color: clColor, others: {},
                note: {text: '', authorID: '', authorName: '', date: '', color: ''}
            }

            // Add others
            const piece = this.scriptDataStore.draft[this.currentDraftKey].data[clID];

            if (lineType === 'character') data[clID].others = {cid: characterID};
            else if (lineType === 'scene-heading') {
                if (piece?.others?.ev) data[clID].others = piece.others;
                else data[clID].others = {ev: '0', scenegoal: ''};
            } else if (piece) {
                data[clID].others = piece.others;
                data[clID].note = piece.note;
            }
        });
        return data;
    }

    getContentOf(type) { /* location or storydos */
        // Current Entire script content
        const data = {};
        // All content body
        const contentList = document.querySelectorAll(`[sw-${type}-id]`);
        //let count = 0;
        contentList.forEach((clElement) => {
            // Line id
            const newID = clElement.getAttribute(`sw-${type}-id`);
            //const newID = count;
            const htmlText = clElement.innerHTML;
            //create the line array
            data[String(newID)] = {id: newID, content: htmlText,}
            //count += 1;
        });

        return data;
    }

    getOutlineContent() {
        let data = window.ScriptAdapter.scriptDataStore.outline = {};
        window.ScriptAdapter.autoSave();
        let listData = document.querySelectorAll(swData);
        listData.forEach((card, index) => {
            let title = card?.querySelector(`[outline-data="scene-title"]`)?.innerHTML;
            let goal = card?.querySelector(`[outline-data="scene-goal"]`)?.innerHTML;
            let emotional_value = card?.querySelector(`[outline-data="emotional-value"]`)?.innerHTML;
            let page_no = card?.querySelector(`[outline-data="page"]`).innerHTML;
            let bgColor = card?.getAttribute("bg-value");
            let sbID = card?.querySelector(`[outline-data="scene-title"]`).getAttribute("react-sbid");
            let scene = card?.querySelectorAll(`[outline-data="scene-item"]`);
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
        window.ScriptAdapter.scriptDataStore.outline["lock"] = 'False';
        window.ScriptAdapter.scriptDataStore["isDrag"] = 'False';
        window.ScriptAdapter.autoSave();
    }

    save() {
        // get the current script content on page
        const getCurrentContent = this.getContent();
        // Store the previous draft content
        this.scriptDataStore.draft[this.currentDraftKey].data = getCurrentContent;
        // update the script data
        this.scriptDataStore.data = getCurrentContent;
        //outline Object
        // this.scriptDataStore.outline = {'abu': 'Bakkar'};
        // Set title
        this.scriptDataStore.title = document.querySelector(`[sw-data-type="title"]`).innerText;
        // Save location
        this.scriptDataStore.location = this.getContentOf('location');
        // Save storydos
        this.scriptDataStore.storydos = this.getContentOf('storydos');
        // get crsf token
        const crsftokenValue = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

        // create form and supply the inputs
        const formData = new FormData();
        formData.append('content', JSON.stringify(window.ScriptAdapter.scriptDataStore));
        formData.append('title', this.scriptDataStore.title);
        formData.append('csrfmiddlewaretoken', crsftokenValue);
        // Send the data to store
        fetch(location.href + '/save', {method: 'POST', body: formData,})
            .then(response => response.json())
            .then(data => { /* console.log('Success:', data); */
            })
            .catch((error) => {
                alert('Unable to save content at this period, please refresh the page.');
            });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.ScriptAdapter = new ScriptAdapter();
})