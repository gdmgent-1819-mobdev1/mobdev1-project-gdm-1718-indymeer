
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

  // AUTH VOOR HEADER WEER TE GEVEN
  document.getElementById('openMenu').onclick = function () {
    const element = document.querySelector('.content');
    element.classList.remove('no-animation');
    element.classList.toggle('shrink');
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
      // eslint-disable-next-line camelcase

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

  // kotenopslag
  const koten = [];


  if (config.mapBoxToken, firebase) {
    mapboxgl.accessToken = config.mapBoxToken;
    const map = new mapboxgl.Map({
      container: 'mapbox',
      center: [3.725, 51.05389],
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 13,
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

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        const rootRef = database.ref();

        const urlRef = rootRef.child(`content/`);
        urlRef.once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const loc = data.coordinates;
            const img = data.image;
            const type = data.Type;
            const adress = data.Adres;
            const name = data.name;

            const kotenInfo = {
              loc,
              img,
              type,
              adress,
              name,

            };

            koten.push(kotenInfo);
          });

          koten.forEach((kot) => {
            const marker = new mapboxgl.Marker()
              .setLngLat([kot.loc[0], kot.loc[1]])
              .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<img src="${kot.img}" width="250px"></img><p class='text-bold'>${kot.type}</p><p>${kot.name}</p>`))
              .addTo(map);
          });

        /*  for (const itemIndex in koten) {
            featureCollection.push([{ 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [koten[itemIndex]] } }]);
          }

          map.on('load', () => {
            map.loadImage('https://i.imgur.com/MK4NUzI.png', (error, image) => {
              if (error) throw error;
              map.addImage('custom-marker', image);
              map.addLayer({
                id: 'markers',
                type: 'symbol',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: featureCollection,
                  },
                },
                layout: {
                  'icon-image': 'custom-marker',
                },
              });
            });
          }); */
        });
      }
    });
  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
};
