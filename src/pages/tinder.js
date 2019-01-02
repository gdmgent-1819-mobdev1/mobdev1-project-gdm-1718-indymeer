// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';

// Import the template to use
const tinderTemplate = require('../templates/tinder.handlebars');
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

export default () => {
  // Data to be passed to the template
  const database = firebase.database();


  const name = 'Tinder.';
  // Return the compiled template to the router
  update(compile(tinderTemplate)({ name }));

  // HOVER OPTIONS OVER PROFILE PIC

  document.getElementById('openMenu').onclick = function () {
    const element = document.querySelector('.content');
    element.classList.remove('no-animation');
    element.classList.toggle('shrink');
    element.classList.remove('displayNot');
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

      // rentKot();


      //        console.log(user.displayName);

      if (!user.emailVerified) {

      } else {
        const listRegisterBtn = document.querySelector('.listRegisterBtn');

        listRegisterBtn.innerHTML = '<a class="btn" id="registerBtn" href="/firebase" data-navigo title="Register / Log In">Register/Log In</a>';
      }
    }
  });


  let storageCounter = 0;
  loadNew();
  const koten_array = [];


  function loadNew() {
    const rootRef = database.ref();

    const urlRef = rootRef.child('content/');
    urlRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
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
        const image = data.image;
        const Entity = data.Entity;
        const Comment = data.Comment;
        const kost = data.Prijs;
        const adminId = data.adminId;
        const name = data.name;
        const key = childSnapshot.key;
        const time = data.time;

        const tinderData = {
          key,
          time,
          name,
          adminId,
          kost,
          Type,
          Opp,
          Verdieping,
          Personen,
          Toilet,
          Douche,
          Bad,
          Keuken,
          Bemeubeld,
          image,
          Adres,
          Entity,
          Comment,
        };

        if (localStorage.getItem('koten') !== null) {
          koten_array.push(tinderData);
          localStorage.setItem('koten', JSON.stringify(koten_array));

        } else {
          koten_array.push(tinderData);
          localStorage.setItem('koten', JSON.stringify(koten_array));
          location.reload();
          }
      });
      showProfile();

    });
  }


  
  

  function showProfile() {
    const koten = JSON.parse(localStorage.getItem('koten'));

    if (storageCounter > koten.length - 1) {
      document.querySelector('.user__card').innerHTML = 'Op op, alles is op!';
      alert('u heeft alle koten bekeken.');
    } else {
      document.querySelector('.user__image').src = koten[storageCounter].image;
      document.querySelector('.user__name').src = koten[storageCounter].name;

      document.querySelector('.user__type').innerHTML = koten[storageCounter].Type;
      document.querySelector('.user__adres').innerHTML = koten[storageCounter].Adres;
      document.querySelector('.user__prijs').innerHTML = koten[storageCounter].kost;

      document.querySelector('.user__opp').innerHTML = koten[storageCounter].Opp;
    }
    // persons.push(new NewPerson(koten, storageCounter));
  }

  function dislike() {
    ++storageCounter;
    if (storageCounter < 9) {
      showProfile();
    } else {
      showProfile();
      loadNew();
    }
  }
  function like() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        likeFav();
      }
    });

    ++storageCounter;

    if (storageCounter < 9) {
      showProfile();
    } else {
      showProfile();
      loadNew();
    }
  }


  const likeFav = () => {
    const koten = JSON.parse(localStorage.getItem('koten'));

    const specialKey = koten[storageCounter].key;

    const user_id = firebase.auth().currentUser.uid;
    console.log(koten);
    console.log(koten[storageCounter].key);
    const type = koten[storageCounter].Type;
    const opp = koten[storageCounter].Opp;
    const verdieping = koten[storageCounter].Verdieping;
    const personen = koten[storageCounter].Personen;
    const toilet = koten[storageCounter].Toilet;
    const douche = koten[storageCounter].Douche;
    const bad = koten[storageCounter].Bad;
    const imgUrl = koten[storageCounter].image;
    const keuken = koten[storageCounter].Keuken;
    const bemeubeld = koten[storageCounter].Bemeubeld;
    const entity = koten[storageCounter].Entity;
    const user = koten[storageCounter].name;
    const Time = koten[storageCounter].time;
    const admin = koten[storageCounter].adminId;
    const Comment = koten[storageCounter].Comment;
    const adres = koten[storageCounter].Adres;

    const ref = firebase.database().ref(`favorites/${user_id}`);
    ref.once('value', (snapshot) => {
      console.log(snapshot.val());
      if (snapshot.val() !== specialKey) {
        firebase.database().ref(`favorites/${user_id}/${specialKey}`).set({
          key: specialKey,
          adminId: admin,
          Type: type,
          Opp: opp,
          Verdieping: verdieping,
          Personen: personen,
          Toilet: toilet,
          Douche: douche,
          Bad: bad,
          image: imgUrl,
          time: Time,
          Keuken: keuken,
          Bemeubeld: bemeubeld,
          Adres: adres,
          Entity: entity,
          comment: Comment,
          name: user,
        });
      }
    });
  };


  document.getElementById('dislike').addEventListener('click', dislike);
  document.getElementById('like').addEventListener('click', like);
};
