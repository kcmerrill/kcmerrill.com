/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

  /* Login functionality */
  login: function(req, res){
    User.findOneByEmail(req.param('email')).done(function (err, user){
        if(err){
            res.json({error: 'DB - Error'}, 500);
        }
        /* did we find a user? */
        if(user){
            /* I know, plain text, so sue me ... for now */
            if(req.param('password') == user.password){
                req.session.authenticated = true;
                res.json(user);
            } else {
                req.session.authenticated = false;
                res.json({error: 'Invalid password.'}, 401);
            }
        } else {
            req.session.user = false;
        }
    }); 
  }
};
