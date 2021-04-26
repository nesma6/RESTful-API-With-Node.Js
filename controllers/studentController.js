const firebase = require('../db');
const Student = require('../models/student');
const Joi = require('joi');
const path = require('path');
const firestore = firebase.firestore();



// const students = [
//     {id:1 , name:'nesma', code:'1601579'},
//     {id:2 , name:'manal' ,code:'1601449'},
//     {id:3 , name:'nedo' ,code:'1601655'}
// ];


function ValidationToErrorStudents(body) {
    var reg = /^([a-zA-Z]||'||-)*$/;
    const schema = Joi.object({
        "name": Joi.string().regex(reg).required(),
        "code": Joi.string().length(7).required()
    });
    return schema.validate(body);
}


const Get_All_Students = async (req,res)=>{
    try {
        const students = await firestore.collection('students');
        const data = await students.get();
        const studentsArray = [];
        if(data.empty) {
            res.status(404).send('No student record found');
        }else {
            data.forEach(doc => {
                const student = new Student(
                    doc.id,
                    doc.data().name,
                    doc.data().code
                );
                studentsArray.push(student);
            });
            res.send(studentsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const Get_Student = async(req,res)=>{
    try {
        const id = req.params.id;
        const student = await firestore.collection('students').doc(id);
        const data = await student.get();
        if(!data.exists) {
            res.status(404).send('Student with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const get_create_student = (req,res)=>{
    let reqPath = path.join(__dirname, '../website');
    res.sendFile('student.html', { root: reqPath })
}

const post_create_student = (req, res) => {
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

const add_Student = async (req,res)=>{
    const result = ValidationToErrorStudents(req.body);
    console.log(result);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    try {
        const data = req.body;
        await firestore.collection('students').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
    // const student = {
    //     id: students.length +1,
    //     name: req.body.name,
    //     code: req.body.code,
    // };
    // students.push(student);
    // res.send(student);
}

const Updat_student = async(req,res)=>{
    const result = ValidationToErrorStudents(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    try {
        const id = req.params.id;
        const data = req.body;
        const student =  await firestore.collection('students').doc(id);
        await student.update(data);
        res.send('Student record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const Delete_student = async(req,res)=>{
    try {
        const id = req.params.id;
        await firestore.collection('students').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    Get_All_Students,
    Get_Student,
    get_create_student,
    post_create_student,
    add_Student,
    Updat_student,
    Delete_student
}