const express = require('express')

const app = express()

const request_Time_Stamp_logger = (req,res,next) => {
    const timestamp = new Date().toISOString()
    console.log(`${timestamp} is now activated using ${req.method} to ${req.url}`)
    next()
}

app.use(request_Time_Stamp_logger);

app.get('/',(req,res) => {
    res.send("Home page")
})

app.get('/about',(req,res) => {
    res.send("about page");
})
app.listen(3000,()=>{
    console.log("Server is Listening the values");
})