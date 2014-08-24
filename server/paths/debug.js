var mongoseed = require('../prepares/mongoseed')
    ;

module.exports = {
    'POST,GET /debug/cleardatabase': function *(next){
        yield mongoseed(true);
        this.status = 200;
        this.body = 'Clear success';
    }
};
