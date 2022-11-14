function enableDragSort(listClass) {
    setTimeout(() => {
        const sortableLists = document.getElementsByClassName(listClass);
        Array.prototype.map.call(sortableLists, (list) => {
            enableDragList(list)
        });
    }, 500);
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

function saveChangedCard() {
    let cardList = document.querySelectorAll(`[sw-data="pin-board-item"]`)
    let data = window.ScriptAdapter.scriptDataStore.pinboard;
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
    let dataList = Object.keys(data).map((key) => data[key]);
    dataList.sort((a, b) => a.unique_id - b.unique_id);
    data = {}
    for (let i = 0; i < dataList.length; i++) {
        data[dataList[i].id] = dataList[i];
    }
    window.ScriptAdapter.scriptDataStore.pinboard = data;
    window.ScriptAdapter.autoSave();
}

function handleDrop(item) {
    item.target.classList.remove('drag-sort-active');
    saveChangedCard();
}

(() => {
    enableDragSort('data-drag-sort-enable');
})();