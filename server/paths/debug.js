var mongoseed = require('../pre/mongoseed')
    ;

module.exports = {
    'GET /debug/cleardatabase': function *(next){
        yield mongoseed(true);
        this.status = 200;
    }
};
