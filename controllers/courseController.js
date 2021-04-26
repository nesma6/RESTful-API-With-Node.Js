const firebase = require('../db');
const Course = require('../models/course');
const Joi = require('joi');
const path = require('path');
const firestore = firebase.firestore();



function ValidationToErrorCourses(body) {
    var reg = /^[a-zA-Z]{3}[0-9]{3}$/;
    const schema = Joi.object({
        "name": Joi.string().min(5).required(),
        "code": Joi.string().regex(reg).required(),
        "description": Joi.string().max(200).allow(null, '')
    });
    return schema.validate(body);
}



const Get_All_Courses = async(req,res)=>{
    try {
        const courses = await firestore.collection('courses');
        const data = await courses.get();
        const coursesArray = [];
        if(data.empty) {
            res.status(404).send('No course record found');
        }else {
            data.forEach(doc => {
                const course = new Course(
                    doc.id,
                    doc.data().name,
                    doc.data().code,
                    doc.data().description
                );
                coursesArray.push(course);
            });
            res.send(coursesArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const Get_Course = async (req,res)=>{
    try {
        const id = req.params.id;
        const course = await firestore.collection('courses').doc(id);
        const data = await course.get();
        if(!data.exists) {
            res.status(404).send('course with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const get_course_create = (req, res) => {
    let reqPath = path.join(__dirname, '../website');
    res.sendFile('course.html', { root: reqPath });
}

const post_course_create = (req, res) => {
    console.log(req.body)
    const { error } = ValidationToErrorCourses(req.body);
    console.log(error);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const course = { id: courses.length + 1,
         name: req.body.name,
         code:req.body.code,
         description:req.body.description
        };
    courses.push(course);
    res.send(course);

}


const addCourse = async(req,res)=>{
    const result = ValidationToErrorCourses(req.body);
    console.log(result);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    try {
        const data = req.body;
        await firestore.collection('courses').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const Updat_course = async(req,res)=>{
    const result = ValidationToErrorCourses(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    try {
        const id = req.params.id;
        const data = req.body;
        const course =  await firestore.collection('courses').doc(id);
        await course.update(data);
        res.send('course record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const Delete_course = async(req,res)=>{
    try {
        const id = req.params.id;
        await firestore.collection('courses').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    Get_All_Courses,
    Get_Course,
    get_course_create,
    post_course_create,
    addCourse,
    Updat_course,
    Delete_course
}