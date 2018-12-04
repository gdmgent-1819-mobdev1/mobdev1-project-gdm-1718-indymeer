// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';


// Import the update helper
import update from '../helpers/update';

// Import the template to use
const mapTemplate = require('../templates/list.handlebars');

export default () => {
  const title = 'Login';
  update(compile(mapTemplate)({ title }));
};
