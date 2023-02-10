const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async (req, res, next) => {

    try {

        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, "secrets");
        console.log(user);
        const users = await User.findByPk(user.userId);
        console.log(users);
            
        req.user = users;
        next();
        

    }
    catch(err){
        console.log(err);
    }

}