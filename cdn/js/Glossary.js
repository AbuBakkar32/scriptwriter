class Glossary {
    attrName = 'sw-glossary'; // custom attribute name
    vars; // global strings across this class
    /** input element containing the crsftoken*/
    crsfToken;
    template;
    list;
    dummy;
    /** timeout status */
    timeOutStatus = false;

    constructor() {
        // card variables
        this.vars = {
            list: `[${this.attrName}="list"]`,
            item: `[${this.attrName}="item"]`,
            menuBtn: `[${this.attrName}="menu-btn"]`,
            menu: `[${this.attrName}="menu"]`,
            title: `[${this.attrName}="title"]`,
            searchBtn: `[${this.attrName}="search-btn"]`,
            body: `[${this.attrName}="body"]`,
            id: `[${this.attrName}="id"]`,
            searchBar: `[${this.attrName}="search-bar"]`,
            editOpt: `[${this.attrName}="edit-option"]`,
            deleteOpt: `[${this.attrName}="delete-option"]`,
            angleUp: `[${this.attrName}="angle-up-btn"]`,
            angleDown: `[${this.attrName}="angle-down-btn"]`,
            crsfTokenAttr: `input[name="csrfmiddlewaretoken"]`,
            editor: `[${this.attrName}="editor"]`,
            eTitle: `[${this.attrName}="editor-title"]`,
            eBody: `[${this.attrName}="editor-body"]`,
            eCreateBtn: `[${this.attrName}="editor-create-btn"]`,
            dummy: `[${this.attrName}="dummy-template"]`,
        };

        // Dummy element
        this.dummy = document.querySelector(this.vars.item);
        /** list of glossary wrapper */
        this.list = document.querySelector(this.vars.list);
        // Request Token
        this.crsfToken = document.querySelector(this.vars.crsfTokenAttr);
        // Glossary template
        this.template = this.list?.querySelector(this.vars.dummy)?.closest(this.vars.item)?.cloneNode(true);
        // Fire Listener
        this.listener();
    }

    listener() {
        // clean template
        if (this.template) {
            this.template.querySelector(this.vars.dummy)?.remove();
            document.querySelector(this.vars.item).remove();
        } else {
            const checkTemplate = this.list?.querySelector(this.vars.item)?.cloneNode(true);
            if (checkTemplate) {
                this.template = checkTemplate;
                const tempTitle = this.template.querySelector(this.vars.title);
                if (tempTitle) tempTitle.innerText = '';
                const tempBody = this.template.querySelector(this.vars.body);
                if (tempBody) tempBody.innerText = '';
                const tempId = this.template.querySelector(this.vars.id);
                if (tempId) tempId.innerText = '';
            }
        }

        document.querySelectorAll(this.vars.item).forEach((glo) => {
            this.setUp(glo);
        });

        /** Editor SetUp: editorWrap, editorTitle, editorBody and editorCreateBtn*/
        const editorCreateBtn = document.querySelector(this.vars.eCreateBtn);
        /* onClick on editor create button to create a new glossary */
        editorCreateBtn?.addEventListener('click', () => {
            this.create();
        });

        /** Search SetUp */
        const searchBar = document.querySelector(this.vars.searchBar); // Input element
        const searchBtn = document.querySelector(this.vars.searchBtn);

        /* onClick on search button */
        searchBtn?.addEventListener('click', () => {
            this.search()
        });
        // Change event on searchBar input element
        searchBar?.addEventListener('change', () => {
            this.search();
        });
        // Keydown event on searchBar input element
        searchBar?.addEventListener('keydown', () => {
            setTimeout(() => {
                this.search();
            }, 10);
        });
        // Focus event on searchBar input element
        searchBar?.addEventListener('focus', () => {
            this.search()
        });
    }

    setUp(glos = this.dummy) {
        /* Basic Elements */
        const menuBtn = glos.querySelector(this.vars.menuBtn);
        const menu = glos.querySelector(this.vars.menu);
        const title = glos.querySelector(this.vars.title);
        const body = glos.querySelector(this.vars.body);
        const Id = glos.querySelector(this.vars.id);
        const editOption = glos.querySelector(this.vars.editOpt);
        const deleteOption = glos.querySelector(this.vars.deleteOpt);
        const angleUp = glos.querySelector(this.vars.angleUp);
        const angleDown = glos.querySelector(this.vars.angleDown);
        /* Basic Settings */
        if (angleUp && angleDown) {
            // show angle down button
            angleDown.classList.remove('hide');
            // adjust the height of the body
            body?.classList.add('h-25');
            // remove the overflow on the body
            body?.classList.replace('overflow-y-auto', 'overflow-hidden');
            // hide angleUp
            angleUp.classList.add('hide');
        }
        menu?.setAttribute('tabindex', '1');

        /* onClick on card dash menu button */
        menuBtn?.addEventListener('click', () => {
            // If className hidden or hide in the wrap then show the wrap
            if (menu?.classList.contains('hide')) {
                menu?.classList.remove('hide');
                menu?.focus();
            } else menu?.classList.add('hide');
        });

        /* onClick on angle up svg(button) */
        angleUp?.addEventListener('click', () => {
            // show angle down button
            angleDown?.classList.remove('hide');
            // adjust the height of the body
            body?.classList.add('h-25');
            // remove the overflow on the body
            body?.classList.replace('overflow-y-auto', 'overflow-hidden');
            // hide angleUp
            angleUp.classList.add('hide');
        });

        /* onClick on angle up svg(button) */
        angleDown?.addEventListener('click', () => {
            // show angle up button
            angleUp?.classList.remove('hide');
            // adjust the height of the body
            body?.classList.remove('h-25');
            // add the overflow on the body
            body?.classList.replace('overflow-hidden', 'overflow-y-auto');
            // hide angleDown
            angleDown.classList.add('hide');
        });

        /* onClick in edit option */
        editOption?.addEventListener('click', () => {
            title.click();
            title.focus()
        })
        /* onClick in delete option */
        deleteOption?.addEventListener('click', () => {
            this.delete(glos);
        });

        body?.addEventListener('keydown', () => {
            if (!this.timeOutStatus) {
                this.timeOutStatus = true;
                setTimeout(() => {
                    this.update(glos);
                    this.timeOutStatus = false;
                }, 500);
            }
        });

        title?.addEventListener('keydown', () => {
            if (!this.timeOutStatus) {
                this.timeOutStatus = true;
                setTimeout(() => {
                    this.update(glos);
                    this.timeOutStatus = false;
                }, 500);
            }
        });

        //If menu lose focus then hide it
        menu?.addEventListener('focusout', () => {
            menu.classList.add('hide');
        });
    }

    /** create glossary with permission */
    create() {
        const editorTitle = document.querySelector(this.vars.eTitle);
        const editorBody = document.querySelector(this.vars.eBody);

        if (!editorTitle?.innerText) {
            alert("Can not create glossary because Name is empty");
            return;
        }
        if (!editorBody?.innerText) {
            alert("Can not create glossary because Content Body is empty");
            return;
        }

        this.sendData('/app-glossary-create', 'POST', undefined, 'create');
    }

    /** delete already existing glossary */
    delete(glos = this.dummy) {
        const ask = confirm('do you want to delete this item');
        if (!ask) return;

        const Id = glos?.querySelector(this.vars.id);
        if (Id?.innerText) {
            const url = '/app-glossary-delete/' + Id?.innerText;
            this.sendData(url, 'GET', glos, 'delete');
        }

    }

    /** update the already created glossary */
    update(glos = this.dummy) {
        const Id = glos?.querySelector(this.vars.id);
        if (Id?.innerText) {
            const url = '/app-glossary-update/' + Id?.innerText;
            this.sendData(url, 'POST', glos, 'update');
        }
    }

    /** search for glossaries through text input in the search form*/
    search() {
        const searchBar = document.querySelector(this.vars.searchBar); // Input element
        const searchValue = searchBar?.value;
        // if the search bar has a value then show all glos title with that value
        const listOfItems = this.list?.querySelectorAll(this.vars.item);
        if (searchValue) {
            listOfItems.forEach((item) => {
                const titleValue = item?.querySelector(this.vars.title)?.innerText;
                if (titleValue?.toLowerCase().includes(searchValue.toLowerCase())) item.classList.remove('hide');
                else item.classList.add('hide');
            });
        } else listOfItems.forEach((item) => {
            item.classList.remove('hide');
        });
    }

    sendData(url, type = "GET", glos = this.dummy, which = "create") {
        //which can be: "create"||"delete"||"update"
        // create form and supply the inputs
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', this.crsfToken.value);

        const editorTitle = document.querySelector(this.vars.eTitle);
        const editorBody = document.querySelector(this.vars.eBody);

        // Send the data to store
        if (type === 'POST') {
            if (which === "update") {
                formData.append('title', glos.querySelector(this.vars.title).innerText);
                formData.append('body', glos.querySelector(this.vars.body).innerText)
            } else if (which === "create") {
                formData.append('title', editorTitle.innerText);
                formData.append('body', editorBody.innerText)
            }
            fetch(url, {method: type, body: formData,})
                .then(response => response.json())
                .then(data => {
                    if (data.result != 'success') alert(data.message);

                    else {
                        if (which === "create") {
                            // Create new glos && set the returned data
                            const newGlos = this.template.cloneNode(true);
                            const tempTitle = newGlos.querySelector(this.vars.title);
                            if (tempTitle) tempTitle.innerText = editorTitle.innerText;
                            const tempBody = newGlos.querySelector(this.vars.body);
                            if (tempBody) tempBody.innerText = editorBody.innerText;
                            const tempId = newGlos.querySelector(this.vars.id);
                            if (tempId) tempId.innerText = data.id;

                            // Append new glos to list
                            this.list.append(newGlos)

                            // SetUp the new glos
                            this.setUp(newGlos)

                            // Clear the editor esction
                            editorTitle.innerText = "";
                            editorBody.innerText = "";
                        }
                    }
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    alert('Note failed!!!');
                })
        } else if (type === 'GET') {
            fetch(url, {method: type})
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        // Delete the card since it has already been deleted inside the backend
                        if (which === "delete") glos.remove();
                    } else alert(data.message);
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    alert('Note failed!!!');
                });
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    window.Glossary = new Glossary();
})