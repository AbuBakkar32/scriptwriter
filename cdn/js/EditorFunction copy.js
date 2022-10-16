class EditorFuncs {
    // Buttons
    boldBtn; //Bold button
    italicBtn; // italic button
    underlineBtn; // underline button
    penPaintBtn; //penPaint button or highlight
    textColorBtn; //Text Color
    voiceRecordBtn; //Voice Record button
    audioPlayReaderBtn; //audio play reader button
    downloadBtn; // download button
    shareBtn; // share button
    saveBtn; // Save button
    // Page Management -> creating, adjust and deleting of page.(i.e) Script writer content page template and wrapper
    swPageListTemp;
    swPageTemp;
    lineTemp;
    //Artificial voice
    recognition;
    //Artificial speak
    speechControl = window.speechSynthesis;
    // Newly created script-body
    newlyCreatedLine;
    // constant height size of any page in the script Document
    swPageHeight = 1130; //640;
    // Status for wrapper in share button
    shareWrapStatus = [];
    // const for speech recognition not support
    srNotSupportedText = 'This browser does not support voice recording. Switch to a chrome browser!';
    constructor(attrName="sw-editor") {
        this.attrName = attrName;
        this.cons = {
            list: `[${this.attrName}="list"]`, 
            item: `[${this.attrName}="item"]`, 
            line: `[${this.attrName}-type]`,
            a: 'action', at: 'action-type', t: 'transition', tt:'transition-type',
            d: 'dialog', dt: 'dialog-type', pa: 'parent-article', pat:'parent-article-type',
            c: 'character', ct: 'character-type', sh: 'scene-heading', sht: 'scene-heading-type',
            editType: `${this.attrName}-type`, editID: `${this.attrName}-id`, editColor: `${this.attrName}-color`,
            focused: `[sw-focused="edit"]`
        };
        this.swPageListTemp = document.querySelector(this.cons.list);
        this.swPageTemp = document.querySelector(this.cons.item).cloneNode(true);
        this.lineTemp = document.querySelector(this.cons.line).cloneNode(true);
        // Buttons initializer
        this.boldBtn = document.querySelectorAll(`[sw-btn="bold"]`);
        this.italicBtn = document.querySelectorAll(`[sw-btn="italic"]`);
        this.underlineBtn = document.querySelectorAll(`[sw-btn="underline"]`);
        this.penPaintBtn = document.querySelectorAll(`[sw-btn="penPaint"]`);
        this.textColorBtn = document.querySelectorAll(`[sw-btn="textColor"]`);
        this.voiceRecordBtn = document.querySelectorAll(`[sw-btn="voiceRecord"]`);
        this.audioPlayReaderBtn = document.querySelectorAll(`[sw-btn="audioPlayReader"]`);
        this.downloadBtn = document.querySelectorAll(`[sw-btn="download"]`);
        this.shareBtn = document.querySelectorAll(`[sw-btn="share"]`);
        this.saveBtn = document.querySelectorAll(`[sw-btn="save"]`);
        // the very first content-line
        this.newlyCreatedLine = document.querySelector(this.cons.line);
        //Init
        this.listener();
    }

    listener() {
        //Initializing script writing editor

        //Inintialize Artificial Voice
        try {
            this.initRecorder();
        } catch (error) {
            console.log(this.srNotSupportedText);
            alert(this.srNotSupportedText);
        }

        // Click event listener for the buttons
        this.boldBtn.forEach((btn) => { btn.addEventListener('click', () => {this.bold(); this.share(); }) });
        this.italicBtn.forEach((btn) => { btn.addEventListener('click', () => { this.italic(); this.share(); }) });
        this.underlineBtn.forEach((btn) => { btn.addEventListener('click', () => { this.underline(); this.share(); }) });
        this.downloadBtn.forEach((btn) => { btn.addEventListener('click', () => { this.download(); this.share(); }) });
        this.saveBtn.forEach((btn) => { btn.addEventListener('click', () => { this.save(); this.share(); }) });
        this.shareBtn.forEach((btn) => { this.shareWrapStatus.push(false); btn.addEventListener('click', () => { this.share(btn);})});

        //Highlight
        this.penPaintBtn.forEach((btn) => {
            let openStatus = true;
            btn.addEventListener('click', () => {
                // Hide the share wrap
                this.share();

                const colorElement = btn.querySelector(`input[type="color"]`);
                //if (openStatus) {
                    //openStatus = false;
                    //colorElement.style.display = 'block';
                    const selected = window.getSelection();
                    if (!selected.toString()) {btn.click(); return};
                    
                    const selectedElement = selected.baseNode?.parentElement;
                    if (selectedElement?.nodeName === 'SPAN' ||
                        selectedElement?.nodeName === 'FONT' && 
                        selectedElement?.style.backgroundColor){
                        this.penPaint('transparent');
                        return;
                    }
                    this.penPaint(colorElement.value)
                /* } else {
                    openStatus = true;
                    colorElement.style.display = '';
                    this.penPaint(null);
                } */
            })
        });
        
        //Apply color text
        this.textColorBtn.forEach((btn) => {
            //let openStatus = true;
            btn.addEventListener('click', () => {
                // Hide the share wrap
                this.share();

                const colorElement = btn.querySelector(`input[type="color"]`);
                //if (openStatus) {
                //    openStatus = false;
                    //colorElement.style.display = 'block';
                    const selected = window.getSelection();
                    if (!selected.toString()) {btn.click(); return};
                    
                    const selectedElement = selected.baseNode?.parentElement;
                    if (selectedElement?.nodeName === 'SPAN' ||
                        selectedElement?.nodeName === 'FONT' && 
                        selectedElement?.color){
                            document.execCommand("removeFormat", false, "foreColor");
                            //this.colorText('');
                            return;
                    }
                    this.colorText(colorElement.value)
                /* } else {
                    openStatus = true;
                    colorElement.style.display = '';
                } */
            }) 
        });

        // Color Picker listerner
        this.renderColorAttr();

        //Record voice function
        this.voiceRecordBtn.forEach((btn) => {
            let recordStatus = true;
            btn.addEventListener('click', () => {
                // Hide the share wrap
                this.share();
                // Confirm that SpeechRecognition is active on this browser
                if (this.recognition) {
                    if (recordStatus) {
                        this.recognition.start();
                        recordStatus = false;
                    } else {
                        this.recognition.stop();
                        recordStatus = true;
                    }
                } else alert(this.srNotSupportedText);
            });
        });

        // Play text
        this.audioPlayReaderBtn.forEach((btn) => {
            let textPlayStatus = true;
            btn.addEventListener('click', () => {
                // Hide the share wrap
                this.share();

                if (textPlayStatus) {
                    this.audioPlayReader();
                    // Play text audio
                    textPlayStatus = false;
                } else {
                    // stop text audio
                    textPlayStatus = true;
                }
                
            });
        });

        // Refresh the total number of pages avaliable.
        //this.totalNumberOfPage();
    }

    generateID() {
        let id = '0';
        const lineList = document.querySelectorAll(this.cons.line);
        const lastLine = lineList[(lineList.length - 1)];
        if (lastLine) {
            const xid = lastLine.getAttribute(this.cons.editID);
            if (xid) id += String(Number(xid.substr(1)) + 1);
            else id += '0';
        } else id += '0';
        
        const lineIDList = [];
        document.querySelectorAll(this.cons.line).forEach((i) => { lineIDList.push(i.getAttribute(this.cons.editID)); });
        let count = 0;
        while (true) {
            count += 1;
            if (lineIDList.includes(id)) {
                id = '0';
                if (lastLine) {
                    const xid = lastLine.getAttribute(this.cons.editID);
                    if (xid) id += String(Number(xid.substr(1)) + count);
                    else id += String(count);
                } else id += String(count);
            } else break;
        }
        return id;
    }

    renderColorAttr() {
        document.querySelectorAll(`[render-color]`).forEach((ele) => {
            ele.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });

            //Watch for change in color value
            ele.addEventListener('change', (f) => {
                f.stopImmediatePropagation();
                f.stopPropagation();
                console.log(ele.value);
                //if (ele.getAttribute('render-color') === 'textColor') this.colorText(ele.value);
                //else if (ele.getAttribute('render-color') === 'highlight') this.penPaint(ele.value)
            });
        });
    }

    bold() { document.execCommand('bold'/* , false, null */);}

    italic() { document.execCommand('italic'/* , false, null */); }

    underline() { document.execCommand('underline'/* , false, null */); }

    penPaint(color) { document.execCommand( "backColor", false, color ) }

    colorText(color) { document.execCommand('foreColor', true, color); }

    voiceRecord() {}
    
    audioPlayReader() {
        const contentLine = document.querySelector(this.cons.focused);
    }

    initRecorder() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.speechControl = window.speechSynthesis;

        this.recognition.continuous = true;

        // This block is called every time the Speech APi captures a line. 
        this.recognition.onresult = (event) => {
            // event is a SpeechRecognitionEvent object. It holds all the lines we have captured so far. We only need the current one.
            const current = event.resultIndex;

            // Get a transcript of what was said.
            const transcript = event.results[current][0].transcript;
            // Add the current transcript to the contents of our Note. There is a weird bug on mobile, where everything is repeated twice.
            // There is no official solution so far so we have to handle an edge case.
            const mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
            if(!mobileRepeatBug) {
                //noteContent += transcript;
                //noteTextarea.val(noteContent);
                const contentLine = document.querySelector(this.cons.focused);
                if (contentLine) {
                    // Add the voice captured text to the current 
                    contentLine.textContent = contentLine.textContent + transcript;
                }
            }
        };

        this.recognition.onstart = function() { 
            console.log('Voice recognition activated. Try speaking into the microphone.');
        }
          
        this.recognition.onspeechend = function() {
            console.log('You were quiet for a while so voice recognition turned itself off.');
        }
          
        this.recognition.onerror = function(event) {
            if(event.error == 'no-speech') {
                console.log('No speech was detected. Try again.');  
            };
        }
    }

    download() {
        //window.location = '/cdn/store/sample.pdf'
        /* fetch(location.href + '/download', {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            if (data.file) window.location = '/cdn/store/'+data.file;
            else alert('Cannot download script document at this time, An internal error has occoured');
        }).catch((error) => {
            alert('Cannot download script document at this time, An internal error has occoured');
            console.log(error);
        }) */
    }

    share(shareBtnWrap = null) {
        if (shareBtnWrap) {
            const index = window.getEleId(shareBtnWrap, this.shareBtn);
            if (!this.shareWrapStatus[index]){
                this.shareWrapStatus[index] = true;
                shareBtnWrap.querySelector(`[sw-share="wrap"]`).classList.remove('hide');
            }else {
                this.shareWrapStatus[index] = false;
                shareBtnWrap.querySelector(`[sw-share="wrap"]`).classList.add('hide');
            }
        } else {
            this.shareWrapStatus.forEach((e) => {e = false});
            document.querySelectorAll(`[sw-share="wrap"]`).forEach((wrap) => {
                wrap.classList.add('hide');
            })
        }
    }

    save() {
        if (confirm('Do you want to save your content')) {
            // ScriptAdapter.js method:
            window.ScriptAdapter.save();
        }
    }

    /** create new content line element and append in after a previous existing Line, then return then newly created element*/
    createNewLine(conl, callback=(newConl)=>{}, publish=true, text='', artID='') {
        /* conl must be an existing content line inside the page.
            if publish is true then MapAndReactOnContent.mapreact() will fire,
            because the newly created content line element will be added to the page. 
        */
        // id must be created before append the newly created Content line
        const lineID = artID || this.generateID();
                
        // New Script Element Body
        const newContentLine = this.lineTemp.cloneNode(true);
        newContentLine.innerHTML = text;
        
        // Set new id
        newContentLine.setAttribute(this.cons.editID, lineID);

        // Set Color
        const color = window.BackgroundColor.randomBg();
        newContentLine.setAttribute(this.cons.editColor, color);

        // Update the newly created content-line var
        this.newlyCreatedLine = newContentLine;
        // Neutralize the new script element body
        window.EditorMode.handleContentLineNuetral(newContentLine);
        // fire the callback function is there is any
        callback(newContentLine);

        if (publish) {
            // Append the new created element
            conl.insertAdjacentElement('afterend', newContentLine);

            /** Watcher for new content line */
            const clID = conl.getAttribute(this.cons.editID);// id of the line
            window.Watcher.newLine(lineID, clID);
        }
        return newContentLine;
    }

    totalNumberOfPage() {
        const numberOfPage = document.querySelectorAll(this.cons.item).length;
        document.querySelector(`[sw-number="totalpage"]`).innerText = String(numberOfPage);

        // Calculate time to read the content given that a page stand for 1min
        if (numberOfPage === 60){
            document.querySelector(`[sw-number="time"]`).innerText = '1h:0m';
        } else if (numberOfPage > 60) {
            const numOfHours = Number(String(numberOfPage/60).split('.')[0]);
            const numOfMins = (numOfHours*60)-numberOfPage;
            document.querySelector(`[sw-number="time"]`).innerText = String(numOfHours) + 'h:' + String(numOfMins) + 'm';
        } else {
            document.querySelector(`[sw-number="time"]`).innerText = '0h:' + String(numberOfPage) + 'm';
        }
    }
}


document.addEventListener("DOMContentLoaded", function(){
    window.EditorFuncs = new EditorFuncs();
});
