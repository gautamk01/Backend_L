// //promises are cleaner way of handling async functions 

//promise => reslve and reject 
//example 1 (only resolve promise)
function delay(time){
    return new Promise((resolve) => setTimeout(resolve,time))
}


console.log('Promise Lecture Starts ')
delay(2000).then(()=>console.log("promise is resolved"))
console.log("end")


// //example 2 (resolve and reject promises)
function divideFun(num1,num2){
    return new Promise((resolve,reject) => {
        if(num2 == 0) {
            reject('can not perfrom division by 0')
        }
        else{
            resolve(num1/num2)
        }
    })
}
divideFun(10,0).then((result) => console.log(result)).catch((error) => console.log(error))


//Example 3 Custom Promise Callback
function randomselection(){
    return Math.round(Math.random())
}

function setup1(){
    console.log("Setup1 Starts....")
    return new Promise((resolve,rejects) => {
        if(randomselection()){
            resolve('The Data is Completed in Setup 1 ')
        }
        else{
            rejects('The Data is Rejected (Setup 1 )')
        }
    })
}

function setup2(data) {
    console.log('Setup2 recivece message : ',data)
    return new Promise((resolve,reject) => {
        if(randomselection()){
            resolve('The Data is completed from Setup2')
        }
        else{
            reject('The Data is Rejected (Setup 2 )')
        }
    })
}

function finalPromis(){
    return new Promise((resolve,reject) => {
        setup1().then(result => {return setup2(result)}  ).then((result) => resolve(result)).catch(erro => console.log(erro))
    })
}

finalPromis().then(result => {console.log('Message recived ',result)}).catch(error => console.log(error))



//Example 4
const fs = require('fs').promises

const readFile = fs.readFile('input.txt','utf8')
.then((result) => {
    console.log("data : ",result); 
    return fs.writeFile('output.txt','There is so manythings to say ')})
    .then(() => {
        console.log("Data Modified "); 
        return fs.readFile('output.txt','utf8')})
        .then(result => 
            {console.log("Data Modified : ",result)})
        .catch((error) => console.log(error))


//example 5
//Fetch and display a user's data
fetch('https://jsonplaceholder.typicode.com/users/1').then(result => {return result.json()})
.then(result => {
    const user_name = result.name ;
    const email  = result.email;
    const  phone = result.phone;
    console.log("User name : ",user_name);
    console.log("User email : ",email);
    console.log("User phone : ", phone);

}).catch((error) => {console.error(error)})