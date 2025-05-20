//THis is a simple templateing langauage which allow html in javascript 
//we have to say to the html that view engin as ejs 
const express = require('express')
const path = require('path');
const { title } = require('process');


const app = express()

//set view engine as EJS 
app.set('view engine','ejs') 

//set the directory for the view 
app.set('views',path.join(__dirname,'views'));

const product = [
    {
        id : 1,
        title:'product 1'
    },
    {
        id : 2,
        title:'product 2'
    },
    {
        id : 3,
        title:'product 3'
    },
    {
        id : 4,
        title:'product 4'
    },
]

app.get('/',(req,res) =>{
    res.render('home',{title:'Home',products:product})
})

app.get('/about',(req,res)=>{
    res.render('about',{title:'ABout'})
})

app.listen(3000,()=>{
    console.log("Server is listening")
})