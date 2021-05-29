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
    let givenUserName = req.query.userName
    let givenQuery = req.query.query

    try {

        // get all docs that match the given query 
        let history = await SearchHistory.find({query: givenQuery}).exec()

        // get all users from history, except user U
        let usersWhoSearchedTheGivenQuery = history.map((doc) => {
            return doc.userName
        }).filter((name) => {
            return name != givenUserName
        })

        let allQueriesFromUsersWhoSearchedTheGivenQuery = await SearchHistory
            .find({userName: usersWhoSearchedTheGivenQuery})
            .exec()

           allQueriesFromUsersWhoSearchedTheGivenQuery = 
            allQueriesFromUsersWhoSearchedTheGivenQuery.filter((doc) => {
                return doc.query != givenQuery
            })

        let queryFrequencyMap = new Map();

        allQueriesFromUsersWhoSearchedTheGivenQuery.forEach((doc) => {
            const query = doc.query
            if (queryFrequencyMap.has(query)) {
                let count = queryFrequencyMap.get(query)
                queryFrequencyMap.set(query, count + 1)
            } else {
                queryFrequencyMap.set(query, 1)
            }
        })

        // sort recommendation query based on occurance 
        let sortedRecomListBasedOnFrequency = [...queryFrequencyMap.entries()].sort((a, b) => {
            return b[1] - a[1]
        })

        let recommList = sortedRecomListBasedOnFrequency.map((query) => {
            return query[0]
        })

        // let sortedAndSlicedRecommendQuery = allQueriesFromUsersWhoSearchedTheGivenQuery
        //     .sort((a, b) => {
        //         return a.timeStamp < b.timeStamp
        //     }).slice(0, 10)
        
        console.log(recommList)
        res.status(201).send(recommList)
    } catch (err) {
        console.log(err)
        res.status(500).send("error in fetching recommendation")
    }
}

module.exports = {
    postSearchHistoryHandler,
    getRecommendationHandler
}