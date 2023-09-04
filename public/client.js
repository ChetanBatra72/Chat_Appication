const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
let activeUsersElement = document.querySelector("#active-users");
let themeToggle = document.querySelector("#theme-toggle");
let currUser = document.querySelector(".active-theme");
let isDarkTheme = false;
let userElement = document.createElement("h4");

const darkColors = [
  "#222",
  "#333",
  "#444",
  "#555",
  "#666",
  "#777",
  "#888",
  "#999",
  "#aaa",
];
do {
  name = prompt("Please enter your name: ");
  const para = document.createElement("p");
  let uName =  " 👤 " + name;
  para.innerText = uName;
  // currUser.appendChild(para);
  currUser.insertBefore(para, currUser.children[0]);
  console.log(para);
} while (!name);
// Use the "keydown" event instead of "keyup"
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
    e.preventDefault(); // Prevent the default behavior of the Enter key, which is to submit the form
  }
});
// Notify the server when the user joins
socket.emit("userJoined", { userName: name });

function formatTimestamp(date) {
  const options = { hour: "numeric", minute: "numeric" };
  return date.toLocaleTimeString(undefined, options);
}

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
    id: Date.now(), // Assign a unique identifier to each message
  };
  // Append
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");
  mainDiv.dataset.messageId = msg.id; // Add the message id as a dataset attribute
  mainDiv.dataset.messageUser = msg.user; // Add the message user as a dataset attribute

  let deleteButton = "";
  if (msg.user === name) {
    deleteButton = `<button class="delete-button" data-message-id="${msg.id}" data-message-user="${msg.user}">🗑️</i></button>`;
  }

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <span class="timestamp">${formatTimestamp(new Date())}</span>
        ${deleteButton}
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
 // Generate a random dark color
 const randomColor = darkColors[Math.floor(Math.random() * darkColors.length)];
 userElement.style.color = 'randomColor';
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    console.log(event.target.classList.contains("trash"));
    const messageId = event.target.getAttribute("data-message-id");
    const messageUser = event.target.getAttribute("data-message-user");

    if (messageUser === name) {
      const deleteForEveryone = confirm(
        "Do you want to delete this message for everyone?"
      );

      if (deleteForEveryone) {
        socket.emit("deleteMessage", { messageId, userName: messageUser });
      }
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("trash")) {
    console.log(event.target.classList.contains("trash"));
    const messageId = event.target.getAttribute("data-message-id");
    const messageUser = event.target.getAttribute("data-message-user");

    if (messageUser === name) {
      const deleteForEveryone = confirm(
        "Do you want to delete this message for everyone?"
      );

      if (deleteForEveryone) {
        socket.emit("deleteMessage", { messageId, userName: messageUser });
      }
    }
  }
});

// ... Rest of your client.js code ...

// Add this code to receive and handle message deletion
socket.on("messageDeleted", (deletedMessageId) => {
  const messageToDelete = document.querySelector(
    `[data-message-id="${deletedMessageId}"]`
  );
  if (messageToDelete) {
    messageToDelete.remove();
  }
});
// Receive messages

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

// Receive active user count
socket.on("activeUsers", (count) => {
  updateActiveUserCount(count);
});

// Display a system message when a user joins
socket.on("message", (msg) => {
  // Check if the message is a user join notification
  if (msg.user !== "System" && msg.message.includes("joined the chat room")) {
    appendSystemMessage(msg.message);
  }
});

// Initialize active user count and theme toggle
socket.on("connect", () => {
  socket.emit("activeUsers", 1); // Inform the server that you are an active user
  updateActiveUserCount(1);

  themeToggle.addEventListener("click", toggleTheme);
});

function updateActiveUserCount(count) {
  activeUsersElement.innerText = `Active Users: ${count}`;
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle("dark-theme", isDarkTheme);
  messageArea.classList.toggle("dark-theme", isDarkTheme);
  activeUsersElement.classList.toggle("dark-theme", isDarkTheme);
  if (!isDarkTheme) {
    message.userElement.style.color = "#e9b421";
  }
}

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

// Append a system message
function appendSystemMessage(message) {
  let mainDiv = document.createElement("div");
  mainDiv.classList.add("system-message", "message", "rand");

  let markup = `
        <p>${message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// let isTrue = false;
let btn = document.querySelector("i");

themeToggle.addEventListener("click", (e) => {
  console.log(e);
  btn.classList.toggle("gg-sun");
  btn.classList.toggle("gg-moon");
  if (btn.classList.contains("gg-moon")) {
    console.log("heybro");
    btn.style.color = "white";
    themeToggle.style.backgroundColor = "#333";
    console.log(toggleTheme);
  } else {
    btn.style.color = "black";
    themeToggle.style.backgroundColor = "#99e9f2";
    // console.log(toggleTheme);
  }
});