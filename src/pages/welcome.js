
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';

// Import the update helper
import update from '../helpers/update';

// Import the template to use
const welcomeTemplate = require('../templates/welcome.handlebars');
const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();


export default () => {
  // Data to be passed to the template
  const title = 'welcome';
  const database = firebase.database();

  update(compile(welcomeTemplate)({ title }));
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        window.location.replace('/#home');

    } else {
    }
  });
};
