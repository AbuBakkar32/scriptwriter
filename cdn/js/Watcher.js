class Watcher {
    constructor() {
        // For capturing the last id created by new contentline
        this.lastID = 0;
        // Total page
        this.totalPage = 0;
        // total content line
        this.totalLine = 0;
        // Attribute changed state
        this.attributeChanged = false;
        //save status
        this.saveStatus = false;
        // window.ScriptDataStore
        // window.MapAndReactOnContent
        // window.EditorFuncs
        // window.ScriptAdapter.currentDraftKey
        // window.Watcher 
    }

    reset(a=0, b=0, c=0, d=false) {
        this.lastID = a;
        this.totalPage = b;
        this.totalLine = c;
        this.attributeChanged = d
    }

    siderBarAwait(status = true, text='Loading...') {
        /** Start Await*/
        const awaitWrapper = document.querySelector(`[sw-loading-sider]`);
        if (status) {
            awaitWrapper.setAttribute('sw-loading-sider','on');
            awaitWrapper.querySelector(`[sw-loading-sider-text]`).textContent = text;
        } else {
            awaitWrapper.setAttribute('sw-loading-sider','off');
            awaitWrapper.querySelector(`[sw-loading-sider-text]`).textContent = text;
        }
    }

    mainPageAwait(status = true, text='Loading...') {
        /** Start Await*/
        const awaitWrapper = document.querySelector(`[sw-loading]`);
        if (status) {
            awaitWrapper.setAttribute('sw-loading','on');
            awaitWrapper.querySelector(`[sw-loading-text]`).textContent = text;
        } else {
            awaitWrapper.setAttribute('sw-loading','off');
            awaitWrapper.querySelector(`[sw-loading-text]`).textContent = text;
        }
    }

    bothAwait(status = true, text='Loading...') {
        this.mainPageAwait(status);
        this.siderBarAwait(status)
        return 1;
    }

    newLine(uid, prevID){
        /** where uid is the new created line id.
         * prevID: previous Line id.
         * */
        //this.totalLine += 1; // Increase the total line
        // get current draft key
        const draftKey = window.ScriptAdapter.currentDraftKey;
        // create new line store through reflow of prev line store
        let newLineStore = {};
        // Await
        const newLinePromise = new Promise((resolve, reject)=>{resolve(1)});
        newLinePromise.then(()=>{
            // get current line store
            const lineStore = window.ScriptDataStore.draft[draftKey].data;
            // get the id of all content line
            const idList = Object.keys(lineStore);
            // reflow to build new line store
            idList.forEach((v) => {
                if (v === prevID) {
                    newLineStore[v] = lineStore[v];
                    const line = document.querySelector(`[sw-editor-id="${uid}"]`);
                    const clColor = line.getAttribute('sw-editor-color');
                    const lineType = line.getAttribute('sw-editor-type'); // current line type
                    const htmlText = line.innerHTML;
                    newLineStore[uid] =  {
                        id: uid, content: htmlText, type: lineType,  color: clColor, others: {},
                        note:{text: '', authorID: '', authorName: '', date: '', color: ''}
                    }
                } else {
                    newLineStore[v] = lineStore[v];
                }
            });
        }).then(() => {
            window.ScriptDataStore.draft[draftKey].data = newLineStore;
        }).then(() => {
            // save data
            this.saveCaller();
        }).then(()=> {
            const pageWrap = document.querySelector(`[sw-editor="list"]`);
            const pageList = pageWrap.querySelectorAll(`[sw-editor="item"]`);
            const contentLineList = pageWrap.querySelectorAll(`[sw-editor-type]`); 

            // Refresh the total number of pages avaliable.
            if (contentLineList.length != this.totalLine) {
                window.EditorFuncs.totalNumberOfPage();
                document.querySelector(`[sw-section-btn="structure"]`).click();
                document.querySelector(`[sw-section-btn="structure"]`).parentElement.click();
            }
            // reload page structure guide
            if (pageList.length != this.totalPage) {
                window.MapAndReactOnContent.structureGuideHandle();
            }
        });
    }

    removeLine(uid) {
        //this.totalLine -= 1; // reduce the total line
        // get current draft key
        const draftKey = window.ScriptAdapter.currentDraftKey;
        // delete the content line record in the store
        delete window.ScriptDataStore.draft[draftKey].data[uid];

        // save data
        this.saveCaller();
        const pageWrap = document.querySelector(`[sw-editor="list"]`);
        const pageList = pageWrap.querySelectorAll(`[sw-editor="item"]`);
        const contentLineList = pageWrap.querySelectorAll(`[sw-editor-type]`); 

        // Refresh the total number of pages avaliable.
        if (contentLineList.length != this.totalLine) {
            window.EditorFuncs.totalNumberOfPage();
            document.querySelector(`[sw-section-btn="structure"]`).click();
            document.querySelector(`[sw-section-btn="structure"]`).parentElement.click();
        }
        // reload page structure guide
        if (pageList.length != this.totalPage) {
            window.MapAndReactOnContent.structureGuideHandle();
        }
    }

    changeAttribute(uid) {
        // the content line element
        const clElement = document.querySelector(`[sw-editor-id="${uid}"]`);
        const lineType = clElement.getAttribute('sw-editor-type'); // current line type
        // get current draft key
        const draftKey = window.ScriptAdapter.currentDraftKey;   
        // update the content line in the web store
        window.ScriptDataStore.draft[draftKey].data[uid].type = lineType;
        if (lineType === 'character') {
            const characterID = clElement.getAttribute('sw-editor-character-id');
            window.ScriptDataStore.draft[draftKey].data[uid].others.cid = characterID;
        }
        // save data
        this.saveCaller();
        // Update the attribute status
        this.attributeChanged = true;
        document.querySelector(`[sw-section-btn="structure"]`).click();
        document.querySelector(`[sw-section-btn="structure"]`).parentElement.click();
            
    }

    changeInLine(uid){
        // the content line element
        const line = document.querySelector(`[sw-editor-id="${uid}"]`);
        const clColor = line.getAttribute('sw-editor-color');
        const lineType = line.getAttribute('sw-editor-type'); // current line type
        const htmlText = line.innerHTML;
        // get current draft key
        const draftKey = window.ScriptAdapter.currentDraftKey;   
        // update the content line in the web store
        window.ScriptDataStore.draft[draftKey].data[uid].content = htmlText;
        window.ScriptDataStore.draft[draftKey].data[uid].type = lineType;
        if (lineType === 'character') window.ScriptDataStore.draft[draftKey].data[uid].others.cid = characterID;
        
        // save data
        this.saveCaller();
    }

    conditionState(){
        let state = false;

        const pageWrap = document.querySelector(`[sw-editor="list"]`);
        const pageList = pageWrap.querySelectorAll(`[sw-editor="item"]`);
        const contentLineList = pageWrap.querySelectorAll(`[sw-editor-type]`); 

        // condition 1 for map and react
        if (pageList.length != this.totalPage) {
            this.totalPage = pageList.length;
            // map react for a particular page
            state = true
        }
        // condition 2 for map and react
        if (contentLineList.length != this.totalLine) {
            this.totalLine = contentLineList.length;
            // map react for a particular page
            state = true
        }
        // condition 3 for map and react
        if (this.attributeChanged){ 
            this.attributeChanged = false;
            state = true; 
        }

        return state;
    }

    saveCaller() {
        if (this.saveStatus) return;
        this.saveStatus = true;
        setTimeout(() => {
            this.save().then(data => { 
                console.log('Data saved:', data); 
                this.saveStatus = false;
            }).catch((error) => {
                console.log('Error:', error);
                alert('Unable to save content at this period, please refresh the page.');
            });
        }, 700);
    }

    async save() {
        // get crsf token
        const crsftokenValue = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;
        // Title text
        const title =  document.querySelector(`[sw-data-type="title"]`).innerText;

        // create form and supply the inputs
        const formData = new FormData();
        formData.append('content', JSON.stringify(window.ScriptDataStore));
        formData.append('title', title);
        formData.append('csrfmiddlewaretoken', crsftokenValue);

        // Send the data to store
        const postData = await fetch(location.href+'/save', { method: 'POST', body: formData, });
        return postData.json();
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.Watcher = new Watcher();
})
