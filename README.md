# most-web-login (in progress)

Most Web Framework Login Pages Extension

Add standard login pages and views by registering this extension in application configuration as follows:

    {
      ...
      "extensions": [
          ...
          { "name":"login", "description":"MOST Web Framework Login Pages", 
          "type":"most-web-login" }
      ]
    }

or by adding the following lines of code in server.js init script:

    var login = require('most-web-login');
    login.extend(web.current);
