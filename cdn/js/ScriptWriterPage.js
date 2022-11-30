class ScriptWriterPage {
    // Pages
    mainPage;
    characterPage;
    locationPage;
    outlinePage;
    pinBoardPage;
    storyDocsPage;
    structurePage;
    // Buttons
    mainPageBtn;
    characterPageBtn;
    locationPageBtn;
    outlinePageBtn;
    pinBoardPageBtn;
    storyDocsPageBtn;
    structurePageBtn;
    // Headers
    headerTemplate1;
    headerTemplate2;
    headerTemplate3;
    // Right sider bar
    rightSiderBar;
    // Close button for main menu
    mainMenuCloseBtn;
    constructor() {
        //Pages
        this.mainPage = document.querySelector(`[sw-page="main"]`);
        this.characterPage = document.querySelector(`[sw-page="character"]`);
        this.locationPage = document.querySelector(`[sw-page="location"]`);
        this.outlinePage = document.querySelector(`[sw-page="outline"]`);
        this.pinBoardPage = document.querySelector(`[sw-page="pin-board"]`);
        this.storyDocsPage = document.querySelector(`[sw-page="story-docs"]`);
        this.structurePage = document.querySelector(`[sw-page="structure"]`);

        //Buttons
        this.mainPageBtn = document.querySelector(`[sw-btn="page-main"]`);
        this.characterPageBtn = document.querySelector(`[sw-btn="page-character"]`);
        this.locationPageBtn = document.querySelector(`[sw-btn="page-location"]`);
        this.outlinePageBtn = document.querySelector(`[sw-btn="page-outline"]`);
        this.pinBoardPageBtn = document.querySelector(`[sw-btn="page-pinBoard"]`);
        this.storyDocsPageBtn = document.querySelector(`[sw-btn="page-storyDocs"]`);
        this.structurePageBtn = document.querySelector(`[sw-btn="page-structure"]`);

        //Headers Template
        this.headerTemplate1 = document.querySelector(`[sw-header="header1"]`);
        this.headerTemplate2 = document.querySelector(`[sw-header="header2"]`);
        this.headerTemplate3 = document.querySelector(`[sw-header="header3"]`);

        //Right sider bar template
        this.rightSiderBar = document.querySelector(`[sw-page="right-sider"]`);

        //Button for closing main menu
        this.mainMenuCloseBtn = document.querySelector(`[sw-data="close-main-menu"]`);

        //Hide other page
        this.hideOrShowPageExcept('main');
        // Hide other header
        this.hideOrShowHeaderExcept('header1');

        // Initializer
        this.listener();
    }

    hideOrShowPageExcept(exceptMe) { /* parameter are main, charater, location, outline, pinBoard, storyDocs, structure */
        if (exceptMe !== 'main' && this.mainPage) this.mainPage.style.display = 'none';
        if (exceptMe !== 'charater' && this.characterPage) this.characterPage.style.display = 'none';
        if (exceptMe !== 'location' && this.locationPage) this.locationPage.style.display = 'none';
        if (exceptMe !== 'outline' && this.outlinePage) this.outlinePage.style.display = 'none';
        if (exceptMe !== 'pinBoard' && this.pinBoardPage) this.pinBoardPage.style.display = 'none';
        if (exceptMe !== 'storyDocs' && this.storyDocsPage) this.storyDocsPage.style.display = 'none';
        if (exceptMe !== 'structure' && this.structurePage) this.structurePage.style.display = 'none';

        if (exceptMe === 'main' && this.mainPage) this.mainPage.style.display = '';
        if (exceptMe === 'character' && this.characterPage) this.characterPage.style.display = '';
        if (exceptMe === 'location'  && this.locationPage) this.locationPage.style.display = '';
        if (exceptMe === 'outline' && this.outlinePage) this.outlinePage.style.display = '';
        if (exceptMe === 'pinBoard' && this.pinBoardPage) this.pinBoardPage.style.display = '';
        if (exceptMe === 'storyDocs' && this.storyDocsPage) this.storyDocsPage.style.display = '';
        if (exceptMe === 'structure' && this.structurePage) this.structurePage.style.display = '';
        this.mainMenuCloseBtn?.click();

        //change the background color if its structure page, because of the graph.
        if (exceptMe === 'structure') {
            document.querySelector('body').classList.add('bg-structure-page');
            document.querySelector('body').classList.remove('bg-x-gradient-grey-200-grey-200-50-white-100');
        }
        else {
            document.querySelector('body').classList.remove('bg-structure-page');
            document.querySelector('body').classList.add('bg-x-gradient-grey-200-grey-200-50-white-100');
        }
    }

    hideOrShowHeaderExcept(exceptMe) {
        if (exceptMe !== 'header1') {this.headerTemplate1.style.display = 'none'; }
        if (exceptMe !== 'header2') {this.headerTemplate2.style.display = 'none';}
        if (exceptMe !== 'header3') {this.headerTemplate3.style.display = 'none';}
        if (exceptMe === 'header1') {this.headerTemplate1.style.display = ''; this.rightSiderBar.style.display = '';}
        if (exceptMe === 'header2') {this.headerTemplate2.style.display = ''; this.rightSiderBar.style.display = 'none';}
        if (exceptMe === 'header3') {this.headerTemplate3.style.display = ''; this.rightSiderBar.style.display = 'none';}
    }

    listener(){
        //Click event for the various buttons
        this.mainPageBtn?.addEventListener('click', () => { 
            this.hideOrShowPageExcept('main');
            this.hideOrShowHeaderExcept('header1');
            window.Watcher.mainPageAwait();
            setTimeout(async() => {
                await window.MapAndReactOnContent.structureGuideHandle();
                // Rearrange pages if need be
                await window.EditorMode.rearrangePage();
                await window.Watcher.mainPageAwait(false);
            },1);
        });

        this.characterPageBtn?.addEventListener('click', () => {
            this.hideOrShowPageExcept('character');
            this.hideOrShowHeaderExcept('header3');
            this.awaitTrigger();
        });

        this.outlinePageBtn?.addEventListener('click', () => {
            this.hideOrShowPageExcept('outline');
            this.hideOrShowHeaderExcept('header3');
            this.awaitTrigger();
        });

        this.pinBoardPageBtn?.addEventListener('click', () => {
            this.hideOrShowPageExcept('pinBoard');
            this.hideOrShowHeaderExcept('header3');
            this.awaitTrigger();
        });

        this.locationPageBtn?.addEventListener('click', () => {
            this.hideOrShowPageExcept('location');
            this.hideOrShowHeaderExcept('header2');
            this.awaitTrigger();
        });

        this.storyDocsPageBtn?.addEventListener('click', () => {
            this.hideOrShowPageExcept('storyDocs');
            this.hideOrShowHeaderExcept('header2');
            this.awaitTrigger();
        });

        this.structurePageBtn?.addEventListener('click', () => {
            this.hideOrShowPageExcept('structure');
            this.hideOrShowHeaderExcept('header3');
            this.awaitTrigger();
            //document.querySelector('body').style.backgroundImage = 'linear-gradient(0deg,#acc1d4,#89bbea 0%,#b3e6c3 100%)!important;'
        });
    }

    awaitTrigger() {
        window.Watcher.mainPageAwait();
        setTimeout(async() => {
            await window.MapAndReactOnContent?.mapreact();
            console.log('awaitTrigger');
            await window.Watcher.mainPageAwait(false);
        }, 1);
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.ScriptWriterPage = new ScriptWriterPage();
});
