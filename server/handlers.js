const postSearchHistoryHandler = async (req, res, SearchHistory) => {
    let newSearchData = req.body

    const query = new SearchHistory(newSearchData)
    query.save((err, response) => {
        if (err) {
            console.log(err)
            res.status(500).send("Error in saving data to DB")
            return
        } 
        res.status(201).send(response)
    })
}

const getRecommendationHandler = async (req, res, SearchHistory) => {
    let userName = req.query.userName
    let query = req.query.query

    console.log(userName, query)
    try {
        let history = await SearchHistory.find({}).exec()
        console.log(history)
        res.status(201).send(history)
    } catch (err) {
        console.log(err)
        res.status(500).send("error in fetching recommendation")
    }
}

module.exports = {
    postSearchHistoryHandler,
    getRecommendationHandler
}