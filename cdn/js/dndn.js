let selector = 'drag-sort-enable-2';

function enableDragSort(listClass) {
    setTimeout(() => {
        // window.ScriptAdapter.scriptDataStore.outline = {};
        // window.ScriptAdapter.autoSave();
        const sortableLists = document.getElementsByClassName(listClass);
        saveChangedCardList(swData = `[mapreact-data="outline-item"]`);
        Array.prototype.map.call(sortableLists, (list) => {
            enableDragList(list)
        });
    }, 100);
}

function enableDragList(list) {
    Array.prototype.map.call(list.children, (item) => {
        enableDragItem(item)
    });
}

function enableDragItem(item) {
    if (item.classList.contains('relative')) {
        item.setAttribute('draggable', true);
    }
    item.style.cursor = 'grab';
    item.ondrag = handleDrag;
    item.ondragend = handleDrop;
}

function handleDrag(item) {
    item.target.removeAttribute('style');
    const selectedItem = item.target, list = selectedItem.parentNode, x = event.clientX, y = event.clientY;
    selectedItem.classList.add('drag-sort-active');
    let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
    if (list === swapItem.parentNode) {
        item.target.style.cursor = 'grabbing';
        swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
        list.insertBefore(selectedItem, swapItem);
    }
    item.target.style.cursor = 'grab';
}

function saveChangedCardListPinboard(swData) {
    let data = window.ScriptAdapter.scriptDataStore.pinboard;
    let cardList = document.querySelectorAll(swData)
    cardList.forEach((card, index) => {
        let title = card.querySelector(`[sw-card-option="title"]`).innerText;
        let body = card.querySelector(`[sw-card-option="body"]`).innerText;
        let cardId = card.querySelector(`[sw-card-option="card-id"]`).innerText;
        let bgColor = card.getAttribute("bg-value");
        let obj = {
            id: cardId, title: title, body: body, unique_id: index, color: bgColor
        };
        data[cardId] = obj;
    });

    // create the pinboard
    let dataList1 = Object.keys(data).map((key) => data[key]);
    dataList1.sort((a, b) => a.unique_id - b.unique_id);
    data = {}
    for (let i = 0; i < dataList1.length; i++) {
        data[dataList1[i].id] = dataList1[i];
    }
    window.ScriptAdapter.scriptDataStore.pinboard = data;
    window.ScriptAdapter.autoSave();
}

function ChangeAndSaveDataOutline(swData) {
    let data = window.ScriptAdapter.scriptDataStore.outline = {};
    window.ScriptAdapter.autoSave();
    let listData = document.querySelectorAll(swData)
    listData.forEach((card, index) => {
        let id = card?.querySelector(`[outline-data="index"]`)?.innerText ? card?.querySelector(`[outline-data="index"]`)?.innerText : 0;
        let title = card?.querySelector(`[outline-data="scene-item-title"]`)?.innerText ? card?.querySelector(`[outline-data="scene-item-title"]`)?.innerText : card.querySelector(`[outline-data="scene-title"]`)?.innerText;
        let goal = card?.querySelector(`[outline-data="scene-goal"]`)?.innerText ? card?.querySelector(`[outline-data="scene-goal"]`)?.innerText : "";
        let emotional_value = card?.querySelector(`[outline-data="emotional-value"]`)?.innerText ? card?.querySelector(`[outline-data="emotional-value"]`)?.innerText : 0;
        let page_no = card?.querySelector(`[outline-data="page"]`)?.innerText ? card?.querySelector(`[outline-data="page"]`).innerText : 0;
        let bgColor = card?.getAttribute("bg-value") ? card?.getAttribute("bg-value") : "";
        let sbID = card?.querySelector(`[outline-data="scene-title"]`)?.getAttribute("react-sbid") ? card?.querySelector(`[outline-data="scene-title"]`).getAttribute("react-sbid") : "";
        let scene = card?.querySelectorAll(`[outline-data="scene-item"]`)
        const sceneID = {};
        scene.forEach((item, index) => {
            const id = item?.getAttribute("outline-data-id");
            sceneID[id] = id;
        })

        let obj = {
            id: index,
            title: title,
            goal: goal,
            emotional_value: emotional_value,
            page_no: page_no,
            color: bgColor,
            sbID: sbID,
            sceneListId: sceneID
        }
        data[index] = obj;
    });
    window.ScriptAdapter.scriptDataStore.outline["lock"] = 'False';
}

function ChangeAndSaveData(swData) {
    let data = window.ScriptAdapter.scriptDataStore.outline = {};
    window.ScriptAdapter.autoSave();
    let listData = document.querySelectorAll(swData);
    listData.forEach((card, index) => {
        let id = card?.querySelector(`[outline-data="index"]`)?.innerText ? card?.querySelector(`[outline-data="index"]`)?.innerText : 0;
        let title = card?.querySelector(`[outline-data="scene-item-title"]`)?.innerText ? card?.querySelector(`[outline-data="scene-item-title"]`)?.innerText : card.querySelector(`[outline-data="scene-title"]`)?.innerText;
        let goal = card?.querySelector(`[outline-data="scene-goal"]`)?.innerText ? card?.querySelector(`[outline-data="scene-goal"]`)?.innerText : "";
        let emotional_value = card?.querySelector(`[outline-data="emotional-value"]`)?.innerText ? card?.querySelector(`[outline-data="emotional-value"]`)?.innerText : 0;
        let page_no = card?.querySelector(`[outline-data="page"]`)?.innerText ? card?.querySelector(`[outline-data="page"]`).innerText : 0;
        let bgColor = card?.getAttribute("bg-value") ? card?.getAttribute("bg-value") : "";
        let sbID = card?.querySelector(`[outline-data="scene-title"]`)?.getAttribute("react-sbid") ? card?.querySelector(`[outline-data="scene-title"]`).getAttribute("react-sbid") : "";
        let scene = card?.querySelectorAll(`[outline-data="scene-item"]`);
        const sceneID = {};
        scene.forEach((item, index) => {
            const id = item?.getAttribute("outline-data-id")
            sceneID[id] = id;
        })

        let obj = {
            id: index,
            title: title,
            goal: goal,
            emotional_value: emotional_value,
            page_no: page_no,
            color: bgColor,
            sbID: sbID,
            sceneListId: sceneID
        }
        data[index] = obj;
    });
    window.ScriptAdapter.scriptDataStore.outline["lock"] = 'False';
    window.ScriptAdapter.autoSave();
    saveChangedCardList(swData);
}

function saveChangedCardList(swData) {
    let listData = document.querySelectorAll(swData);
    let count = 0;
    try {
        listData.forEach((card, index) => {
            if(!window.ScriptAdapter.scriptDataStore.outline[index].title.toLowerCase().startsWith('act')){count++;}
            card.querySelector(`[outline-data="index"]`).innerText = count;
            card.querySelector(`[outline-data="scene-title"]`).innerText = window.ScriptAdapter.scriptDataStore.outline[index].title;
            card.querySelector(`[outline-data="scene-item-title"]`).innerText = window.ScriptAdapter.scriptDataStore.outline[index].title;
            card.querySelector(`[outline-data="scene-goal"]`).innerText = window.ScriptAdapter.scriptDataStore.outline[index].goal;
            card.querySelector(`[outline-data="emotional-value"]`).innerText = window.ScriptAdapter.scriptDataStore.outline[index].emotional_value;
            card.querySelector(`[outline-data="page"]`).innerText = window.ScriptAdapter.scriptDataStore.outline[index].page_no;
            card.setAttribute("bg-value", window.ScriptAdapter.scriptDataStore.outline[index].color);
            card.querySelector(`[outline-data="scene-title"]`).setAttribute('react-sbid', window.ScriptAdapter.scriptDataStore.outline[index].sbID);
            card.classList.forEach((item) => {
                if (item.includes("bg-")) {
                    card.classList.remove(item);
                    card.classList.add(window.ScriptAdapter.scriptDataStore.outline[index].color);
                }
            });
        });
    } catch (e) {
    }
}

function handleDrop(item) {
    item.target.classList.remove('drag-sort-active');
    if (selector === 'drag-sort-enable-2') {
        saveChangedCardListPinboard(swData = `[sw-data="pin-board-item"]`);
    } else if (selector === 'drag-sort-enable-outline') {
        ChangeAndSaveData(swData = `[mapreact-data="outline-item"]`);
    } else {
        saveChangedCardListPinboard(swData = `[sw-card-option="card"]`);
    }
}

(() => {
    setTimeout(() => {
        document.querySelectorAll(`[sw-data="option"]`).forEach((option) => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (e.target.innerText === 'Pin Board') {
                    selector = "drag-sort-enable"
                    enableDragSort(selector);
                } else if (e.target.innerText === 'Outline') {
                    selector = "drag-sort-enable-outline"
                    enableDragSort(selector);
                } else if (e.target.innerText === 'Script') {
                    selector = 'drag-sort-enable-2';
                    enableDragSort(selector);
                }
            });
        })
    }, 1000);
    enableDragSort(selector);
})();