class BackgroundColor {
    bg;
    bgValueList;
    constructor() {
        this.bg = {
            yellow : '#f9f6d7', green: '#cdf6ce' ,blue: '#e2f1ff', purple: '#f2e8f5', orange: '#f6decd', pink: '#f6cdf2'
        }

        // Background colors
        this.bgValueList = ['bg-green', 'bg-pink', 'bg-yellow', 'bg-orange', 'bg-purple', 'bg-blue'];
    }

    randomBg() {
        return this.bgValueList[Math.floor(Math.random() * this.bgValueList.length)];
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.BackgroundColor = new BackgroundColor();
})
