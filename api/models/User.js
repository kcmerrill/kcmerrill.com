/**
 * User
 *
 * @module      :: Model
 * @description :: A basic user model
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    email    : 'string',
    password : 'string'
  },
  toJSON: function(){
    var obj = this.toObject();
    delete obj.password;
    return obj;
  }
};
