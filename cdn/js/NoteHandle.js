class NoteHandle {
    attrName = `sw-note-handle`;
    vars;

    constructor() {
        this.vars = {
            list: `[${this.attrName}="rs-list"]`,
            item: `[${this.attrName}="rs-item"]`,
            name: `[${this.attrName}="rs-name"]`,
            date: `[${this.attrName}="rs-date"]`,
            color: `[${this.attrName}="rs-color"]`,
            authorId: `[${this.attrName}="rs-author-id"]`,
            title: `[${this.attrName}="rs-title"]`,
            body: `[${this.attrName}="rs-body"]`,
            nameLogo: `[${this.attrName}="rs-name-logo"]`,

        }
        this.noteList = document.querySelector(this.vars.list);
        this.item = document.querySelector(this.vars.item)?.cloneNode(true);
        this.clear();
    }

    clear() {
        // Remove dummy template
        if (this.noteList) [...this.noteList.children].forEach(e => e.remove());
    }

    renderer(data) {
        if (!this.noteList) return;
        if (!data?.note[0]) return;

        for (let i = 0; i < data?.note?.length; i++) {
            // Set Note
            const note = this.item.cloneNode(true);
            // Set note body
            const noteTitle = note.querySelector(this.vars.title);
            noteTitle.innerText = data.note[i]?.title;

            // Set note body
            const noteBody = note.querySelector(this.vars.body);
            noteBody.innerText = data.note[i]?.description;

            // update bg-color
            noteBody.parentElement.classList.add(window.BackgroundColor.randomBg());

            // set author name
            const authorName = note.querySelector(this.vars.name);
            authorName.innerText = data.note[i].authorName ? data.note[i].authorName : 'Anonymous';

            //set date 
            const dateCreated = note.querySelector(this.vars.date);
            dateCreated.innerText = data.note[i].date ? data.note[i].date : '';

            // set author id
            const authorID = note.querySelector(this.vars.authorId);
            authorID.innerText = '1'// data.note.authorID;

            const nameLogo = data?.note[i].authorName ? data?.note[i].authorName[0].toUpperCase() + data?.note[i].authorName.split(' ').length > 1 ? data?.note[i].authorName.split(' ')[1][0].toUpperCase() : data?.note[i].authorName.slice(0, 2).toUpperCase() : 'O';

            //set name logo
            const authorNameLogo = note.querySelector(this.vars.nameLogo);
            authorNameLogo.innerText = nameLogo;

            //append note into the list
            this.noteList.append(note);
        }
    }

    reCallNoteHandle() {
        this.clear();
        const draft = window.ScriptDataStore.draft
        const activedraft = Object.values(draft).filter(d => d.active)[0]
        const data = activedraft.data
        for (const [key, value] of Object.entries(data)) {
            const val = value
            this.renderer(val)
        }
    }
}

window.NoteHandle = new NoteHandle();

