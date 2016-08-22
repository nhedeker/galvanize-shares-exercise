// going back to old way cause babel and brunch are not transpiling this section
'use strict';

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

// same thing as doing process.env.NODE_ENV
// but app.get will default to our environement string
switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'));
    break;

  case 'production':
    app.use(morgan('short'));
    break;

  // always good to have default even when you are doing nothing
  default:
}

// path ensures no matter OS path titiling and slashes are same
const path = require('path');

// __dirname of just this file - absolute current working directory
app.use(express.static(path.join(__dirname, 'public')));

// CSRF protection
// looks at accept header on the req Object
// accept header tells server that client only wants JSON or certain format of
// data - client sends this as a hint to the server
// in our case have to ask specifically for JSON
// needs to be underneath static files but above api routes
// can't hit api from the browser anymore too
// can test server in terminal now by running:
// http -j GET :8000/api/posts
// -j means only interested in JSON req
app.use('/api', (req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  // otherwise request dies here
  // 406 means not acceptable
  res.sendStatus(406);
});

const bodyParser = require('body-parser');

// parse the req body into JSON
app.use(bodyParser.json());

const posts = require('./routes/posts');

// when you have both client side and server side routing going on adding a
// namespace (such as '/api') it helps to seperate them and make the technology
// not get confused with what is entered in the URL
// so if you do a get request for just '/posts' it will direct you to client
// side and like client side routing take over
// but if you prefix things with api we know your getting data from the server
// then via server side routing
app.use('/api', posts);

// can no longer default to just 404 catch all
// need to default now to client side to handle weirdness
// topic/awww example (to try maybe comment out direct middleware below)

// any method and any path in the request we want to find public directory and
// index.html and send it to the response - will read the contents of the file
// at that path and send that in the body of the response

// for use cases when users are accesing a specific part of site via a certain
// link - once at site navigation is handled completely on the client end

// fetches application once on server-side routing and then control goes to the
// client-side
// (index.html tells brunch to kick start the js functionailty with react)

// super important technique
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// eslint-disable-next-line max-params
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.log(err.stack);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', port);
});
