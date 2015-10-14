# most-web-extensions (in progress)

Most Web Framework MVC Extensions

Register this extension in application configuration as follows:

    {
      ...
      "extensions": [
          ...
          { "name":"mwext", "description":"MOST Web Framework Extensions", 
          "type":"most-web-extensions" }
      ]
    }

or by adding the following lines of code in server.js init script:

    var mwext = require('most-web-extensions');
    mwext.extend(web.current);
