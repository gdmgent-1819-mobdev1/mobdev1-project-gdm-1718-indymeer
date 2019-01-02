// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const aboutTemplate = require('../templates/rent.handlebars');
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

export default () => {
  // Data to be passed to the template
  const database = firebase.database();


  const name = 'Test inc.';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ name }));

  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }

  // NAV ANIMATIONS
  document.getElementById('openMenu').onclick = function () {
    const element = document.querySelector('.content');
    element.classList.remove('no-animation');
    element.classList.toggle('shrink');
  };

  // WHEN USER IS ACTIVE


  // function to check when user is loggedin


  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const user_id = firebase.auth().currentUser.uid;
      // eslint-disable-next-line camelcase
      const ref = firebase.database().ref(`accounts/${user_id}`);
      ref.once('value', (snapshot) => {
        if (snapshot.val().status === 'verkoper') {
          const school = document.querySelector('.school');
          const verkoper = snapshot.val().status;
          school.innerHTML = verkoper;


        } else {
         

        }
      });

      const showProfile = document.querySelector('.userDetails');
      const menu = document.querySelector('.menu');
      const userProfile = document.querySelector('.nameUser');
      const school = document.querySelector('.school');


      const name = user.displayName;
      const email = user.email;

      const opleiding = user.campus;
      school.innerHTML = opleiding;


      userProfile.innerHTML = name;

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

      downFavo();


      //        console.log(user.displayName);

      if (!user.emailVerified) {

      } else {
        window.location ="#/firebase";
        const listRegisterBtn = document.querySelector('.listRegisterBtn');

        listRegisterBtn.innerHTML = '<a class="btn" id="registerBtn" href="/firebase" data-navigo title="Register / Log In">Register/Log In</a>';
      }
    }
  });


  // FUNCTION TO DELETE POST BY GETTING THE KEY OF THE ID

  const DeletePost = (snapkey) => {
    const user_id = firebase.auth().currentUser.uid;

    const ref = firebase.database().ref(`favorites/${user_id}`);
    ref.child(snapkey).remove();
    location.reload();

    alert('Not longer a Favorite');
  };

  // GETTING THE FAVO ITEMS AND CREATE THEM

  const ul = document.getElementById('posts');
  const downFavo = () => {
    const user_id = firebase.auth().currentUser.uid;

    const rootRef = database.ref();

    const urlRef = rootRef.child(`favorites/${user_id}`);
    urlRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();

        const adres = data.Adres;
        const Toilet = data.Toilet;
        const Douche = data.Douche;
        const image = data.image;
        const madeName = data.name;
        const key = childSnapshot.key;
        const time = data.time;
        const type = data.Type;
        const Prijs = data.Prijs;
        const opp = data.Opp;



        const main = createNode('div');
        
        main.innerHTML = `<div class="product" id="${key}">
        <img src="${image}" alt="image" />
        <div class="product-text">
        <div class="profileInfo">
        <img alt='Profile Photo' class='avatar-photo' height='28' src='https://4.bp.blogspot.com/-H232JumEqSc/WFKY-6H-zdI/AAAAAAAAAEw/DcQaHyrxHi863t8YK4UWjYTBZ72lI0cNACLcB/s1600/profile%2Bpicture.png' width='28'>
        <div class="posted-name">${madeName} <br> <span> ${time}</span></div>
        <div class="Type">${type} <br>        
        </div>
        </div>


         <p>Het gegeven adres: ${adres}<br> De prijs: ${Prijs} </p>
          <p> De opgegeven oppervlakte: ${opp} m² </p>  
       
         <hr>
         <div class='icons'>
         <div data-href="https://developers.facebook.com/docs/plugins/" class="fb-share-button"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" ><i class="fa fa-share-alt iconColor"></i></a></div>
         <button id="chatUser"><i class="fa fa-comment-o iconColor"></i></button>

         <button class="heartBtn"><i class="fa fa-heart red" id="${key}"></i></button>
         </div>
       

        </div>
       </div>
           `;
        append(ul, main);
        const user_name = firebase.auth().currentUser.displayName;
        const toChat = () => {
          sessionStorage.setItem('variableName', data.adminId);
          const sessionKey = data.adminId + '_' + user_id;
          const myRef = firebase.database().ref(`chats/${sessionKey}`);
          const key = myRef.key;

          const info = {
            id: key,
            verzender: user_id,
            verzenderName: user_name,
            ontvanger: data.adminId,
            ontvangerName: data.name,

          };
          myRef.child('members').set(info);
          window.location.href = '#/chat';
      }
      
      // FOR LOOPS TO LOOP OVER ALL BUTTONS

        if (document.getElementById('chatUser') !== null) {
          const buttons = document.querySelectorAll('#chatUser');
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', toChat);
          }
        }

        if (document.querySelector('.heartBtn') !== null) {
          const buttons = document.querySelectorAll('.heartBtn');
          for (let i = 0; i < buttons.length; i++) {
          buttons[i].onclick = function (e) {
            const snapkey = e.target.getAttribute('id');

            DeletePost(snapkey);
          };
        }
        };
      });
    });
  };
};
