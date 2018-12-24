// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const chatTemplate = require('../templates/chat.handlebars');
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

export default () => {
  // Data to be passed to the template
  const database = firebase.database();


  const name = 'Chat';
  // Return the compiled template to the router
  update(compile(chatTemplate)({ name }));

  // HOVER OPTIONS OVER PROFILE PIC

  function profileMore() {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */

    console.warn('Log a warn level message.');
    const showProfile = document.querySelector('.header-right');
    showProfile.addEventListener('mouseover', () => {
      document.getElementById('dropdownWrapper').style = 'opacity:1; visibility:inherit;';
    });
    showProfile.addEventListener('mouseout', () => {
      document.getElementById('dropdownWrapper').style = '';
    });
  }


  // AUTH VOOR HEADER WEER TE GEVEN
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const user_id = firebase.auth().currentUser.uid;
      console.log(user_id);
      // eslint-disable-next-line camelcase
      const ref = firebase.database().ref(`accounts/${user_id}`);
      ref.once('value', (snapshot) => {
        console.log(snapshot.val());
        if (snapshot.val().status === 'verkoper') {
          console.log('test');
        } else {
          console.log('beter proberen');
        }
      });

      const showProfile = document.querySelector('.listRegisterBtn');
      const registerbtn = document.querySelector('#registerBtn');

      const name = user.displayName;
      const email = user.email;
      // const photo = user.photoURL;


      showProfile.innerHTML = ` <div class='header-right'>
      <div class='avatar-wrapper' id='avatarWrapper'>
        <img alt='Profile Photo' class='avatar-photo' height='28' src='https://4.bp.blogspot.com/-H232JumEqSc/WFKY-6H-zdI/AAAAAAAAAEw/DcQaHyrxHi863t8YK4UWjYTBZ72lI0cNACLcB/s1600/profile%2Bpicture.png' width='28'>
        <svg class='avatar-dropdown-arrow' height='24' id='dropdownWrapperArrow' viewbox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'>
          <title>Dropdown Arrow</title>
          <path d='M12 14.5c-.2 0-.3-.1-.5-.2l-3.8-3.6c-.2-.2-.2-.4-.2-.5 0-.1 0-.3.2-.5.3-.3.7-.3 1 0l3.3 3.1 3.3-3.1c.2-.2.5-.2.8-.1.3.1.4.4.4.6 0 .2-.1.4-.2.5l-3.8 3.6c-.1.1-.3.2-.5.2z'></path>
        </svg>
      </div>
      <div class='dropdown-wrapper' id='dropdownWrapper' style='width: 256px'>
        <div class='dropdown-profile-details'>
          <span class='dropdown-profile-details--name'>${name}</span>
          <span class='dropdown-profile-details--email'>${email}</span>
        </div>
        <div class='dropdown-links'>
          <a href='#'>Profile</a>
          <a href='#'>Messages</a>
          <a href='#' id="logout">Sign out</a>
        </div>
      </div>
    </div>`;

      registerbtn.innerHTML = '';
      profileMore();
      chat();

      if (!user.emailVerified) {
      /*  alertArea.innerHTML = `
          <div class='alerts_warning'><strong><i class="fas fa-exclamation-triangle"></i>Verification: </strong> Make sure to verify your email address. <a href='' id='verifyMe'>Re-send verification email</a><button type='button' class='btn' id='closeAlert'><i class="fas fa-times"></i></button></div>
          `;
        setTimeout(() => {
          alertArea.innerHTML = '';
        }, (2 * 60 * 1000));
      } */
      } else {
        const listRegisterBtn = document.querySelector('.listRegisterBtn');

        listRegisterBtn.innerHTML = '<a class="btn" id="registerBtn" href="/firebase" data-navigo title="Register / Log In">Register/Log In</a>';
      }
    }
  });

const chat = () =>{
const db = firebase.database();
const chatForm = document.querySelector('#reviewForm');
const textBox = document.querySelector('#message');
const chats = document.querySelector('.chat-feed');
const sessionId = firebase.auth().currentUser.uid;
const chatsRef = db.ref('/chats');

chatForm.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  
  if (!textBox.value) {
    return;
  }
  
  const messageId = Date.now();
  
  db.ref('chats/' + messageId).set({
    userId: sessionId,
    message: textBox.value
  });
  
  textBox.value = '';
}

chatsRef.on('child_added', handleChildAdded);

function handleChildAdded(data) {
  const messageData = data.val();
  console.log(messageData);
  const li = document.createElement('li');
  
  li.innerHTML = messageData.message;
  
  if (messageData.userId !== sessionId) {
    li.classList.add('other');
  }
  
  chats.appendChild(li);
  chats.scrollTop = chats.scrollHeight;
}

textBox.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  if (e.which == 13) {
    handleSubmit(e);
  }
}
}
};
