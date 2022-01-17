const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get All Repositories with Pagination
router.get('/repository-list', async (req,res)=>{
    
    console.log(req.originalUrl)

    try{
        const query = req.query.q;
        const pageNo = req.query.page || 1;
        const recordLimit = req.query.limit || 12;

        axios
            .get(
              `https://api.github.com/search/repositories?q=${query}&page=${pageNo}&per_page=${recordLimit}`,
              { headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
            } }
            )
            .then(function (response) {
              res.send({statusCode: 200, data: response.data, message: 'Repositories Fetched' });
            })
            .catch(function (error) {
              res.send({statusCode: 400, data: null, message: error.message });
            });
    }
    catch (err){
        console.log('Error in processing Get Repos Request:', err)
    }
})

module.exports = router;