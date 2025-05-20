const express = require('express')
const app = express()

//middleware (express.json()) is a middle ware that parse the JSON file 
app.use(express.json())

let books = [
    {
        id :'1',
        title: 'Book 1'
    }
    ,{
        id:'2',
        title : 'Book 2'
    }
    ,{
        id:'3',
        title : 'Book 3'
    }
];

//This is a intro route
app.get('/',(req,res) => {
    res.json({
        message:"welcome to our bookstore api"
    })
});


//get all books 
app.get('/get',(req,res)=>{
    res.json(books);
})


//get a single book
app.get('/get/:id',(req,res) =>{
    const book = books.find(item => item.id == req.params.id);
    if(book){
        res.status(200).json(book)
    }
    else{
        res.status(404).json({
            message:"Book is not found !!"
        })
    }
})

app.post('/add',(req,res) =>{
    const newbook = {
        id : books.length + 1 ,
        title : `book ${books.length + 1}`
    }

    books.push(newbook);
    res.status(200).json({
        data : newbook,
        message: 'new book is added '
    })
})

app.put('/update/:id',(req,res)=>{
    const findebook = books.find(book => book.id == req.params.id)
    if(findebook){
        findebook.title = req.body.title || findebook.title
        res.status(200).json({
            data: findebook,
            message: `The Book ${req.params.id} is updated`
        })
    }
    else{
        res.status(404).json({
            message:"Book is not found"
        })
    }
})

app.delete('/delete/:id',(req,res) =>{
    const find_index = books.findIndex(item=>item.id == req.params.id)
    if(find_index != -1){
        const delete_book = books.splice(find_index,1);
        res.status(200).json({
            message:'deleted Successfully',
            data : delete_book[0]
        })

    }else{
        res.status(404).json({
            message:'Books is not found'
        })
    }
})

const port  = 3000 
app.listen(port,()=>{
    console.log("server is now running")
})