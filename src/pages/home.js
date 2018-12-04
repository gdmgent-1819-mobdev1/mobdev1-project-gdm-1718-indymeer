/* eslint-disable spaced-comment */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
// Import the update helper
const { getInstance } = require('../firebase/firebase');
const homeTemplate = require('../templates/home.handlebars');
const rentTemplate = require('../templates/rent.handlebars');
const aboutTemplate = require('../templates/about.handlebars');


const firebase = getInstance();


const newLocal = 25;
export default () => {
  function logOut() {
    firebase.auth().signOut()
      .then(() => {
      // GetNotification('signedOut`, `Thank you come again - Apu');
        window.location.reload();
      });
  }


  const user = 'Test user';
  // Return the compiled template to the router
  update(compile(homeTemplate, rentTemplate, aboutTemplate)({ user }));

  // WHEN USER IS ACTIVE
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
  /*
  function rentKot() {
    document.getElementById('rentPage').innerHTML = `

  `;
  }
  */
  // function to check when user is loggedin


  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const showProfile = document.querySelector('.listRegisterBtn');
      const registerbtn = document.querySelector('#registerBtn');

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

      registerbtn.innerHTML = '';
      profileMore();
      //rentKot();


      //        console.log(user.displayName);

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


  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }

  const getRandomNum = () => Math.floor(Math.random() * 206);
  const ul = document.getElementById('flex-container');
  fetch('https://datatank.stad.gent/4/wonen/kotatgent.json').then(response => response.json()).then((data) => {
    //call in objects from json


    function create() {
      // eslint-disable-next-line space-unary-ops
      for (let i = 0; data.length; i += 1) {
        const type = data[i].Type;
        const adres = `${data[i].Straat} ${data[i].Huisummer} ${data[i].Plaats}`;
        const prijs = data[i].Huurprijs;


        const main = createNode('div');
        main.innerHTML = `<div class="product">
            <p class="product-title">${type}</p>
            <div id="imageGen"></div>
            <img src="https://source.unsplash.com/collection/494266/${getRandomNum()}" alt="image" />
            <div class="product-text">
             <p>Het gegeven adres: ${adres} <br> De prijs: ${prijs} </p>
             <button class="gradient-button gradient-button-1">View Product</button>
            </div>
           </div>`;
        append(ul, main);
      }
    }
    create();
  });
  function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
  }

  function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
  }

  function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
      ele.className = ele.className.replace(reg, ' ');
    }
  }

  // eslint-disable-next-line no-unused-vars
  const findItems = function (itemName) {
    const p = document.getElementsByClassName('product-title');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < p.length; i++) {
      if (!(p[i].textContent === itemName)) {
        addClass(p[i], 'un-selected');
      } else {
        removeClass(p[i], 'un-selected');
      }
    }
  };
  document.addEventListener('click', (event) => {
    if (event.target) {
      if (event.target.id === 'logout') {
        logOut();
      }
      if (event.target.classList.contains('header-right')) {
        console.warn('heyy');
      }
    }
  });
};
