const messageTypes = { LEFT:'left', RIGHT: 'right', LOGIN:'login' };

// Chat 
const chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

//Login
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');

const messages = [];


var socket = io();

socket.on('message', message =>{
    if(message.type !== messageTypes.LOGIN)
    {
        if(message.author === username)
        {
            message.type = messageTypes.RIGHT;
        }
        else{
            message.type = messageTypes.LEFT;
        }
    } 
    
    messages.push(message);
    displayMessages();
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// take message and return Html
const createMessageHtml = (message) =>{
    if(message.type === messageTypes.LOGIN )
    {
        return `
            <p class="secondary-text text-center mb-2">${message.author} joined the chat...</p>
        `;
    }

    return `
	<div class="message ${
		message.type === messageTypes.LEFT ? 'message-left' : 'message-right'
	}">
		<div class="message-details flex">
			<p class="flex-grow-1 message-author">${
				message.type === messageTypes.LEFT ? message.author : ''
			}</p>
			<p class="message-date">${message.date}</p>
		</div>
		<p class="message-content">${message.content}</p>
	</div>
	`;
};

const displayMessages = () =>{
    
    const messagesHTML = messages
        .map( message => createMessageHtml(message))
        .join('');
    messagesList.innerHTML = messagesHTML;
}

displayMessages();

//sendBtn
sendBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    if(!messageInput.value){
        alert("Enter message to send !!");
    }

    const date = new Date();
    const day = date.getDay();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const dateString = `${month}/${day}/${year}`;
    const message = {
        author: username,
        date: dateString,
        content: messageInput.value,
        // type: messageTypes.RIGHT
    }

    sendMessage(message);
    // messages.push(message);
    // displayMessages();

    messageInput.value = '';

    // chatWindow.scrollTop = chatWindow.scrollHeight;
});

const sendMessage = message =>{
    socket.emit('message', message);
}


//loginBtn
loginBtn.addEventListener('click', e => {
    e.preventDefault();

    if(!usernameInput.value){
        alert("Enter username to continue !!");
    }

    username = usernameInput.value;
   sendMessage({
        author: username,
        type: messageTypes.LOGIN
    })

    //hiding login and displaying chat window
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');

});