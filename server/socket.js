var socketIO = require('socket.io')

    , io
    ;


module.exports = function(server){
    io = socketIO(server);

    io.on('connection', function(socket){
        // console.log('a new client connected:', socket.id);
    });
};

module.exports.io = function(){
    return io;
};
