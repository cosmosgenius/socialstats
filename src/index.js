import React from 'react';
import OAuth from 'oauthio-web';

OAuth.initialize('yAsd3hEaL2vwelv9tEFbXSJMOag');

OAuth.popup('twitter').done(console.log.bind(console)).fail(console.log.bind(console));
