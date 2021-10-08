var express = require('express');
var router = express.Router();
const dotenv = require("dotenv");
var needle=require('needle');
dotenv.config();
const bearerToken=process.env.bearerToken


router.get('/user/:user_name',(req,res,next)=>{
    
    var endPointUrl=`https://api.twitter.com/2/tweets/search/recent?query=from:${req.params.user_name}&max_results=13&tweet.fields=created_at&expansions=author_id&user.fields=created_at,public_metrics,description`
    

    needle ('get', endPointUrl,{
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${bearerToken}`
        }
    }).then((response)=>{
        if(response.statusCode!==200){
            if(response.statusCode===404){
                res.status(404).send({"messege":"No records found!"})
            }
        }
        else{
            if(response.body){

                if(response.body.meta.result_count===0){
                    res.status(404).send({
                        "status": 404,
                        "message": "tweets not found"
                    })
                }

                const tweets=[];
                for(var i=0;i<response.body.data.length;i++){
                    tweets.push(
                        {
                            "created_at":response.body.data[i].created_at,
                            "text":response.body.data[i].text
                        }
                    )
                }
                const resBody={
                    "user_name":response.body.includes.users[0].name,
                    "user_screen_name":req.params.user_name,
                    "followers_count":response.body.includes.users[0].public_metrics.followers_count,
                    "friends_count": response.body.includes.users[0].public_metrics.following_count,
                    "tweets":tweets
                }
                res.statusCode=200;
                res.setHeader("Content-Type","application/json");
                res.status(200).send(resBody);
            }
            else{
                res.status(404).send({
                    status:"404",
                    messege:"No records found!"
                });
            }
        }
        
    }).catch(function(err) {
    res.statusCode=400;
    res.send({"status": 400,
    "message": "Bad Request."+err});
    next(err);
    });
})




module.exports = router;