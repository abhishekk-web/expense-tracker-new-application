const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//This function is for checking that user is filling all the form that required or not

function isstringvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

// this is the signup controller

exports.signUp = async (req, res) => {

    try {

        // we are using saltRounds so that we can set our password more critical as we increase our saltRounds
        const saltRounds = 10;

        const {name, email, password}= req.body;

            // here we are calling the function that checks the user filled all the form or not
        
            if(isstringvalid(name) || isstringvalid(email) || isstringvalid(password)){
            return res.status(400).json({err:"Bad parameters, form is not completely filled"});
        }

        // we are finding the user through email first

        const find = await user.findAll({where: {email:email}});
        if(find.length>0){  // here if the user already present then it just sent the response that user already present
            res.status(404).json({success:false, message: "User already exist"});
        }
        else{   // if user is not present here we'll create the user
            bcrypt.hash(password, saltRounds, async(err, hash)=> {  // firstly we our using brcypt here, where took password first then saltrounds

                console.log(err);
                const data = user.create({name: name, email: email, password: hash});   // here we sets our password as hash
                res.status(200).json({success: true, message: "successfully added user", data:data});

            })
        }

    }
    catch(err){ // here we are checking all the errors
        return res.status(500).json({message:err});
    }
    
}

// we are using a function for json web token through that we can encrypt the user id

const  generateAccessToken = (id, name, isPremiumUser) =>{
    return jwt.sign({ userId: id, name: name, isPremiumUser}, 'secrets');
}

// controller for login page

exports.login = async (req, res) => {

    try {

    const {email, password} = req.body;
    
    // here we are calling the function that checks the user filled all the form or not

    if(isstringvalid(email) || isstringvalid(password)){
        return res.status(400).json({err:"Bad parameters, form is not completely filled"});

    }

    // first we check that the user is present in database or not

    const data = await user.findAll({where: {email:email}});
    if(data.length > 0){

        bcrypt.compare(password, data[0].password, (err, response) => { // here we our comparing our hash password using compare function, firstly we need the password that user entered then the user's password that stored on database

            if(err){
                throw new Error("Something went wrong");    // if there's any wrong while comparing the password it will give the error and sends into the catch block

            }
            if(response == true){   
                // throw new Error;            
                return res.status(200).json({success: true, message: "user found successfully", token:generateAccessToken(data[0].id, data[0].name, data[0].isPremiumUser) });
            }
            else{
                return res.status(404).json({success: false, message: "password is incorrect"});    // if the password is incorrect then sends the json response that password is incorrect

            }
        }) 
    }
    else{
        // throw new Error;
        return res.status(400).json({success: false, message: "User not found"});   // if the user not found then it sends the response that the user not found
    }

    }
    catch(err){
        return res.status(500).json({message:err}); // here it catches all the error
    }


}

exports.generateAccessToken = generateAccessToken;