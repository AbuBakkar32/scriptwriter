//import { EditorFuncs } from "./EditorFuncs.js";
// Take Note: e.target will return the particular element which it content was adjust.
// Take Note: e.offsetX or Y only works for input element
// Introduced serveral functions from app.js: hideAndShowDropable('hideable-part', 'showable-part')
class MapAndReactOnContent {
    // Take note 'rs' means right side bar
    characterStore = [];
    contentStore = [];
    dataForGraph = [];
    /* Right Side Bar Template */
    // structure guide
    rsStructureList;
    /** container for each page script-bodys */
    rsStructureOption; 
    /**will indicate each script-body */
    rsStructureItem
    /**icon that will be added to each structureItem when clicked*/
    rsStructureItemArrow 
    /**script writer content page list wrapper*/
    swPageTemp
    /**Check status before setTimeout execute*/
    setTimeoutStatus = true;
    /** meta type mutation status trigger by changeTypeOfContentLine() */
    metaTypeMutationStatus = false;
    /** removed node mutation status */
    removeNodeMutationStatus = true;
    // page mutation status
    pageMutationStatus = true;
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
            focused: `[sw-focused="edit"]`, editCharacterID: `${this.attrName}-character-id`,
        };

        // structure guide
        this.rsStructureList = document.querySelector(`[sw-data="structure-list"]`);
        this.rsStructureOption = document.querySelector(`[sw-data="structure-option"]`).cloneNode(true);
        this.rsStructureItem = document.querySelector(`[sw-data="structure-item"]`).cloneNode(true);
        this.rsStructureItemArrow = document.querySelector(`[sw-data="structure-item-arrow"]`).cloneNode(true);

        // script writer content page list wrapper
        this.swPageTemp = document.querySelector(this.cons.list);

        // Delete the dummy templates of structure guide in right sider bar
        [...this.rsStructureList.children].forEach((el) => {el.remove()});
        [...this.rsStructureOption.children].forEach((el) => {el.remove()});

        //Init listener
        this.listener();
    }

    listener() {
        // Click listener for the page list wrapper
        this.swPageTemp.addEventListener('click', (e)=>{
            const mainTarget = e.target.closest(this.cons.line);
            // Remove all previous target
            const previous = document.querySelector(this.cons.focused);
            if (previous) previous.removeAttribute('sw-focused');
            //Add focus edit to the current content line
            if (mainTarget) {
                mainTarget.setAttribute('sw-focused', 'edit');
                // get the meta type
                const metaType = mainTarget.getAttribute('sw-editor-type');
                if (document.querySelectorAll(`[sw-select-item="set"]`).length>3) {
                    // postion to set the name of the type of content line
                    const typeNamePos = document.querySelector(`[sw-select-item="set"]`);
                    if (metaType === 'action' && typeNamePos) typeNamePos.textContent = 'Action';
                    else if (metaType === 'dialog' && typeNamePos) typeNamePos.textContent = 'Dialog';
                    else if (metaType === 'scene-heading' && typeNamePos) typeNamePos.textContent = 'Scene Heading';
                    else if (metaType === 'parent-article' && typeNamePos) typeNamePos.textContent = 'Parent Article';
                    else if (metaType === 'character' && typeNamePos) typeNamePos.textContent = 'Character';
                    else if (metaType === 'transition' && typeNamePos) typeNamePos.textContent = 'Transition';
                }
            }
            //Function that can change any type of content line
            this.changeTypeOfContentLine();
        });
        //Function that can change any type of content line
        this.changeTypeOfContentLine();
    }

    geneateUniqueID() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

    structureGuideHandle(contentStore = []) {
        // Clear the structure guide wrapper
        [...this.rsStructureList.children].forEach((el) => {el.remove()});

        // List of scenes and their text lenght
        const scenesCals = { scenes:[], highestLenght: 0 };

        const scenesTextLength = [];

        this.contentStore.forEach((item) => {
            if (item.type === 'scene-heading') {
                const content = item.content.innerText;
                const pos = item.index;

                //Get all other scene type that is under this scene heading
                let sceneTextLength = content.length;
                
                for (let i = pos+1; i < this.contentStore.length; i++) {
                    const tem = this.contentStore[i];
                    if (tem.type === 'scene-heading') break;
                    else sceneTextLength += tem.content.innerText.length;       
                }
                scenesCals.scenes.push({element: item.content, textLength: sceneTextLength});

                scenesTextLength.push(sceneTextLength);
            }
        });

        const highToLowSceneTextLength = scenesTextLength.sort((a, b) => b-a);
        if (highToLowSceneTextLength.length) scenesCals.highestLenght = highToLowSceneTextLength[0];

        // Render page content to the Structure Guide Template
        this.structureGuideHandleTemplate(scenesCals);
    }

    structureGuideHandleTextSize(num=10) {
        if (num >= 96) return 'w-100';
        else if (num >= 90) return 'w-95';
        else if (num >= 85) return 'w-90';
        else if (num >= 80) return 'w-85';
        else if (num >= 75) return 'w-80';
        else if (num >= 70) return 'w-75';
        else if (num >= 65) return 'w-70';
        else if (num >= 60) return 'w-65';
        else if (num >= 55) return 'w-60';
        else if (num >= 50) return 'w-55';
        else if (num >= 45) return 'w-50';
        else if (num >= 40) return 'w-45';
        else if (num >= 35) return 'w-40';
        else if (num >= 30) return 'w-35';
        else if (num >= 25) return 'w-30';
        else if (num >= 20) return 'w-25';
        else if (num >= 15) return 'w-20';
        else if (num >= 10) return 'w-15';
        else if (num >= 5) return 'w-10';
        else return 'w-5';
    }

    structureGuideHandleTemplate(scenesCals={scenes:[], highestLenght: 0}, returnPageStructureWrap = false) {
        // the container representing each page in the structure guide
        const pageStructureWrap = this.rsStructureOption.cloneNode(true);
        // Add the structure option to the structure list
        this.rsStructureList.appendChild(pageStructureWrap);
        
        const highestTextLenght = scenesCals.highestLenght;
        scenesCals.scenes.forEach((scene) => {
            const pageTextPercentage = scene.textLength/highestTextLenght*100;
            // get the width size of the text in the script body content
            const widSize = this.structureGuideHandleTextSize(pageTextPercentage);

            // create a structure guide item that will be under the structure option to represent the particular content line
            const structureItem = this.rsStructureItem.cloneNode(true);
            // add the text width size to the structure item
            structureItem.querySelector(`[sw-data="structure-item-size"]`).classList.replace('w-40', widSize);
            // Add the structure item to it structure option
            pageStructureWrap.appendChild(structureItem);

            // Add click event listener to the Stucture Item, so that each time it is been clicked, the structure arrow will indicate
            structureItem.addEventListener('click', () => {
                const arrowElement = document.querySelector(`[sw-data="structure-item-arrow"]`) || this.rsStructureItemArrow.cloneNode(true);
                structureItem.insertAdjacentElement('afterbegin', arrowElement);
                const mainEditor = scene.element.parentElement.parentElement;
                mainEditor.setAttribute('contenteditable', 'false');
                // Scroll to the particular script body
                window.scrollTo(0, scene.element.offsetTop + scene.element.parentElement.offsetTop);
                // click on the script body
                scene.element.click();
                scene.element.focus();
                mainEditor.setAttribute('contenteditable', 'true');
            });
            
        });

        if (returnPageStructureWrap) return pageStructureWrap;
    }

    mapreact() {
        this.cIdList = [];
        this.mapContents();
        this.structureGuideHandle(this.contentStore);
        window.CharacterHandle?.characterHandle(this.contentStore);
        window.OutlineHandle?.outlineHandle(this.contentStore);
        this.standAloneReactOnContent();
        try { this.graphRenderer(); }
        catch (error) { console.log('Unable to render graph', error); }
    }

    mapContents() {
        /** this.contentStore structure must be a list of array with the this structure
         * {main: content-line element itself, 
         *  type: the type of content-line gotten from meta-type attribute value,
         *  id: the generated unique id for performing map and react(contentLineScriptBodyElemt.setAttribute('react-pos', .id)),
         *  index: the index position of the array in this.contentStore,
         *  other: [], 
         * //the other key is an optional key that is only available for charater type, and is used to store charater script body 
         * element of the same value.
         *  }
          */
        //Clear previous stored contents
        this.contentStore = [];

        //Clear all previous stored data in the graph store
        this.dataForGraph = [];

        // reset the content store
        if (window.CharacterHandle) window.CharacterHandle.contentStore = this.contentStore;
        if (window.OutlineHandle) window.OutlineHandle.contentStore = this.contentStore;

        // start mapping element by content type
        const lineList = document.querySelectorAll(this.cons.line);
        let count = 0;
        let dataForGraphCount = 0;
        let uidCount = 0;
        const pagePackList = document.querySelectorAll(this.cons.item);
        // ready cid
        let readyID = {};
        for (let index = 0; index < lineList.length; index++) {
            uidCount += 1;
            const el = lineList[index];
            const mainElement = el;
            const getType = el.getAttribute(this.cons.editType); // return either action or dialog or parathentical or scene-heading etc.
            const scriptBodyElement = el;
            let uid = uidCount; //this.geneateUniqueID();
            const ind = count;
            // script body id
            const sbID = el.getAttribute(this.cons.editID);
            // script body color
            const sbColor = el.getAttribute(this.cons.editColor);
            // Create/Append the array to contentStore
            if (getType === 'character') {
                // character id
                let cid = el.getAttribute(this.cons.editCharacterID);
                if (!cid) {
                    window.CharacterHandle.lineValidator(el)
                    cid = el.getAttribute(this.cons.editCharacterID);
                }
                if (readyID[cid]) uid = readyID[cid].uid;
                else readyID[cid] = {uid: uid, cid: cid};
                // set the map react id on script body element
                scriptBodyElement.setAttribute('react-pos', uid);
                const cat = {
                    main: mainElement, type: getType, content: scriptBodyElement, id: uid, index: ind, other: [], cid: cid, 
                    sbID: sbID, color: sbColor
                };
                this.contentStore.push(cat);
                // Increase the count
                count += 1;
            } else if (getType !== 'character') {
                // Get the particular page number
                const pageNumber = getEleId(el.parentElement, pagePackList)+1;
                // set the map react id on script body element
                scriptBodyElement.setAttribute('react-pos', uid);
                const cat = {
                    main: mainElement, type: getType, content: scriptBodyElement, id: uid, index: ind, 
                    sbID: sbID, color: sbColor, pageNumber: pageNumber
                };
                this.contentStore.push(cat);
                // Increase the count
                count += 1;
            }

            //Append data to the DataForGraph Store
            if (getType === 'character') {
                this.dataForGraph.push({type: 'character', name: scriptBodyElement.innerText, index: dataForGraphCount});
                dataForGraphCount += 1;
            } else if (getType === 'scene-heading') {
                this.dataForGraph.push({type: 'scene-heading', name: scriptBodyElement.innerText, index: dataForGraphCount});
                dataForGraphCount += 1;
            }
        }
    }

    standAloneReactOnContent() {
        //const startTime = performance.now(); 
        document.querySelectorAll(`[react-pos]`).forEach((ele) => {
            ele.addEventListener('input', ()=>{
                const mrID = ele.getAttribute('react-pos');
                const reactSet = document.querySelectorAll(`[react-pos="${mrID}"]`);
                reactSet.forEach((it) => {
                    if (ele != it) it.innerText = ele.innerText;
                    else {
                        const isLine = it.hasAttribute(this.cons.editType);// closest(`[sw-data="content-line"]`);
                        if (isLine) {
                            const clID = it.getAttribute(this.cons.editID);
                            /** Watcher reaction */
                            window.Watcher.changeInLine(clID);
                        }
                    }
                });

                // if character
                if (ele.hasAttribute('character-data')){
                    const characterItem = ele.closest(`[mapreact-data="character-item"]`);
                    if(!characterItem) return;
                    const characterIDElement = characterItem.querySelector(`[character-idvalue]`);
                    if (!characterIDElement) return;
                    const characterID = characterIDElement.getAttribute('character-idvalue');
                    if (characterID) window.CharacterHandle.update(characterID);
                    console.log('character option 1 update');
                } else if (ele.hasAttribute('rs-character')){
                    const characterItem = ele.closest(`[mapreact-data="rs-character-item"]`);
                    if(!characterItem) return;
                    const characterIDElement = characterItem.querySelector(`[rs-character-id]`);
                    if (!characterIDElement) return;
                    const characterID = characterIDElement.getAttribute('rs-character-id');
                    if (characterID) window.CharacterHandle.update(characterID);
                    console.log('character option 2 update');
                } else if (ele.hasAttribute(this.cons.editCharacterID)) {
                    if (ele.getAttribute(this.cons.editType) != 'character') return;
                    const getCharacterID = ele.getAttribute(this.cons.editCharacterID)
                    if (getCharacterID) window.CharacterHandle.update(getCharacterID);
                    console.log('character option 3 update');
                }
            });
        });
        //console.log(`Rendering took ${performance.now() - startTime}ms`);
        // A hide and show function from app.js
        hideAndShowDropable('hideable-part', 'showable-part');
    }

    /* Change of content line type starts here */
    changeTypeOfContentLine() {
        //The switch menu
        const controlSwitch = document.querySelectorAll(`[sw-changer="content-line-type"]`);
        controlSwitch.forEach((stw) => {
            // List of content line type
            const typeList = [...stw.children];
            // Add click listener event that will trigger the chnage of the selected content
            typeList.forEach((typ) => {
                typ.addEventListener('click', ()=> {
                    const targetFocused = document.querySelector(this.cons.focused);
                    let targetFocusedPromise = new Promise((resolve, reject)=>{resolve(1)});
                    targetFocusedPromise.then(()=> {
                        if (typ.innerText.toLowerCase().startsWith('a') && targetFocused) this.actionType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('s') && targetFocused) this.sceneHeadingType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('p') && targetFocused) this.parentArticleType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('c') && targetFocused) this.characterType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('d') && targetFocused) this.dialogeType(targetFocused);
                        else if (typ.innerText.toLowerCase().startsWith('t') && targetFocused) this.transitionType(targetFocused);
                    }).then(() => {
                        if (!targetFocused) return;
                        // id of the content line
                        const clID = targetFocused.getAttribute(this.cons.editID);
                        /** Watcher reaction */
                        window.Watcher.changeAttribute(clID);
                    })
                });
            });
        });
    }


    sceneHeadingType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType:line.getAttribute(this.cons.editType), funcName: 'scene-heading'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'scene-heading');
        // set line type
        window.EditorMode.handleSceneHeadingType(line)
    }

    actionType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType:line.getAttribute(this.cons.editType), funcName: 'action'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'action');
    }

    dialogeType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType:line.getAttribute(this.cons.editType), funcName: 'dialog'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'dialog');
        window.EditorMode.handleDialog(line); // set line type
    }

    parentArticleType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType:line.getAttribute(this.cons.editType), funcName: 'parent-article'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'parent-article');
        window.EditorMode.handleParentArticle(line) // set line type
    }

    characterType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType:line.getAttribute(this.cons.editType), funcName: 'character'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // Script Body
        const scriptBody = line;
        // get the script Body text
        const currentText = line?.textContent.toUpperCase();
        // assign character id to it
        const isCharacterNameExist = window.CharacterHandle.checkStore(currentText);
        if (isCharacterNameExist.valid) { /*this means character name exist */
            line.setAttribute(this.cons.editCharacterID, isCharacterNameExist.id);
        } else { // create new charater
            const newCharacterId = window.CharacterHandle.create(currentText);
            line.setAttribute(this.cons.editCharacterID, newCharacterId);
        };
        //reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'character');
        // set line type
        window.EditorMode.handleCharater(line)
    }

    transitionType(line) {
        // get the content line meta-type // function name
        const {metaType, funcName} = {metaType:line.getAttribute(this.cons.editType), funcName: 'transition'};
        // if function name is same as metaType then end the function
        if (funcName === metaType) return;
        // clear character id
        window.MapAndReactOnContent.clearCharacterIdOnContentLine(line)
        // reset line to action
        window.EditorMode.handleContentLineNuetral(line, 'transition');
        // set line type
        window.EditorMode.handleTransition(line)
    }

    clearCharacterIdOnContentLine(line){
        const characterIDValue = line.getAttribute(this.cons.editCharacterID);
        if(!characterIDValue) return;
        line.setAttribute(this.cons.editCharacterID, '');
    }
    /* Change of content line type ends here */
    /* Apply Graph starts from here */
    graphRenderer() {
        // Array used for character type
        const charactersPossession = [];
        const validatedCharacters = [];

        //Array used for scene heading
        const sceneCharacters = [];
        this.dataForGraph.forEach((item) => {
            if (item.type === 'character') {
                const name = item.name;                
                //Get the number of times a character Name appear
                if (!validatedCharacters.includes(name)) {
                    let numberOfCharacterAppearance = 0;
                    this.dataForGraph.forEach((it) => {
                        if (it.type === 'character' && name === it.name) numberOfCharacterAppearance += 1;
                    });

                    validatedCharacters.push(name)
                    // Append character name and total appearance
                    charactersPossession.push([name, numberOfCharacterAppearance])
                }
            }
            else if (item.type === 'scene-heading') {
                const name = item.name;
                const pos = item.index;
                
                //Get all scene heading that the character Name appear
                let characterAppearedScene = '';
                for (let i = pos+1; i < this.dataForGraph.length; i++) {
                    const tem = this.dataForGraph[i];
                    if ((tem.type === 'character') /* && !characterAppearedScene.includes(tem.name) */) characterAppearedScene += tem.name+', ';
                    else if (tem.type === 'scene-heading') break;
                }

                // Append character
                sceneCharacters.push({name: name, characters: characterAppearedScene});
            }
        });
        
        // Render filtered data to their various graph
        if (charactersPossession.length > 0) this.graphTemplateThree(charactersPossession);
        if (sceneCharacters.length > 0) {
            // sceneCharacter Data Table arrangement
            const newTable = [];
            let count = 1;
            // explore list
            sceneCharacters.forEach((itm) => {
                const sceneItem = itm.characters.split(' ');
                sceneItem.pop();
                const noOfCharacters = sceneItem.length;
                // restructured character names
                let newSetNames = '';
                sceneItem.forEach((nam) => {
                    if (!newSetNames.includes(nam)) newSetNames += nam+' ';
                });
                newTable.push([
                    count, noOfCharacters, noOfCharacters, -noOfCharacters, -noOfCharacters, this.graphTipDOMTemplate(itm.name, newSetNames)]
                );
                count += 1;
            });
            this.graphTemplateFour(newTable);
        }
    }

    graphTipDOMTemplate(sceneHeading, characterNames) {
        return `
        <div class="p-8 text-cursive bg-four">
            <b>${sceneHeading}</b><br>
            <span>${characterNames}</span>
        </div>`
    }

    graphTemplateOne() { //Line Chart graph
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawLineChart);

        function drawLineChart() {
            const data = google.visualization.arrayToDataTable([
                ['Year', 'Sales', 'Expenses'],
                ['2004',  1000,      400],
                ['2005',  1170,      460],
                ['2006',  660,       1120],
                ['2007',  1030,      540]
            ]);

            const options = {
                title: 'Company Performance',
                curveType: 'function',
                legend: { position: 'bottom' }
            };
            const chart = new google.visualization.LineChart(document.querySelector(`[sw-graph="item-1"]`));
            chart.draw(data, options);
      }
    }

    graphTemplateTwo() { // Line graph chart
        const drawLineChart = () => {
            var data = google.visualization.arrayToDataTable([
                ['Year', 'Sales', 'Expenses'],
                ['2004',  1000,      400],
                ['2005',  1170,      460],
                ['2006',  660,       1120],
                ['2007',  1030,      540]
            ]);

            var options = {
                title: 'Company Performance',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.querySelector(`[sw-graph="item-2"]`));

            chart.draw(data, options);
        }
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawLineChart);
    }

    graphTemplateThree(charactersPossession) { //Pie Chart Graph
        // format for charactersPossession parameter: [['German',  5.85]]
        const drawChart = () => {
            const data = google.visualization.arrayToDataTable([
                ['Character Name', 'Possession'], 
                ...charactersPossession
            ]);

            let graph3Width = 500;
            if (window.innerWidth < 1200) graph3Width = window.innerWidth - 20;

            const options = {
                width: graph3Width,
                height: 400,
                legend: 'none',
                pieSliceText: 'label',
                title: '',
                //pieStartAngle: 100,
                pieHole: 0.3,
                pieSliceTextStyle: {
                    color: 'black'
                },
                backgroundColor: {
                    fill: 'none', // Change the background color.
                    stroke: 'none' // Change the vartical line color
                },
                pieSliceBorderColor: 'none',
                slices: {0: {color: '#952aff'}, 1: {color:'#fed59a'}, 3: {color: '#ffe6e9'}} //Customize bgcolor for each data space
                //tooltip: { trigger: 'selection'} //trigger: selection => makes the tip display when click on the stroke.
            };

            const chart = new google.visualization.PieChart(document.querySelector(`[sw-graph="item-3"]`));
            chart.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawChart);
    }

    graphTemplateFour(tableData) { //Candle Graph
        // format for tableData parameter: [[1, 28, 28, -38, -38, '<b>one<b>']]
        const drawCandleChart = () => {
            const data = new google.visualization.DataTable();
            data.addColumn('number', 'Y');
            data.addColumn('number', 'S');
            data.addColumn('number', 't');
            data.addColumn('number', 'p');
            data.addColumn('number', 'q');
            // A column for custom tooltip content
            data.addColumn({type: 'string', role: 'tooltip', p: {html: true}});
            data.addRows([...tableData]);

            // Configure the hAxis ticks
            const zeros = [];
            tableData.forEach((it) => {
                zeros.push(0)
            });

            let graph1Width = 1200;
            let graph2Width = 500;
            if (window.innerWidth < graph1Width) graph1Width = window.innerWidth - 20;
            if (window.innerWidth < graph2Width) graph2Width = window.innerWidth - 20;


            const options = {
                width: graph1Width,
                tooltip: {isHtml: true, ignoreBounds: true},//, trigger: 'selection'},
                legend: 'none',
                //colors: ["transparent", "white"],
                bar: { groupWidth: '1%' }, // Remove space between bars.
                backgroundColor: {
                    fill: 'none', // Change the background color.
                    stroke: 'none' // Change the vartical line color
                },
                candlestick: {
                    fallingColor: {stroke:'#ffffff', strokeWidth: 10, fill: '#ffffff' }, // red: Applying color to the line bar
                    risingColor: { stroke:'#ffffff', strokeWidth: 10, fill: '#ffffff' }   // green: 
                },
                vAxis: { ticks: [0] }, //To hide all the horizontal lines.
                hAxis: { ticks: [...zeros, tableData.length+1], baseline: tableData.length+1, gridlines: {color: '#000', minSpacing: 20} }, /* baseline: is the last vertical line bar. 
                ticks: represent the border of each vertical bar.(each data in the google.visualization.arrayToDataTable is represented 
                    in the tick list by it index number or 0 to make it hidden)*/
                chartArea:{left:20, top:0, width:'100%', height:'100%', stroke:'#fdc', strokeWidth:5}
            };

            const chart = new google.visualization.CandlestickChart(document.querySelector(`[sw-graph="item-1"]`));
            chart.draw(data, options);

            const chart1 = new google.visualization.CandlestickChart(document.querySelector(`[sw-graph="item-2"]`));
            options.width = graph2Width;
            chart1.draw(data, options);
        }
        google.charts.setOnLoadCallback(drawCandleChart);
    }
}


//init google graph
try {
    google.charts.load('current', {'packages':['corechart']});
} catch (e) { 
    console.log('An error error in google chart initialization.', e);
}
document.addEventListener("DOMContentLoaded", function(){
    window.MapAndReactOnContent = new MapAndReactOnContent();
});

