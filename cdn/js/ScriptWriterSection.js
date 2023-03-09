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
        this.rightClikMenu();
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

    rightClikMenu() {
        const leftBar = document.querySelector('.side-bar-right-click');
        const contextMenu = document.querySelector('#right-click-menu');
        const addBtn = contextMenu.querySelectorAll('div')[0];
        const removeBtn = contextMenu.querySelectorAll('div')[3];
        const rightClickMenu = document.querySelector('#left-sidebar');
        const removeRightMenu = document.querySelector('#remove-left-sidebar');
        const mainMenu = document.querySelector(`[sw-data="select"]`).querySelectorAll('li');
        setTimeout(() => {
            const dataList = Object.values(window.ScriptAdapter.scriptDataStore.sectionList);
            this.renderSideMenuBarSection(removeBtn, dataList, rightClickMenu, removeRightMenu, mainMenu);
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
        addBtn.addEventListener('mouseover', () => {
            if (rightClickMenu.classList.contains('hide')) {
                rightClickMenu.classList.remove('hide')
                removeRightMenu.classList.add('hide');
            }
        })
    }

    renderSideMenuBarSection(removeBtn, dataList, rightClickMenu, removeRightMenu, mainMenu) {
        const removeLi = document.querySelector('#remove-left-sidebar').querySelectorAll('li')
        const addLi = rightClickMenu.querySelectorAll('li');

        if (dataList.length === 0) {
            removeBtn.style.cursor = 'not-allowed';
            removeBtn.style.opacity = '0.5';
        } else {
            removeBtn.addEventListener('mouseover', () => {
                if (!rightClickMenu.classList.contains('hide')) {
                    rightClickMenu.classList.add('hide');
                }
                if (removeRightMenu.classList.contains('hide')) {
                    removeRightMenu.classList.remove('hide');
                }
            })
        }
        this.mainMenuSection(mainMenu, dataList);
        this.addSection(addLi, dataList);
        this.removeSection(removeLi, dataList);
    }

    mainMenuSection(mainMenu, dataList) {
        for (let i = 1; i < mainMenu.length; i++) {
            if (!dataList.includes(mainMenu[i].innerText.trim())) {
                mainMenu[i].classList.add('hide');
            }
        }
    }

    addSection(selector, dataList) {
        if (selector.length > 0) {
            selector.forEach(li => {
                if (dataList.includes(li.innerText.trim())) {
                    li.classList.add('hide');
                }
            })
        }
    }

    removeSection(selector, dataList) {
        if (selector.length > 0) {
            selector.forEach(li => {
                if (!dataList.includes(li.innerText.trim())) {
                    li.classList.add('hide');
                }
            })
        }
    }
}

function addMenuItem(item) {
    setTimeout(() => {
        const dataList = Object.values(window.ScriptAdapter?.scriptDataStore?.sectionList);
        if (!dataList || dataList.length === 0) {
            window.ScriptAdapter.scriptDataStore.sectionList = [item];
            window.ScriptAdapter?.autoSave();
        }
        if (dataList.length > 0 && !dataList.includes(item)) {
            window.ScriptAdapter.scriptDataStore.sectionList = [...dataList, item];
        }
        window.ScriptAdapter?.autoSave();
    }, 1);
}

function removeMenuItem(item) {
    setTimeout(() => {
        const dataList = Object.values(window.ScriptAdapter?.scriptDataStore?.sectionList);
        if (dataList.length > 0 && dataList.includes(item)) {
            const index = dataList.indexOf(item);
            dataList.splice(index, 1);
            window.ScriptAdapter.scriptDataStore.sectionList = [...dataList];
        }
        window.ScriptAdapter?.autoSave();
    }, 1);
}

document.addEventListener("DOMContentLoaded", function () {
    window.ScriptWriterSection = new ScriptWriterSection();
});