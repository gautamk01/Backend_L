//call back Hell 
//when we have mulitple 

// A simple call back function
function person (name,callbackfn){

    console.log(`Hello ${name}`)
    callbackfn()
}

function address()
{
        console.log('India')
}

person('Gautam Krishna M',address)

//callback example 2 
const fs = require('fs')

fs.readFile('input.txt','utf8',(error,data) =>{
    if(error) {
        console.log(error)
        return;
    }
    console.log(data)
})

//call back Hell example 

fs.readFile('input.txt','utf8',(error,data) => {
    //callback 1
    if(error){
        console.log(error)
        return;
    }

    const modify_data = data.toUpperCase()
    fs.writeFile('output.txt',modify_data,(error) =>{
        //callback 2
        if(error){
            console.log(error)
            return
        }
        console.log("Modified Data")

        fs.readFile('output.txt','utf8',(error,data) =>{
            //callback 3
            if(error) {
                console.log(error);
                return 
            }
            console.log("modifyed Data : ",data)

        })
    })
})