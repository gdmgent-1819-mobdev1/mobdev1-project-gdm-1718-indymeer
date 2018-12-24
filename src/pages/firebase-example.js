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
  const posts = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ title, loading, posts }));


  // CODE OM TE SWITCHEN VAN LOGIN NAAR REGISTER


  // Fire back to home
  function toHome() {
    window.location.replace('/');
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

  function signup(e) {
    e.preventDefault();

    const email = document.getElementById('registMail').value;
    const password = document.getElementById('registPass').value;
    const username = document.getElementById('userName').value;
    const auth = firebase.auth();
    let status = null;

    if (document.getElementById('checkbox').checked) { status = 'verkoper'; } else { status = 'student'; }
    /*
        const fileButton = document.getElementById('imageUpload');
        var file = fileButton.files[0];
        var storageRef = firebase.storage().ref('/profilePicture/'+ file.name);
        storageRef.put(file);
     */
   

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
