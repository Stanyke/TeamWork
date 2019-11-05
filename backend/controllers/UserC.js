const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');
//encrypt my password with bcrypt ---> npm install --save bcrypt


export async function createUser(req, res)
{
    try
    {
        let checkdata = await User.findOne({where:{email:req.body.email}});
        console.log(checkdata);
        
        if(checkdata){
            res.json({
                message:"Already Exist",
                data:checkdata
            });
        }
        else
        {
            bcrypt.hash(req.body.password, 10).then(
            (hash) => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save().then(
                    () => {
                        res.status(201).json({
                            message: 'User added successfully!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        });
                    }
                );
            });
        }
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({
            success: false,
            message:"Something went wrong!"
        });
    }


export async function createUser(req, res) {
    try{
        let checkdata = await User.findOne({where:{email:req.body.email}});
        console.log(checkdata);
        if(checkdata){
            res.json({
                message:"Already Exist",
                data:checkdata
            });
        }
        else
        {
            bcrypt.hash(req.body.password, 10).then(
                (hash) => 
                {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });

                    let createdata = await User.create(req.body, {
                        fields: ['name', 'email', 'password', 'phone', 'profile_pic']
                    });
                    if(createdata){
                        res.status(201).json({
                            success: true,
                            message: "User Created Successfully",
                            data: createdata
                        });
                    }
                }
            );
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            success: false,
            message:"Something went wrong!"
        })
    }
}