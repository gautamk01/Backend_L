//module.export
//require



const first_module = require('./frst_module')

console.log(first_module.add(1,2))

//try catch block

try{
    console.log("Trying to divide by zero ")
    let result = first_module.divide(54,0)
}
catch(error){
    console.log(error.message)
}



//module Wrapper 
// {
//     function(export,require,module,__filename,__dirname){
//         //your module code 
//     }
// }