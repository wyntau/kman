module.exports = {
    'GET /demo': function *(next){
        this.body = {
            path: 'demo'
            , name: 'test'
        }
    }
};