let selector = 'drag-sort-enable-2';

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
    const selectedItem = item.target,
        list = selectedItem.parentNode,
        x = event.clientX,
        y = event.clientY;

    selectedItem.classList.add('drag-sort-active');
    let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

    if (list === swapItem.parentNode) {
        swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
        list.insertBefore(selectedItem, swapItem);
    }
}

function saveChangedCardList(swData) {
    let data = window.ScriptAdapter.scriptDataStore.pinboard;
    let cardList = document.querySelectorAll(swData)
    cardList.forEach((card, index) => {
        let title = card.querySelector(`[sw-card-option="title"]`).innerText;
        let body = card.querySelector(`[sw-card-option="body"]`).innerText;
        let cardId = card.querySelector(`[sw-card-option="card-id"]`).innerText;
        let bgColor = card.getAttribute("bg-value");
        let obj = {
            id: cardId,
            title: title,
            body: body,
            unique_id: index,
            color: bgColor
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

function handleDrop(item) {
    item.target.classList.remove('drag-sort-active');
    if (selector === 'drag-sort-enable-2') {
        saveChangedCardList(swData = `[sw-data="pin-board-item"]`);
    } else {
        saveChangedCardList(swData = `[sw-card-option="card"]`);
    }
}

(() => {
    setTimeout(() => {
        document.querySelector(`[sw-btn="page-pinBoard"]`).addEventListener('click', () => {
            selector = "drag-sort-enable"
            enableDragSort(selector);
        })
    }, 500);
    enableDragSort(selector);
})();