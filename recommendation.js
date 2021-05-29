

let form = document.querySelector('form');
let logP = document.getElementById('log');
let historyP = document.getElementById('history');
let occranceP = document.getElementById('occrance');
let userNameInput = document.getElementById('username-input')
let queryInput = document.getElementById('query-input')
form.addEventListener('submit', logSubmit);
let searchHistory = []; // from previous users and keep track of current

document.getElementById('clear').addEventListener('click', () => {
    // clear storage and content on page
    localStorage.removeItem('history');
    occranceP.textContent = '';
    historyP.textContent = '';
    searchHistory = [];
})

window.addEventListener('load', () => {
    let storage = JSON.parse(localStorage.getItem("history"));
    if (storage != null) { // if has cookies to use
        searchHistory = storage;
        computeTrending();
        // console.log(searchHistory);
    }
});

// handle form sumbit behavior
function logSubmit(event) {
    event.preventDefault();
    handleLog(event);
    computeTrending(queryInput); // compute the trending
}

// log the action and save storage
function handleLog(event) {
    let newP = generateActivityContent(userNameInput.value, queryInput.value, event);
    logP.prepend(newP); // put the recent activity at top
}

// generate the given information inside a p tag
function generateActivityContent(user, college, event) {
    let pTag = document.createElement('p');
    let timeStamp = Math.floor(parseFloat(event.timeStamp));
    pTag.textContent = user + " searched " + college + " @Time Stamp: " + timeStamp;

    // let searchData = {"userName": userNameInput.value, "query": queryInput.value}
    // fetch("http://yichi.me", {
    //     headers: new Headers({"Content-Type": "application/json"}),
    //     method: "POST",
    //     mode: 'cors',
    //     body: JSON.stringify(searchData)
    // }).then((response) => {
    //     console.log(response.statusText)
    // }).catch((err) => {
    //     console.log(err)
    // })

    // update the dom
    pTag.textContent = user + " searched " + college + " @TimeStamp: " + timeStamp + "ms";
    return pTag;
}

// display the trending college and update storage
function computeTrending(queryInput) {
    if (queryInput != null) { // if the function has a query to add to history
        searchHistory.push(queryInput.value); // update search history array with duplicates
        historyP.textContent = searchHistory;
    }

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

    occranceP.textContent = updateOccranceText(newArray);
    // console.log(newArray);
    updateStorage(searchHistory);
}

function updateStorage(searchHistory) {
    localStorage.setItem('history', JSON.stringify(searchHistory));
}

// return the college search in sorted order, based on the unsorted Array
function updateOccranceText(newArray) {
    // sorting the array
    let byTimes = function () {
        return function (a, b) {
            return ((a.size > b.size) ? -1 : ((a.size < b.size) ? 1 : 0));
        }
    };
    let sortedArray = newArray.sort(byTimes()); // reorder the array based on time: big -> small
    // generate the text to display
    let string = "";
    for (let i = 0; i < sortedArray.length; i++) {
        if (i < 5) { // record the top 5 result, if length is greater
            string = string + sortedArray[i].text + "/      ";
        }
    }
    return string;
}

function readSearchHistoryFromFile() {
    fs.readFile("./data.json", 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            return JSON.parse(data)
        }
    })
}

function writeSearchHistoryToFile(data) {
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been written");
    })
}
