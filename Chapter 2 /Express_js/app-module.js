const express = require('express')
const app = express()


//application level setting
app.set('View engine', 'ejs')


app.get('/',(req,res) => {
    res.send("Data sending")
})


//Api end point 
app.post('/api/data' , (req,res) =>{
    res.json({
      message : 'Data received',
      data:req.body
    })
})

app.use((err,res,req,next) =>{
    console.log(err.stack)
    res.send(500).send('something went wrong')
})