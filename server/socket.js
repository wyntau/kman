var socketIO = require('socket.io')

    , io
    ;


module.exports = function(server){
    io = socketIO(server);

    io.on('connection', function(socket){
        
    });
};

module.exports.io = function(){
    return io;
};
