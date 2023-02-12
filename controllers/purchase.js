const Purchase = require('../models/purchase');
const Razorpay = require('razorpay');
const userController = require("../controllers/user");

exports.purchase = async(req, res) => {

    try {

        var razorpay = new Razorpay({

            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const amount = 2500;
        console.log(amount);
        razorpay.orders.create({amount, currency: "INR"}, async(err, order)=> {  

            try {

                if(err){
                    console.log(err);
                }
                const userId = req.user.id;
                const status = await Purchase.create({orderId: order.id, status: "Pending", userId: userId});
                // console.log(status);
                res.status(200).json({success: true, order, key_id: razorpay.key_id});

            }
            catch(err){
                console.log(err);
            }

        })

    }
    catch(err){
        console.log(err);
    }

}

exports.update = async(req, res) => {

    try{

        const userId = req.user.id;
        const {order_id, payment_id} = req.body;
        const purchase = await Purchase.findOne({where: {orderid: order_id}})
        const promise1 = await purchase.update({paymentId: payment_id, status: "Successful"});
        const promise2 = await req.user.update({isPremiumUser: true});
        Promise.all([promise1, promise2]).then(()=> {
            return res.status(200).json({success: true, message: "Transaction successful", token:userController.generateAccessToken(userId, undefined, true)}) // here we are updating the token
        })

    }
    catch(err){
        console.log(err);
    }

}