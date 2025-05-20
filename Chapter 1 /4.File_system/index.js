//Lets work on file system module 
const fs = require('fs')
const path = require('path')

const folder_path = path.join(__dirname,'data2')
//check if the folder is exsiste
if(!fs.existsSync(folder_path)){
    //make the folder
    fs.mkdirSync(folder_path)
    console.log("complete making the folder ")
}

//1. This is a synchronous way
const file_path = path.join(folder_path,'text1.txt');

//write the file
fs.writeFileSync(file_path,"Hello this is just a trail")

//read
const file_content = fs.readFileSync(file_path,'utf-8');
console.log(file_content)

//append the new text to the exsiting file  
fs.appendFileSync(file_path,"\nthis is a new line")
console.log("New file content is added")


//Async Methord 
const async_file_dir = path.join(folder_path,'async.txt')

fs.writeFile(async_file_dir,'This is another way of creating a text file',(error) =>{if(error) throw error
    console.log("Async file is created !!")

    fs.readFile(async_file_dir,'utf8',(error,data) => {
        if(error) throw error;
        console.log(data);

        fs.appendFile(async_file_dir,"\nThere are few line added in the text file",(error) => {
            if (error) throw error;
            console.log("Append the data")
            fs.readFile(async_file_dir,'utf8',(error,data) => {
                if (error) throw error;
                console.log("Data from updated Text : ",data)
            })
        })
    })

    
})
