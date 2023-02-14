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
    //Get Data from the database
    getData;
    //Get data from the script page
    searchWrapperElements;
    //get all script page number
    searchPageNumber;

    constructor() {
        //load Time and Date
        setInterval(this.showTimeDate, 1000);
        // Load settings from web db
        const loadSettings = this.loadSetting();
        loadSettings.then(res => {
            this.getData = res;
            window.localStorage.setItem('userData', this.getData.accountType);
            window.localStorage.setItem('data', JSON.stringify(this.getData));
            // Set night mode status
            setTimeout(() => {
                if (res.nightMode) {
                    if (res.nightMode === 'true') {
                        this.nightModeInput.checked = true;
                        // Set the dark theme
                        this.darkModeStyleElement.innerText = this.darkModeStyle();
                        try {
                            this.displayName.style.color = "white";
                        } catch (e) {

                        }
                    }
                    this.nightModeStatus = this.nightModeInput.checked;
                } else {
                    try {
                        this.displayName.style.color = "black";
                    } catch (e) {

                    }
                }
            }, 200);

            // Set one page writing mode status
            if (res.onePageWriting) {
                if (res.onePageWriting === 'true') {
                    this.onePageWritingInput.checked = true;
                    setTimeout(() => {
                        this.searchWrapperElements = document.querySelectorAll(`[sw-editor="item"]`);
                        this.searchPageNumber = document.querySelectorAll(`[sw-page-number="item"]`);
                        for (let i = 1; i < this.searchWrapperElements.length; i++) {
                            this.searchWrapperElements[i].remove();
                            this.searchPageNumber[i].remove();
                        }
                    }, 200)
                }
                this.onePageWritingStatus = this.onePageWritingInput.checked;

            }

            if (res.waterMarkStatus) {
                if (res.waterMarkStatus === 'true') {
                    this.waterMarkInput.checked = true;
                }
                this.waterMarkStatus = this.waterMarkInput.checked;
            }
            res.waterMarkDisplayOpacity ? this.opacity.value = res.waterMarkDisplayOpacity * 100 : this.opacity.value = 100;
            res.waterMarkDisplayText ? this.display.value = res.waterMarkDisplayText : this.display.value = "";
            res.autoSaveTimeOut ? this.autoSave.value = res.autoSaveTimeOut : this.autoSave.value = 5;

            setTimeout(() => {
                try {
                    this.displayName = document.querySelectorAll(".water-marks");
                    if (this.waterMarkStatus) {
                        this.displayName.forEach((element) => {element.classList.remove("hidden");});
                    } else {
                        this.displayName.forEach((element) => {element.classList.add("hidden");});
                    }
                    const opacityValue = document.querySelectorAll('.opacity-range');
                    opacityValue.forEach((element) => {element.style.opacity = res.waterMarkDisplayOpacity;});
                } catch (e) {
                }
            }, 100);
            let timeOut = res.autoSaveTimeOut * 1000 * 60;
            const loadScript = this.loadScript(res.userID);
            loadScript.then(res => {
                for (const element of res) {
                    setInterval(this.downloadScript, timeOut, element);
                }
            });
            this.listener();
            this.onePageWritingListener();
            this.waterMarkListener();
            this.displayListener();
            this.opacityListener();
            this.autoSaveListener();
            this.removeMultiplePages();
        });
    }

    // selectFileLocation() {
    //     this.directory.addEventListener('change', () => {
    //         console.log(this.directory.files);
    //     });
    // }

    //Set the date time into the dashboard
    showTimeDate() {
        let d = new Date();
        let date = d.toLocaleDateString();
        let time = d.toLocaleTimeString();
        try {
            document.getElementById("time").innerHTML = time + " " + date;
        } catch (e) {
        }
    }

    //settingPageListener
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
            try {
                if (this.nightModeStatus) {
                    this.darkModeStyleElement.innerText = this.darkModeStyle();
                    this.displayName.forEach(element => {element.style.color = "white";});
                    // this.displayName.style.color = "white";
                } else {
                    this.darkModeStyleElement.innerText = "";
                    this.displayName.forEach(element => {element.style.color = "black";});
                }
            } catch (e) {

            }
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
            if (this.onePageWritingInput.checked === true) {
                setTimeout(() => {
                    this.searchWrapperElements = document.querySelectorAll(`[sw-editor="item"]`);
                    this.searchPageNumber = document.querySelectorAll(`[sw-page-number="item"]`);
                    this.displayName = document.querySelectorAll(".water-marks");

                    for (let i = 1; i < this.searchWrapperElements.length; i++) {
                        this.searchWrapperElements[i].remove();
                        this.searchPageNumber[i].remove();
                        this.displayName[i].remove();
                    }
                }, 100)
            }
            this.getCommomFields();
            //Save Settings
            this.saveSetting();
        });
    }

    /* Listening for a change Water Mark Mode */
    waterMarkListener() {
        this.waterMarkInput.addEventListener('change', () => {
            // Update the status
            try {
                this.waterMarkStatus = this.waterMarkInput.checked;
                if (this.waterMarkStatus) {
                    this.displayName.forEach(element => {element.classList.remove("hidden");});
                } else {
                    this.displayName.forEach(element => {element.classList.add("hidden");});
                }
            } catch (e) {
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
        this.display.addEventListener('keyup', (event) => {
            // Update the status
            try {
                this.displayName.forEach(element => {element.innerHTML = this.display.value});
            } catch (e) {

            }
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

    // Remove multiple pages after every enter button press
    removeMultiplePages() {
        setInterval(() => {

        }, 100)
    }

    darkModeStyle() {
        return `.bg-x-gradient-grey-200-grey-200-50-white-100 { 
            background-color: rgb(16 14 14 / 80%)!important;
            background-image: linear-gradient(90deg,rgb(36 35 35 / 91%),rgb(36 35 35 / 91%) 100%,rgb(36 35 35 / 91%) 0)
        }
        .white-image {display: block !important}
        .black-image {display: none!important}
        .bg-four{ background-color: rgb(36 35 35 / 91%) !important; color: white !important; }
        .bg-three { background-color: #242326 !important; color: white !important; fill: white !important; }
        .bg-fill { background-color: #242326 !important; color: white !important; }
        svg.fill-color { fill: black !important; }
        .imgx100, .img40, .imgx75 { background-color: white !important; }
        li > svg { fill: black !important;}
        div[sw-glossary="item"], div[sw-page-number="item"] {color: white !important;}
        div[sw-card-option="option-wrap"] {fill: white !important;}
        span > svg { fill: black !important}
        .structure{color: white !important;}
        .social-logo { fill: white !important;}
        button > svg { fill: currentColor!important}
        .script-feature-menu0 { background-color: rgb(35 34 34) !important; color: white; }
        .doping { color: black!important;}
        .act-name, .select-color {color: white !important;}
        div[sw-share="wrap"]  {fill: white !important; background-color: #242323 !important; opacity: 0.9 !important;}
        .select-feature-menu {color: black !important;}
        .select-feature-menu span>svg {fill: black !important;}
        .fill-current-icon, .site-color {fill: gray !important;}
        .content-color {color: gray !important;}
        div[rs-outline="item"] {color: gray !important;}
        .fill-color {color: black !important;}
         svg.ang-color, .ang-color {fill: black !important;}
         .st0 {fill: white !important;}
         .c-black {fill: gray !important;}
         svg.size24 {fill: gray !important;}
        .fill-current {fill: white !important;}
        .bg-color {background-color: #242326 !important;}
        div[sw-structure="color"] {background-color: #242326 !important;}
        .nav-dark-color {background-color: #242326 !important;}
         div[outline-data="menu"] {background-color: #242326 !important;}
         div[outline-data="delete-option"] {fill: white !important; margin-left: 3px;}
         svg[outline-data="add"], svg[outline-data="lock"], svg[outline-data="unlock"] {fill: white !important;}
        .com-color, .ml-40 {color: black !important;}
        .profile-info {color: black !important;}
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
    let slider = document.querySelector('#myRange');
    let opacity;
    setTimeout(() => {
        opacity = document.querySelectorAll('.opacity-range');
    }, 100);

    slider.oninput = function () {
        this.waterMarkDisplayOpacity = this.value / 100;
        opacity.forEach((item) => {item.style.opacity = slider.value / 100;});
    }
}

window.ClientSetting = new ClientSetting();
slider();


