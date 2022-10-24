/**
 * If className select-feature-menu is added to the first element
 * of the <li>, displays the selection.
 */
function customControlMenuPopUp() {
    const openBtns = document.querySelectorAll(`[sw-trigger="open"]`);
    openBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelector('body').classList.add('overflow-hidden');

            document.querySelectorAll('aside').forEach((asd) => {
                asd.classList.add('flex');
                asd.classList.add('flex-col');
                asd.classList.remove('hidden');
            });
        });
    });

    const closeBtns = document.querySelectorAll(`[sw-trigger="close"]`);
    closeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelector('body').classList.remove('overflow-hidden');

            document.querySelectorAll('aside').forEach((asd) => {
                asd.classList.remove('flex');
                asd.classList.remove('flex-col');
                asd.classList.add('hidden');
            });
        });
    });
}

function swSelectOptionApply() {
    const liWrapper = document.querySelectorAll(`[sw-data="select"]`);
    // Iterate through the loop
    liWrapper.forEach((ele) => {
        //list of li in the ul element
        const liList = ele.querySelectorAll(`[sw-data="option"]`);
        // Listen for click event within the ul element.
        liList.forEach((eleli) => {
            eleli.addEventListener('click', function () {
                if (!this.firstElementChild.classList.contains('select-feature-menu')) {
                    // Remove the select option from other li element
                    liList.forEach((sli) => {
                        sli.firstElementChild.classList.remove('select-feature-menu');
                        sli.classList.add('mt-16');
                        sli.classList.add('mb-16');
                    });
                    // Add selection to the current li element
                    this.firstElementChild.classList.add('select-feature-menu');
                    this.classList.remove('mt-16');
                    this.classList.remove('mb-16');
                }
            });
        });
    });
}

function hideAndShowDropable(eleName, NodeListName) {
    const characterOption = document.querySelectorAll(`[sw-action="${NodeListName}"]`); //showable-part

    // Listen to click event
    characterOption.forEach((ele) => {
        //ele.setAttribute('tabindex', '1');
        //let featureSwitch = true;
        ele.addEventListener('click', function () {
            // query the feature wrapper xter-down
            const featureWrapper = this.querySelector('.' + eleName) || this.querySelector(`[sw-action="${eleName}"]`); //hideable-part
            featureWrapper.style.display = 'block';
        });

        ele.addEventListener('mousemove', () => {
            if (ele.querySelector(`[sw-action="off-part"]`)) {
                ele.querySelector(`[sw-action="off-part"]`).style.display = 'block';
            }
        });

        ele.addEventListener('mouseout', () => {
            if (ele.querySelector(`[sw-action="off-part"]`)) {
                ele.querySelector(`[sw-action="off-part"]`).style.display = '';
            }
        });

        if (ele.querySelector(`[sw-action="off-part"]`)) {
            ele.querySelector(`[sw-action="off-part"]`).addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                // query the feature wrapper xter-down
                const featureWrapper = ele.querySelector('.' + eleName) || ele.querySelector(`[sw-action="${eleName}"]`); //hideable-part
                featureWrapper.style.display = 'none';
            });
        }
    });
}

function quickID() {
    return Math.random().toString(36).substring(2)
}

function uniqueID() {
    return Math.random().toString(14).substring(2);
}

function menuOptionPopup() {
    const menuHello = document.querySelectorAll(`[sw-display="menu-hello"]`);

    // Listen to click event
    menuHello.forEach((ele) => {
        ele.addEventListener('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            //e.preventDefault();
            // query the main wrapper
            const mainWrapper = this.closest(`[sw-display="hello-drop"]`);
            if (mainWrapper) {
                const menuHi = mainWrapper.querySelector(`[sw-display="menu-hi"]`);
                if (menuHi?.classList.contains('hidden')) menuHi.classList.remove('hidden');
                else menuHi.classList.add('hidden');
            }
        })
    })
}

function swSelectItem() {
    // Wrapper for drop down
    const selectContainer = document.querySelectorAll(`[sw-select-item="container"]`);
    selectContainer.forEach((itm) => {
        let useImage = false;
        if (itm.querySelector(`[sw-select-item="use-image"]`)) useImage = true;
        //Wrapper for setting selected item
        const setItem = itm.querySelector(`[sw-select-item="set"]`);

        //wrapper for get items
        const getItems = itm.querySelector(`[sw-select-item="get"]`);

        //Add click event listener to get children
        Array.prototype.slice.call(getItems.children).forEach((sel) => {
            sel.addEventListener('click', function () {
                if (useImage) {
                    setItem.innerHTML = sel.querySelector('img').outerHTML;
                    setItem.querySelector('img').classList.replace('img30', 'img40');
                    //Hide the wrapper for get items
                    getItems.style.display = '';
                } else {
                    setItem.textContent = this.textContent;
                    //Hide the wrapper for get items
                    getItems.style.display = '';
                }
            });
        });

        //Enable dropdown action
        let checkerStatus = true;
        itm.addEventListener('click', () => {
            if (checkerStatus) {
                getItems.style.display = 'block';
                checkerStatus = false;
            } else {
                getItems.style.display = '';
                checkerStatus = true;
            }
        });

        // Set the tabindex="1" on every container so that the focus event can work
        itm.setAttribute('tabindex', '1');

        // If focus is lost within the wrapper then hide
        itm.addEventListener('focusout', () => {
            getItems.style.display = '';
            checkerStatus = true;
        });
    });
}

function getEleId(ele, nodeList) {
    const arr = Array.prototype.slice.call(nodeList); // Now it's an Array.
    return arr.indexOf(ele);
}

function popUpSettings() {
    // Wrapper for settings content. (display is none by default)
    const settingsPopup = document.querySelector('.settings-popup');
    if (settingsPopup) {
        document.querySelector(`[sw-action="settings-open"]`).addEventListener('click', () => {
            //show settings wrapper
            settingsPopup.style.display = 'block';
        });

        document.querySelector(`[sw-action="close-settings"]`).addEventListener('click', () => {
            //show settings wrapper
            settingsPopup.style.display = 'none';
        });
    } else console.log('Popup Setting wont work on this page');
}


// Click Block Event on wrapper
function clickBlock() {
    document.querySelectorAll(`[sw-clickPrevent="true"]`).forEach((wrapper) => {
        wrapper.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
        })
    })
}

function tabAction() {
    const tabContainer = document.querySelectorAll(`[sw-tab-fn="container"]`);

    tabContainer.forEach((container) => {
        // Tab menu option wrapper
        const tabOptionWrap = container.querySelector(`[sw-tab-fn="opt-wrap"]`)
        // Tab meun option
        const allTabOptions = container.querySelectorAll(`[sw-tab-fn="option"]`);
        // Tab itself
        const tabs = container?.querySelectorAll(`[sw-tab-fn="tab"]`);
        // Ensure that only one tab is showing
        let count = 0;
        tabs.forEach((tab) => {
            if (!count) {
                count += 1;
                tab.classList.remove('hide');
            } else tab.classList.add('hide');
        });
        // Add click event listener to all the options
        allTabOptions.forEach((option) => {
            option.addEventListener('click', () => {
                // Remove the tab option click indicator
                tabOptionWrap.querySelector('.tab-shade')?.classList.remove('tab-shade');
                // Add the tab option click indicator to the current clicked option
                option.classList.add('tab-shade');
                // get the index position of the tab option
                const optionIndex = getEleId(option, allTabOptions);
                // set the tab of the same index position to be visible and hide the rest tabs
                tabs.forEach((tab) => {
                    const tabIndex = getEleId(tab, tabs);
                    if (optionIndex === tabIndex) tab.classList.remove('hide');
                    else tab.classList.add('hide');
                });
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Call this function
    customControlMenuPopUp();

    // Call this function
    swSelectItem();

    swSelectOptionApply();

    hideAndShowDropable('hideable-part', 'showable-part');

    menuOptionPopup();
    //Call Setting Actions
    popUpSettings();
    // Block click on wrapper
    clickBlock();
    // Tab function
    tabAction()

});
