var mongoseed = require('../pre/mongoseed')
    ;

module.exports = {
    'POST /debug/cleardatabase': function *(next){
        yield mongoseed(true);
        this.status = 200;
    }
};
