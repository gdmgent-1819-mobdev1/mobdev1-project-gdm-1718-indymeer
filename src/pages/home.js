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

  const database = firebase.database();

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
      const user_id = firebase.auth().currentUser.uid;
      console.log(user_id);
      // eslint-disable-next-line camelcase
      const ref = firebase.database().ref(`accounts/${user_id}`);
      ref.once('value', (snapshot) => {
        console.log(snapshot.val());
        if (snapshot.val().status == 'verkoper') {
          console.log('test');
        } else {
          console.log('beter proberen');
        }
      });

      const showProfile = document.querySelector('.listRegisterBtn');

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

      profileMore();
      createKot();
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
        createKot();
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

  // ONCLICK ADD USER AS ADMIN
  const modal = document.getElementById('myModal');
  const detailModel = document.getElementById('myModal2');

  const btn = document.getElementById('plus');

  const span = document.getElementsByClassName('close')[0];
  const span2 = document.getElementsByClassName('close2')[0];


  btn.onclick = function () {
    modal.style.display = 'block';
    imageUpload();
  };

  span.onclick = function () {
    modal.style.display = 'none';
  };
  span2.onclick = function () {
    detailModel.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      detailModel.style.display = 'none';
    }
  };

  // image upload
  let imagePath;
  let imgUrl;
  const imageUpload = () => {
    console.log('test');
  
    
    if (firebase) {
      const fileUpload = document.getElementById('kotFoto');

      fileUpload.addEventListener('change', (evt) => {
        console.log('swk');
        if (fileUpload.value !== '') {
          const fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
          const storageRef = firebase.storage().ref(`images/${fileName}/`);

          storageRef.put(evt.target.files[0]).then(() => {
            imagePath = `images/${fileName}/`;

            const storeImage = firebase.storage().ref(imagePath);
            storeImage.getDownloadURL().then((url) => {
              localStorage.setItem('imageLink', url);
              
              imgUrl = url;
              console.log(imgUrl);

            });
          });
        } else {
          console.log('emptyy');
          imgUrl = 0;
        }
      });
    }
  };


  // GET VALUE OF FORM AND MAKE ITEM
  document.getElementById('kotSubmit').addEventListener('click', dataKot, createKot);
  function dataKot() {
    const Type = document.getElementById('kotType').value;
    const Opp = document.getElementById('kotOpp').value;
    const Verdieping = document.getElementById('kotVerdieping').value;
    const Personen = document.getElementById('kotPers').value;
    const Toilet = document.getElementById('kotToilet').value;
    const Douche = document.getElementById('kotDouche').value;
    const Bad = document.getElementById('kotBad').value;
    const Keuken = document.getElementById('kotKeuken').value;
    const Bemeubeld = document.getElementById('kotBemeubeld').value;
    const Adres = document.getElementById('kotAdres').value;
    const Entity = document.getElementById('kotEntity').value;
    const Comment = document.getElementById('kotCom').value;


    const uid = firebase.auth().currentUser.uid;


    firebase.database().ref(`content/${uid}/`).push({
      Type,
      Opp,
      Verdieping,
      Personen,
      Toilet,
      Douche,
      Bad,
      image: imgUrl,
      Keuken,
      Bemeubeld,
      Adres,
      Entity,
      Comment,
    });
    modal.style.display = 'none';
  }

  // create post from database data

  const createKot = () => {
    const rootRef = database.ref();
    const user_id = firebase.auth().currentUser.uid;
    const name = firebase.displayName;


    const urlRef = rootRef.child(`content/${user_id}`);
    urlRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        console.log(data);

        const adres = data.Adres;
        const prijs = data.Toilet;
        const id = data.Douche;
        const categorie = data.Type;
        console.log(prijs);


        const main = createNode('div');
        main.innerHTML = `<div class="product">
              <p class="product-title">${categorie}</p>
              <div id="imageGen"></div>
              <img src="https://source.unsplash.com/collection/494266/${getRandomNum()}" alt="image" />
              <div class="product-text">
              <p> id: ${id}
               <p>Het gegeven adres: ${adres} ${prijs} <br> De prijs: </p>
               <button><i class="fas fa-heart" id="favorite"></i></button>
               <div class="posted-name">${name}</div>
               <div class="fb-share-button" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button_count" data-size="small" data-mobile-iframe="true"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Delen</a></div>
               <button class="gradient-button gradient-button-1 details" id="detailsList">View Product</button>
              </div>
             </div>
             
             `;
        append(ul, main);

        document.getElementById('detailsList').onclick = function () {
          detailModel.style.display = 'block';

          document.getElementById('detType').innerHTML = data.Type;
          document.getElementById('detOpp').innerHTML = data.Opp;
          document.getElementById('detVerdieping').innerHTML = data.Verdieping;
          document.getElementById('detPersonen').innerHTML = data.Personen;
          document.getElementById('detToilet').innerHTML = data.Toilet;
          document.getElementById('detDouche').innerHTML = data.Douche;
          document.getElementById('detBad').innerHTML = data.Bad;
          document.getElementById('detKeuken').innerHTML = data.Keuken;
          document.getElementById('detBemeubeld').innerHTML = data.Bemeubeld;
          document.getElementById('detAdres').innerHTML = data.Adres;
          document.getElementById('detEntity').innerHTML = data.Entity;
          document.getElementById('detComment').innerHTML = data.Comment;
        };

        document.getElementById('favorite').onclick = function () {
          const Type = data.Type;
          const Opp = data.Opp;
          const Verdieping = data.Verdieping;
          const Personen = data.Personen;
          const Toilet = data.Toilet;
          const Douche = data.Douche;
          const Bad = data.Bad;
          const Keuken = data.Keuken;
          const Bemeubeld = data.Bemeubeld;
          const Adres = data.Adres;
          const Entity = data.Entity;
          const Comment = data.Comment;
          firebase.database().ref(`favorites/${user_id}/`).push({
            Type,
            Opp,
            Verdieping,
            Personen,
            Toilet,
            Douche,
            Bad,
            Keuken,
            Bemeubeld,
            Adres,
            Entity,
            Comment,
          });
        };

        document.querySelector('.fb-share-button').onclick = function (data) {
          const desc = [data.Type, data.Opp,
            data.Verdieping,
            data.Personen,
            data.Toilet,
            data.Douche,
            data.Bad,
            data.Keuken,
            data.Bemeubeld,
            data.Adres,
            data.Entity,
            data.Comment];
          document.querySelector('meta[name="description"]').setAttribute('content', desc);
        };
      });
    });
  };


  const getRandomNum = () => Math.floor(Math.random() * 206);
  const ul = document.getElementById('flex-container');
  /*  fetch('https://datatank.stad.gent/4/wonen/kotatgent.json').then(response => response.json()).then((data) => {
    //call in objects from json


    function create() {
      // eslint-disable-next-line space-unary-ops
      for (let i = 0; data.length; i += 1) {
        const adres = data[i].Straat;
        const huisnummer = data[i].Huisummer;
        const Plaats = data[i].Plaats;
        const prijs = data[i].Huurprijs;
        const id = data[i]['﻿Kot id'];
        const categorie = data[i].Type;


        const main = createNode('div');
        main.innerHTML = `<div class="product Kotprod">
            <p class="product-title">${categorie}</p>
            <div id="imageGen"></div>
            <img src="https://source.unsplash.com/collection/494266/${getRandomNum()}" alt="image" />
            <div class="product-text">
            <p> id: ${id}
             <p>Het gegeven adres: ${adres} ${huisnummer} ${Plaats} <br> De prijs: ${prijs} </p>
             <button class="gradient-button gradient-button-1">View Product</button>
            </div>
           </div>

           `;
        append(ul, main);
      }
    }
    create();
  });
*/
  // eslint-disable-next-line no-unused-vars
  const list = document.getElementById('flex-container');
  const forms = document.forms;

  const searchBar = forms['flex-form'].querySelector('input');
  searchBar.addEventListener('keyup', (e) => {
    document.getElementById('cover').style.height = '45vh';
    const term = e.target.value.toLowerCase();
    const books = list.getElementsByTagName('div');
    Array.from(books).forEach((book) => {
      const title = book.textContent;
      if (title.toLowerCase().indexOf(e.target.value) != -1) {
        book.style.display = 'block';
      } else {
        book.style.display = 'none';
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target) {
      if (event.target.id === 'logout') {
        logOut();
      }
      if (event.target.classList.contains('header-right')) {
        console.warn('heyy');
      }
      if (event.target.classList.contains('Kotprod')) {
        document.getElementById('favorite').addEventListener('click', favorite);
        const favorite = () => {

        };
      }
    }
  });
};
