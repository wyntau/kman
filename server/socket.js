var socketIO = require('socket.io')

    , io
    ;

module.exports.init = function(server){
    io = socketIO(server);

    io.on('connection', function(socket){
        io.emit('online');
    });

    io.on('disconnection', function(socket){
        io.emit('offline');
    });

    return server; // for chain
};

module.exports.io = function(){
    return io;
};
