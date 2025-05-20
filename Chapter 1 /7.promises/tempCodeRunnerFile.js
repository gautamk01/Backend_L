//example 1 (only resolve promise)
function delay(time){
    return new Promise((resolve) => setTimeout(resolve,time))
}


console.log('Promise Lecture Starts ')
delay(2000).then(()=>console.log("promise is resolved"))
console.log("end")