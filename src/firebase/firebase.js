const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: 'AIzaSyDRgRLGNhj0q17RUOGszeRrS34dnYsGAVI',
  authDomain: 'opdracht1-ec83f.firebaseapp.com',
  databaseURL: 'https://opdracht1-ec83f.firebaseio.com',
  projectId: 'opdracht1-ec83f',
  storageBucket: 'opdracht1-ec83f.appspot.com',
  messagingSenderId: '279742894607',
};

let instance = null;


const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};
