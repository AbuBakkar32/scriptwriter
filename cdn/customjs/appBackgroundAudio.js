(() => {
    var u = class {
        submit;
        response;

        constructor() {
            this.response = {}, this.submit = async (t, i) => {
                i && (i.preventDefault(), i.stopPropagation(), i.stopImmediatePropagation());
                let n = new FormData;
                t.data?.forEach(e => {
                    n.append(e.key, e.value)
                }), t.bodyDataBySelector?.forEach(e => {
                    if (!e.key || !e.selector || !e.target) {
                        console.log(`Selector:${e.selector}, Target:${e.target}, Key:${e.key}, One or more option not found'`);
                        return
                    }
                    let c = "No element with this selector:";
                    if (e.target === "value") {
                        let a = document.querySelector(e.selector);
                        if (!a) return console.log(`${c}${e.selector}, Found`);
                        n.append(e.key, a.value)
                    } else if (e.target === "text") {
                        let a = document.querySelector(e.selector);
                        if (!a) return console.log(`${c}${e.selector}, Found`);
                        n.append(e.key, a.textContent)
                    } else if (e.target === "attribute") {
                        let a = document.querySelector(e.selector), m = a?.getAttribute(e.selector);
                        if (!a || !m) return console.log(`No element or Attribute of selector:${e.selector}, Found`);
                        n.append(e.key, m)
                    } else if (e.target === "file") {
                        let a = document.querySelector(e.selector);
                        if (!a) return console.log(`${c}${e.selector}, Found`);
                        let m = a.files;
                        n.append(e.key, m[0])
                    }
                });
                let r = t.bodyDataBySelector?.length, o = {method: t.method};
                (t.data?.length || r) && (o = {...o, body: n}), t.otherOptions && (o = {...o, ...t.otherOptions});
                let s = await fetch(t.url, o);
                this.response = s;
                let l;
                return t.type === "text" ? l = await s.text() : l = await s.json(), t.callBack && (t.specifyResponseDataInCallBack ? t.callBack(l) : t.callBack()), t.redirectUrl && (window.location.href = t.redirectUrl), l
            }
        }
    };
    var d = class {
        crsftokenValue;
        attr;
        nameInput;
        fileInput;
        createAudioButton;
        vars;
        audioList;
        audioItemTemplate;
        quest;

        constructor() {
            this.attr = "sw-bg-audio", this.vars = {
                crsf: 'input[name="csrfmiddlewaretoken"]',
                mainName: `[${this.attr}="name"]`,
                mainFile: `[${this.attr}="file"]`,
                createBtn: `[${this.attr}="create-btn"]`,
                list: `[${this.attr}="list"]`,
                item: `[${this.attr}="item"]`,
                itemTemp: `[${this.attr}-template="item"]`,
                title: `[${this.attr}="title"]`,
                audio: `[${this.attr}="audio"]`,
                menu: `[${this.attr}="menu"]`,
                menuBtn: `[${this.attr}="menu-btn"]`,
                delete: `[${this.attr}="delete-option"]`,
                audioID: `${this.attr}-id`
            }, this.crsftokenValue = document.querySelector(this.vars.crsf), this.nameInput = document.querySelector(this.vars.mainName), this.fileInput = document.querySelector(this.vars.mainFile), this.createAudioButton = document.querySelector(this.vars.createBtn), this.audioList = document.querySelector(this.vars.list), this.audioItemTemplate = document.querySelector(this.vars.itemTemp), this.start(), this.quest = new u
        }

        start() {
            this.audioItemTemplate.remove(), document.querySelectorAll(this.vars.item).forEach(i => this.activateItem(i)), this.createAudioButton?.addEventListener("click", () => {
                if (!this.nameInput?.value || !this.fileInput?.value) return;
                let n = {
                    url: location.href + "/create",
                    method: "POST",
                    bodyDataBySelector: [{
                        selector: this.vars.mainName,
                        target: "value",
                        key: "audioName"
                    }, {selector: this.vars.mainFile, target: "file", key: "audioFile"}, {
                        selector: this.vars.crsf,
                        target: "value",
                        key: "csrfmiddlewaretoken"
                    }]
                };
                this.quest.submit(n).then(o => {
                    if (!o || o.result === "failed") return;
                    let s = this.audioItemTemplate.cloneNode(!0);
                    this.setItemParas(s, {
                        id: o.id,
                        name: o.name,
                        title: this.nameInput.value
                    }), this.activateItem(s), this.nameInput.value = "", this.fileInput.value = ""
                })
            })
        }

        setItemParas(t, i) {
            t.setAttribute(this.vars.audioID, i.id);
            let n = t.querySelector(this.vars.audio);
            n.src = "cdn/staticfiles/" + i.name;
            let r = t.querySelector(this.vars.title);
            r && (r.textContent = i.title), this.audioList.insertAdjacentElement("afterbegin", t)
        }

        activateItem(t) {
            let i = t.getAttribute(this.vars.audioID), n = t.querySelector(this.vars.title),
                r = t.querySelector(this.vars.menu), o = t.querySelector(this.vars.menuBtn),
                s = t.querySelector(this.vars.delete);
            n?.addEventListener("input", () => {
                let e = {
                    url: location.href + "/update/" + i,
                    method: "POST",
                    bodyDataBySelector: [{
                        selector: this.vars.title,
                        target: "text",
                        key: "audioName"
                    }, {selector: this.vars.crsf, target: "value", key: "csrfmiddlewaretoken"}]
                };
                this.quest.submit(e)
            }), r?.setAttribute("tabindex", "1"), o?.addEventListener("click", () => {
                r && (r.classList.contains("hide") ? r.classList.remove("hide") : r.classList.add("hide"))
            }), r?.addEventListener("focusout", () => r.classList.add("hide")), s?.addEventListener("click", () => {
                let e = {url: location.href + "/delete/" + i, method: "GET"};
                this.quest.submit(e).then(c => {
                    c && c?.result === "success" && t.remove()
                })
            })
        }
    };
    document.addEventListener("DOMContentLoaded", () => {
        new d
    });
})();
