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

        // Initializer
        this.listener();
    }

    hideOrShowSectionExcept(exceptMe) { /* parameter are  charater, location, outline, pinBoard, storyDocs, structure */
        if (exceptMe !== 'charater' && this.characterSection) this.characterSection.classList.add('hidden') ;
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

    listener(){
        //Click event for the various buttons
        this.characterBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('character');
            window.Watcher.siderBarAwait();
            setTimeout(async() => {
                await window.MapAndReactOnContent?.mapreact();
                await window.Watcher.siderBarAwait(false);
            }, 1);
        });

        this.noteBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('note');
        });

        this.outlineBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('outline');
            window.Watcher.siderBarAwait();
            setTimeout(async() => {
                await window.MapAndReactOnContent?.mapreact();
                await window.Watcher.siderBarAwait(false);
            },1);
        });

        this.pinBoardBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('pin-board');
        });

        this.structureBtn?.addEventListener('click', () => {
            this.hideOrShowSectionExcept('structure');
        });
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.ScriptWriterSection = new ScriptWriterSection();
});