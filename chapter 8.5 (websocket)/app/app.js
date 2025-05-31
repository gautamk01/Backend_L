const socket = new WebSocket("ws://localhost:3000"); //make sure the port in the backend is same

function sendmessage(e) {
  e.preventDefault(); // submit the form without reloading the page
  const input = document.querySelector("input");
  if (input.value) {
    socket.send(input.value);
    input.value = "";
  }
  input.focus();
}

document.querySelector("form").addEventListener("submit", sendmessage);

//listen for messsages  from the server
socket.addEventListener("message", ({ data }) => {
  const li = document.createElement("li"); //create a new list element
  li.textContent = data; //inser the data to the list
  document.querySelector("ul").appendChild(li); //append the list to unordered list
});
