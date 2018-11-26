// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

document.querySelector('.register-buttton').addEventListener('click', down);

down (e) => {
  e.preventDefault()
  document.querySelector('.registred').slideDown()
  document.querySelector('.wrapper').slideUp()

  
  
};



/*
$(".register-buttton").click(function(e) {
  e.preventDefault();
    $(".registred").slideDown(600);
       $(".wrapper").slideUp(600);
});


$(".reset").click(function(e) {
  e.preventDefault();
    $(".registred").slideUp(600);
       $(".wrapper").slideDown(600);
});



$(".btn").click(function(e) {
  e.preventDefault();
    $(".login--content").slideDown(600);
       $(".register--content").slideUp(600);
});


$(".btn-reg").click(function(e) {
  e.preventDefault();
    $(".login--content").slideUp(600);
       $(".register--content").slideDown(600);
});
*/
// Data to be passed to the template
/* @param  {Node} elem Element to show and hide
*/
function slideDown(elem) {
 elem.style.maxHeight = '1000px';
 // We're using a timer to set opacity = 0 because setting max-height = 0 doesn't (completely) hide the element.
 elem.style.opacity   = '1';
}

/**
* Slide element up (like jQuery's slideUp)
* @param  {Node} elem Element
* @return {[type]}      [description]
*/
function slideUp(elem) {
 elem.style.maxHeight = '0';
 once( 1, function () {
   elem.style.opacity = '0';
 });
}

/**
* Call once after timeout
* @param  {Number}   seconds  Number of seconds to wait
* @param  {Function} callback Callback function
*/
function once (seconds, callback) {
 var counter = 0;
 var time = window.setInterval( function () {
   counter++;
   if ( counter >= seconds ) {
     callback();
     window.clearInterval( time );
   }
 }, 400 );
}

export default () => {

function login(e) {
  e.preventDefault()
  const email = document.getElementById("login_email").value
  const password = document.getElementById("login_password").value

  firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
          GetNotification('You are now logged in successfully!');
          toHome();

      })
  /*  .catch(function (error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;

    console.log(errorCode, errorMessage);
    document.getElementsByClassName('alerts').innerHTML = errorCode + " - " + errorMessage;
  });*/
}


// SIGNUP 

function signup(e) {
  e.preventDefault();

  const email = document.getElementById("signup_email").value;
  const password = document.getElementById("signup_password").value;
  const username = document.getElementById('username').value;
  const auth = firebase.auth();

  auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
          auth.currentUser.updateProfile({
              displayName: username
          })
          auth.currentUser.sendEmailVerification()
              .then(() => {
                  GetNotification(`Thanks for signing up to our website! Check your e-mail for account verification!`);
                  toHome();
              })
      })
  /*  .catch(function (error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;

    console.log(errorCode, errorMessage);
    document.getElementsByClassName('alerts').innerHTML = errorCode + " - " + errorMessage;
  });*/
}

// PASSWORD

function PasswordLost() {
  const email = document.getElementById('emailForgot').value;
  firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
          GetNotification(`HELP IS ON THE WAY`, `Get something to drink in the meantime `);
          toHome();
      })
      .catch(function (error) {
  
      });
}
  const user = 'Test user';
  // Return the compiled template to the router
  update(compile(homeTemplate)({ user }));
};
