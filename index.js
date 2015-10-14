var LoginBaseController = require('./controllers/login-controller'), path = require('path');
if (typeof exports !== 'undefined')
{
    module.exports = {
        /**
         * @param {HttpApplication} app
         */
        extend:function(app) {
            //register controllers
            app.controller('login', LoginBaseController);
            //register routes
            app.config.routes.unshift(
                { "url":"/login",  "mime":"text/html", "action":"login", "controller":"login", path:path.join(__dirname, 'bootstrap') },
                { "url":"/logout",  "mime":"text/html", "action":"logout", "controller":"login" },
                { "url":"/css/login.css",  "mime":"text/css", "action":"style", "controller":"login" }
            );
        }
    };
}