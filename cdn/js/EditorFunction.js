(() => {
    var c = class {
        attr;
        slt;
        startBtn;
        pauseBtn;
        stopBtn;
        speech;
        audioPlayer;

        constructor() {
            this.attr = "sw-audio", this.slt = {
                start: `[${this.attr}="start-btn"]`,
                stop: `[${this.attr}="stop-btn"]`,
                pause: `[${this.attr}="pause-btn"]`,
                player: `[${this.attr}="audio-player"]`,
                audioItem: `[${this.attr}="audio-item"]`,
                audioSrc: `${this.attr}-src`,
                wrap: '[sw-audio="wrap"]'
            }, "speechSynthesis" in window && (this.speech = speechSynthesis, this.speech.cancel()), this.startBtn = document.querySelector(this.slt.start), this.stopBtn = document.querySelector(this.slt.stop), this.pauseBtn = document.querySelector(this.slt.pause), this.audioPlayer = document.querySelector(this.slt.player), this.init()
        }

        init() {
            if (!this.speech) return;
            this.startBtn.addEventListener("click", () => {
                if (this.speech?.paused) {
                    this.speech.resume();
                    return
                }
                this.speech?.cancel();
                let e = document.querySelector('[sw-editor="list"]');
                this.speakWords(e.innerText)
            }), this.pauseBtn.addEventListener("click", () => {
                if (!this.speech?.paused) {
                    this.speech?.pause();
                    return
                }
            }), this.stopBtn.addEventListener("click", () => {
                this.speech?.cancel()
            }), document.querySelectorAll(this.slt.audioItem).forEach(e => {
                let s = e.getAttribute(this.slt.audioSrc);
                e.addEventListener("click", () => {
                    this.audioPlayer.pause(), this.audioPlayer.volume = .2, this.audioPlayer.src = s
                })
            })
        }

        speakWords(t) {
            if (!this.speech) return;
            let e = new SpeechSynthesisUtterance;
            e.volume = 1, e.rate = .7, e.pitch = 1.5, e.text = t, e.lang = "en-GB", this.speech.speak(e)
        }
    };
    var l = class {
        attr;
        slt;
        recognition;
        startBtn;
        stopBtn;
        statusWrapper;
        runningState;

        constructor() {
            if (this.attr = "sw-recording", this.slt = {
                wrap: `[${this.attr}="wrap"]`,
                focused: '[sw-focused="edit"]',
                start: `[${this.attr}="start-btn"]`,
                stop: `[${this.attr}="stop-btn"]`,
                status: `[${this.attr}="status"]`
            }, this.runningState = !1, this.startBtn = document.querySelector(this.slt.start), this.stopBtn = document.querySelector(this.slt.stop), this.statusWrapper = document.querySelector(this.slt.status), "speechSynthesis" in window) {
                let t = window.SpeechRecognition || window.webkitSpeechRecognition;
                this.recognition = new t
            }
            this.init()
        }

        init() {
            if (!this.recognition) {
                this.statusWrapper.textContent = "Browser Not Supported. Use Chrome Browser.";
                return
            }
            this.recognition.continuous = !0, this.recognition.stop(), this.startBtn?.addEventListener("click", () => {
                this.runningState = !0, this.recognition.start(), this.statusWrapper.textContent = t
            }), this.stopBtn?.addEventListener("click", () => {
                this.runningState = !1, this.recognition.stop(), this.statusWrapper.textContent = e, window.ScriptAdapter.save()
            });
            let t = "Recording Active", e = "Not Active";
            this.recognition.onresult = s => {
                let i = s.resultIndex, n = s?.results[i][0].transcript;
                if (!(i == 1 && n == s.results[0][0].transcript)) {
                    let a = document.querySelector('[sw-editor="list"]')?.lastElementChild?.lastElementChild,
                        p = document.querySelector(this.slt.focused);
                    p ? p.textContent = p.textContent + n : a && (a.scrollIntoView(), a.textContent = a.textContent + n);
                    let m = this.statusWrapper.textContent;
                    m === t ? this.statusWrapper.textContent = t + "." : m === t + "." ? this.statusWrapper.textContent = t + ".." : m === t + ".." ? this.statusWrapper.textContent = t + "..." : this.statusWrapper.textContent = t
                }
            }, this.recognition.onstart = () => {
                this.statusWrapper.textContent = t
            }, this.recognition.onspeechend = () => {
                this.statusWrapper.textContent = e, this.runningState && this.recognition.start()
            }, this.recognition.onerror = s => {
                this.statusWrapper.textContent = e, s.error == "no-speech" && (this.statusWrapper.textContent = "No Speech Detected")
            }
        }
    };
    var h = class {
        formateBtns;
        toolsBtns;
        searchBtns;
        authorBtn;
        shortcutBtn;
        shortcutWrap;
        shortcutNav;
        shortcutClose;
        hideBtns;
        attr;
        cons;
        hide;
        hidden;

        constructor() {
            this.hide = "hide", this.hidden = "hidden", this.attr = "sw-top-menu", this.cons = {
                formateBtn: `[${this.attr}="formate-btn"]`,
                formateWrap: `[${this.attr}="formate-wrap"]`,
                toolsBtn: `[${this.attr}="tools-btn"]`,
                toolsWrap: `[${this.attr}="tools-wrap"]`,
                searchBtn: `[${this.attr}="search-btn"]`,
                searchWrap: `[${this.attr}="search-wrap"]`,
                authorBtn: `[${this.attr}="author-btn"]`,
                authorWrap: `[${this.attr}="author-wrap"]`,
                shortcutBtn: `[${this.attr}="shortcut-btn"]`,
                shortcutWrap: `[${this.attr}="shortcut-wrap"]`,
                shortcutNav: `[${this.attr}="shortcut-nav"]`,
                shortcutCloseWrap: `[${this.attr}="shortcut-close-wrap"]`,
                hideBtn: `[${this.attr}="hide-btn"]`,
                wrapper: `[${this.attr}="wrapper"]`
            }, this.formateBtns = document.querySelectorAll(this.cons.formateBtn), this.toolsBtns = document.querySelectorAll(this.cons.toolsBtn), this.searchBtns = document.querySelectorAll(this.cons.searchBtn), this.authorBtn = document.querySelector(this.cons.authorBtn), this.shortcutBtn = document.querySelector(this.cons.shortcutBtn), this.shortcutWrap = document.querySelector(this.cons.shortcutWrap), this.shortcutNav = document.querySelector(this.cons.shortcutNav), this.shortcutClose = document.querySelector(this.cons.shortcutCloseWrap), this.hideBtns = document.querySelectorAll(this.cons.hideBtn), this.init()
        }

        init() {
            this.formateBtns.forEach(t => {
                t.addEventListener("click", () => this.emitAct(t, "formate"))
            }), this.toolsBtns.forEach(t => {
                t.addEventListener("click", () => this.emitAct(t, "tools"))
            }), this.searchBtns.forEach(t => {
                t.addEventListener("click", () => this.emitAct(t, "search"))
            }), this.authorBtn?.addEventListener("click", () => this.emitAct(this.authorBtn, "author")),
                this.shortcutBtn?.addEventListener("click", () => this.emitAct(this.authorBtn, "shortcut")),
                this.hideBtns.forEach(t => {
                t.addEventListener("click", () => this.emitAct(t, "hide"))
            })
        }

        emitAct(t, e) {
            let s = t?.closest(this.cons.wrapper);
            if (!s) return;
            let i = s.querySelector(this.cons.formateWrap), n = s.querySelector(this.cons.searchWrap),
                r = s.querySelector(this.cons.authorWrap), o = s.querySelector(this.cons.toolsWrap);
            e === "formate" ? i?.classList.remove(this.hidden) : e === "tools" ? o?.classList.remove(this.hidden) : e === "search" ? n?.classList.remove(this.hidden) : e === "author" ? r?.classList.remove(this.hidden) : e === "shortcut" ? (this.shortcutWrap?.classList.remove(this.hidden), this.shortcutNav?.classList.remove(this.hidden), this.shortcutClose?.classList.remove(this.hide)) : e === "hide" && (i && !i.classList.contains(this.hidden) && i.classList.add(this.hidden), r && !r.classList.contains(this.hidden) && r.classList.add(this.hidden), n && !n.classList.contains(this.hidden) && n.classList.add(this.hidden), o && !o.classList.contains(this.hidden) && o.classList.add(this.hidden), this.shortcutWrap && !this.shortcutWrap?.classList.contains(this.hidden) && (this.shortcutWrap?.classList.add(this.hidden), this.shortcutNav?.classList.add(this.hidden), this.shortcutClose?.classList.add(this.hide))), this.reactOnShortcutBtns(s)
        }

        reactOnShortcutBtns(t) {
            let e = t.querySelector(this.cons.formateBtn), s = t.querySelector(this.cons.toolsBtn),
                i = t.querySelector(this.cons.searchBtn), n = t.querySelector(this.cons.authorBtn),
                r = t.querySelector(this.cons.shortcutBtn), o = t.querySelector(this.cons.hideBtn);
            o.classList.contains(this.hide) ? o.classList.remove(this.hide) : o.classList.add(this.hide), e && (e.classList.contains(this.hide) ? e.classList.remove(this.hide) : e.classList.add(this.hide)), s && (s.classList.contains(this.hide) ? s.classList.remove(this.hide) : s.classList.add(this.hide)), i && (i.classList.contains(this.hide) ? i.classList.remove(this.hide) : i.classList.add(this.hide)), n && (n.classList.contains(this.hide) ? n.classList.remove(this.hide) : n.classList.add(this.hide)), r && (r.classList.contains(this.hide) ? r.classList.remove(this.hide) : r.classList.add(this.hide))
        }
    };
    var d = class {
        boldBtn;
        italicBtn;
        underlineBtn;
        penPaintBtn;
        textColorBtn;
        voiceRecordBtn;
        audioPlayReaderBtn;
        downloadBtn;
        shareBtn;
        saveBtn;
        swPageListTemp;
        swPageTemp;
        lineTemp;
        newlyCreatedLine;
        swPageHeight = 1130;
        attrName;
        cons;
        shortcutMenu;
        textToSpeech;
        speechToText;

        constructor() {
            this.attrName = "sw-editor", this.cons = {
                list: `[${this.attrName}="list"]`,
                item: `[${this.attrName}="item"]`,
                line: `[${this.attrName}-type]`,
                a: "action",
                at: "action-type",
                t: "transition",
                tt: "transition-type",
                d: "dialog",
                dt: "dialog-type",
                pa: "parent-article",
                pat: "parent-article-type",
                c: "character",
                ct: "character-type",
                sh: "scene-heading",
                sht: "scene-heading-type",
                editType: `${this.attrName}-type`,
                editID: `${this.attrName}-id`,
                editColor: `${this.attrName}-color`,
                focused: '[sw-focused="edit"]',
                selectedBtn: '[sw-btn-selected="true"]',
                btnSelectAttr: "sw-btn-selected",
                btnAttr: "sw-btn"
            }, this.swPageListTemp = document.querySelector(this.cons.list), this.swPageTemp = document.querySelector(this.cons.item)?.cloneNode(!0), this.lineTemp = document.querySelector(this.cons.line)?.cloneNode(!0), this.newlyCreatedLine = document.querySelector(this.cons.line), this.boldBtn = document.querySelectorAll('[sw-btn="bold"]'), this.italicBtn = document.querySelectorAll('[sw-btn="italic"]'), this.underlineBtn = document.querySelectorAll('[sw-btn="underline"]'), this.penPaintBtn = document.querySelectorAll('[sw-btn="penPaint"]'), this.textColorBtn = document.querySelectorAll('[sw-btn="textColor"]'), this.voiceRecordBtn = document.querySelectorAll('[sw-btn="voiceRecord"]'), this.audioPlayReaderBtn = document.querySelectorAll('[sw-btn="audioPlayReader"]'), this.downloadBtn = document.querySelectorAll('[sw-btn="download"]'), this.shareBtn = document.querySelectorAll('[sw-btn="share"]'), this.saveBtn = document.querySelectorAll('[sw-btn="save"]'), this.listener(), this.shortcutMenu = new h, this.textToSpeech = new c, this.speechToText = new l
        }

        listener() {
            this.boldBtn.forEach(t => {
                t.addEventListener("click", () => this.emis(t, "bold"))
            }), this.italicBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "italic"))), this.underlineBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "underline"))), this.downloadBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "download"))), this.saveBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "save"))), this.shareBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "share"))), this.penPaintBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "highlight"))), this.textColorBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "color"))), this.renderColorAttr(), this.voiceRecordBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "voiceRecord"))), this.audioPlayReaderBtn.forEach(t => t.addEventListener("click", () => this.emis(t, "audioPlayReader"))), this.totalNumberOfPage()
        }


        emis(t, e) {
            let s = document.querySelector(this.cons.selectedBtn);
            if (s) {
                s.setAttribute(this.cons.btnSelectAttr, "false");
                let i = s.getAttribute(this.cons.btnAttr);
                if (i === "voiceRecord") {
                    let n = s.querySelector('[sw-recording="wrap"]');
                    n && n.classList.add("hide")
                } else if (i === "audioPlayReader") {
                    let n = s.querySelector(this.textToSpeech.slt.wrap);
                    n && (n.classList.add("hide"), n.querySelector(this.textToSpeech.slt.player).pause())
                } else if (i === "share") {
                    let n = s.querySelector('[sw-share="wrap"]');
                    n && n.classList.add("hide")
                }
            }
            t !== s && (t.setAttribute(this.cons.btnSelectAttr, "true"), e === "bold" ? this.bold() : e === "italic" ? this.italic() : e === "underline" ? this.underline() : e === "download" ? this.download() : e === "save" ? this.save() : e === "share" ? this.share(t) : e === "highlight" ? this.highlight(t) : e === "color" ? this.color(t) : e === "voiceRecord" ? this.voiceRecord(t) : e === "audioPlayReader" && this.audioPlayReader(t))
        }

        generateID() {
            let t = "0", e = document.querySelectorAll(this.cons.line), s = e[e.length - 1];
            if (s) {
                let r = s.getAttribute(this.cons.editID);
                r ? t += String(Number(r.substr(1)) + 1) : t += "0"
            } else t += "0";
            let i = [];
            e.forEach(r => {
                i.push(r.getAttribute(this.cons.editID))
            });
            let n = 0;
            for (; n += 1, i.includes(t);) if (t = "0", s) {
                let r = s.getAttribute(this.cons.editID);
                r ? t += String(Number(r.substring(1)) + n) : t += String(n)
            } else t += String(n);
            return t
        }

        renderColorAttr() {
            document.querySelectorAll("[render-color]").forEach(t => {
                t.addEventListener("click", e => {
                    e.stopImmediatePropagation(), e.stopPropagation()
                }), t.addEventListener("change", e => {
                    e.stopImmediatePropagation(), e.stopPropagation()
                })
            })
        }

        bold() {
            document.execCommand("bold")
        }

        italic() {
            document.execCommand("italic")
        }

        underline() {
            document.execCommand("underline")
        }

        highlight(t) {
            let e = t.querySelector('input[type="color"]'), s = window.getSelection();
            if (!s?.toString()) {
                t.click();
                return
            }
            let i = s.focusNode?.parentElement;
            if (i?.nodeName === "SPAN" || i?.nodeName === "FONT" && i?.style.backgroundColor) {
                this.penPaint("transparent");
                return
            }
            this.penPaint(e.value)
        }

        color(t) {
            let e = t.querySelector('input[type="color"]'), s = window.getSelection();
            if (!s?.toString()) {
                t.click();
                return
            }
            let i = s.focusNode?.parentElement;
            if (i?.nodeName === "SPAN" || i?.nodeName === "FONT" && i?.color) {
                document.execCommand("removeFormat", !1, "foreColor");
                return
            }
            this.colorText(e.value)
        }

        penPaint(t) {
            document.execCommand("backColor", !1, t)
        }

        colorText(t) {
            document.execCommand("foreColor", !0, t)
        }

        voiceRecord(t) {
            let e = t?.querySelector('[sw-recording="wrap"]');
            e.classList.contains("hide") ? e?.classList.remove("hide") : e?.classList.add("hide")
        }

        audioPlayReader(t) {
            let e = t?.querySelector(this.textToSpeech.slt.wrap);
            e.classList.contains("hide") ? e?.classList.remove("hide") : e?.classList.add("hide")
        }

        download() {
            var rest = confirm("Do you want to download your content");
            if (rest) {
                document.querySelectorAll(`[sw-editor="item"]`).forEach(t => {
                    t.style.boxShadow = "none"
                })
                const file = window.location.pathname.split("/");
                const fileName = file[file.length - 1]
                var HTML_Width = document.querySelector(".html-content").offsetWidth - 750;
                var HTML_Height = document.querySelector(".html-content").offsetHeight - 500;
                var top_left_margin = 15;
                var PDF_Width = HTML_Width + (top_left_margin * 2);
                var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
                var canvas_image_width = HTML_Width;
                var canvas_image_height = HTML_Height;
                var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

                html2canvas(document.querySelector(".html-content")).then(function (canvas) {
                    var imgData = canvas.toDataURL("image/jpeg", 1.0);
                    var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
                    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
                    for (var i = 1; i <= totalPDFPages; i++) {
                        pdf.addPage(PDF_Width, PDF_Height);
                        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
                    }
                    pdf.save(fileName + ".pdf");
                });
            }
        }

        share(t) {
            let e = t?.querySelector('[sw-share="wrap"]');
            e.classList.contains("hide") ? e?.classList.remove("hide") : e?.classList.add("hide")
        }

        save() {
            confirm("Do you want to save your content") && window.ScriptAdapter.save()
        }

        createNewLine(t, e, s = !0, i = "", n = "") {
            let r = n || this.generateID(), o = this.lineTemp?.cloneNode(!0);
            o.innerHTML = i, o.setAttribute(this.cons?.editID, r);
            let y = window.BackgroundColor.randomBg();
            if (o?.setAttribute(this.cons?.editColor, y), this.newlyCreatedLine = o, window.EditorMode.handleContentLineNuetral(o), e(o), s) {
                t?.insertAdjacentElement("afterend", o);
                let a = t?.getAttribute(this.cons?.editID);
                window.Watcher.newLine(r, a)
            }
            return o
        }

        totalNumberOfPage() {
            let t = document.querySelectorAll(this.cons.item).length,
                e = document.querySelector('[sw-number="totalpage"]'), s = document.querySelector('[sw-number="time"]');
            if (e && (e.innerText = String(t)), t === 60) s && (s.innerText = "1h:0m"); else if (t > 60) {
                let i = Number(String(t / 60).split(".")[0]), n = i * 60 - t;
                s && (s.innerText = String(i) + "h:" + String(n) + "m")
            } else s && (s.innerText = "0h:" + String(t) + "m")
        }
    };
    document.addEventListener("DOMContentLoaded", () => {
        window.EditorFuncs = new d
    });
})();
