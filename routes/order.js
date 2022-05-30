const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { verifyTokenAdmin, verifyToken, verifyTokenAuthorization } = require('./verifyToken');
const router = require('express').Router()

router.post('/', async (req,res) => {
    const newOrder = new Order(req.body)
    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.put('/:id', verifyTokenAdmin, async (req, res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true}
        )
        res.status(200).json(updatedOrder)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.delete('/:id', verifyTokenAdmin, async(req,res) => {
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('delivered')
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.get('/find/:id', verifyTokenAuthorization, async(req,res) => {
    try{
        const order = await Order.findOne({ userId: req.params.id}) 
        res.status(200).json(order)
    }
    catch(err){
        res.status.json(err)
    }
})

router.get('/', verifyTokenAdmin, async (req, res)=> {
    try{
        const orders = await Order.find();
        res.status(200).json(orders)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.get('/income', verifyTokenAdmin, async(req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const prevMonth = newDate(new Date().setMonth(lastMonth.getMonth() - 1))
    try{
        const income = await Order.aggregate([
            { $match: {createdAt: {$gte: prevMonth}}},
            {
                $project: {
                    month: {$month: '$createdAt'}
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: {$sum: '$sales'}
                }
            }
            
        ]);
        res.status(200).json(income)
    }
    catch(err){
        res.status(500).json(err)
    }
})
module.exports = router;