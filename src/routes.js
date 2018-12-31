// Pages
import HomeView from './pages/home';
import AboutView from './pages/about';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import ChatView from './pages/chat';
import tinderView from './pages/tinder';


export default [
  { path: '/', view: HomeView },
  { path: '/rent', view: AboutView },
  { path: '/firebase-example', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
  { path: '/chat', view: ChatView },
  { path: '/tinder', view: tinderView },
];
