/* eslint-disable eqeqeq */
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

  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }


  // HOVER OPTIONS OVER PROFILE
  // post notification on message // code from: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
  const keyRef = firebase.database().ref('chats/');
  keyRef.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      childSnapshot.forEach((snapshot2) => {
        const data = snapshot2.val();
        if (firebase.auth().currentUser.uid === data.ontvanger) {
          if (!('Notification' in window)) {
            alert('This browser does not support system notifications');
          }

          // Let's check whether notification permissions have already been granted
          else if (Notification.permission === 'granted') {
            // If it's okay let's create a notification
            let notification = new Notification('Message received');
          }

          // Otherwise, we need to ask the user for permission
          else if (Notification.permission !== 'denied') {
            Notification.requestPermission((permission) => {
              // If the user accepts, let's create a notification
              if (permission === 'granted') {
                let notification = new Notification('Message received');
              }
            });
          }
        }
      });
    });
  });


  // CHECK CHAT LIST BY THE KEY OF THE USER DEFINED IN NAMELIST
  const chat = (snapkey) => {
    // snapkey = unique roomkey
    const reciever = sessionStorage.getItem('variableName');
    const db = firebase.database();
    const chatForm = document.querySelector('#reviewForm');
    const textBox = document.querySelector('#message');
    const chats = document.querySelector('.chat-feed');
    const sessionId = firebase.auth().currentUser.uid;
    const keyRef = firebase.database().ref(`chats/${snapkey}/msg`);
    chats.innerHTML = '';


    keyRef.once('value', (snapshot) => {
      chatForm.addEventListener('submit', handleSubmit);

      function handleSubmit(e) {
        e.preventDefault();

        if (!textBox.value) {
          return;
        }


        keyRef.push({
          userId: sessionId,
          message: textBox.value,
        });

        textBox.value = '';
      }

      const data = snapshot.val();

      // push value of invoering naar firebase

      // als er een child key is bijgekomen

      keyRef.on('child_added', handleChildAdded);

      // maak de html content
      function handleChildAdded(data) {
        const messageData = data.val();
        const li = document.createElement('li');

        li.innerHTML = messageData.message;

        if (messageData.userId == sessionId) {
          li.classList.add('other');
        }

        chats.appendChild(li);
        chats.scrollTop = chats.scrollHeight;
      }

      // als er op enter gedrukt wordt, zorg voor een submit
      textBox.addEventListener('keydown', handleKeyDown);

      function handleKeyDown(e) {
        if (e.which === 13) {
          handleSubmit(e);
        }
      }
    });
  };


  // RETRIEVE CONTACT LIST 

  const ul = document.getElementById('listbody');
  const nameList = () => {
    // GET THE MEMBERS IN THE SNAPKEY OF CHAT REF
    const keyRef = firebase.database().ref('chats/');
    keyRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        childSnapshot.forEach((snapshot2) => {
          const data = snapshot2.val();
          const id = data.id;
          const msg = [];
          if (firebase.auth().currentUser.uid === data.verzender) {
            const ontV = data.ontvangerName;

            const main = createNode('div');
            main.innerHTML = `
               <div class="message" id="${id}">
              <div class="avatar">
                <img class="avatar__image" src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?dpr=2&auto=compress,format&fit=crop&w=376&h=564&q=80&cs=tinysrgb&crop=" alt="">
              </div>
              <div class="message__snippet">
                <div class="message__stuff">
                  <div class="message__name">${ontV}</div>
                  <div class="message__last">2 mins</div>
                </div>
              </div>
            </div>`;
            ul.appendChild(main);
            if (document.querySelector('.message')) {
              const buttons = document.querySelectorAll('.message');
              for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', slide);
              }
            }
          } else if (firebase.auth().currentUser.uid === data.ontvanger) {
            const verZ = data.verzenderName;

            const main = createNode('div');
            main.innerHTML = `
               <div class="message" id="${id}">
              <div class="avatar">
                <img class="avatar__image" src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?dpr=2&auto=compress,format&fit=crop&w=376&h=564&q=80&cs=tinysrgb&crop=" alt="">
              </div>
              <div class="message__snippet">
                <div class="message__stuff">
                  <div class="message__name">${verZ}</div>
                  <div class="message__last">2 mins</div>
                </div>
              </div>
            </div>`;
            ul.appendChild(main);
            if (document.querySelector('.message')) {
              const buttons = document.querySelectorAll('.message');
              for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', slide);
              }
            }
          }
        });
      });
    });
  };

  // ANIMATION FOR SLIDING THE CONTACT LIST AND RENDERING THE CHATS OF THAT USER

  const slide = (e) => {
    const snapkey = e.currentTarget.getAttribute('id');
    chat(snapkey);
    const element = document.querySelector('#listbody');
    element.classList.toggle('chatAnimation');
    document.querySelector('#openMenu').classList.toggle('hideItem');
    document.querySelector('#poppedOut').innerHTML += '<div id="return"><i class="fa fa-arrow-left"></i></div>';

    if (document.querySelector('#return')) {
      document.getElementById('return').addEventListener('click', () => {
        const lis = document.querySelector('#listbody');
        lis.classList.toggle('chatAnimation');
        document.querySelector('#openMenu').classList.toggle('hideItem');
        document.querySelector('#return').outerHTML = '';
      });
    }
    menuCheck();
  };


  // ANIMATION FOR NAVIGATION 

  const menuCheck = () => {
    document.querySelector('#openMenu').addEventListener('click', () => {
      const element = document.querySelector('.content');
      element.classList.remove('no-animation');
      element.classList.toggle('shrink');
    });
  };
  // WHEN USER IS ACTIVE

  /*
  function rentKot() {
    document.getElementById('rentPage').innerHTML = `

  `;
  }
  */

  // function to check when user is loggedin


  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const user_id = firebase.auth().currentUser.uid;
      // eslint-disable-next-line camelcase
      const ref = firebase.database().ref(`accounts/${user_id}`);
      ref.once('value', (snapshot) => {
        if (snapshot.val().status === 'verkoper') {
            // DO NOTHING
        } else {
          // DO NOTHING
        }
      });

      const showProfile = document.querySelector('.userDetails');
      const menu = document.querySelector('.menu');

      const name = user.displayName;
      const email = user.email;


      showProfile.innerHTML = `
      <h2 class="userName">${name}<h2>
        <p class="userEmail">${email}</p>`;

      menu.innerHTML = `
      <ul>
        <li class="contacts bold">
                    <a href="/#/home" data-navigo title="Hotels">Home</a>
        </li>

        <li class="partners bold">
          <a href="/#/rent"  data-navigo title="Hotels">Profile</a>
        </li>

        <li class="settings bold"> 
           <a href="/#/mapbox" data-navigo title="About">Map</a>
        </li>

        <li class="eraseDb light"> 
          <a href="/#/chat" data-navigo title="Chat">chat</a>
        </li>
        <li class="eraseTags light">
          <a href="/#/tinder" data-navigo title="tinder">tinder</a>
        </li>
        <li class="logOut"><a href="#" id="logout"> Log Out</a></li>      </ul>
      `;

      nameList();
      menuCheck();
      // rentKot();


      //        console.log(user.displayName);

      if (!user.emailVerified) {

      } else {
        const listRegisterBtn = document.querySelector('.listRegisterBtn');

        listRegisterBtn.innerHTML = '<a class="btn" id="registerBtn" href="/firebase" data-navigo title="Register / Log In">Register/Log In</a>';
      }
    } else {
      window.location.replace('/');
    }
  });
};
