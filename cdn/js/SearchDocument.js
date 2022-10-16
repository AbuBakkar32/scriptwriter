class SearchDocument {
    searchInputElements; // search input boxes.
    searchWrapperElements; // container where search will react
    // Locating matched search text vars
    fromPos = 0;
    toPos = 0;
    currentPos = 0;
    // the current page sw-search component
    currentSearchInputWrapper;
    currentSearchWapper;
    // Select Page buttons Wrapper
    selectPageButtonsWrapper;

    constructor(){
        this.searchInputElements = document.querySelectorAll(`input[type="search"]`);
        this.searchWrapperElements = document.querySelectorAll(`[sw-search="wrapper"]`);
        this.currentSearchInputWrapper = document.querySelector(`[sw-search="input-wrapper"]`);
        this.currentSearchWapper = document.querySelector(`[sw-search="wrapper"]`);
        this.selectPageButtonsWrapper = document.querySelectorAll(`[sw-data="select"]`);
        // Listener
        this.listener();
    }

    listener() {
        // Change and Keydown event listener on all search input
        this.searchInputElements?.forEach((input) => {
            
            // Change event
            input.addEventListener('change', ()=> {
                const currentValue = input.value;
                this.removeSearchLabel();
                if (currentValue) {
                    this.currentSearchInputWrapper.querySelector(`[sw-search="result-wrapper"]`).classList.remove('hidden');
                    this.createSearchLabel(currentValue);
                }
            });

            // Keydown event
            input.addEventListener('keyup', ()=> {
                setTimeout(() => {
                    const currentValue = input.value;
                    this.removeSearchLabel();
                    if (currentValue) {
                        this.currentSearchInputWrapper?.querySelector(`[sw-search="result-wrapper"]`).classList.remove('hidden');
                        this.createSearchLabel(currentValue);
                    } else // Reset number of search found
                        this.currentSearchInputWrapper.querySelector(`[sw-search="resultno"]`).innerText = '0';
                }, 10);
            });

            // Focus event
            input.addEventListener('focus', ()=> {
                const currentValue = input.value;
                // Remove Previous highlighed text
                this.removeSearchLabel();
                // Search box container
                const inputWrapper = input.closest(`[sw-search="input-wrapper"]`);
                // Set current Input Wrapper
                this.currentSearchInputWrapper = inputWrapper;
                // Reset number of search found
                this.currentSearchInputWrapper.querySelector(`[sw-search="resultno"]`).innerText = '0';
                // Set current search wrapper
                this.searchWrapperElements.forEach((wrapper) => { if (wrapper.getBoundingClientRect().y) this.currentSearchWapper = wrapper;});
                if (currentValue) {
                    this.currentSearchInputWrapper.querySelector(`[sw-search="result-wrapper"]`).classList.remove('hidden');
                    this.createSearchLabel(currentValue);
                }
            });

            // Click Event listener to the buttons in the search box container
            // Search box container
            const inputWrapper = input.closest(`[sw-search="input-wrapper"]`);
            // close button
            const closeBtn = inputWrapper?.querySelector(`[sw-search="close-btn"]`);
            // search Up Button
            const upBtn = inputWrapper?.querySelector(`[sw-search="up-btn"]`);
            // search down button
            const downBtn = inputWrapper?.querySelector(`[sw-search="down-btn"]`);

            // Close button Click listener
            closeBtn?.addEventListener('click', () => { closeBtn.closest(`[sw-search="result-wrapper"]`).classList.add('hidden'); });
            // Search Upward click event listener
            upBtn?.addEventListener('click', () => { this.currentSearchInputWrapper = upBtn.closest(`[sw-search="input-wrapper"]`); this.searchUp() });
            // Search Downward click event listener
            downBtn?.addEventListener('click', () => {this.currentSearchInputWrapper = downBtn.closest(`[sw-search="input-wrapper"]`); this.searchDown() });

        });

        // If click on the wrapper body then remove all search highlights
        this.searchWrapperElements.forEach((wrap) => {
            wrap?.addEventListener('click', () => {
                this.removeSearchLabel();
                //hide the result wrapper
                this.currentSearchInputWrapper.querySelector(`[sw-search="result-wrapper"]`).classList.add('hidden');
                // Reset number of search found
                this.currentSearchInputWrapper.querySelector(`[sw-search="resultno"]`).innerText = '0';
            });
        });

        // When any button that leads to another page is clicked, Reset number of search and hide the result wrapper
        this.onSelectPageButtons()
    }

    onSelectPageButtons() {
        this.selectPageButtonsWrapper.forEach((pb) => {
            [...pb.children].forEach((btn) => {
                btn.addEventListener('click', ()=> {
                    //Reset number of search and hide the result wrapper
                    document.querySelectorAll(`[sw-search="input-wrapper"]`).forEach((wrap) => {
                        const resultWraper = wrap.querySelector(`[sw-search="result-wrapper"]`);
                        if (resultWraper){
                            //hide the result wrapper
                            resultWraper.classList.add('hidden');
                            // Reset the number of search
                            resultWraper.querySelector(`[sw-search="resultno"]`).innerText = '0';
                        }
                    });
                    // Remove all highlight
                    this.removeSearchLabel();
                })
            })
        });
    }

    createSearchLabel(text='') {
        // marked element string
        const markedElement = `<span style="background-color:#c8d185" sw-search="label">${text}</span>`;

        // Check the current editor that is open.
        this.searchWrapperElements.forEach((editorwrapper) => {
            if (editorwrapper.getBoundingClientRect().y) {
                // Get all current script lines or elements inside/with contenteditable or element that search should take place
                const line = editorwrapper.querySelectorAll(`[sw-editor-type]`); 
                // Go into this elements and check if the search word is there before render the highlight.
                line.forEach((sl) => {
                    const lineText = sl.innerHTML;//.toLowerCase();
                    if (lineText.toLowerCase().includes(text.toLowerCase())) {
                        /* let textAs = ``;
                        lineText.split(' ').forEach((txt) => {
                            if(txt.toLowerCase() === text.toLowerCase()) 
                        }); */
                        sl.innerHTML = sl.innerHTML.replaceAll(text, markedElement);//sl.innerHTML.replace(`/${text}/g`, markedElement)
                    }
                })
            }
        });

        this.currentSearchInputWrapper.querySelector(`[sw-search="resultno"]`).innerText = document.querySelectorAll(`[sw-search="label"]`).length;
    }

    removeSearchLabel() {
        document.querySelectorAll(`[sw-search="label"]`).forEach((marked) => {
            // Get the exact marked text
            const markedText = marked.innerText;
            marked.outerHTML = markedText
        });
    }

    searchUp() {
        const resultEle = this.currentSearchInputWrapper?.querySelector(`[sw-search="resultno"]`);
        // get the current index/position
        const posText = resultEle?.innerText;
        if (!posText?.includes('/')) {
            // total search found
            const totalFound = Number(posText);
            if (totalFound) {
                const currentHighlighted = document.querySelectorAll(`[sw-search="label"]`)[totalFound-1];
                currentHighlighted.style.backgroundColor = '#626a24';
                //currentHighlighted.scrollIntoView();
                window.scrollTo(0, currentHighlighted.offsetTop);
                resultEle.innerText = String(totalFound)+'/'+String(totalFound);
            }
        } else {
            // reset the color of all highlighted
            document.querySelectorAll(`[sw-search="label"]`).forEach((hl) => {
                hl.style.backgroundColor = '#c8d185';
            });
            // Get the current index/position from the result number element
            const vert = posText.split('/');
            const index = Number(vert[0]); // current highlighted
            const pos = Number(vert[1]); //total highlighted found
            if (index-1) {
                const currentHighlighted = document.querySelectorAll(`[sw-search="label"]`)[index-2];
                currentHighlighted.style.backgroundColor = '#626a24';
                //currentHighlighted.scrollIntoView();
                window.scrollTo(0, currentHighlighted.offsetTop);
                resultEle.innerText = String(index-1)+'/'+String(pos);
            } else {
                const currentHighlighted = document.querySelectorAll(`[sw-search="label"]`)[pos-1];
                currentHighlighted.style.backgroundColor = '#626a24';
                //currentHighlighted.scrollIntoView();
                window.scrollTo(0, currentHighlighted.offsetTop);
                resultEle.innerText = String(pos)+'/'+String(pos);
            }
        }
    }

    searchDown() {
        const resultEle = this.currentSearchInputWrapper.querySelector(`[sw-search="resultno"]`);
        // get the current index/position
        const posText = resultEle?.innerText;
        if (!posText?.includes('/')) {
            // total search found
            const totalFound = Number(posText);
            if (totalFound) {
                const currentHighlighted = document.querySelectorAll(`[sw-search="label"]`)[0];
                currentHighlighted.style.backgroundColor = '#626a24';
                //currentHighlighted.scrollIntoView();
                window.scrollTo(0, currentHighlighted.offsetTop);
                resultEle.innerText = '1/'+String(totalFound);
            }
        } else {
            // reset the color of all highlighted
            document.querySelectorAll(`[sw-search="label"]`).forEach((hl) => {
                hl.style.backgroundColor = '#c8d185';
            });
            // Get the current index/position from the result number element
            const vert = posText.split('/');
            const index = Number(vert[0]); // current highlighted
            const pos = Number(vert[1]); //total highlighted found
            if (((index+1)<pos) || (pos>index)) {
                const currentHighlighted = document.querySelectorAll(`[sw-search="label"]`)[index];
                currentHighlighted.style.backgroundColor = '#626a24';
                //currentHighlighted.scrollIntoView();
                window.scrollTo(0, currentHighlighted.offsetTop);
                resultEle.innerText = String(index+1)+'/'+String(pos);
            } else {
                const currentHighlighted = document.querySelectorAll(`[sw-search="label"]`)[0];
                currentHighlighted.style.backgroundColor = '#626a24';
                //currentHighlighted.scrollIntoView();
                window.scrollTo(0, currentHighlighted.offsetTop);
                resultEle.innerText = '1/'+String(pos);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.SearchDocument = new SearchDocument();
})
