// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';

// Import the update helper
import update from '../helpers/update';

// Import the template to use
const mapTemplate = require('../templates/page-with-map.handlebars');
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();


export default () => {
  // Data to be passed to the template
  const title = 'Mapbox example';
  const database = firebase.database();

  update(compile(mapTemplate, firebase)({ title }));
  // kotenopslag
  const koten = {};


  const locationConvert = () => {
    const rootRef = database.ref();
    const user_id = firebase.auth().currentUser.uid;


    const urlRef = rootRef.child(`content/${user_id}`);
    urlRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const address = data.adres;

        return new Promise(
          (resolve, reject) => {
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?limit=1&access_token=${config.mapBoxToken}`)
              .then((response) => {
                const dataMap = response.json();
                resolve(dataMap);
                console.log(dataMap);
              }, error => reject(error));
          },
        );
      });
    });
  };


  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    const map = new mapboxgl.Map({
      container: 'mapbox',
      center: [-74.50, 40],
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 18,
    });
    map.addControl(new MapboxGeocoder({
      accessToken: config.mapBoxToken,
    }));
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }));
    map.on('load', (e) => {
      // Add the data to your map as a layer
      map.addLayer({
        id: 'locations',
        type: 'symbol',
        // Add a GeoJSON source containing place coordinates and information.
        source: {
          type: 'geojson',
          // data: stores,
        },
        layout: {
          'icon-image': 'restaurant-15',
          'icon-allow-overlap': true,
        },
      });
    });
  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
  console.log(config.mapBoxToken);


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


      //  registerbtn.innerHTML = '';
      profileMore();
      locationConvert();


      //        console.log(user.displayName);
    } else {
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
