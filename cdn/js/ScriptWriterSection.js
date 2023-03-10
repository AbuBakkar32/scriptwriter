class ScriptWriterSection {
    // Pages
    characterSection;
    noteSection;
    outlineSection;
    pinBoardSection;
    structureSection;
    // Buttons
    characterBtn;
    noteBtn;
    outlineBtn;
    pinBoardBtn;
    structureBtn;

    constructor() {
        //Pages
        this.characterSection = document.querySelector(`[sw-section="character"]`);
        this.noteSection = document.querySelector(`[sw-section="note"]`);
        this.outlineSection = document.querySelector(`[sw-section="outline"]`);
        this.pinBoardSection = document.querySelector(`[sw-section="pin-board"]`);
        this.structureSection = document.querySelector(`[sw-section="structure"]`);

        //Buttons
        this.characterBtn = document.querySelector(`[sw-section-btn="character"]`);
        this.noteBtn = document.querySelector(`[sw-section-btn="note"]`);
        this.outlineBtn = document.querySelector(`[sw-section-btn="outline"]`);
        this.pinBoardBtn = document.querySelector(`[sw-section-btn="pin-board"]`);
        this.structureBtn = document.querySelector(`[sw-section-btn="structure"]`);

        //Hide other section
        this.hideOrShowSectionExcept('structure');
        window.MapAndReactOnContent?.mapreact();
        this.rightClickMenu();
        // Initializer
        this.listener();
    }

    hideOrShowSectionExcept(exceptMe) { /* parameter are  character, location, outline, pinBoard, storyDocs, structure */
        if (exceptMe !== 'character' && this.characterSection) this.characterSection.classList.add('hidden');
        if (exceptMe !== 'note' && this.noteSection) this.noteSection.classList.add('hidden');
        if (exceptMe !== 'outline' && this.outlineSection) this.outlineSection.classList.add('hidden');
        if (exceptMe !== 'pin-board' && this.pinBoardSection) this.pinBoardSection.classList.add('hidden');
        if (exceptMe !== 'structure' && this.structureSection) this.structureSection.classList.add('hidden');

        if (exceptMe === 'character' && this.characterSection) this.characterSection.classList.remove('hidden');
        if (exceptMe === 'note' && this.noteSection) this.noteSection.classList.remove('hidden');
        if (exceptMe === 'outline' && this.outlineSection) this.outlineSection.classList.remove('hidden');
        if (exceptMe === 'pin-board' && this.pinBoardSection) this.pinBoardSection.classList.remove('hidden');
        if (exceptMe === 'structure' && this.structureSection) this.structureSection.classList.remove('hidden');
    }

    listener() {
        //Click event for the various buttons
        this.characterBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('character');
            window.Watcher.siderBarAwait();
            setTimeout(async () => {
                await window.MapAndReactOnContent?.mapreact();
                await window.Watcher.siderBarAwait(false);
            }, 1);
        });

        this.noteBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('note');
            window.Watcher.siderBarAwait();
            setTimeout(async () => {
                await window.MapAndReactOnContent?.mapreact();
                await window.Watcher.siderBarAwait(false);
            }, 1);
        });

        this.outlineBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('outline');
            window.Watcher.siderBarAwait();
            setTimeout(async () => {
                await window.MapAndReactOnContent?.mapreact();
                await window.Watcher.siderBarAwait(false);
            }, 1);
        });

        this.pinBoardBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('pin-board');
            window.Watcher.siderBarAwait();
            setTimeout(async () => {
                await window.MapAndReactOnContent?.mapreact();
                await window.Watcher.siderBarAwait(false);
            }, 1);
        });

        this.structureBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('structure');
            window.Watcher.siderBarAwait();
            setTimeout(async () => {
                await window.MapAndReactOnContent?.mapreact();
                await window.Watcher.siderBarAwait(false);
            }, 1);
        });
    }

    rightClickMenu() {
        const leftBar = document.querySelector('.side-bar-right-click');
        const contextMenu = document.querySelector('#right-click-menu');
        const addBtn = contextMenu.querySelectorAll('div')[0];
        const removeBtn = contextMenu.querySelectorAll('div')[3];
        const rightClickMenu = document.querySelector('#left-sidebar');
        const removeRightMenu = document.querySelector('#remove-left-sidebar');
        const mainMenu = document.querySelector(`[sw-data="select"]`).querySelectorAll('li');
        setTimeout(() => {
            let dataList;
            try {
                dataList = Object.values(window.ScriptAdapter.scriptDataStore.sectionList);
            } catch (e) {
                dataList = [];
            }
            this.renderSideMenuBarSection(addBtn, removeBtn, dataList, rightClickMenu, removeRightMenu, mainMenu);
        }, 1);
        document.addEventListener('click', () => {
            if (!contextMenu.classList.contains('hide')) {
                contextMenu.classList.add('hide')
            }
            if (!rightClickMenu.classList.contains('hide')) {
                rightClickMenu.classList.add('hide')
            }
            if (!removeRightMenu.classList.contains('hide')) {
                removeRightMenu.classList.add('hide')
            }
        });
        leftBar.addEventListener('contextmenu', event => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            contextMenu.style.marginTop = `${event.pageY - 222}px`;
            rightClickMenu.style.marginTop = `${event.pageY - 222}px`;
            removeRightMenu.style.marginTop = `${event.pageY - 222}px`;
            contextMenu.classList.contains('hide') ? contextMenu.classList.remove('hide') : contextMenu.classList.add('hide');
        });
    }

    renderSideMenuBarSection(addBtn, removeBtn, dataList, rightClickMenu, removeRightMenu, mainMenu) {
        const addLi = Array.from(rightClickMenu.querySelectorAll('li'));
        const removeLi = Array.from(removeRightMenu.querySelectorAll('li'));

        this.mainMenuSection(mainMenu, dataList);
        this.addSection(addLi, dataList);
        this.removeSection(removeLi, dataList);

        addBtn.addEventListener('mouseover', () => {
            rightClickMenu.classList.toggle('hide', dataList.length === 6);
            removeRightMenu.classList.add('hide');
        });

        removeBtn.addEventListener('mouseover', () => {
            rightClickMenu.classList.add('hide');
            removeRightMenu.classList.toggle('hide', dataList.length === 0);
        });
    }

    mainMenuSection(mainMenu, dataList) {
        for (let i = 1; i < mainMenu.length; i++) {
            if (!dataList.includes(mainMenu[i].innerText.trim())) {
                mainMenu[i].classList.add('hide');
            }
        }
    }

    addSection(addLi, dataList) {
        addLi.forEach(li => {
            if (dataList.includes(li.innerText.trim())) {
                li.classList.add('hide');
            }
        });
    }

    removeSection(removeLi, dataList) {
        removeLi.forEach(li => {
            if (!dataList.includes(li.innerText.trim())) {
                li.classList.add('hide');
            }
        });
    }
}

function addMenuItem(item) {
    const {sectionList} = window.ScriptAdapter.scriptDataStore;
    const dataList = Array.isArray(sectionList) ? sectionList : [];
    if (!dataList.includes(item)) {
        window.ScriptAdapter.scriptDataStore.sectionList = [...dataList, item];
        window.ScriptAdapter?.autoSave();
    }
    setTimeout(() => {
        window.ScriptWriterSection.rightClickMenu();
    }, 1);

    const data = Object.values(window.ScriptAdapter.scriptDataStore.sectionList);
    const li = document.querySelector(`[sw-data="select"]`).querySelectorAll('li');
    const removeRightMenu = document.querySelector('#remove-left-sidebar');
    for (let i = 1; i < li.length; i++) {
        if (!data.includes(li[i].innerText.trim())) {
            li[i].classList.add('hide');
        } else {
            li[i].classList.remove('hide');
        }
    }

    const removeLi = Array.from(removeRightMenu.querySelectorAll('li'));
    removeLi.forEach(li => {
        if (!data.includes(li.innerText.trim())) {
            li.classList.add('hide');
        } else {
            li.classList.remove('hide');
        }
    });

}

function removeMenuItem(item) {
    const {sectionList} = window.ScriptAdapter.scriptDataStore;
    const dataList = Array.isArray(sectionList) ? sectionList : [];
    const itemIndex = dataList.indexOf(item);
    if (itemIndex > -1) {
        dataList.splice(itemIndex, 1);
        window.ScriptAdapter.scriptDataStore.sectionList = dataList;
        window.ScriptAdapter?.autoSave();
    }
    setTimeout(() => {
        window.ScriptWriterSection.rightClickMenu();
    }, 1);

    const data = Object.values(window.ScriptAdapter.scriptDataStore.sectionList);
    const rightClickMenu = document.querySelector('#left-sidebar');
    const addLi = Array.from(rightClickMenu.querySelectorAll('li'));
    addLi.forEach(li => {
        if (data.includes(li.innerText.trim())) {
            li.classList.add('hide');
        } else {
            li.classList.remove('hide');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    window.ScriptWriterSection = new ScriptWriterSection();
});