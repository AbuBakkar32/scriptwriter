class ClientSetting {
    // Dark mode style element
    darkModeStyleElement = document.querySelector(`[sw-darkmode="style"]`);
    // Setting Options
    nightModeInput = document.querySelector(`[sw-settings="dark-mode"]`);
    //Seeting Opacity
    opacity = document.querySelector(`[sw-settings="opacity"]`);
    //setting Display
    display = document.querySelector('[sw-settings="display-name"]');
    //autoSaveTimeOut
    autoSave = document.querySelector(`[sw-settings="auto-save"]`);
    // Settings Status
    nightModeStatus;
    //opacity
    waterMarkDisplayOpacity;
    //Display Name
    waterMarkDisplayText;
    //autoSaveTimeOut
    autoSaveTimeOut;
    //List Unique ID
    unique_script_id;

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

            res.waterMarkDisplayOpacity ? this.opacity.value = res.waterMarkDisplayOpacity * 100 : this.opacity.value = 1.0;
            var opacity = document.querySelector('.opacity-range');
            opacity.style.opacity = res.waterMarkDisplayOpacity
            res.waterMarkDisplayText ? this.display.value = res.waterMarkDisplayText : this.display.value = "";
            res.autoSaveTimeOut ? this.autoSave.value = res.autoSaveTimeOut : this.autoSave.value = 5;
            this.listener();
            this.displayListener();
            this.opacityListener();
            this.autoSaveListener();
            let timeOut = res.autoSaveTimeOut * 1000 * 60;
            const loadScript = this.loadScript(res.userID);
            loadScript.then(res => {
                for (let i = 0; i < res.length; i++) {
                    setInterval(this.downloadScript, timeOut, res[i]);
                }
            });
        });
    }

    showTimeDate() {
        var d = new Date();
        var date = d.toLocaleDateString();
        var time = d.toLocaleTimeString();
        document.getElementById("time").innerHTML = time + " " + date;
    }

    /* Listening for a change in the night mode input. */
    listener() {
        // Night mode Input
        this.nightModeInput.addEventListener('change', () => {
            // Update the status
            this.nightModeStatus = this.nightModeInput.checked;
            this.autoSaveTimeOut = this.autoSave.value;
            this.waterMarkDisplayOpacity = this.opacity.value;
            this.waterMarkDisplayText = this.display.value;

            console.log(this.autoSaveTimeOut);
            console.log(this.waterMarkDisplayOpacity);
            console.log(this.waterMarkDisplayText);
            // Set or Remove dark mode
            if (this.nightModeStatus) this.darkModeStyleElement.innerText = this.darkModeStyle();
            else this.darkModeStyleElement.innerText = "";
            //Save Settings
            this.saveSetting();
        });
    }

    /* Listening for a change in the night mode input. */
    opacityListener() {
        //Opacity Input
        this.opacity.addEventListener('change', () => {
            // Update the status
            this.waterMarkDisplayOpacity = this.opacity.value;
            this.waterMarkDisplayText = this.display.value;
            this.autoSaveTimeOut = this.autoSave.value;
            //Save Settings
            this.saveSetting();
        });
    }

    /* Listening for a change the display Name */
    displayListener() {
        //Display Input
        this.display.addEventListener('keyup', () => {
            // Update the status
            this.autoSaveTimeOut = this.autoSave.value;
            this.waterMarkDisplayOpacity = this.opacity.value;
            this.waterMarkDisplayText = this.display.value;
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
    var opacity = document.querySelector('.opacity-range');

    slider.oninput = function () {
        waterMarkDisplayOpacity = this.value / 100;
        opacity.style.opacity = slider.value / 100;
    }
}

window.ClientSetting = new ClientSetting();
slider();


