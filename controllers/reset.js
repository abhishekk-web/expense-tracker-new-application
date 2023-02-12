const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const ForgotPasswords = require('../models/reset');

// this is the forgot password, here we got the key that will help us to use that key for reseting the password

exports.forgot = async(req, res) => {

    try{
        const {email} = req.body;
        console.log(email);

        const user = await User.findOne({where: {email}});
        if(user) {
            const id = uuid.v4();
            console.log(id);
            console.log("checking");
            user.createForgotpassword({ id, active: true})
            .catch((err) => {
                console.log("error error error");
                console.log(err);
            })
            console.log("all good");
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            console.log("all not good");
            console.log(user.email);

            const msg = {

                to: user.email,
                from: 'abhi.chatterjee38@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and eady to do anywhere, even with Node.js',
                html: `<a href="http://localhost:3000/password/forgotpassword/${id}">Reset Password</a>`

            }

            const response = await sgMail.send(msg);
            return res.status(response[0].statusCode).json({message: 'link to reset password sent to your email', success: true});

        }

        else{
            console.log('User doesnot exist');
        }

    }
    catch(err) {
        console.log(err);
        return res.status(500).json({success: false});
    }

}

// here we are reseting our password and sending a form where we have to change the password

exports.resets = async (req, res) => {

    try{

        const id = req.params.id;
        const forgotPasswordRequest = await ForgotPasswords.findOne({where: {id}});
        if(forgotPasswordRequest){

            forgotPasswordRequest.update({active: false});
            res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
                </script>
                <div style="height: 100%;">
                <form style="border: 2px solid black; border-radius: 4px; margin-top: 200px;text-align: center;height: 180px;width: 700px; margin-left: 350px;" action="/password/updatepassword/${id}" method="get">
                    <br><br><label style="font-weight: bold" for="newpassword">Enter New password</label><br><br>
                    <input style="width: 300px" name="newpassword" type="password" placeholder="Enter your new password" required></input><br><br>
                    <button>reset password</button>
                </form>
                </div>
        </html>`)

        res.send();
            
        }

    }
    catch(err) {
        console.log(err);
    }

}


// here we are updating our password

exports.update = async(req, res) => {

    try {

        const {newpassword} = req.query;
        console.log(newpassword);
        const {id} = req.params;
        console.log(id);
        const resetPasswordRequests =  await ForgotPasswords.findOne({where: {id: id}});
        console.log(resetPasswordRequests);
        const user = await User.findOne({where: {id: resetPasswordRequests.userId}});
        console.log(user);
        if(user) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) =>{
                if(err){
                    console.log(err);
                }
                bcrypt.hash(newpassword, salt, async function(err, hash) {

                    try {

                    if(err) {
                        console.log(err);
                    }
                    await user.update({password: hash});
                    res.status(200).json({success: true, message: "successfully updated the new password"});
                
                }
                
                catch(err) {
                    throw new Error;
                }
                
                })
            })
        }
        else {
            return res.status(404).json({error: 'No user Exists', success: false});
        }

    }

    catch(err) {
        console.log(err);
    }

}