module.exports=function(options){

    var authenticate = function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            if(token != options.token) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                    // if everything is good, save to request for use in other routes
                    req.token = token;
                    next();
            }

        } else {
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    };

    return {
        authenticate: authenticate
    }
};