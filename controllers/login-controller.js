/**
 * MOST Web Framework Controller for Login
 * Created by kbarbounakis on 2015-10-10.
 */
var util = require('util'),
    web = require('most-web'),
    path = require('path');
/**
 * @class LoginBaseController
 * @constructor
 * @augments {HttpBaseController}
 */
function LoginBaseController() {
    LoginBaseController.super_.call(this);
}
util.inherits(LoginBaseController, web.controllers.HttpBaseController);

function queryReturnUrl() {
    /**
     * @type {HttpContext|*}
     */
    var self = this;
    var returnUrl = self.params['return'] || self.params['returnUrl'];
    if (web.common.isNullOrUndefined(returnUrl)) {
        //validate referrer
        var referer = self.request.headers.referer;
        if (referer) {
            var refererUri = url.parse(referer);
            if (refererUri.query) {
                var query = querystring.parse(refererUri.query);
                returnUrl=query.returnUrl;
            }
        }
    }
    return returnUrl || '/index.html';
}

/**
 * Tries to login the current user by applying the credentials specified (<username> and <password>).
 * If the underlying HTTP request contains a return URL parameter (<return> or <returnUrl>) then the user will be redirected to this URL.
 * @param callback
 */
LoginBaseController.prototype.login = function (callback) {
    var self = this, context = self.context;
    if (this.context.is('POST')) {
        //validate anti-forgery token
        self.context.validateAntiForgeryToken();
        //try to login
        var credentials = self.context.params.credentials;
        if (typeof credentials.password !== 'string') {
            callback(new web.common.HttpBadRequest());
            return;
        }
        var requestPassword = credentials.password.replace(/(^\s*|\s*$)/g, '');
        if (requestPassword.length===0) {
            callback(null, self.view({message:'Login failed due to server error. User password cannot be empty.'}));
            return;
        }
        //validate user name
        if (/^[A-Za-z0-9_\.\-@]+$/.test(credentials.username)==false) {
            callback(null, self.view({message:'Login failed due to server error. The user name may contains one or more illegal characters. Please contact your system administrator.'}));
            return;
        }
        //init auth provider
        var auth = self.context.application.module.service('$auth')(self.context);
        auth.login(credentials.username, requestPassword, function(err) {
            if (err) {
                web.common.log(err);
                if ((err instanceof web.common.HttpUnauthorizedException) || (err instanceof web.common.HttpForbiddenException)) {
                    callback(null, self.view({message:err.message, status:err.status, substatus: err.substatus}));
                }
                else {
                    callback(null, self.view({message:'Login failed due to server error. Please try again or contact system administrator.'}));
                }
            }
            else {
                var returnUrl = queryReturnUrl.call(self.context);
                if (web.common.isRelativeUrl(returnUrl)) {
                    return callback(null, self.redirect(returnUrl));
                }
                else {
                    return callback(null, self.redirect('/index.html'));
                }
            }
        });
    }
    else {
        return callback(null, self.view());
    }
};
/**
 * Logouts the current user and returns to home page.
 * If the underlying HTTP request contains a return URL parameter (<return> or <returnUrl>) then the user will be redirected to this URL.
 * @param callback
 */
LoginBaseController.prototype.logout = function(callback)
{
    var self = this;
    try {
        //init auth provider
        var auth = self.context.application.module.service('$auth')(self.context);
        auth.logout(function(err) {
            web.common.log(err);
            callback(null, self.redirect(self.context.params['return'] || self.context.params['returnUrl'] || '/index.html'));
        });
    }
    catch (e) {
        web.common.log(e);
        callback(new web.common.HttpServerError());
    }
};

LoginBaseController.prototype.style = function(callback)
{
    callback(null, this.file(path.resolve(__dirname, './../css/style.css'), 'login.css'));
};

if (typeof module !== 'undefined') module.exports = LoginBaseController;