var is = require('jistype')
    ;

module.exports = function(routes) {
    return function(app) {
        // 将路由表的每一项附加到app上
        Object.keys(routes).forEach(function(key) {
            var args = routes[key],
                methodPath = key.split(' '),
                method = methodPath[0].toUpperCase(),
                path = methodPath[1];

            if (is.isArray(args)) {
                args.unshift(path);
            } else {
                args = [path, args];
            }

            switch (method) {
                case 'GET':
                    app.get.apply(app, args);
                    break;
                case 'POST':
                    app.post.apply(app, args);
                    break;
                case 'PUT':
                    app.put.apply(app, args);
                    break;
                case 'DELETE':
                    app.delete.apply(app, args);
                    break;
                default:
                    throw new Error('Invalid HTTP method specified for route ' + path);
                    break;
            }
        });
    };
};