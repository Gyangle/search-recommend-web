const express = require("express")
const fs = require("fs")
const PORT = 80
const CORS_HEADER = "Access-Control-Allow-Origin"
const CORS_TARGET = "*"
const CONTENT_HEADER = "Access-Control-Allow-Headers"
const HEADER = "Content-Type, Authorization"
const DB_NAME = "db.json"
const app = express()

app.use(express.json());
app.use((req, res, next) => {
    res.header(CORS_HEADER, CORS_TARGET)
    res.header(CONTENT_HEADER, HEADER)
    next()
})

app.post("/", (req, res) => {
    let newSearchData = req.body

    // read exiting history
    readSearchHistoryFromFile().then((response) => {
        console.log("im hare")
        let prevSearchHistory = JSON.parse(response)
        console.log(prevSearchHistory)

        prevSearchHistory.users.push(newSearchData.userName)
        prevSearchHistory.queries.push(newSearchData.query)
        console.log(prevSearchHistory)

        // write the new history to db 
        writeSearchHistoryToFile(prevSearchHistory)
        res.status(200).send("process completed")
    }).catch((err) => {
        res.status(500).send(err)
    })
})

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`)
})

// returns an array of json objects
function readSearchHistoryFromFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(`./${DB_NAME}`, 'utf8', (err, data) => {
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
        fs.writeFile(`./${DB_NAME}`, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve("File has been written")
            }
        })
    })
}