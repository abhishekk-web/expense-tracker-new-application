const user = require('../models/user');

exports.signUp = async (req, res) => {

    try {

        const {name, email, password}= req.body;
        console.log(name);

        const find = await user.findAll({where: {email:email}});
        console.log(find);
        if(find.length>0){
            console.log("user already exist");
            // res.status(404).json({success:false, message: "User already exist"});
        }
        else{
            const data = user.create({name: name, email: email, password: password});
            res.status(200).json({success: true, message: "successfully added user", data:data});
        }

    }
    catch(err){
        console.log(err);
    }
    
}