const http = require('http')

//create a server 

const server = http.createServer((req,res) =>{
    console.log(req)
    res.writeHead(200,{'content-type':'text/plain'})
    res.end("Hello from the node js")
})

//listening the server 

server.listen(3000,()=>{
    console.log("Server is Listening ")
})