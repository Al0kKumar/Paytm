const express = require('express');
const { z } = require('zod');
const User = require('../dbSchema/user.js');
const Account = require('../dbSchema/account.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authmiddleware = require('../middlewares/JWT.js');


const router = express.Router()

const signupSchema = z.object({
    username: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string().min(6),
    email: z.string().email()
})

const loginSchema = z.object({
    username: z.string(),   
    password: z.string()
})  

const updateSchema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    password: z.string().optional()
})

router.post('/signup',async (req,res) => {

    const parsedResult = signupSchema.safeParse(req.body);
    
    if(!parsedResult.success){
       return  res.status(400).json({
            msg:"fill all credentials"
        })
    }

    const {email , username,firstname ,lastname ,password  } = req.body;

   const exists = await User.findOne({
    $or:[{email },{ username}]
   })

   if(exists){
    return  res.status(400).json({
        msg:"user already exists"
    })
    
   }

   const hashedPassword = await bcrypt.hash(password,10);

   const user = await User.create({
    username,
    firstname,
    lastname,
    password: hashedPassword,
    email
   })


   await Account.create({
    userId: user._id,
    balance: 0 
   })

  return  res.status(201).json({
    msg:"User created successfully"
   })

});

router.post('/login', async (req,res) => {

    const isValid = loginSchema.safeParse(req.body);

    if(!isValid.success){
      return  res.status(400).json({
            msg:"Invalid user input"
        })
    }

    const { username, password } = req.body;


    const user = await User.findOne({username})
     
    if(!user){
        return res.status(401).json({
            msg:"User doesn't exist "
        })
    }


    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            msg:"Incorrect Password"
        })
    }

    const payload = {
        id: user._id,
        username: user.username
    };

    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            msg: "User Logged in successfully",
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            msg:"Error genrating token",
            error:error.messgae
        })  
    }
})

router.put('/update',authmiddleware,async (req,res) => {
    
    const right = updateSchema.safeParse(req.body);

    if(!right.success){
        return res.status(400).json({
            msg:"fill to kr bhai update"
        })
    }
     
    const Userid = req.user_id;
    
    console.log("User ID:", Userid);
    console.log("Data to update:", right.data);

    const result  = await User.updateOne(
        { _id: Userid },
        { $set: right.data }
    )

    console.log("Update result:", result);

    if(result.nModified === 0){
        return res.status(404).json({
            msg:"User not found or no changes made"
        })
    }

    return res.status(201).json({
        msg: "Update made successfully"
    })
   
})

router.get('/filtername',async(req,res) => {
    
    const filter = req.query.filter || "";

    let users ;

    if(filter){

     users = await User.find({
        $or: [
            {firstname:{$regex: filter , $options: 'i'}},
            {lastname: {$regex: filter , $options: 'i'}}
        ]
    })
}  
else{
    users = await User.find().select('-password');
}

    
    return res.status(200).json({
        user : users.map(user => ({
            username : user.username,
            firstname : user.firstname,
            lastname : user.lastname,
            _id : user.id
        }))
    })
     
})

router.get('/allusers',authmiddleware, async (req,res) => {
    
    const users = await User.find().select('-password');

    return res.status(200).json(users);

})

module.exports = router;