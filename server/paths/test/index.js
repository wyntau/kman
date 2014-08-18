module.exports = {
  'GET /index': function *(next){
    this.body = 'Just use directory including `index.js` to define one path';
  }
};