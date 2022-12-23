const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')

const router = express.Router()

const courseSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
    }
})

const Course = mongoose.model('Course', courseSchema)



// const courses = [
//     {id: 1, name: 'course_1'},
//     {id: 2, name: 'course_2'},
//     {id: 3, name: 'course_3'},
//     {id: 4, name: 'course_4'},
//     {id: 5, name: 'course_5'},
// ]


// For Validation 
function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(course)
}

// Routes for courses API
router.get('/', async (req, res)=>{
    const courses = await Course
                          .find()
                          .sort('name')
    res.send(courses)
})

router.get('/:name', async (req, res)=>{
    // parseInt(req.params.name)
    const course = await Course.find({name: req.params.name})
    // Resource Not Found
    if(!course) return res.status(404).send('The course with the given ID was not Found')
    res.send(course)
})

router.post('/', async (req, res) =>{
    const {error} = validateCourse(req.body)

    if(error){

       const {details} = error
        // 400 Bad request
        return res.status(400).send(details[0].message)
    }
    let course = new Course({ name: req.body.name })
    course = await course.save()
    res.send(course)
})

router.put('/:id', async (req, res)=>{
    const {error} = validateCourse(req.body)
    if(error){
        const {details} = error
         // 400 Bad request
         return res.status(400).send(details[0].message)
     }
    try{
        const course = await Course.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new:true})
        res.send(course) 
    }
    catch(error){
        // 404 Resource Not Found
        res.status(404).send(`The course with the given ID was not Found ${error.message}`)
        
    }
        
})


router.delete('/:id', async (req, res) =>{
    try{
        const course = await Course.findByIdAndRemove(req.params.id)
        if(!course) return res.status(404).send('The course with the given ID was not Found')
        res.send(course)
    }
    catch(error){
        res.status(404).send(`The course with the given ID was not Found \n ${error.message}`)
    }
    // Resource Not Found

})


module.exports = router

