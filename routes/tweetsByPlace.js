/** http://localhost:3000/twitter/location?latitude=22.5726&longitude=88.3639&radius=12km */

var express = require('express');
var router = express.Router();
const dotenv = require("dotenv");
var needle=require('needle');
var Twitter = require('twitter');
dotenv.config();
const bearerToken=process.env.bearerToken


router.get('/location',(req,res,next)=>{

    var latitude=req.query.latitude;
    var longitude=req.query.longitude;
    var radius=req.query.radius;

    var client = new Twitter({
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_secret,
    access_token_key:process.env.Access_Token,
    access_token_secret:process.env.Access_Token_Secret
    });
    
    var geoCode=`${latitude},${longitude},${radius}`
    console.log(geoCode);
    var params = {
        geocode:geoCode,
        result_type:"recent",
        count: 10,
    };
    client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
        var allTweets=[];
        if(tweets.statuses.length===0){
            res.status(404).send({
                "status": 404,
                "message": "tweets not found"
            })
        }
        else{
            for(var i=0;i<tweets.statuses.length;i++){
                allTweets.push({
                    text:tweets.statuses[i].text,
                    user_screen_name:tweets.statuses[i].user.screen_name
                })
            }
            res.status(200).send(allTweets);
        }
    }
    else{
        res.status(400).send({
            "status": 400,
            "message": "Bad Request"
        })
    }
    });

    
})



module.exports = router;