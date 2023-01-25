class CommentHandler{
    commentIcon;
    note;
    comments;
    constructor(){
        this.commentIcon = '<img onclick="showNoteContainer(this)" style="width: 25px; cursor: pointer; transform: scaleX(-1);" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABMklEQVRoge3ZQUrDQBiG4afiuisXYjfiATyF7lt3Ip7DGxXcufcYXqCCiuAqF2hd2JASEk0icfrjvBDCJAN5v8wM/MwQnEmtPcMFjhO4dOEdj3hrenmFAps9vwos6vInQeR3Q8zgYBvgEtOmYdlTpphTBThN5zKYI6oA9cUcgQlVgLDkAKk57NF3jSVeR3IpmeFGx3XZJ8ASt0OMBjDxFeJH/tUUKof1aSSXknNcd+3cJ0DnYf1Lwk+hHCA1OUBqcoDU5FpoJHIt1ESuhcYg/BTKAVJTBtgktRjGhirAKqHIUD52G2E3d3dZBAlR2G7s0nzAMd/e2xb4XcvzJla479H/O9Z4wYOWA46udP1Tzzj7zYfGIrQ8weUJLk9weYLLE1ye4PIElye4PMHliXkovr98AnUlCYg7xE0PAAAAAElFTkSuQmCC">'
        this.note = `<div style="position: absolute; left: -29%; bottom: -33%; box-shadow: 2px 2px 5px;">
        <div class="com-color" style="background-color:yellow; padding: 12px; max-width: 250px; position: relative;  max-height: 150px; overflow-y: scroll; z-index: 100;">
            <div onclick="hideNoteContainer(this)" style="position: absolute; top: 0; right: 10px; font-size: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; cursor: pointer; font-weight: bolder;">x</div>
            <div class="noteContainer"></div>

            <div style="color: black;">
                <input id="noteTitle" class="noteInput" type="text" placeholder="Title here..." style="padding: 8px; border: none; outline: none; background-color: inherit; font-weight: bold; font-size: 13px; color: black;"/>
                <textarea id="noteDescription" class="noteInput" rows="2" placeholder="Note here..." style="padding: 8px; border: none; outline: none; margin-bottom: 8px; background-color: inherit; font-weight: bold; width: 90%; color: black; font-size: 12px"></textarea>
                <button onclick="addComment(this)" style="background-color: rgb(0, 0, 226); color: white; border: none; padding: 0 8px; font-size: 12px;">Add Note</button>
            </div>

            <div style="position: sticky; bottom: 0; right: 0; width: 30px; height: 100px; padding: 10px; float: right;">
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: yellow; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: red; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightgreen; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightblue; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: orange; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
            </div>
        </div>
        </div>`
        this.comments = [];
        // call the getComments function when the page loads
        this.getComments()
    }
    
    getComments(){
        if(window?.ScriptDataStore?.draft) {
            let draft = window?.ScriptDataStore?.draft
            let activedraft = Object.values(draft).filter(d => d.active)[0]
            let note = activedraft.data
            // note is an object. loop it
            for (const key in note) {
                if (note.hasOwnProperty(key)) {
                    const element = note[key];
                    // check if element.note is an array. If it not an array, it means there is no note
                    if (Array.isArray(element.note)) {
                        element.note.forEach(n => {
                            this.comments.push(n);
                        });
                    }
                }
            }
            setTimeout(() => {
                
                this.insertCommentsToEditor();
            }, 1000);
        }
    }

    insertCommentsToEditor(){
        this.comments.forEach(comment => {
            try {
                const sw_editor_id = comment.sw_editor_id;
                const html_sw_editor_id = document.querySelector(`[sw-editor-id="${sw_editor_id}"]`)
                const bg_color = comment.bg_color ? comment.bg_color : 'lightblue';

                const commentHtml = `<div style="font-size: 16px; font-weight: bolder; margin-right: 12px;">${comment.title}</div>
                <div style="font-size: 12px; font-weight: bold; padding-bottom: 8px">
                ${comment.description}
                </div>
                <div style="border-bottom: 1px solid gray; display: flex; font-size: 12px; margin-top: 8px; font-weight: bold; align-items: center; padding-bottom: 4px">
                    <div style="margin-right: 4px; background-color: aqua; border-radius: 50%; padding: 0 6px 0 7px;">A</div>
                    <div style="margin-right: 8px;">Asif Biswas</div>
                    <div>sep 2, 2022</div>
                </div>
                `

                // check if id=sw-editor-id-${sw_editor_id} exists
                if (document.getElementById(`sw-editor-id-${sw_editor_id}`)) {
                    const abs = document.getElementById(`sw-editor-id-${sw_editor_id}`)
                    const noteContainer = abs.querySelector('.noteContainer');
                    noteContainer.insertAdjacentHTML('beforeend', commentHtml);
                } else {
                    const note = `<div style="position: absolute; left: -29%; bottom: -33%; box-shadow: 2px 2px 5px;">
                        <div class="com-color" style="background-color:${bg_color}; padding: 12px; max-width: 250px; position: relative;  max-height: 150px; overflow-y: scroll; z-index: 100;">
                            <div onclick="hideNoteContainer2(this)" style="position: absolute; top: 0; right: 10px; font-size: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; cursor: pointer; font-weight: bolder;">x</div>
                            <div class="noteContainer">${commentHtml}</div>

                            <div style="color: black;">
                                <input id="noteTitle" class="noteInput" type="text" placeholder="Title here..." style="padding: 8px; border: none; outline: none; background-color: inherit; font-weight: bold; font-size: 13px; color: black;"/>
                                <textarea id="noteDescription" class="noteInput" rows="2" placeholder="Note here..." style="padding: 8px; border: none; outline: none; margin-bottom: 8px; background-color: inherit; font-weight: bold; width: 90%; color: black; font-size: 12px"></textarea>
                                <button onclick="addComment(this)" style="background-color: rgb(0, 0, 226); color: white; border: none; padding: 0 8px; font-size: 12px;">Add Note</button>
                            </div>

                            <div style="position: sticky; bottom: 0; right: 0; width: 30px; height: 100px; padding: 10px; float: right;">
                                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: yellow; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: red; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightgreen; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightblue; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: orange; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                            </div>
                        </div>
                        </div>`
                    let abs = `<div id="sw-editor-id-${sw_editor_id}" class="absolute sw_editor_class2" style="left: -36px; margin-top: -24px; width: 100%; z-index:0; " contenteditable="false">${commentIcon}<div class="relative hidden" style="margin-top: -30px;">${note}</div></div>`;
                    html_sw_editor_id.insertAdjacentHTML('afterend', abs);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

}


const commentIcon = '<img onclick="showNoteContainer(this)" style="width: 25px; cursor: pointer; transform: scaleX(-1);" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABMklEQVRoge3ZQUrDQBiG4afiuisXYjfiATyF7lt3Ip7DGxXcufcYXqCCiuAqF2hd2JASEk0icfrjvBDCJAN5v8wM/MwQnEmtPcMFjhO4dOEdj3hrenmFAps9vwos6vInQeR3Q8zgYBvgEtOmYdlTpphTBThN5zKYI6oA9cUcgQlVgLDkAKk57NF3jSVeR3IpmeFGx3XZJ8ASt0OMBjDxFeJH/tUUKof1aSSXknNcd+3cJ0DnYf1Lwk+hHCA1OUBqcoDU5FpoJHIt1ESuhcYg/BTKAVJTBtgktRjGhirAKqHIUD52G2E3d3dZBAlR2G7s0nzAMd/e2xb4XcvzJla479H/O9Z4wYOWA46udP1Tzzj7zYfGIrQ8weUJLk9weYLLE1ye4PIElye4PMHliXkovr98AnUlCYg7xE0PAAAAAElFTkSuQmCC">'
const note = `<div style="position: absolute; left: -29%; bottom: -33%; box-shadow: 2px 2px 5px;">
        <div class="com-color" style="background-color:lightblue; padding: 12px; max-width: 250px; position: relative;  max-height: 150px; overflow-y: scroll; z-index: 100;">
            <div onclick="hideNoteContainer(this)" style="position: absolute; top: 0; right: 10px; font-size: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; cursor: pointer; font-weight: bolder;">x</div>
            <div class="noteContainer"></div>

            <div style="color: black;">
                <input id="noteTitle" class="noteInput" type="text" placeholder="Title here..." style="padding: 8px; border: none; outline: none; background-color: inherit; font-weight: bold; font-size: 13px; color: black;"/>
                <textarea id="noteDescription" class="noteInput" rows="2" placeholder="Note here..." style="padding: 8px; border: none; outline: none; margin-bottom: 8px; background-color: inherit; font-weight: bold; width: 90%; color: black; font-size: 12px"></textarea>
                <button onclick="addComment(this)" style="background-color: rgb(0, 0, 226); color: white; border: none; padding: 0 8px; font-size: 12px;">Add Note</button>
            </div>

            <div style="position: sticky; bottom: 0; right: 0; width: 30px; height: 100px; padding: 10px; float: right;">
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: yellow; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: red; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightgreen; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightblue; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: orange; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
            </div>
        </div>
        </div>
        `

let authorFullname = '';
fetch('/auther-fullname').then(res => res.json()).then(data => {
    authorFullname = data.fullname;
});

function addAbsElement(thisElement){
    const sw_editor_id = thisElement.getAttribute('sw-editor-id');
    const abs = `<div onmouseout="hideElement('sw-editor-id-${sw_editor_id}')" id="sw-editor-id-${sw_editor_id}" class="absolute sw_editor_class" style="left: -36px; margin-top: -24px; width: 100%; z-index:0; " contenteditable="false">${commentIcon}<div class="relative hidden" style="margin-top: -30px;">${note}</div></div>`;
    thisElement.insertAdjacentHTML('afterend', abs);
}

function removeAbsElement(thisElement){
    const sw_editor_id = thisElement.getAttribute('sw-editor-id');
    const abs = document.getElementById(`sw-editor-id-${sw_editor_id}`);
    const is_show = abs?.classList?.contains('show');
    if (event.relatedTarget.id != `sw-editor-id-${sw_editor_id}` && !is_show) {
        abs.remove();
    }
}


setInterval(function(){
    const commentRelative = document.querySelectorAll('.commentRelative');
    commentRelative.forEach(function(item){
        // add onmouseover event
        item.setAttribute('onmouseover', 'addAbsElement(this)');
        // add onmouseout event
        item.setAttribute('onmouseout', 'removeAbsElement(this)');
    });
}, 1000);


function hideElement(id) {
    const abs = document.querySelector(`#${id}`);
    const is_show = abs.classList.contains('show');
    if (event.relatedTarget.parentNode.id != id && !is_show) {
        abs.remove();
    }
}

function showNoteContainer(thisElement) {
    const sw_editor_class = document.getElementsByClassName("sw_editor_class")
    for (let i = 0; i < sw_editor_class.length; i++) {
        const element = sw_editor_class[i];
        element.classList.remove('show');
        //element.querySelector('.relative').classList.add('hidden');
        if (element.querySelector('.relative')) {
            element.querySelector('.relative').classList.add('hidden');
        }
    }
    const sw_editor_class2 = document.getElementsByClassName("sw_editor_class2")
    for (let i = 0; i < sw_editor_class2.length; i++) {
        const element = sw_editor_class2[i];
        element.classList.remove('show');
        //element.querySelector('.relative').classList.add('hidden');
        if (element.querySelector('.relative')) {
            element.querySelector('.relative').classList.add('hidden');
        }
    }

    const sw_editor_id_container = thisElement.parentNode
    sw_editor_id_container.classList.toggle('show');
    const note2 = sw_editor_id_container.querySelector('.relative');
    if (note2) {
        note2.classList.toggle('hidden');
    }
    if (!sw_editor_id_container.classList.contains('sw_editor_class2') && !sw_editor_id_container.classList.contains('sw_editor_class show')) {
        const lineNo = sw_editor_id_container.id.split('-')[3];
        let comments = []
        let draft = window.ScriptDataStore.draft
        let activedraft = Object.values(draft).filter(d => d.active)[0]
        let allnote = activedraft.data
        // note is an object. loop it
        for (const key in allnote) {
            
            if (allnote.hasOwnProperty(key)) {
                const element = allnote[key];
                // check if element.note is an array. If it not an array, it means there is no note
                if (Array.isArray(element.note)) {
                    element.note.forEach(n => {
                        if (n.sw_editor_id == lineNo) {
                            comments.push(n)
                        }
                    });
                }
            }
        }
        
        if (comments.length && note2) {
            note2.remove();
        }
        let commentHtml = '';
        comments.forEach(function (comment) {
            commentHtml += `<div style="font-size: 16px; font-weight: bolder; margin-right: 12px;">${comment.title}</div>
                <div style="font-size: 12px; font-weight: bold; padding-bottom: 8px">
                ${comment.description}
                </div>
                <div style="border-bottom: 1px solid gray; display: flex; font-size: 12px; margin-top: 8px; font-weight: bold; align-items: center; padding-bottom: 4px">
                    <div style="margin-right: 4px; background-color: aqua; border-radius: 50%; padding: 0 6px 0 7px;">A</div>
                    <div style="margin-right: 8px;">Asif Biswas</div>
                    <div>sep 2, 2022</div>
                </div>
                `
        });
        const note = `<div style="position: absolute; left: -29%; bottom: -33%; box-shadow: 2px 2px 5px;">
            <div style="background-color:yellow; padding: 12px; max-width: 250px; position: relative;  max-height: 150px; overflow-y: scroll; z-index: 100;">
                <div onclick="hideNoteContainer2(this)" style="position: absolute; top: 0; right: 10px; font-size: 20px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; cursor: pointer; font-weight: bolder;">x</div>
                <div class="noteContainer">
                    ${commentHtml}
                </div>

                <div style="color: black;">
                    <input id="noteTitle" class="noteInput" type="text" placeholder="Title here..." style="padding: 8px; border: none; outline: none; background-color: inherit; font-weight: bold; font-size: 13px; color: black;"/>
                    <textarea id="noteDescription" class="noteInput" rows="2" placeholder="Note here..." style="padding: 8px; border: none; outline: none; margin-bottom: 8px; background-color: inherit; font-weight: bold; width: 90%; color: black; font-size: 12px"></textarea>
                    <button onclick="addComment(this)" style="background-color: rgb(0, 0, 226); color: white; border: none; padding: 0 8px; font-size: 12px;">Add Note</button>
                </div>

                <div style="position: sticky; bottom: 0; right: 0; width: 30px; height: 100px; padding: 10px; float: right;">
                    <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: yellow; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                    <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: red; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                    <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightgreen; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                    <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: lightblue; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                    <div onclick="changeBackgroundColor(this)" style="width: 15px; height: 15px; background-color: orange; border: 1px solid gray; box-shadow: 1px 1px 3px; margin-bottom: 4px"></div>
                </div>
            </div>
            </div>`
        const abs = `<div class="relative" style="margin-top: -30px;">${note}</div>`;
        // add abs next to thisElement
        thisElement.insertAdjacentHTML('afterend', abs);
    
    }
}

function hideNoteContainer(thisElement) {
    const sw_editor_id_container = thisElement.parentNode.parentNode.parentNode.parentNode;
    sw_editor_id_container.remove();
}

function hideNoteContainer2(thisElement) {
    const sw_editor_id_container = thisElement.parentNode.parentNode.parentNode.parentNode
    sw_editor_id_container.classList.toggle('show');
    const note = sw_editor_id_container.querySelector('.relative');
    if (note) {
        note.classList.toggle('hidden');
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function addComment(thisElement) {
    const noteTitle = thisElement.parentNode.querySelector('#noteTitle').value;
    const noteDescription = thisElement.parentNode.querySelector('#noteDescription').value;
    if (noteTitle === '' || noteDescription === '') {
        alert('Please fill in the title and description');
        return;
    }
    const sw_editor_id_container = thisElement.parentNode.parentNode.parentNode.parentNode.parentNode;
    let sw_editor_id = sw_editor_id_container.getAttribute('id');

    sw_editor_id = sw_editor_id.split('-')[3]
    const scriptId = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];

    let date = new Date();
    // convert it to string like: 02 sep, 2022
    date = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const myNote = {
        title: noteTitle,
        description: noteDescription,
        script_id: scriptId,
        sw_editor_id: sw_editor_id,
        authorName: authorFullname,
        date: date,
    }

    let draft = window.ScriptDataStore.draft
    let activedraft = Object.values(draft).filter(d => d.active)[0]
    const activeKeyName = Object.keys(draft).filter(d => draft[d].active)[0]
    let note = activedraft.data[sw_editor_id].note;   
    // check note is an object or an array
    if (Array.isArray(note)) {
        note.push(myNote);
    } else {
        note = [myNote];
    }
    window.ScriptDataStore.draft[activeKeyName].data[sw_editor_id].note = note;
    window.ScriptAdapter.autoSave(note)
    window.NoteHandle.reCallNoteHandle();

    const noteContainer = thisElement.parentNode.parentNode.querySelector('.noteContainer');
    const comment = `<div style="font-size: 16px; font-weight: bolder; margin-right: 12px;">${noteTitle}</div>
    <div style="font-size: 12px; font-weight: bold; padding-bottom: 8px">
    ${noteDescription}
    </div>
    <div style="border-bottom: 1px solid gray; display: flex; font-size: 12px; margin-top: 8px; font-weight: bold; align-items: center; padding-bottom: 4px">
        <div style="margin-right: 4px; background-color: aqua; border-radius: 50%; padding: 0 6px 0 7px;">A</div>
        <div style="margin-right: 8px;">${authorFullname}</div>
        <div>sep 2, 2022</div>
    </div>`
    // add the comment at the end of the noteContainer
    noteContainer.insertAdjacentHTML('beforeend', comment);
    thisElement.parentNode.querySelector('#noteTitle').value = '';
    thisElement.parentNode.querySelector('#noteDescription').value = '';
    sw_editor_id_container.classList.remove('sw_editor_class')
    sw_editor_id_container.classList.add('sw_editor_class2')
    const noteContainerParent = sw_editor_id_container.querySelector('.noteContainer');
    // get the previous sibiling div of noteContainerParent
    const noteContainerParentPrev = noteContainerParent.previousElementSibling;

    noteContainerParentPrev.setAttribute('onclick', 'hideNoteContainer2(this)');
    // remove event listener 'mouseout' of sw_editor_id_container
    sw_editor_id_container.removeEventListener('mouseout', function () {
    })
    // remove event listener 'mouseover' of sw_editor_id_container
    sw_editor_id_container.removeEventListener('mouseover', function () {
    })
}

function changeBackgroundColor(thisElement) {
    const parentNode = thisElement.parentNode.parentNode
    const color = thisElement.style.backgroundColor;
    parentNode.style.backgroundColor = color;

    const sw_editor_id = parentNode.parentNode.parentNode.parentNode.id.split('-')[3];
    let draft = window.ScriptDataStore.draft
    let activedraft = Object.values(draft).filter(d => d.active)[0]
    let note = activedraft.data
    // note is an object. loop it
    for (const key in note) {
        if (note.hasOwnProperty(key)) {
            const element = note[key];
            // check if element.note is an array. If it not an array, it means there is no note
            if (Array.isArray(element.note)) {
                element.note.forEach(n => {
                    if (n.sw_editor_id == sw_editor_id) {
                        n.bg_color = color;
                    }
                });
            }
        }
    }
    // save changes 
    window.ScriptAdapter.autoSave()
}


document.addEventListener("DOMContentLoaded", function(){
    window.CommentHandler = new CommentHandler();
})

