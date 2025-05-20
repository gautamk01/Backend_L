const EventEmitter = require('events');

const myfirstEmitter = new EventEmitter();

myfirstEmitter.on('greet',(name) =>{
    console.log("Hello",name);

})

myfirstEmitter.emit('greet','gautam')



//Custom Emitter 
class MyCustomEmitter extends EventEmitter {
  constructor() {
    super();
    this.greetingWord = 'hello'; // Avoid method name conflict
  }

  greet(name) {
    this.emit('greet', `${name}`);
  }
}

const emitter = new MyCustomEmitter();

// Register listener
emitter.on('greet', (message) => {
  console.log('Greet Event:', message);
});

// Trigger event
emitter.greet('Gautam'); // ➜ Greet Event: hello, Gautam
