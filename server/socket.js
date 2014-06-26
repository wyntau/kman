var socketIO = require('socket.io')

    , io
    ;

module.exports.init = function(server){
    io = socketIO(server);

    io.on('connection', function(socket){
        // console.log('a new client connected:', socket.id);
    });

    return server; // for chain
};

module.exports.io = function(){
    return io;
};
