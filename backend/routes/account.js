const express = require('express');
const { z } = require('zod');
const User = require('../dbSchema/user.js');
const Account = require('../dbSchema/account.js');
const authmiddleware = require('../middlewares/JWT.js');
const mongoose = require('mongoose');

const router = express.Router()

router.get('/balance', authmiddleware, async (req,res) => {
     
    //as from auth i willbe geting all the defined fields
    // of my user in req.user & then to get specific 
    //details of user we can do stuff like (req.user.id, req.user.username)  
    //this much only coz we defined these 2 fields only in the jwt payload
    const account = await Account.findOne({ userId: req.user.id });
 
    return res.status(201).json({
        balance : account.balance 
    });
})

// const transferSchema = z.object({ 
//     amount: z.number(),
//     to: z.string()
// })


router.post('/transfer', authmiddleware , async (req,res) => {

   
    const {amount, to} = req.body;

    if(!amount || !to){
        return res.status(400).json({
            msg:"Amount or recipent missing"
        })
    }
    
    if(!mongoose.Types.ObjectId.isValid(to)){
       return res.status(400).json({
        msg:"Invalid recipent "
       })
    }

    const session = await mongoose.startSession();
    
     
    try {
        session.startTransaction();
        
        
        
        const sender = await Account.findOne({userId : req.user.id}).session(session);
     //   const senderAccount = sender.userId;
    
        if(!sender || sender.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                msg:"Insufficient balance "
            })
        }
    
        const Recipent = await Account.findOne({userId: to}).session(session);
    
        if(!Recipent){
            await session.abortTransaction();
            return res.status(400).json({
                msg:"User doesn't exist"
            })
        }

       
      await  Account.updateOne(
            {userId : sender.userId},
            {$inc: {balance: -amount}},
            {session}
        );

      await Account.updateOne(
            {userId: to},
            {$inc : {balance: amount}},
            {session}
        );

        //commit the transfer 
        await session.commitTransaction();

        
        return res.json({
        msg: "Transfer succesful"
       });
    
    } catch (error) {

        await session.abortTransaction();
        return res.status(400).json({
            msg: error.message
        });
    }   finally{
        session.endSession();
    }

});


module.exports = router ;