

const API_ENDPOINT = "http://localhost:81"
let form = document.querySelector('form');
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

    let searchData = {"userName": userNameInput.value, "query": queryInput.value}

    uploadSearchData(searchData)
    retrieveQueryRecommendation(searchData).then(recomData => {
        console.log(recomData)
        // append it to the DOM
        let recommList = document.getElementById("recomm-list")
        recommList.innerHTML = ""
        recomData.forEach((query) => {
            let newItem = document.createElement("li")
            newItem.setAttribute("class", "recomm-item")
            newItem.innerText = query
            recommList.append(newItem)
        })
    })
    
    computeTrending(queryInput); // compute the trending
}

// generate the given informationfinside a p tag
function generateActivityContent(user, college, event) {
    let pTag = document.createElement('p');
    let timeStamp = Math.floor(parseFloat(event.timeStamp));
    pTag.textContent = user + " searched " + college + " @TimeStamp: " + timeStamp + "ms";
    console.log(pTag)
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

async function uploadSearchData(data) {
    fetch(API_ENDPOINT, {
        headers: new Headers({"Content-Type": "application/json"}),
        method: "POST",
        mode: 'cors',
        body: JSON.stringify(data)
    }).then((response) => {
        console.log(response.statusText)
    }).catch((err) => {
        console.log(err)
    })
}

async function retrieveQueryRecommendation(data) {
    try {
        const response = await fetch(API_ENDPOINT + `?userName=${data.userName}&query=${data.query}`, {
            headers: new Headers({"Content-Type": "application/json"}),
            method: "GET",
            mode: 'cors'
        })
        const recommendations = await response.json()
        return recommendations
    } catch (err) {
        console.log(err)
    }
}
