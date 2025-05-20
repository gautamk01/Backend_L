const http = require('http')

const server = http.createServer((req,res) =>{
    const url = req.url;
    if(url == '/'){
        res.writeHead(200,{'content-type':'text/plain'})
        res.end('THis is the base route Home Page')
    }else if(url == '/project'){
        res.writeHead(200,{'content-type':'text/plain'})
        res.end('This is project Page')
    }
    else {
        res.writeHead(404,{'content-type' : 'text/plain'})
        res.end('This page is not found')
    }
})


server.listen(3000,()=>{
    console.log("Server is now listening");
})