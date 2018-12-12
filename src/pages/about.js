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

// ONCLICK ADD USER AS ADMIN

// AUTH VOOR HEADER WEER TE GEVEN

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const showProfile = document.querySelector('.listRegisterBtn');
      // const registerbtn = document.querySelector('#registerBtn');

      const name = user.displayName;
      const email = user.email;
      const photo = user.photoURL;

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
    document.querySelector('.nameUser').innerHTML = name;


      //  registerbtn.innerHTML = '';
      profileMore();


      //        console.log(user.displayName);
    }
    else {
      /*  document.getElementById('rent').addEventListener('click', () => {
          window.location.replace('/firebase');
        });
              window.location = '/list';

*/
      window.location = '/#firebase';

      const listRegisterBtn = document.querySelector('.listRegisterBtn');

      listRegisterBtn.innerHTML = '<a class="btn" id="registerBtn" href="/firebase" data-navigo title="Register / Log In">Register/Log In</a>';
    }
  });
};
