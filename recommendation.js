

let form = document.querySelector('form');
let log = document.getElementById('log');
let historyP = document.getElementById('history');
let occranceP = document.getElementById('occrance');
let userNameInput = document.getElementById('username-input')
let queryInput = document.getElementById('query-input')
form.addEventListener('submit', logSubmit);
let searchHistory = []; // keep track of query and its occurance

// handle form sumbit behavior
function logSubmit(event) {
    event.preventDefault();
    let newP = addSearchContent(userNameInput.value, queryInput.value);
    log.prepend(newP);
    // append college to array and update the DOM
    searchHistory.push(queryInput.value);
    displaySearchHistory(searchHistory);
}

// generate the given information inside a p tag
function addSearchContent(user, college) {
    let pTag = document.createElement('p');
    // console.log(user + " search " + college + ` at ${event.timeStamp};`);
    let timeStamp = Math.floor(parseFloat(event.timeStamp));
    pTag.textContent = user + " searched " + college + " @Time Stamp: " + timeStamp;

    let searchData = {"userName": userNameInput.value, "query": queryInput.value}
    fetch("http://yichi.me", {
        headers: new Headers({"Content-Type": "application/json"}),
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(searchData)
    }).then((response) => {
        console.log(response.statusText)
    }).catch((err) => {
        console.log(err)
    })

    return pTag;
}

// display the history and occurance to desinated div
function displaySearchHistory(searchHistory) {
    historyP.textContent = searchHistory;
    // keep track of occrance and update
    let newArray = [], wordObj;
    searchHistory.forEach(function (word) {
    wordObj = newArray.filter(function (w) {
        return w.text == word;
    });
    if (wordObj.length) {
        wordObj[0].size += 1;
    } else {
        newArray.push({ text: word, size: 1 });
    }
    });
    occranceP.textContent = JSON.stringify(newArray);
}
