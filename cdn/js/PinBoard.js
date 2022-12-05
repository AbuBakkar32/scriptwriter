class PinBoard {
    /**  CardOption.js loaded*/
    cardOption = window.CardOption;
    /** dummy card option element*/
    cardOptionTemplate;
    /** pin board card main template*/
    cardListWrap = document.querySelector(`[sw-card-option="list"]`);
    /** right sider bar pin board List template */
    rsPinboardList;
    /** right sider bar pin board item template */
    rsPinboardItemTemp;
    constructor(){
        this.rsPinboardList = document.querySelector(`[sw-data="pin-board-list"]`);
        this.rsPinboardItem = this.rsPinboardList.querySelector(`[sw-data="pin-board-item"]`);
        this.rsPinboardItemTemp = this.rsPinboardItem.cloneNode(true);
        this.cardOptionItem = this.cardListWrap.querySelector(this.cardOption.cardVar.cardWrap);
        this.cardOptionTemplate = this.cardOptionItem.cloneNode(true);

        this.load();
    }

    load() {
        // load pin Board
        if (!this.cardOptionTemplate && !this.rsPinboardItemTemp) return;

        const getPinBoardKeys = Object.keys(window.ScriptDataStore.pinboard);
        if (getPinBoardKeys.length) {
            // Remove previous template
            [...this.cardListWrap.children].forEach((card) => {card.remove()});
            [...this.rsPinboardList.children].forEach((card) => {card.remove()});
            getPinBoardKeys.forEach((key) => {
                // get the pin board
                const data = window.ScriptDataStore.pinboard[key];
    
                const card = this.cardOptionTemplate.cloneNode(true);
                const title = card.querySelector(this.cardOption.cardVar.title);
                const body = card.querySelector(this.cardOption.cardVar.body);
                const cardId = card.querySelector(this.cardOption.cardVar.cardId);
                const colorOption = card.querySelector(this.cardOption.cardVar.colorOpt);

                const theCurrentBgValue = colorOption?.querySelector(`[${this.cardOption.cardVar.bgValue}]`)?.getAttribute(this.cardOption.cardVar.bgValue);

                if (title) title.innerText = data.title;
                if (body) body.innerText = data.body;
                if (cardId) cardId.innerText = data.id;

                card.classList.replace(theCurrentBgValue, data.color);
                card.setAttribute(this.cardOption.cardVar.bgValue, data.color);

                const colorOptionToBgValue = colorOption?.querySelector(`[${this.cardOption.cardVar.bgValue}]`);
                colorOptionToBgValue?.setAttribute(this.cardOption.cardVar.bgValue, data.color);
                colorOptionToBgValue?.classList.replace(theCurrentBgValue, data.color);

                this.cardListWrap.append(card);

                const newRsCard = this.rsPinboardTemplateRender(this.rsPinboardItemTemp, data);
                const rs = {enabled: true, card: newRsCard}
                this.cardOption.addListeners(card, rs);
                this.cardOption.rsSetUp(rs.card, card);
            });
        } else {
            const rs = {enabled: true, card: this.rsPinboardItem}
            this.cardOption.addListeners(this.cardOptionItem, rs);
            this.cardOption.rsSetUp(rs.card, this.cardOptionItem);
        }
    }

    rsPinboardTemplateRender(cardTemp=this.rsPinboardItemTemp, data) {
        const card = cardTemp.cloneNode(true);
        const title = card.querySelector(this.cardOption.cardVar.title);
        const body = card.querySelector(this.cardOption.cardVar.body);
        const cardId = card.querySelector(this.cardOption.cardVar.cardId);
        const colorOption = card.querySelector(this.cardOption.cardVar.colorOpt)

        const theCurrentBgValue = colorOption?.querySelector(`[${this.cardOption.cardVar.bgValue}]`)?.getAttribute(this.cardOption.cardVar.bgValue);

        if (title) title.innerText = data.title;
        if (body) body.innerText = data.body;
        if (cardId) cardId.innerText = data.id;

        card.classList.replace(theCurrentBgValue, data.color);
        card.setAttribute(this.cardOption.cardVar.bgValue, data.color);

        const colorOptionToBgValue = colorOption?.querySelector(`[${this.cardOption.cardVar.bgValue}]`);
        colorOptionToBgValue?.setAttribute(this.cardOption.cardVar.bgValue, data.color);
        colorOptionToBgValue?.classList.replace(theCurrentBgValue, data.color);

        this.rsPinboardList.append(card);
        return card;
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.PinBoard = new PinBoard();
})
