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
  const studentRef = database.ref('userdata');
  const sellerRef = database.ref('Verkoper');
  console.log(studentRef + ' ' + sellerRef);

  let loading = true;
  let posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));

// CODE VOOR IMAGE UPLOAD

  // eslint-disable-next-line no-use-before-define
  document.getElementById('imageUpload').addEventListener('change', readURL, true);
  function readURL() {
    const file = document.getElementById('imageUpload').files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
      document.getElementById('clock').style.backgroundImage = `url(${reader.result})`;
    };
    if (file) {
      reader.readAsDataURL(file);
    // eslint-disable-next-line no-empty
    } else {
    }
  }

  // CODE OM TE SWITCHEN VAN LOGIN NAAR REGISTER

  const elem = document.querySelector('.register--content');
  const elem2 = document.querySelector('.login--content');
  document.addEventListener('click', (event) => {
    event.preventDefault();

    if (event.target.matches('.btn-reg')) {
      elem.removeAttribute('hidden');
      elem2.setAttribute('hidden', 'true');

      elem.classList.add('fadeInDown');
    }

    if (event.target.matches('.btn')) {
      elem.setAttribute('hidden', 'true');
      elem2.removeAttribute('hidden');
      elem.classList.remove('fadeInDown');
    }
  }, false);

  if (firebase) {
    /* firebase.auth().createUserWithEmailAndPassword('test@test.com', 'test333').catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
    */
    // eslint-disable-next-line no-use-before-define
    document.querySelector('.register-buttton').addEventListener('click', signup);
    document.querySelector('#loginBttn').addEventListener('click', login);

  
  
    // Fire back to home
    function toHome() {
      window.location.replace('/');
    }

    database.on('value', (snapshot) => {
      posts = snapshot.val();
      loading = false;
      // Run the update helper to update the template
      update(compile(aboutTemplate)({ title, loading, posts }));
    });

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


    // SIGNUP

    function signup(e) {
      e.preventDefault();

      const email = document.getElementById('registMail').value;
      const password = document.getElementById('registPass').value;
      const username = document.getElementById('userName').value;
      const auth = firebase.auth();

      const userData = {
        username,
        email,
      };
      studentRef.push(userData);
    

      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          auth.currentUser.updateProfile({
            displayName: username,
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
  }
};
