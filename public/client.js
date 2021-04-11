let ws = new WebSocket('ws://localhost:8000/ws');

const nameForm = document.querySelector('.name-form');
const chatRoom = document.querySelector('.chatroom');
const chatList = document.querySelector('.chat-list');
const chatForm = document.querySelector('.chat-form');

let name = "anon";

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();

  name = nameForm.nickname.value;

  nameForm.classList.add('hidden');
  chatRoom.classList.remove('hidden');
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let msg = chatForm.msg.value;

  ws.send(JSON.stringify({name, msg}));
});

const outputMessage = ({data}) => {
  const {name, msg} = JSON.parse(data);

  let messageBody = `
           <li>
                <div class="name">🐣 ${name}</div>
                <div class="msg">${msg}</div>
            </li>
  `

  chatList.innerHTML += messageBody;
}

ws.addEventListener('message', outputMessage);
