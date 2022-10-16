class CardOption {
    attrName = `sw-card-option`; // custom attribute name
    cardVar; // global strings across this class
    cardList; // list of cards main element
    /** input element containing the crsftoken*/
    crsfToken;
    dummyCard;
    bg;
    bgValueList;
    constructor() {
        // card variables
        this.cardVar = {
            cardWrap: `[${this.attrName}="card"]`, optionMenuBtn: `[${this.attrName}="option-menu-btn"]`, 
            optionWrap: `[${this.attrName}="option-wrap"]`, title: `[${this.attrName}="title"]`,
            body: `[${this.attrName}="body"]`, cardId: `[${this.attrName}="card-id"]`, 
            renameOpt: `[${this.attrName}="rename-option"]`, addOpt: `[${this.attrName}="add-option"]`, 
            deleteOpt: `[${this.attrName}="delete-option"]`, colorOpt: `[${this.attrName}="color-option"]`,
            openOpt: `[${this.attrName}="open-option"]`,
            colorWrap:  `[${this.attrName}="color-wrap"]`, angleUp: `[${this.attrName}="angle-up-btn"]`, 
            angleDown: `[${this.attrName}="angle-down-btn"]`, vital: `[${this.attrName}="vital"]`,
            bgValue: `bg-value`, crsfTokenAttr: `input[name="csrfmiddlewaretoken"]`, borderLeft: `[${this.attrName}="border-left"]`,
        };

        /* Background colors style="border-left: 8px solid #2c8da6;"*/
        this.bg = window.BackgroundColor.bg;

        // Background colors
        //this.bgValueList = window.BackgroundColor.bgValueList;

        // list of cards wrap
        this.cardList = document.querySelectorAll(this.cardVar.cardWrap);

        this.crsfToken = document.querySelector(this.cardVar.crsfTokenAttr);

        this.dummyCard = document.querySelector(this.cardVar.cardWrap);

        // Fire Listener
        this.listener();
    }

    listener() {
        // Apply listener on all cardWrap
        if (!document.querySelector(`[sw-card-option="list"]`)) { this.cardList.forEach((card) => { this.addListeners(card) })};
    }

    addListeners(card = this.dummyCard, rs={enabled: false, card:null}) {
        this.clickListener(card, rs);
        this.focusListener(card, rs);
        this.keyDownListener(card, rs);
    }

    clickListener(card = this.dummyCard, rs={enabled: false, card:null}) {
        // Clickable elements
        const optionMenuBtn = card.querySelector(this.cardVar.optionMenuBtn);
        const optionWrap = card.querySelector(this.cardVar.optionWrap); // wrapper conaining all options
        const angleUp = card.querySelector(this.cardVar.angleUp);
        const angleDown = card.querySelector(this.cardVar.angleDown);
        const addOption = card.querySelector(this.cardVar.addOpt);
        const renameOption = card.querySelector(this.cardVar.renameOpt);
        const deleteOption = card.querySelector(this.cardVar.deleteOpt);
        const colorOption = card.querySelector(this.cardVar.colorOpt);
        const openOption = card.querySelector(this.cardVar.openOpt);
        const colorWrap = card.querySelector(this.cardVar.colorWrap);
        const body = card.querySelector(this.cardVar.body);
        const title = card.querySelector(this.cardVar.title);
        const cardId = card.querySelector(this.cardVar.cardId);

        /* Basic Setup*/
        if (angleUp && angleDown) {
            // show angle down button
            angleDown.classList.remove('hide');
            // adjust the height of the card
            card.classList.replace('rem-h15', 'rem-h6');
            // adjust the height of the body
            body?.classList.replace('rem-h10', 'h-20');
            // remove the overflow on the body
            body?.classList.replace('overflow-y-auto', 'overflow-hidden');
            // hide angleUp
            angleUp.classList.add('hide');
        }
        colorWrap?.classList.add('hide');
        title?.setAttribute('tabindex', '1');
        title?.setAttribute('contenteditable', 'false');
        optionWrap?.setAttribute('tabindex', '1');
        
        /* onClick on card dash menu button */
        optionMenuBtn?.addEventListener('click', ()=> {
            // If className hidden or hide in the wrap then show the wrap
            if (optionWrap?.classList.contains('hide')) {
                optionWrap?.classList.remove('hide');
                optionWrap?.focus();
            }else optionWrap?.classList.add('hide');
        });

        /* Right click on card dash menu button */
        optionMenuBtn?.addEventListener('contextmenu', (e)=> {
            e.preventDefault();
            // If className hidden or hide in the wrap then show the wrap
            if (optionWrap?.classList.contains('hide')) {
                optionWrap?.classList.remove('hide');
                optionWrap?.focus();
            }else optionWrap?.classList.add('hide');
        });

        /* onClick on angle up svg(button) */
        angleUp?.addEventListener('click', ()=> {
            // show angle down button
            angleDown?.classList.remove('hide');
            // adjust the height of the card
            card.classList.replace('rem-h15', 'rem-h6');
            // adjust the height of the body
            body?.classList.replace('rem-h10', 'h-20');
            // remove the overflow on the body
            body?.classList.replace('overflow-y-auto', 'overflow-hidden');
            // hide angleUp
            angleUp.classList.add('hide');
        });

        /* onClick on angle up svg(button) */
        angleDown?.addEventListener('click', ()=> {
            // show angle up button
            angleUp?.classList.remove('hide');
            // adjust the height of the card
            card.classList.replace('rem-h6', 'rem-h15');
            // adjust the height of the body
            body?.classList.replace('h-20', 'rem-h10');
            // add the overflow on the body
            body?.classList.replace('overflow-hidden','overflow-y-auto');
            // hide angleDown
            angleDown.classList.add('hide');
        });

        /* onClick on add option */
        addOption?.addEventListener('click', ()=> {
            const newCard = card.cloneNode(true); // create new card
            const newCardTitle = newCard.querySelector(this.cardVar.title); // remove title and body contents
            if (newCardTitle) newCardTitle.innerText = '';
            const newCardBody = newCard.querySelector(this.cardVar.body);
            if (newCardBody) newCardBody.innerText = '';

            /* Basic Setup */
            newCard.querySelector(this.cardVar.angleDown)?.classList.remove('hide'); // show angle down button
            newCard.classList.replace('rem-h15', 'rem-h6'); // adjust the height of the card
            newCardBody?.classList.replace('rem-h10', 'h-20'); // adjust the height of the body
            newCardBody?.classList.remove('overflow-y-auto'); // remove the overflow on the body
            newCard.querySelector(this.cardVar.angleUp)?.classList.add('hide'); // hide angleUp
            newCard.querySelector(this.cardVar.colorWrap)?.classList.add('hide'); // Hide color wrap
            card.insertAdjacentElement('afterend', newCard); // Add the new card after the previous card
            newCard.classList.add('hide'); // hide new card and oly show it when created in DB

            if (rs.enabled) {
                const rsNewCard = rs.card.cloneNode(true); // create new card
                const rsNewCardTitle = rsNewCard.querySelector(this.cardVar.title); // remove title and body contents
                if (rsNewCardTitle) rsNewCardTitle.innerText = '';
                const rsNewCardBody = rsNewCard.querySelector(this.cardVar.body);
                if (rsNewCardBody) rsNewCardBody.innerText = '';
                rsNewCard.querySelector(this.cardVar.colorWrap)?.classList.add('hide'); // Hide color wrap
                rs.card.insertAdjacentElement('afterend', rsNewCard); // Add the new card after the previous card
                rsNewCard.classList.add('hide'); // hide new card and oly show it when created in DB
                const newRs = {enabled: true, card: rsNewCard};
                this.addListeners(newCard, newRs); // Add listener to new card
                this.rsSetUp(rsNewCard, newCard);
                this.add(newCard, newRs); // Add it to database
            } else {
                this.addListeners(newCard); // Add listener to new card
                this.add(newCard); // Add it to database
            }
        });

        /* onClick in open option */
        openOption?.addEventListener('click', ()=> { setTimeout(() => { window.location = '/scriptwork/'+cardId.innerText }, 10); });

        /* onClick in rename option */
        renameOption?.addEventListener('click', ()=> { this.rename(card, rs); });

        /* onClick in delete option */
        deleteOption?.addEventListener('click', ()=> { this.delete(card, rs); });

        /* onClick in color option */
        colorOption?.addEventListener('click', ()=> {
            if (colorWrap.classList.contains('hide')) colorWrap.classList.remove('hide');
            else colorWrap.classList.add('hide');
        });

        /* onclick in color wrapper children with color var bg-value */
        const colorList = colorWrap.querySelectorAll(`[${this.cardVar.bgValue}]`);
        colorList.forEach((color) => {
            if (color.getAttribute(this.cardVar.bgValue)) {
                color.addEventListener('click', ()=> {
                    //console.log(color.getAttribute(this.cardVar.bgValue));
                    // Get the current background color
                    const theCurrentBgValue = colorOption?.querySelector(`[${this.cardVar.bgValue}]`)?.getAttribute(this.cardVar.bgValue);
                    const currentSelectedColor = color.getAttribute(this.cardVar.bgValue); // get the selected background color
                    // set the current selected color to the card
                    if(card.getAttribute(this.cardVar.bgValue)) {
                        card.classList.replace(theCurrentBgValue, currentSelectedColor);
                        card.setAttribute(this.cardVar.bgValue, currentSelectedColor);
                    } 

                    const borderLeft = card.querySelector(this.cardVar.borderLeft);
                    if (borderLeft) {
                        borderLeft.style.borderLeft = `8px solid ${this.bg[currentSelectedColor.replace('bg-','')]}`;
                    }

                    const colorOptionToBgValue = colorOption.querySelector(`[${this.cardVar.bgValue}]`);
                    colorOptionToBgValue?.setAttribute(this.cardVar.bgValue, currentSelectedColor);
                    colorOptionToBgValue?.classList.replace(theCurrentBgValue, currentSelectedColor);

                    colorWrap.classList.add('hide'); // hide the color wrap

                    if(rs.enabled) {
                        rs.card.classList.replace(theCurrentBgValue, currentSelectedColor);
                        rs.card.setAttribute(this.cardVar.bgValue, currentSelectedColor);
                        const rsColorOption = rs.card.querySelector(this.cardVar.colorOpt).querySelector(`[${this.cardVar.bgValue}]`);
                        rsColorOption?.setAttribute(this.cardVar.bgValue, currentSelectedColor);
                        rsColorOption?.classList.replace(theCurrentBgValue, currentSelectedColor);
                    }
                    
                    this.update(card, rs); // update the card on database
                });
            }
        })
    }

    keyDownListener(card = this.dummyCard, rs={enabled: false, card:null}) {
        const body = card.querySelector(this.cardVar.body);
        const title = card.querySelector(this.cardVar.title);
        const rsBody = rs.card?.querySelector(this.cardVar.body);
        const rsTitle = rs.card?.querySelector(this.cardVar.title);

        body?.addEventListener('keydown', ()=> {
            setTimeout(() => {
                if (rs.enabled) rsBody.innerText = body.innerText;
                this.update(card, rs);
            }, 500);
        });

        title?.addEventListener('keydown', ()=> {
            setTimeout(() => {
                if (rs.enabled) rsTitle.innerText = title.innerText;
                this.update(card, rs);
            }, 500);
        });

        rsBody?.addEventListener('keydown', ()=> {
            setTimeout(() => {
                if (body) body.innerText = rsBody.innerText;
                this.update(card, rs);
            }, 500);
        });

        rsTitle?.addEventListener('keydown', ()=> {
            setTimeout(() => {
                if (title) title.innerText = rsTitle.innerText;
                this.update(card, rs);
            }, 500);
        });
    }

    focusListener(card = this.dummyCard, rs={enabled: false, card:null}) {
        const optionWrap = card.querySelector(this.cardVar.optionWrap);
        const title = card.querySelector(this.cardVar.title);

        const rsOptionWrap = rs.card?.querySelector(this.cardVar.optionWrap);
        const rsTitle = rs.card?.querySelector(this.cardVar.title);

        //If optionWrap lose focus then hide it
        optionWrap?.addEventListener('focusout', ()=> { optionWrap.classList.add('hide'); });
        // if title lose focus then change contenteditable to false
        title?.addEventListener('focusout', ()=> { title.setAttribute('contenteditable', 'false'); });

        //If optionWrap lose focus then hide it
        rsOptionWrap?.addEventListener('focusout', ()=> { rsOptionWrap.classList.add('hide'); });
        // if title lose focus then change contenteditable to false
        rsTitle?.addEventListener('focusout', ()=> { rsTitle.setAttribute('contenteditable', 'false'); });
    }

    determindSendData(card = this.dummyCard) {
        /* the only time we defind piority is when we want to call this.sendData with which="update" after which="add" */
        const myType = { vital: true, useDB: false, piority: false, noteId: '' };

        // check if card is vital
        const vitalCard = card.querySelector(this.cardVar.vital);
        if (!vitalCard) myType.vital = !myType.vital;

        // check if webstore is available or useDB
        if (window.ScriptAdapter) myType.useDB = !myType.useDB;

        // check if card has id
        const noteId = card.querySelector(this.cardVar.cardId);
        if (noteId) myType.noteId = noteId.innerText;

        // piority is determine when there is no card id and there is a webstore
        if (!noteId && window.ScriptAdapter) myType.piority = !myType.piority;

        return myType;
    }

    rename(card = this.dummyCard, rs={enabled: false, card:null}) {        
        // get card title
        const title = card.querySelector(this.cardVar.title);
        const rsTitle = rs.card.querySelector(this.cardVar.title);
        if (title) {
            title.setAttribute('contenteditable', 'true'); title.click(); title.focus();
        }

        if (rs.enabled) {
            rsTitle.setAttribute('contenteditable', 'true'); rsTitle.click(); rsTitle.focus();
        }
    }

    add(card = this.dummyCard, rs={enabled: false, card:null}) {
        // what kind of card is this?
        const whatCard = this.determindSendData(card);
        if (whatCard.vital) {
            if (whatCard.useDB) this.sendData('/note-create', 'GET', card, 'add', whatCard.useDB, whatCard.piority, whatCard.vital, rs);
            else this.sendData('/note-create', 'GET', card, 'add', whatCard.useDB, whatCard.piority, whatCard.vital, rs); 
        }
    }

    delete(card = this.dummyCard, rs={enabled: false, card:null}) {
        const ask = confirm('do you want to delete this item');
        if (!ask) return;
        // what kind of card is this?
        const whatCard = this.determindSendData(card);
        if (whatCard.vital) {
            if (document.querySelectorAll(this.cardVar.vital).length > 1) {
                if (whatCard.noteId) {
                    let url = '/note-delete/'+whatCard.noteId;
                    if (!whatCard.vital) url = '/script-work-delete/'+whatCard.noteId;

                    if (whatCard.useDB) this.sendData(url, 'GET', card, 'delete', whatCard.useDB, whatCard.piority, whatCard.vital, rs);
                    else this.sendData(url, 'GET', card, 'delete', whatCard.useDB, whatCard.piority, whatCard.vital);
                }
            } 
        } else {
            if (whatCard.noteId) {
                let url = '/note-delete/'+whatCard.noteId;
                if (!whatCard.vital) url = '/script-work-delete/'+whatCard.noteId;

                if (whatCard.useDB) this.sendData(url, 'GET', card, 'delete', whatCard.useDB, whatCard.piority, whatCard.vital, rs);
                else this.sendData(url, 'GET', card, 'delete', whatCard.useDB, whatCard.piority, whatCard.vital);
            }
        }
    }

    update(card = this.dummyCard, rs={enabled: false, card:null}) {
        // what kind of card is this?
        const whatCard = this.determindSendData(card);
        if (whatCard.noteId) {
            let url = '/note-update/'+whatCard.noteId;
            if (!whatCard.vital) url = '/script-work-update/'+whatCard.noteId;
            
            if (whatCard.useDB) this.sendData(url, 'POST', card, 'update', whatCard.useDB, whatCard.piority, whatCard.vital, rs);
            else this.sendData(url, 'POST', card, 'update', whatCard.useDB, whatCard.piority, whatCard.vital, rs);
        } else {
            if (whatCard.piority) this.sendData('/note-create', 'GET', card, 'add', whatCard.useDB, whatCard.piority, whatCard.vital, rs);
            else this.sendData('/note-create', 'GET', card, 'add', whatCard.useDB, !whatCard.piority, whatCard.vital, rs);   
        }
    }
    
    sendData(url, type="GET", card=this.dummyCard, which="add", useDB=false, piority=false, vital=true, rs={enabled: false, card:null}) {
        //which can be: "add"||"delete"||"update"
        // create form and supply the inputs
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', this.crsfToken.value);

        // Send the data to store
        if (type === 'POST' && !useDB && vital) {
            if (which === "update") {
                formData.append('color', card.getAttribute(this.cardVar.bgValue));
                formData.append('title', card.querySelector(this.cardVar.title).innerText);
                formData.append('body', card.querySelector(this.cardVar.body).innerText)
            }
            fetch(url, { method: type, body: formData,})
            .then(response => response.json())
            .then(data => {
                if (data.result != 'success') alert(data.message);
            })
            .catch((error) => { console.log('Error: ', error); alert('Note failed!!!');})
        } else if (type === 'GET' && !useDB && vital) {
            fetch(url, { method: type})
            .then(response => response.json())
            .then(data => {
                if(data.result === 'success') {
                    if (which === "add") {
                        // update the card id
                        const cardID = card.querySelector(this.cardVar.cardId);
                        if (cardID) cardID.innerText = data.id;
                        // Update the card bg color
                        if (!piority) {
                            const cardBgColor = card.getAttribute(this.cardVar.bgValue);
                            card.classList.replace(cardBgColor, data.color);
                            card.setAttribute(this.cardVar.bgValue, data.color);

                            const colorOptionToBgValue = card.querySelector(this.cardVar.colorOpt)?.querySelector(`[${this.cardVar.bgValue}]`);
                            colorOptionToBgValue?.setAttribute(this.cardVar.bgValue, data.color);
                            colorOptionToBgValue?.classList.replace(cardBgColor, data.color);

                            // hide the option wrap
                            card.querySelector(this.cardVar.optionWrap)?.classList.add('hide');
                            
                            // Show the new card
                            card.classList.remove('hide');
                        }

                        // if piority is true then then an update will be called
                        if (piority) this.update(card);

                    } else if (which === "delete") {
                        // Delete the card since it has already been deleted inside the backend
                        card.remove();
                    }
                } else alert(data.message);
            })
            .catch((error) => {
                console.log('Error: ', error);
                alert('Note failed!!!');
            });
        }

        if(useDB && vital) {
            // window.ScriptAdapter.scriptDataStore.pinboard
            // window.ScriptAdapter.save()
            if (which === 'add') {
                // create new id && // random bg color
                const data = {
                    color: window.BackgroundColor.randomBg(),
                    id: '0'+quickID().substr(2), // + document.querySelectorAll(this.cardVar.cardWrap).length + 1
                };

                // create the pinboard
                window.ScriptAdapter.scriptDataStore.pinboard[data.id] = { id: data.id, title: '', body: '', color: data.color };

                // update the card id
                const cardID = card.querySelector(this.cardVar.cardId);
                if (cardID) cardID.innerText = data.id;

                // if right sider bar element
                if (rs.enabled) rs.card.querySelector(this.cardVar.cardId).textContent = data.id;

                // Update the card bg color
                if (!piority) {
                    const cardBgColor = card.getAttribute(this.cardVar.bgValue);
                    card.classList.replace(cardBgColor, data.color);
                    card.setAttribute(this.cardVar.bgValue, data.color);

                    const colorOptionToBgValue = card.querySelector(this.cardVar.colorOpt)?.querySelector(`[${this.cardVar.bgValue}]`);
                    colorOptionToBgValue?.setAttribute(this.cardVar.bgValue, data.color);
                    colorOptionToBgValue?.classList.replace(cardBgColor, data.color);

                    card.querySelector(this.cardVar.optionWrap)?.classList.add('hide'); // hide the option wrap
                    card.classList.remove('hide'); // Show the new card

                    // if right sider bar element
                    if (rs.enabled) {
                        rs.card.classList.replace(cardBgColor, data.color);
                        rs.card.setAttribute(this.cardVar.bgValue, data.color);

                        const rsBgValue = card.querySelector(this.cardVar.colorOpt)?.querySelector(`[${this.cardVar.bgValue}]`);
                        rsBgValue?.setAttribute(this.cardVar.bgValue, data.color);
                        rsBgValue?.classList.replace(cardBgColor, data.color);

                        rs.card.querySelector(this.cardVar.optionWrap)?.classList.add('hide'); // hide the option wrap
                        rs.card.classList.remove('hide'); // Show the new rs card
                    }
                };

                // save the pinBoard
                window.ScriptAdapter.autoSave();

                // if piority is true then an update will be called
                if (piority) this.update(card, rs);
            } else if (which === 'delete') {
                // Get the id of this pinBoard card
                const cardID = card.querySelector(this.cardVar.cardId)?.innerText;
                if (cardID) {
                    delete window.ScriptAdapter.scriptDataStore.pinboard[cardID]; // delete the pinboard from web database
                    card.remove(); // delete card
                    if(rs.enabled) rs.card.remove();
                    window.ScriptAdapter.autoSave(); // ensure the remaining pinBoards is saved
                };
            } else if (which === 'update') {
                // Get the id of this pinBoard card
                const cardID = card.querySelector(this.cardVar.cardId)?.innerText;
                if (cardID) {
                    const currentColor = card.getAttribute(this.cardVar.bgValue);
                    const currentTitle =  card.querySelector(this.cardVar.title)?.innerText;
                    const currentBody = card.querySelector(this.cardVar.body)?.innerText;

                    // update this particular pinboard
                    window.ScriptAdapter.scriptDataStore.pinboard[cardID].title = currentTitle;
                    window.ScriptAdapter.scriptDataStore.pinboard[cardID].body = currentBody;
                    window.ScriptAdapter.scriptDataStore.pinboard[cardID].color = currentColor;

                    // save the pinBoard
                    window.ScriptAdapter.autoSave();;
                }
            }
        }

        if (!vital) {
            if (which === 'update') {
                const bgValue = card.querySelector(this.cardVar.colorOpt)?.querySelector(`[${this.cardVar.bgValue}]`);
                formData.append('color', (bgValue?.getAttribute(this.cardVar.bgValue) || 'bg-blue'));
                formData.append('title', card.querySelector(this.cardVar.title).innerText);
                fetch(url, { method: type, body: formData,})
                .then(response => response.json())
                .then(data => { if (data.result != 'success') alert(data.message); })
                .catch((error) => { console.log('Error: ', error); alert('Script failed!!!'); });
            } else if (which === 'delete') {
                fetch(url, { method: type})
                .then(response => response.json())
                .then(data => { 
                    if(data.result != 'success') alert(data.message);
                    else card.remove();
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    alert('Script failed!!!');
                });
            }
        }
    }

    rsSetUp(rsCard=this.dummyCard, card= this.dummyCard) {
        // Clickable elements
        const optionMenuBtn = rsCard.querySelector(this.cardVar.optionMenuBtn);
        const optionWrap = rsCard.querySelector(this.cardVar.optionWrap); // wrapper conaining all options

        const addOption = rsCard.querySelector(this.cardVar.addOpt);
        const renameOption = rsCard.querySelector(this.cardVar.renameOpt);
        const deleteOption = rsCard.querySelector(this.cardVar.deleteOpt);
        const colorOption = rsCard.querySelector(this.cardVar.colorOpt);

        const colorWrap = rsCard.querySelector(this.cardVar.colorWrap);
        const body = rsCard.querySelector(this.cardVar.body);
        const title = rsCard.querySelector(this.cardVar.title);
        const cardId = rsCard.querySelector(this.cardVar.cardId);

        /** Basic SetUp */
        colorWrap?.classList.add('hide');
        title?.setAttribute('tabindex', '1');
        title?.setAttribute('contenteditable', 'false');
        optionWrap?.setAttribute('tabindex', '1');

        // Listeners
        /* onClick on card dash menu button */
        optionMenuBtn?.addEventListener('click', ()=> {
            // If className hidden or hide in the wrap then show the wrap
            if (optionWrap?.classList.contains('hide')) {
                optionWrap?.classList.remove('hide');
                optionWrap?.focus();
            }else optionWrap?.classList.add('hide');
        });

        /* onClick on add option */
        addOption?.addEventListener('click', ()=> { card.querySelector(this.cardVar.addOpt)?.click() });
        /* onClick in rename option */
        renameOption?.addEventListener('click', ()=> { card.querySelector(this.cardVar.renameOpt)?.click() });
        /* onClick in delete option */
        deleteOption?.addEventListener('click', ()=> { card.querySelector(this.cardVar.deleteOpt)?.click() });

        /* onClick in color option */
        colorOption?.addEventListener('click', ()=> {
            if (colorWrap.classList.contains('hide')) colorWrap.classList.remove('hide');
            else colorWrap.classList.add('hide');
        });

        /* onclick in color wrapper children with color var bg-value */
        const colorList = colorWrap.querySelectorAll(`[${this.cardVar.bgValue}]`);
        const cardColorList = card.querySelector(this.cardVar.colorWrap).querySelectorAll(`[${this.cardVar.bgValue}]`);
        colorList.forEach((color) => {
            if (color.getAttribute(this.cardVar.bgValue)) {
                const colorPos = getEleId(color, colorList);
                //console.log(cardColorList[colorPos]);
                color.addEventListener('click', ()=> { cardColorList[colorPos].dispatchEvent(new Event('click')); colorWrap.classList.add('hide'); });
            }
        });

    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.CardOption = new CardOption();
})

