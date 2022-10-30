class ClientSetting {
    // Dark mode style element
    darkModeStyleElement = document.querySelector(`[sw-darkmode="style"]`);
    // Setting Options
    nightModeInput = document.querySelector(`[sw-settings="dark-mode"]`);
    //one-page-writing
    onePageWritingInput = document.querySelector(`[sw-settings="one-page-writing"]`);
    //Watermark
    waterMarkInput = document.querySelector(`[sw-settings="water-mark"]`);
    //Seeting Opacity
    opacity = document.querySelector(`[sw-settings="opacity"]`);
    //setting Display
    display = document.querySelector('[sw-settings="display-name"]');
    //autoSaveTimeOut
    autoSave = document.querySelector(`[sw-settings="auto-save"]`);
    //get Directory
    directory = document.querySelector('input[type="file"]');
    // Settings Status
    nightModeStatus;
    //onePageWriting status
    onePageWritingStatus
    //waterMarkStatus
    waterMarkStatus
    //opacity
    waterMarkDisplayOpacity;
    //Display Name
    waterMarkDisplayText;
    //autoSaveTimeOut
    autoSaveTimeOut;
    //List for Display Name
    displayName;

    constructor() {
        //load Time and Date
        setInterval(this.showTimeDate, 1000);
        // Load settings from web db
        const loadSettings = this.loadSetting();
        loadSettings.then(res => {
            // Set night mode status
            if (res.nightMode) {
                if (res.nightMode === 'true') {
                    this.nightModeInput.checked = true;
                    // Set the dark theme
                    this.darkModeStyleElement.innerText = this.darkModeStyle();
                }
                this.nightModeStatus = this.nightModeInput.checked;
            }

            if (res.onePageWriting) {
                if (res.onePageWriting === 'true') {
                    this.onePageWritingInput.checked = true;
                }
                this.onePageWritingStatus = this.onePageWritingInput.checked;
            }

            if (res.waterMarkStatus) {
                if (res.waterMarkStatus === 'true') {
                    this.waterMarkInput.checked = true;
                }
                this.waterMarkStatus = this.waterMarkInput.checked;
            }
            var opacity = document.querySelector('.opacity-range');
            res.waterMarkDisplayOpacity ? this.opacity.value = res.waterMarkDisplayOpacity * 100 : this.opacity.value = 100;
            opacity.style.opacity = res.waterMarkDisplayOpacity
            res.waterMarkDisplayText ? this.display.value = res.waterMarkDisplayText : this.display.value = "";
            res.autoSaveTimeOut ? this.autoSave.value = res.autoSaveTimeOut : this.autoSave.value = 5;

            setTimeout(() => {
                this.displayName = document.querySelector(".water-marks");
                if (this.waterMarkStatus) {
                    this.displayName.classList.remove("hidden");
                } else {
                    this.displayName.classList.add("hidden");
                }
                var opacityValue = document.querySelector('.opacity-range');
                this.displayName.innerHTML = res.waterMarkDisplayText;
                opacityValue.style.opacity = res.waterMarkDisplayOpacity
            }, 100);

            this.listener();
            this.onePageWritingListener();
            this.waterMarkListener();
            this.displayListener();
            this.opacityListener();
            this.autoSaveListener();
            //this.selectFileLocation();
            let timeOut = res.autoSaveTimeOut * 1000 * 60;
            const loadScript = this.loadScript(res.userID);
            loadScript.then(res => {
                for (let i = 0; i < res.length; i++) {
                    setInterval(this.downloadScript, timeOut, res[i]);
                }
            });
        });
    }

    // selectFileLocation() {
    //     this.directory.addEventListener('change', () => {
    //         console.log(this.directory.files);
    //     });
    // }

    showTimeDate() {
        var d = new Date();
        var date = d.toLocaleDateString();
        var time = d.toLocaleTimeString();
        try {
            document.getElementById("time").innerHTML = time + " " + date;
        } catch (e) {
        }
    }

    getCommomFields() {
        this.autoSaveTimeOut = this.autoSave.value;
        this.waterMarkDisplayOpacity = this.opacity.value;
        this.waterMarkDisplayText = this.display.value;
    }

    /* Listening for a change in the night mode input. */
    listener() {
        // Night mode Input
        this.nightModeInput.addEventListener('change', () => {
            // Update the status
            this.nightModeStatus = this.nightModeInput.checked;
            this.getCommomFields();
            // Set or Remove dark mode
            if (this.nightModeStatus) this.darkModeStyleElement.innerText = this.darkModeStyle();
            else this.darkModeStyleElement.innerText = "";
            //Save Settings
            this.saveSetting();
        });
    }

    /* Listening for a change One Page Writing Mode */
    onePageWritingListener() {
        // Night mode Input
        this.onePageWritingInput.addEventListener('change', () => {
            // Update the status
            this.onePageWritingStatus = this.onePageWritingInput.checked;
            this.getCommomFields();
            //Save Settings
            this.saveSetting();
        });
    }

    /* Listening for a change Water Mark Mode */
    waterMarkListener() {
        this.waterMarkInput.addEventListener('change', () => {
            // Update the status
            this.waterMarkStatus = this.waterMarkInput.checked;
            if (this.waterMarkStatus) {
                    this.displayName.classList.remove("hidden");
                } else {
                    this.displayName.classList.add("hidden");
                }
            this.getCommomFields();
            //Save Settings
            this.saveSetting();
        });
    }

    /* Listening for a change in the opacity. */
    opacityListener() {
        //Opacity Input
        this.opacity.addEventListener('change', () => {
            // Update the status
            this.getCommomFields();
            //Save Settings
            this.saveSetting();
        });
    }

    /* Listening for a change the display Name */
    displayListener() {
        //Display Input
        this.display.addEventListener('keyup', () => {
            // Update the status
            this.getCommomFields();
            //Save Settings
            this.saveSetting();
        });

    }

    /* Auto Save settings to web db */
    autoSaveListener() {
        this.autoSave.addEventListener('change', () => {
            // Update the status
            this.autoSaveTimeOut = this.autoSave.value;
            this.waterMarkDisplayOpacity = this.opacity.value;
            this.waterMarkDisplayText = this.display.value;
            //Save Settings
            this.saveSetting();
        });
    }

    darkModeStyle() {
        return `.bg-x-gradient-grey-200-grey-200-50-white-100 { 
            background-color: rgb(16 14 14 / 80%)!important;
            background-image: linear-gradient(90deg,rgb(36 35 35 / 91%),rgb(36 35 35 / 91%) 100%,rgb(36 35 35 / 91%) 0)
        }
        .white-image {display: block !important}
        .black-image {display: none!important}
        .bg-four{ background-color: rgb(36 35 35 / 91%) !important; color: white!important; }
        .bg-three { background-color: rgb(0 0 0 / 93%) !important; color: white !important; }
        svg { fill: white !important; }
        li > svg { fill: black!important;}
        span > svg { fill: black!important}
        button > svg { fill: currentColor!important}
        .script-feature-menu0 { background-color: rgb(35 34 34) !important; color: white; }
        .doping { color: black!important;}
        .c-green { color: white!important;}
        .header-nav {background-image: linear-gradient(90deg,#00000e,#000000 100%,#fff 0);}
        .fill-current {fill: currentColor!important;}
        .script-feature-menu {background-image: linear-gradient(90deg,#00000e,#000000 100%,#fff 0);}
        .btn-jump { box-shadow: 0px 2px 4px rgb(225 230 225 / 90%), 0px 7px 13px -3px rgb(45 35 66 / 30%), inset 0px -3px 0px rgb(54 57 90 / 20%);}
        `
    }

    async saveSetting() {
        // get crsf token
        const crsftokenValue = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

        // create form and supply the inputs
        const formData = new FormData();
        formData.append('nightMode', this.nightModeStatus);
        formData.append('onePageWriting', this.onePageWritingStatus);
        formData.append('waterMarkStatus', this.waterMarkStatus);
        formData.append('csrfmiddlewaretoken', crsftokenValue);
        formData.append('waterMarkDisplayOpacity', this.waterMarkDisplayOpacity / 100);
        formData.append('waterMarkDisplayText', this.waterMarkDisplayText);
        formData.append('autoSaveTimeOut', this.autoSaveTimeOut);
        if (this.accountTypeInput) {
            if (this.accountTypeStatus) formData.append('accountType', 'pro')
            else formData.append('accountType', 'free')
        }

        // Send the data to store
        const postData = await fetch(location.protocol + "//" + location.host + '/clientsetting', {
            method: 'POST',
            body: formData,
        });
        return postData.json();
    }

    async loadSetting() {
        const res = await fetch(location.protocol + "//" + location.host + '/clientsetting', {method: 'GET'})
        return res.json();
    }

    async loadScript(userID) {
        const res = await fetch(location.protocol + "//" + location.host + '/get-all-script/' + userID, {method: 'GET'})
        return res.json();
    }

    async downloadScript(uniqueId) {
        const res = await fetch(location.protocol + "//" + location.host + '/scriptwork/' + uniqueId + '/download', {method: 'GET'})
        return res.json();
    }
}

/* A function that is used to change the value of the slider. */
async function slider() {
    var slider = document.querySelector('#myRange');
    var opacity;
    setTimeout(() => {
        opacity = document.querySelector('.opacity-range');
    }, 100);

    slider.oninput = function () {
        waterMarkDisplayOpacity = this.value / 100;
        opacity.style.opacity = slider.value / 100;
    }
}

window.ClientSetting = new ClientSetting();
slider();


