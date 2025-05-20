const express = require('express')


const app = express()

//A Basic route
app.get('/',(req,res) =>{
    res.send('Hello')
})


//get all product 
app.get('/products',(req,res)=>{
    const products= [
        {id:1,name:'milk',price:200},
        {id:2 , name :'Biscut', price:230},
        {id:3, name : 'Horlicks',price:300}
    ]
    res.json(products)
    console.log(req.params.type)
})

//dynamic routing for a single product 
app.get('/products/:Id',(req,res) =>{
   const value = parseInt(req.params.Id)
   const products= [
    {id:1,name:'milk',price:200},
    {id:2 , name :'Biscut', price:230},
    {id:3, name : 'Horlicks',price:300}
]
  const item = products.find(pro => pro.id === value)

   if(item){
    res.json(item)
   }
   else{
    res.json('Not found')
   }
})

//server listening code 

app.listen(3000,()=>{
    console.log("Server is listening")
})