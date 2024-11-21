// backend/routes/student.route.js

const express = require('express');
const router = express.Router();
const cors=require('cors');
const Student = require('../models/Student'); // Student Model

router.post('/students',cors(), async (req, res, next) => {
    try {
        const data = await Student.create(req.body);
        console.log(data);
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// READ Students
router.get('/',cors(), async (req, res, next) => {
    try {
        const data = await Student.find();
        res.json(data);
    } catch (error) {
        return next(error);
    }
});

// UPDATE Student
router.route('/students/:id')
    // Get Single Student
    .get(cors(),async (req, res, next) => {
        try {
            const data = await Student.findById(req.params.id);
            res.json(data);
        } catch (error) {
            return next(error);
        }
    })
    // Update Student Data
    .put(cors(), async (req, res, next) => {
        try {
            const data = await Student.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.json(data);
            console.log("Student updated successfully!");
        } catch (error) {
            return next(error);
        }
    });


// DELETE Student
router.delete('/students/:id',cors(), async (req, res, next) => {
    try {
        const data = await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({
            msg: data,
        });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
