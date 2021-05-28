const fs = require("fs")
const { response } = require("express")

// returs an array of json objects
function readSearchHistoryFromFile() {
    return new Promise((resolve, reject) => {
        fs.readFile("./data2.json", 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// data: array of json objects
function writeSearchHistoryToFile(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile("./data2.json", JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve("File has been written")
            }
        })
    })
}

let data = [{"occurance":1},{"occurance2":1},{"occurance3":1}]
writeSearchHistoryToFile(data)
readSearchHistoryFromFile().then((response) => {
    let data = JSON.parse(response)
    console.log(data)
})
