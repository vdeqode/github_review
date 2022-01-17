const { default: axios } = require('axios');
const express = require('express');
const User = require('../models/user.model');

const router = express.Router();

// Helper Function to get User Details
const getUserFromGithubAPI = async (url)=>{
    const header = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    };
    const response = await axios.get(url, { headers: header });
    return response.data;
}

// Get All Users with Pagination
router.get('/user-list', async (req,res)=>{
    
    console.log(req.originalUrl)
    
    try{
        const query = req.query.q;
        const pageNo = req.query.page || 1;
        const recordLimit = req.query.limit || 10;
        const skip = (pageNo * recordLimit) - recordLimit || 0;
        let results = [];

        const searchRegex = new RegExp(query, "i");
        const users_count = await User.countDocuments({ name: { $regex: searchRegex } });
        const db_users = await User.find({ name: { $regex: searchRegex } }).skip(skip);

        // When we find the user in our DB
        if(db_users.lenght>0){
            console.log('Users Found in our Database')
            res.send({ statusCode: 200, data: { items: db_users, total_count: users_count }, message: 'Users fetched' });
        }
        else // User not found in DB
        {
    
            axios
                .get(
                    `https://api.github.com/search/users?q=${query}&page=${pageNo}&per_page=${recordLimit}`,
                    { headers: {
                        Authorization: `token ${process.env.GITHUB_TOKEN}`
                    } 
                }
                )
                .then(response=>{
                    results = response.data.items;
                    let promises = [];
                    let users = [];
                    results.forEach((user) => {
                        promises.push(
                            getUserFromGithubAPI(user.url).then((userDetail) => {
                            if (userDetail.name || userDetail.login) {
                                const searchUserRegex = new RegExp(query, "i");
                                if (userDetail.name.match(searchUserRegex) || userDetail.login.match(searchUserRegex)) {
                                    users.push(userDetail);
                                }
                            }
                            })
                            .catch(error=>{
                                console.log("Error getting user details:", error)
                            })
                        );
                    });
    
                    return Promise.all(promises).then(() => {
                        const data = User.insertMany(users);
                        res.send({ 
                            statusCode: 200, 
                            data: { items: users, total_count: response.data.total_count }, 
                            message: 'Users fetched!'
                        });
                    });  
                })
                .catch(error=>{
                    res.send({
                        statusCode:400, 
                        data:null, 
                        message: "Could not fetch users!"
                    })
                })
        }

    }
    catch(error){
        console.log("Could not fetch users", error.message)
    }
})


module.exports = router;