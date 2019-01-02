/* eslint-disable func-names */
/* eslint-disable spaced-comment */
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import update from '../helpers/update';
import config from '../config';

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
      const user_id = firebase.auth().currentUser.uid;

      const userLoc = [];

      console.log(user_id);
      // eslint-disable-next-line camelcase
      const ref = firebase.database().ref(`accounts/${user_id}`);
      ref.once('value', (snapshot) => {
        let lat = snapshot.val().lat;
        let long = snapshot.val().long;
        
        const locInfo = {
          lat,
          long,
        }
        userLoc.push(locInfo);
        localStorage.setItem('Locatie', JSON.stringify(userLoc));


        console.log(snapshot.val());

        if (snapshot.val().status === 'verkoper') {
          console.log('test');
        } else {
          console.log('beter proberen');
          document.getElementById('plus').outerHTML = "";
          const store = JSON.parse(localStorage.getItem('Locatie'));

          const degreesToRadians = (degrees) => {
            return degrees * (Math.PI / 180);
          };
          const kotenRef = firebase.database().ref('content');
          kotenRef.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
              const currentKot = firebase.database().ref('content/' + childSnapshot.key);
              const Lat = store[0].lat;
              const Long =  store[0].long;
              const Long2 = childSnapshot.val().coordinates[0];
              const Lat2 = childSnapshot.val().coordinates[1];
              const R = 6371; // metres
              const φ1 = degreesToRadians(Lat);
              const φ2 = degreesToRadians(Lat2);
              const Δφ = degreesToRadians(Lat2 - Lat);
              const Δλ = degreesToRadians(Long2 - Long);
              const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
                  + Math.cos(φ1) * Math.cos(φ2)
                  * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              const result = Math.round(R * c);
              currentKot.child('toUser').set(result);
            });
          });
        }
      });
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

            //rentKot();
            createKot();


      //        console.log(user.displayName);

      if (!user.emailVerified) {

      } 
    }else {
      document.getElementById('plus').outerHTML = '';

        createKot();

      }
  });


  // basic elements for creating

  function createNode(element) {
    return document.createElement(element);
  }

  function append(parent, el) {
    return parent.appendChild(el);
  }



  // ONCLICK ADD USER AS ADMIN
  const modal = document.getElementById('myModal');
  const detailModel = document.querySelector('#myModal2');

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
    if (event.target === modal) {
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


  mapboxgl.accessToken = config.mapBoxToken;

  let coordinates;

  const convert = () => {
    const Adres = document.getElementById('kotAdres').value;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${Adres}.json?limit=1&access_token=${config.mapBoxToken}&cachebuster=1545257251767&autocomplete=true&limit=1`;
    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        coordinates = data.features[0].center;
      });
  };

  const inputAdres = document.getElementById('kotAdres');
  inputAdres.addEventListener('blur', convert);


  /*
  const checkInside = () => {
    /* const gentLink = 'https://datatank.stad.gent/4/grondgebied/wijken.geojson';
    fetch(gentLink, {
      method: 'GET'
    })  .then(response => response.json())
    .then((data) => {
      gent.push(data);
      console.log(gent[0].coordinates);
    });
    let point = turf.point([3.709919, 51.077006]);
// here first is lng and then lat
    let polygon = turf.polygon([[
      gent[0].coordinates,
    ]], { name: 'poly1'});
    turf.inside(point, polygon);


    const cluster = [];
    let features = [];
    const point1 = turf.point([3.709919, 51.077006], { });//x,y
    const gentLink = 'https://datatank.stad.gent/4/grondgebied/wijken.geojson';
    fetch(gentLink, (data) => {
      features = data.coordinates;

      for (let i = 0, len = features.length; i < len; i++) {
        const isInside = turf.inside(point1, features[i]);

        if (isInside) {
          cluster.push(features[i]);
        }
      }

      //Create table of attributes
    });
    console.log(cluster);
  }; checkInside();*/
  // eslint-disable-next-line no-unused-vars
  let noImgUrl;
  let image;

  const DeletePost = (snapkey) => {
    const ref = firebase.database().ref('content/');
    ref.child(snapkey).remove();
    console.log(snapkey);
    window.location.replace('/#');

    alert('Deleted i see - Yoda');
  };

  const EditPost = (snapkey) => {
    modal.style.display = 'block';

    const imgEdit = document.getElementById('kotFoto');

    imgEdit.addEventListener('change', (evt) => {
      if (imgEdit.value !== '') {
        const fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
        const storageRef = firebase.storage().ref(`images/${fileName}/`);

        storageRef.put(evt.target.files[0]).then(() => {
          imagePath = `images/${fileName}/`;

          const storeImage = firebase.storage().ref(imagePath);
          storeImage.getDownloadURL().then((url) => {
            imgUrl = url;
            if (imgUrl !== '') {
              image = imgUrl;
            }
          });
        });
      }
    });

    const ref = firebase.database().ref(`content/${snapkey}`);
    ref.once('value', (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      noImgUrl = data.image;
      if (imgUrl === undefined) {
        image = noImgUrl;
      }


      document.getElementById('kotType').value = data.Type;
      document.getElementById('kotOpp').value = data.Opp;
      document.getElementById('kotVerdieping').value = data.Verdieping;
      document.getElementById('kotPers').value = data.Personen;
      document.getElementById('kotToilet').value = data.Toilet;
      document.getElementById('kotDouche').value = data.Douche;
      document.getElementById('kotBad').value = data.Bad;
      document.getElementById('kotKeuken').value = data.Keuken;
      document.getElementById('kotBemeubeld').value = data.Bemeubeld;
      document.getElementById('kotAdres').value = data.Adres;
      document.getElementById('kotEntity').value = data.Entity;
      document.getElementById('kotCom').value = data.Comment;

      const editInfo = {
        adminId: uid,
        Type,
        Opp,
        Verdieping,
        Personen,
        Toilet,
        Douche,
        Bad,
        image,
        Keuken,
        Bemeubeld,
        Adres,
        coordinates,
        Entity,
        Comment,
        name,
      };
      ref.set(editInfo);
    });
  };
  function timeStamp() {
    const now = new Date();
    const date = [now.getMonth() + 1, now.getDate()];

    return date.join('/');
  }

  // GET VALUE OF FORM AND MAKE ITEM
  document.getElementById('kotSubmit').addEventListener('click', dataKot, createKot);
  function dataKot() {
    const Prijs = document.getElementById('kotPrijs').value;
    const Waarborg = document.getElementById('kotWaarborg').value;
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
    const time = timeStamp();


    const uid = firebase.auth().currentUser.uid;
    const name = firebase.auth().currentUser.displayName;
    const kotPush = firebase.database().ref('content/').push();

    const kotInfo = {
      adminId: uid,
      Type,
      Prijs,
      Waarborg,
      Opp,
      Verdieping,
      Personen,
      Toilet,
      Douche,
      Bad,
      image: imgUrl,
      time,
      Keuken,
      Bemeubeld,
      Adres,
      coordinates,
      Entity,
      Comment,
      name,
    };

    kotPush.set(kotInfo);

    modal.style.display = 'none';
    alert('kot is created');
    location.reload();

  }

  // create post from database data

  const detailsPopup = (e) => {
    detailModel.style.display = 'block';
    console.log(e.target.getAttribute('id'));
    const uniqueId = e.target.getAttribute('id');
    const ref = firebase.database().ref(`content/${uniqueId}`);
    ref.once('value', (snapshot) => {
      console.log(snapshot.val());
      const det = snapshot.val();
      console.log(det.image);


      document.getElementById('detImg').src = det.image;
      document.getElementById('postName').innerHTML = det.name;

      document.getElementById('Type').innerHTML = det.Type;
      document.getElementById('detOpp').innerHTML = det.Opp;
      document.getElementById('detVerdieping').innerHTML = det.Verdieping;
      document.getElementById('detPersonen').innerHTML = det.Personen;
      document.getElementById('detToilet').innerHTML = det.Toilet;
      document.getElementById('detDouche').innerHTML = det.Douche;
      document.getElementById('detBad').innerHTML = det.Bad;
      document.getElementById('detKeuken').innerHTML = det.Keuken;
      document.getElementById('detBemeubeld').innerHTML = det.Bemeubeld;
      document.getElementById('detAdres').innerHTML = det.Adres;
      document.getElementById('detEntity').innerHTML = det.Entity;
      document.getElementById('detComment').innerHTML = det.Comment;
    });
  };

  let kotRef = database.ref('content/');

  // price
    const filter = document.getElementById('order');
    filter.addEventListener('change', () => {

     if (filter.value === '-1') {
        kotRef = database.ref('content/').orderByChild('Opp');
        document.querySelector('#fullContent').innerHTML = '';
      } 
      if (filter.value === '-2') {
        kotRef = database.ref('content/').orderByChild('Type');
        document.querySelector('#fullContent').innerHTML = '';
      } if (filter.value === '-3') {
        kotRef = database.ref('content/').orderByChild('toUser');
        document.querySelector('#fullContent').innerHTML = '';
      }if (filter.value === '-4') {
        kotRef = database.ref('content/').orderByChild('Prijs');
        document.querySelector('#fullContent').innerHTML = '';
      }

      createKot();

    });


  const createKot = () => {
    const rootRef = database.ref();

    let user_id;
    let user_name;
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
      const gebruiker = firebase.auth().currentUser.uid;
    const name = firebase.auth().currentUser.displayName;
        user_id = gebruiker;
        user_name = name;
      }


    });
   

    const urlRef = rootRef.child('content/').orderByChild('time');
    kotRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        console.log(data);
        const specialKey = childSnapshot.key;
        const adres = data.Adres;
        const type = data.Type;
        const opp = data.Opp;
        const Prijs = data.Prijs;
        const Verdieping = data.Verdieping;
        const Personen = data.Personen;
        const Toilet = data.Toilet;
        const Douche = data.Douche;
        const Bad = data.Bad;
        const image = data.image;
        const Keuken = data.Keuken;
        const Bemeubeld = data.Bemeubeld;
        const Entity = data.Entity;
        const madeName = data.name;
        const key = childSnapshot.key;
        const time = data.time;
        const adminId = data.adminId;


        // eslint-disable-next-line camelcase
        let optionButton = '';
        if (childSnapshot.val().adminId === user_id) {
          console.log('eureka');
          optionButton = ` <div class="post-options-holder">
              <div id= "" class="edit" >
              <i class="fa fa-pencil" id="${key}"></i>
              </div><!--End Tools-->
              <div id= "" class="delete" >
              <i class="fa fa-trash " id="${key}"></i>
              </div><!--End Tools-->
           
           
            </div><!--End Post Options Holder -->`;
        } else {
          console.log('beter proberen');
        }

        const main = createNode('div');
        main.innerHTML = `<div class="product" id="${key}">
              <img src="${image}" alt="image" />
              <div class="product-text">
              <div class="profileInfo">
              <img alt='Profile Photo' class='avatar-photo' height='28' src='https://4.bp.blogspot.com/-H232JumEqSc/WFKY-6H-zdI/AAAAAAAAAEw/DcQaHyrxHi863t8YK4UWjYTBZ72lI0cNACLcB/s1600/profile%2Bpicture.png' width='28'>
              <div class="posted-name">${madeName} <br> <span> ${time}</span></div>
              <div class="Type">${type} <br>                ${optionButton}
              </div>
              </div>

              <p>  ${Toilet}</p>

               <p>Het gegeven adres: ${adres}<br> De prijs: ${Prijs} </p>
                <p> De opgegeven oppervlakte: ${opp} m² </p>  
             
               <button class=" details" id="${key}">View Product</button>
               <hr>
               <div class='icons'>
               <div data-href="https://developers.facebook.com/docs/plugins/" class="fb-share-button"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" ><i class="fa fa-share-alt iconColor"></i></a></div>
               <button id="chatUser"><i class="fa fa-comment-o iconColor"></i></button>

               <button class="heartBtn"><i class="fa fa-heart-o iconColor" id="favorite"></i></button>
               </div>
             

              </div>
             </div>
             
             `;
        append(ul, main);

        
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {

          }else{
            document.querySelector('#chatUser').style.display = "none";
            document.querySelector('.heartBtn').style.display = "none";

          }
        });

        const tools = () => {
          if (childSnapshot.val().adminId === user_id) {
            document.querySelector('.delete').onclick = function (e) {
              const snapkey = e.target.getAttribute('id');
              console.log(snapkey);
              DeletePost(snapkey);
            };
            document.querySelector('.edit').onclick = function (e) {
              const snapkey = e.target.getAttribute('id');

              EditPost(snapkey);
            };
          }
        }; tools();
        const toChat = () => {
          console.log('triggerd')
          sessionStorage.setItem('variableName', data.adminId);
          const sessionKey = data.adminId + '_' + user_id;
          const myRef = firebase.database().ref(`chats/${sessionKey}`);
          const key = myRef.key;

          const info = {
            id: key,
            verzender: user_id,
            verzenderName: user_name,
            ontvanger: data.adminId,
            ontvangerName: data.name,

          };
          myRef.child('members').set(info);
          window.location.href = '#/chat';
      }

        if (document.getElementById('chatUser') !== null) {
          console.log('gevonden');
          const buttons = document.querySelectorAll('#chatUser');
          console.log(buttons);
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', toChat);
          }
        }
     
        if (document.querySelector('#favorite') !== null) {
          document.getElementById('favorite').addEventListener('click', () => {
            console.log('button clicked');
            const elem = document.querySelector('#favorite');
            elem.classList.remove('fa-heart-o');
            elem.classList.add('fa-heart', 'red');
            const kotType = data.Type;
            const oppervlakte = data.Opp;
            const verdieping = data.Verdieping;
            const personen = data.Personen;
            const toilet = data.Toilet;
            const douche = data.Douche;
            const bad = data.Bad;
            const img = data.image;
            const keuken = data.Keuken;
            const bemeubeld = data.Bemeubeld;
            const entity = data.Entity;
            const userName = data.name;
            const Time = data.time;
            const admin = data.adminId;
            const Comment = data.Comment;
            const locatie =data.Adres;
            const ref = firebase.database().ref(`favorites/${user_id}`);
            ref.once('value', (snapshot) => {
        
              console.log(snapshot.val())
              if (snapshot.val() !== specialKey) {
        
        
                
                firebase.database().ref(`favorites/${user_id}/${specialKey}`).set({
                  key: specialKey,
                  adminId: admin,
                  Type: kotType,
                  Opp: oppervlakte,
                  Verdieping: verdieping,
                  Personen: personen,
                  Toilet: toilet,
                  Douche: douche,
                  Bad: bad,
                  image: img,
                  time: Time,
                  Keuken: keuken,
                  Bemeubeld: bemeubeld,
                  Adres: locatie,
                  Entity: entity,
                  comment: Comment,
                  name: userName,
                });
              }
            });
          });
                  
        if (document.getElementsByClassName('details') !== null) {
          console.log('gevonden');
          const buttons = document.querySelectorAll('.details');
          console.log(buttons);
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', detailsPopup);
          }
        }
        }

        document.querySelector('.fb-share-button').onclick = function (data) {
          const desc = [
            data.Type,
            data.Opp,
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




  const ul = document.getElementById('fullContent');


  // FILTERS


  // search

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
      if (title.toLowerCase().indexOf(e.target.value) !== -1) {
        book.style.display = 'block';
      } else {
        book.style.display = 'none';
      }
    });
  });


  // initially sort the element


  document.addEventListener('click', (event) => {
    if (event.target) {
      if (event.target.id === 'logout') {
        logOut();
      }
      // eslint-disable-next-line no-empty
      if (event.target.classList.contains('header-right')) {
      }
      if (event.target.classList.contains('Kotprod')) {
        //   document.getElementById('favorite').addEventListener('click', favorite);

        if (event.target.classList.contains('more-btn')) {
          console.log('morebutton');
        }
      }
    }
  });
};
