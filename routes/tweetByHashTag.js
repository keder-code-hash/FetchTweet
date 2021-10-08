var express = require('express');
var router = express.Router();
const dotenv = require("dotenv");
var needle=require('needle');
var Twitter = require('twitter');
dotenv.config();
const bearerToken=process.env.bearerToken


router.get('/hashtag/:tag',(req,res,next)=>{
    
 
    var tag=req.params.tag;

    var client = new Twitter({
    consumer_key: process.env.API_Key,
    consumer_secret: process.env.API_secret,
    access_token_key:process.env.Access_Token,
    access_token_secret:process.env.Access_Token_Secret
    });
   
    var params = {
        result_type:"recent",
        q: '#'+tag,
        count: 10,
    };
    client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
        
        if(tweets.statuses.length===0){
            res.status(404).send({
                "status": 404,
                "message": "tweets not found"
            })
        }
        var tweetsArr=[];
        for(var i=0;i<tweets.statuses.length;i++){
            tweetsArr.push({
                "text":tweets.statuses[i].text,
                "user_screen_name":tweets.statuses[i].user.screen_name,
                "retweet_count":tweets.statuses[i].retweet_count
            })
        }      
        
        res.status(200).send(tweetsArr);

    }
    else{
        res.status(400).send({
            status:"400",
            messege:"Bad Request!"
        })
    }
    });
})


module.exports = router;