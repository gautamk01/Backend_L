//path module provide utilities to work under file and directory 

const path = require('path')

console.log("Directory name :",path.dirname(__filename))
console.log("file Name : ",path.basename(__filename));
console.log("name of the folder (file present) : ",path.basename(__dirname));

const joinpath = path.join('/user','document','node','project');
console.log("join path",joinpath)

const resolvepath = path.resolve('user','document','node')
console.log(resolvepath);

const normalize_path = path.normalize('/user/.document/../node')
console.log(normalize_path)