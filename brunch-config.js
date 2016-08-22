'use strict';

module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'app.js': /^app\//,
        'vendor.js': /^node_modules\//
      }
    },

    stylesheets: {
      joinTo: {
        'app.css': /^app\//
      }
    }
  },

  plugins: {
    babel: {
      presets: ['es2015', 'react']
    }
  },

  // setting server config when app starts
  // telling brunch to ignore everything in the app & public directory
  // so only deals with back-end and doesn't restart server if change in
  // clientside code
  // to test just run npm start in console
  // starts both brunch stuff and nodemon stuff
  // makes sure nodemon only deals with back-end
  // and brunch only deals with front end
  server: {
    command: 'nodemon --ignore app --ignore public server.js'
  }
};
