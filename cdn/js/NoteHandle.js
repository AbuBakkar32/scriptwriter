class NoteHandle {
    attrName = `sw-note-handle`;
    vars;
    constructor() {
        this.vars = {
            list: `[${this.attrName}="rs-list"]`, item: `[${this.attrName}="rs-item"]`, name: `[${this.attrName}="rs-name"]`, 
            date: `[${this.attrName}="rs-date"]`, color: `[${this.attrName}="rs-color"]`, authorId: `[${this.attrName}="rs-author-id"]`,
            title: `[${this.attrName}="rs-title"]`, body: `[${this.attrName}="rs-body"]`,  nameLogo: `[${this.attrName}="rs-name-logo"]`, 

        }
        this.noteList = document.querySelector(this.vars.list);
        this.item = document.querySelector(this.vars.item)?.cloneNode(true);
        this.clear();
    }

    clear() {
        // Remove dummy template
        if(this.noteList) [...this.noteList.children].forEach(e => e.remove());
    }

    renderer(data){
        if(!this.noteList) return;
        if (!data.note.authorName) return;
        if(!data.note.text) return;

        // Set Note
        const note = this.item.cloneNode(true);

        // Set note body
        const noteBody = note.querySelector(this.vars.body);
        noteBody.innerText = data.note.text;
        
        // update bg-color
        noteBody.parentElement.classList.replace('bg-yellow', data.note.color);

        // set author name
        const authorName = note.querySelector(this.vars.name);
        authorName.innerText = data.note.authorName;

        //set date 
        const dateCreated = note.querySelector(this.vars.date);
        dateCreated.innerText = data.note.date;

        // set author id
        const authorID = note.querySelector(this.vars.authorId);
        authorID.innerText = data.note.authorID;

        const nameLogo = data.note.authorName.split(' ')[0][0].toUpperCase() + data.note.authorName.split(' ')[1][0].toUpperCase();
        //set name logo
        const authorNameLogo = note.querySelector(this.vars.nameLogo);
        authorNameLogo.innerText = nameLogo;

        //set color
        const color = note.querySelector(this.vars.color);
        color.innerText = data.note.color;

        this.noteList.append(note);
    }

}


window.NoteHandle = new NoteHandle();

