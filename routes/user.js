const User = require('../models/User');
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require('./verifyToken');

const router = require('express').Router()

//update user
router.put('/:id', verifyTokenAuthorization, async (req,res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt
        (req.body.password, process.env.SEC_PASS)
        .toString()
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})  

//delete user
router.delete("/:id", verifyTokenAuthorization, async (req,res) =>{ 
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('deleted')
    }
    catch(err){
        res.status(500).json(err)
    }
})

//get user(only for admin)
router.get("/", verifyTokenAdmin, async (req,res) =>{ 
    const query = req.query.new
    try{
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : 
        await Users.find()
        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//get user stats
router.get('/stats', verifyTokenAdmin, async(req,res)=> {
    const date = new Date();
    const lastYear = newDate(date.setFullYear(date.getFullYear() - 1))
    try{
        const data  = await User.aggregate([
            { $match: { createdAt: { $gta: lastYear}}},
            {
                $project: {
                    month: { $month: '$createdAt'}
                }
            },
            {
                $group: {
                _id: '$month',
                total: { $sum: 1}
            },
            }
        ])
    res.status(200).json(data)
    }
    catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;