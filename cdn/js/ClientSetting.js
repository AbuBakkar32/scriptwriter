class ClientSetting {
    // Dark mode style element
    darkModeStyleElement = document.querySelector(`[sw-darkmode="style"]`);
    // Setting Options
    nightModeInput = document.querySelector(`[sw-settings="dark-mode"]`);
    // Settings Status
    nightModeStatus;
    constructor() {
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
    
            //Event listeners for setting Inputs
            this.listener();    
        });
        
    }

    listener() {
        // Night mode Input
        this.nightModeInput.addEventListener('change', () => {
            // Update the status
            this.nightModeStatus = this.nightModeInput.checked;
            // Set or Remove dark mode
            if (this.nightModeStatus) this.darkModeStyleElement.innerText = this.darkModeStyle();
            else  this.darkModeStyleElement.innerText = "";
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
        if (this.accountTypeInput) {
            if (this.accountTypeStatus) formData.append('accountType', 'pro')
            else  formData.append('accountType', 'free')
        }

        // Send the data to store
        const postData = await fetch(location.protocol+"//"+location.host+'/clientsetting', {method: 'POST', body: formData,});
        return postData.json();
    }

    async loadSetting() {
        const res = await fetch(location.protocol+"//"+location.host+'/clientsetting', {method: 'GET'})
        return res.json();
    }
}

//document.addEventListener("DOMContentLoaded", function(){
    window.ClientSetting = new ClientSetting();
//})
