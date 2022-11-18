let selector = 'drag-sort-enable-2';

function enableDragSort(listClass) {
    setTimeout(() => {
        const sortableLists = document.getElementsByClassName(listClass);
        //saveChangedCardList(swData = `[mapreact-data="outline-item"]`);
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
    item.setAttribute('draggable', true)
    item.ondrag = handleDrag;
    item.ondragend = handleDrop;
}

function handleDrag(item) {
    const selectedItem = item.target, list = selectedItem.parentNode, x = event.clientX, y = event.clientY;

    selectedItem.classList.add('drag-sort-active');
    let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

    if (list === swapItem.parentNode) {
        swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
        list.insertBefore(selectedItem, swapItem);
    }
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

function ChangeAndSaveData(swData) {
    let data = window.ScriptAdapter.scriptDataStore.outline;
    data = {};
    window.ScriptAdapter.scriptDataStore.outline = data;
    window.ScriptAdapter.autoSave();
    let listData = document.querySelectorAll(swData);
    listData.forEach((card, index) => {
        let id = card?.querySelector(`[outline-data="index"]`)?.innerHTML;
        let title = card?.querySelector(`[outline-data="scene-title"]`)?.innerHTML;
        let goal = card?.querySelector(`[outline-data="scene-goal"]`)?.innerHTML;
        let emotional_value = card?.querySelector(`[outline-data="emotional-value"]`)?.innerHTML;
        let page_no = card?.querySelector(`[outline-data="page"]`).innerHTML;
        let item_title = card?.querySelector(`[outline-data="scene-item-title"]`)?.innerHTML;
        let bgColor = card?.getAttribute("bg-value");
        let scene_list = {};
        card?.querySelectorAll(`[outline-data="scene-list"]`).forEach((scene, index) => {
            scene?.querySelectorAll(`[outline-data="scene-item"]`).forEach((item, index) => {
                let scene_item = {
                    scene_item: item?.innerHTML
                };
                scene_list[index] = scene_item;
            });
        });
        let obj = {
            id: index,
            title: title,
            goal: goal,
            emotional_value: emotional_value,
            page_no: page_no,
            color: bgColor,
            item_title: item_title,
            scene_list: scene_list
        }
        data[index] = obj;
    });
    window.ScriptAdapter.autoSave();
    saveChangedCardList(swData);
}

function saveChangedCardList(swData) {
    let listData = document.querySelectorAll(swData);
    let data = window.ScriptAdapter.scriptDataStore.outline;
    try {
        listData.forEach((card, index) => {
            card.querySelector(`[outline-data="index"]`).innerHTML = window.ScriptAdapter.scriptDataStore.outline[index].id + 1;
            card.querySelector(`[outline-data="scene-title"]`).innerHTML = window.ScriptAdapter.scriptDataStore.outline[index].title;
            card.querySelector(`[outline-data="scene-goal"]`).innerHTML = window.ScriptAdapter.scriptDataStore.outline[index].goal;
            card.querySelector(`[outline-data="emotional-value"]`).innerHTML = window.ScriptAdapter.scriptDataStore.outline[index].emotional_value;
            card.querySelector(`[outline-data="page"]`).innerHTML = window.ScriptAdapter.scriptDataStore.outline[index].page_no;
            card.setAttribute("bg-value", window.ScriptAdapter.scriptDataStore.outline[index].color);
            card.querySelector(`[outline-data="scene-item-title"]`).innerHTML = window.ScriptAdapter.scriptDataStore.outline[index].item_title;
            card.classList.forEach((item) => {
                if (item.includes("bg-")) {
                    card.classList.remove(item);
                    card.classList.add(window.ScriptAdapter.scriptDataStore.outline[index].color);
                }
            });
            card.querySelectorAll(`[outline-data="scene-list"]`).forEach((scene, i) => {
                scene.querySelectorAll(`[outline-data="scene-item"]`).forEach((item, j) => {
                    item.remove();
                });
            });
            let cardList = Object.keys(data).map((key) => data[key]);
            Object.keys(cardList[index].scene_list).forEach((key) => {
                let div = `<div class="col-10 pb-2" outline-data="scene-item" outline-data-id="" contenteditable="true" data-placeholder="Type here..">${cardList[index].scene_list[key].scene_item}</div>`
                card.querySelector(`[outline-data="scene-list"]`).insertAdjacentHTML('beforeend', div);
            })
        });
    } catch (e) {

    }
}

function handleDrop(item) {
    item.target.classList.remove('drag-sort-active');
    if (selector === 'drag-sort-enable-2') {
        console.log(selector);
        saveChangedCardListPinboard(swData = `[sw-data="pin-board-item"]`);
    } else if (selector === 'drag-sort-enable-outline') {
        console.log(selector);
        ChangeAndSaveData(swData = `[mapreact-data="outline-item"]`);
    } else {
        console.log(selector);
        saveChangedCardListPinboard(swData = `[sw-card-option="card"]`);
    }
}

(() => {
    setTimeout(() => {
        document.querySelectorAll(`[sw-data="option"]`).forEach((option) => {
            option.addEventListener('click', (e) => {
                if (e.srcElement.innerText === 'Pin Board') {
                    selector = "drag-sort-enable"
                    enableDragSort(selector);
                } else if (e.srcElement.innerText === 'Outline') {
                    selector = "drag-sort-enable-outline"
                    enableDragSort(selector);
                }
            });
        })
    }, 500);
    enableDragSort(selector);
})();