const express = require('express')
const app = express();


//define middleware function 
const myfirstmiddleware = (req,res,next) => {
    console.log("this first middleware will run on every request");
    next(); // if we command out this next methord , the upcomming methords like get will not be working 
    //so enabling next methord is an important part of this process 
};

app.use(myfirstmiddleware);

app.get('/',(req,res) =>{
    res.send("Home page")
})
app.get('/about',(req,res) =>{
    res.send("About page")
})

app.listen(3000,()=>{
    console.log("Server is now running on port 3000");
})