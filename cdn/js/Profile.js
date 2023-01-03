const Profile = () => {
    let weekdays = [1, 3, 5];
    $('#weekdays').weekdays({
        selected: weekdays,
    });
    weekdays = []
    const li = document.getElementById("weekdays").getElementsByTagName('li');
    var allSelectedDay = document.querySelector('#weekdays');
    setTimeout(function () {
        for (var i = 0; i < li.length; i++) {
            if (li[i].classList.contains("weekday-selected")) {
                li[i].style.backgroundColor = "#CDF6CE";
                li[i].style.fontWeight = '100';
                li[i].style.fontWeight = '700';
            }
            li[i].style.color = 'black';
            li[i].style.borderRadius = '25px';
            li[i].style.lineHeight = '0.25';
            li[i].style.marginLeft = '5px';
            li[i].style.fontSize = '12px';
            li[i].style.paddingLeft = '33px';
            li[i].style.paddingRight = '33px';
            li[i].style.paddingTop = '15px';
            li[i].style.paddingBottom = '15px';
            li[i].style.fontWeight = '700';
        }

    }, 100);

    allSelectedDay.addEventListener('click', function (e) {
        var a = $('#weekdays').selectedDays();
        for (var i = 0; i < a.length; i++) {
            weekdays.push(a[i]);
        }
        setTimeout(function () {
            for (var i = 0; i < li.length; i++) {
                if (li[i].classList.contains("weekday-selected")) {
                    li[i].style.backgroundColor = "#CDF6CE";
                    li[i].style.fontWeight = '700';
                } else {
                    li[i].style.backgroundColor = "#FFFFFF";
                    li[i].style.color = 'black';
                    li[i].style.fontWeight = '700';
                }
            }
        }, 100);
        weekdays = [];
    });
}

// Path: cdn\js\Profile.js
var weekdays = [];
$(function () {
    const li = document.getElementById("weekdays").getElementsByTagName('li');
    var allSelectedDay = document.querySelector('#weekdays');
    setTimeout(function () {
        for (var i = 0; i < li.length; i++) {
            if (li[i].classList.contains("weekday-selected")) {
                li[i].style.backgroundColor = "#CDF6CE";
                li[i].style.fontWeight = '100';
                li[i].style.fontWeight = '700';
            }
            li[i].style.color = 'black';
            li[i].style.borderRadius = '25px';
            li[i].style.lineHeight = '0.25';
            li[i].style.marginLeft = '5px';
            li[i].style.fontSize = '12px';
            li[i].style.paddingLeft = '33px';
            li[i].style.paddingRight = '33px';
            li[i].style.paddingTop = '15px';
            li[i].style.paddingBottom = '15px';
            li[i].style.fontWeight = '700';
        }

    }, 100);

    allSelectedDay.addEventListener('click', function (e) {
        var a = $('#weekdays').selectedIndexes();
        for (var i = 0; i < a.length; i++) {
            weekdays.push(a[i]);
        }

        setTimeout(function () {
            for (var i = 0; i < li.length; i++) {
                if (li[i].classList.contains("weekday-selected")) {
                    li[i].style.backgroundColor = "#CDF6CE";
                    li[i].style.fontWeight = '700';
                } else {
                    li[i].style.backgroundColor = "#FFFFFF";
                    li[i].style.color = 'black';
                    li[i].style.fontWeight = '700';
                }
            }
        }, 100);
        weekdays = [];
    });
    loadClientData();
});

// Load Client Data From Database
const loadClientData = () => {
    fetch(location.protocol + "//" + location.host + '/clientsetting', {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            var weeksData = data.authorReminders;
            weeksData = weeksData.split(',');
            for (var i = 0; i < weeksData.length; i++) {
                weekdays.push(parseInt(weeksData[i]));
            }
            $('#weekdays').weekdays({
                selectedIndexes: weekdays,
            });
            weekdays = [];
        })
};

// The profile Form Element
const updateProfileForm = document.querySelector(`[sw-update-form="profile"]`);
const updateWeekAlert = document.querySelector(`[sw-update-form="week-alert"]`);
const updateProfile = () => {
    const weekData = [];
    var a = $('#weekdays').selectedIndexes();
    for (var i = 0; i < a.length; i++) {
        weekData.push(a[i]);
    }
    // get crsf token
    const crsftokenValue = document.querySelector(`input[name="csrfmiddlewaretoken"]`);
    //get first name
    const firstName = document.querySelector(`input[name="firstName"]`);
    //get last name
    const lastName = document.querySelector(`input[name="lastName"]`);
    // get the password
    const passwordElement = updateProfileForm.querySelector(`input[name="password"]`);
    // get the email
    const emailElement = updateProfileForm.querySelector(`input[name="email"]`);

    if (!crsftokenValue && !passwordElement) return;
    // create form and supply the inputs
    const formData = new FormData();
    formData.append("firstName", firstName.value);
    formData.append("lastName", lastName.value);
    formData.append('password', passwordElement.value);
    formData.append('email', emailElement.value);
    formData.append('authorReminders', weekData);
    formData.append('csrfmiddlewaretoken', crsftokenValue.value);

    // Send the data to store
    fetch('/profile', {method: 'POST', body: formData,})
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') alert(data.message);
            else alert(data.message);
        })
        .catch((error) => {
            console.log('Error:', error);
            alert('Content failed!!!');
        });
};

// Add submit form eventlistener
updateProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Submit the form
    updateProfile();
});

updateWeekAlert.addEventListener('click', function (e) {
    e.preventDefault();
    // Submit the form
    updateProfile();
});

document.addEventListener('DOMContentLoaded', function () {
    window.Profile = new Profile();
});