document.addEventListener('DOMContentLoaded', (event) => {

    var dragSrcEl = null;
    let items = [];

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move'

        return false;
    }

    function handleDragEnter(e) {
        setTimeout(() => {
            this.classList.add('over');
        }, 100);
    }

    function handleDragLeave(e) {
        setTimeout(() => {
            this.classList.remove('over');
        }, 100);
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    }

    function handleDragEnd(e) {
        items.forEach(function (item) {
            setTimeout(() => {
                item.classList.remove('over');
            }, 100);
        });
    }

    setTimeout(function () {
        items = document.querySelectorAll('.full-div .box');
        items.forEach(function (item) {
            item.addEventListener('dragstart', handleDragStart, false);
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
            item.addEventListener('dragend', handleDragEnd, false);
        });
    }, 100);
});