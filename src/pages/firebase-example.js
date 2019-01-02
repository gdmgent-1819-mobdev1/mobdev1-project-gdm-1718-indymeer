/* eslint-disable no-inner-declarations */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/list.handlebars');

export default () => {
  // Data to be passed to the template
  const database = firebase.database();
  const studentRef = database.ref('Users');
  const sellerRef = database.ref('Verkoper');
  console.log(`${studentRef } ${sellerRef}`);

  const loading = true;
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading }));

// AUTH VOOR HEADER WEER TE GEVEN
document.getElementById('openMenu').onclick = function () {
  const element = document.querySelector('.content');
  element.classList.remove('no-animation');
  element.classList.toggle('shrink');
};

// WHEN USER IS ACTIVE

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
 
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
                  <a href="/#/" data-navigo title="Hotels">Home</a>
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

    //rentKot();


    //        console.log(user.displayName);

    if (!user.emailVerified) {

    } else {
      const listRegisterBtn = document.querySelector('.listRegisterBtn');

      listRegisterBtn.innerHTML = '<a class="btn" id="registerBtn" href="/firebase" data-navigo title="Register / Log In">Register/Log In</a>';
    }
  }
});
  // CODE OM TE SWITCHEN VAN LOGIN NAAR REGISTER


  // Fire back to home
  function toHome() {
    window.location.replace('/home');
  }

  /*  database.on('value', (snapshot) => {
      posts = snapshot.val();
      loading = false;
      // Run the update helper to update the template
      update(compile(aboutTemplate)({ title, loading, posts }));
    });
*/
  // LOGIN code

  function login(e) {
    e.preventDefault();
    const email = document.getElementById('mailLogin').value;
    const password = document.getElementById('passLogin').value;

    firebase.auth().signInWithEmailAndPassword(email, password)

      .then(() => {
        // GetNotification('You are now logged in successfully!');
        toHome();
      });
    /*  .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode, errorMessage);
      document.getElementsByClassName('alerts').innerHTML = errorCode + " - " + errorMessage;
    }); */
  }

  // CODE VOOR IMAGE UPLOAD
  /*
  document.getElementById('imageUpload').addEventListener('change', readURL, true);
  function readURL() {
    const file = document.getElementById('imageUpload').files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
      document.getElementById('clock').style.backgroundImage = `url(${  reader.result  })`;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }
*/

  const loginBtn = document.getElementById('login');
  const signupBtn = document.getElementById('signup');
  document.getElementById('submit-Sign').addEventListener('click', signup);
  document.getElementById('submit-Log').addEventListener('click', login);

  loginBtn.addEventListener('click', (e) => {
    const parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
      // eslint-disable-next-line eqeqeq
      if (element !== 'slide-up') {
        parent.classList.add('slide-up');
      } else {
        signupBtn.parentNode.classList.add('slide-up');
        parent.classList.remove('slide-up');
      }
    });
  });
 

  signupBtn.addEventListener('click', (e) => {
    const parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
      if (element !== 'slide-up') {
        parent.classList.add('slide-up');
      } else {
        loginBtn.parentNode.parentNode.classList.add('slide-up');
        parent.classList.remove('slide-up');
      }
    });
  });
  // SIGNUP
  document.querySelector("#checkbox").addEventListener("change", function() {
    document.querySelector('#CampusList').classList.toggle('hide');
});

  function signup(e) {
    e.preventDefault();

    const email = document.getElementById('registMail').value;
    const password = document.getElementById('registPass').value;
    const username = document.getElementById('userName').value;
    const adres = document.getElementById('userAdres').value;
    const tel = document.getElementById('userTelefoon').value;

    const select = document.getElementById('CampusList').value;
    const selectedCampus = document.getElementById('CampusList');
    const campus = selectedCampus.options[selectedCampus.selectedIndex].text;
    let status = null;

    // CAMPUS COORDINATES
    
    let long = 0;
    let lat = 0;

    if (select === '1') {
      long = 3.669072;
      lat = 51.087393;
    } else if (select === '2') {
      long = 3.700460;
      lat = 51.032020;
    } else if (select === '3') {
      long = 3.708860;
      lat = 51.060800;
    }

    if (document.getElementById('checkbox').checked) 
    { status = 'verkoper';
   } else { 
     status = 'student'; 
    }
    /*
        const fileButton = document.getElementById('imageUpload');
        var file = fileButton.files[0];
        var storageRef = firebase.storage().ref('/profilePicture/'+ file.name);
        storageRef.put(file);
     */
   
    const auth = firebase.auth();

    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        auth.currentUser.updateProfile({
          displayName: username,
        });
        const uid = firebase.auth().currentUser.uid;
        firebase.database().ref().child('accounts').child(uid).set({
            username,
            email,
            status,
            adres,
            tel,
            campus,
            long,
            lat
          });
    
        auth.currentUser.sendEmailVerification()
          .then(() => {
            toHome();
          });
      });
      
      


  
    /*  .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode, errorMessage);
    }); */
  }

  // PASSWORD

  function PasswordLost() {
    const email = document.getElementById('emailForgot').value;
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        // GetNotification('HELP IS ON THE WAY', 'Get something to drink in the meantime ');
        // toHome();
      })
      .catch(() => {

      });
  }
};
