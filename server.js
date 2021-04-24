const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const courses = [
    {id:1 , name:'course1', code:'CSE129', description:'course nesma'},
    {id:2 , name:'course2' ,code:'CSE130', description:'course manal'},
    {id:3 , name:'course3' ,code:'CSE130', description:'course nedo'}
];

const students = [
    {id:1 , name:'nesma', code:'1601579'},
    {id:2 , name:'manal' ,code:'1601449'},
    {id:3 , name:'nedo' ,code:'1601655'}
];


function ValidationToErrorCourses(body) {
    var reg = /^[a-zA-Z]{3}[0-9]{3}$/;
    const schema = Joi.object({
        "name": Joi.string().min(5).required(),
        "code": Joi.string().regex(reg).required(),
        "description": Joi.string().max(200).allow(null, '')
    });
    return schema.validate(body);
}

function ValidationToErrorStudents(body) {
    var reg = /^([a-zA-Z]||'||-)*$/;
    const schema = Joi.object({
        "name": Joi.string().regex(reg).required(),
        "code": Joi.string().length(7).required()
    });
    return schema.validate(body);
}

//home page
app.get('/', (req,res)=>{
    res.send("Hello to my site");
});
//course intity
app.get('/api/courses/', (req,res)=>{
    res.send(courses);
});

app.get('/api/courses/:id', (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("the course id is not valid");
        return;
    }
    res.send(course);
});

app.get('/web/courses/create', (req,res)=>{
    res.sendFile('website/course.html', { root: __dirname });
});



app.post('/api/courses/', (req,res)=>{
    const result = ValidationToErrorCourses(req.body);
    console.log(result);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length +1,
        name: req.body.name,
        code: req.body.code,
        description: req.body.description
    };
    courses.push(course);
    res.send(JSON.stringify(course));
});

app.put('/api/courses/:id', (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("the course id is not valid");
        return;
    }

    const result = ValidationToErrorCourses(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});

app.delete('/api/courses/:id', (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("the course id is not valid");
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
});


//student intity

app.get('/api/students/', (req,res)=>{
    res.send(students);
});

app.get('/api/students/:id', (req,res)=>{
    const student = students.find(c => c.id === parseInt(req.params.id));
    if(!student){
        res.status(404).send("the course id is not valid");
        return;
    }
    res.send(student);
});

app.get('/web/students/create', (req,res)=>{
    res.sendFile('website/student.html', { root: __dirname });
});


app.post('/api/students/', (req,res)=>{
    const result = ValidationToErrorStudents(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const student = {
        id: students.length +1,
        name: req.body.name,
        code: req.body.code
    };
    students.push(student);
    res.send(student);
});

app.put('/api/students/:id', (req,res)=>{
    const student = students.find(c => c.id === parseInt(req.params.id));
    if(!student){
        res.status(404).send("the student id is not valid");
        return;
    }
    const result = ValidationToErrorStudents(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);

});

app.delete('/api/students/:id', (req,res)=>{
    const student = students.find(c => c.id === parseInt(req.params.id));
    if(!student){
        res.status(404).send("the student id is not valid");
        return;
    }
    const index = students.indexOf(student);
    students.splice(index,1);
    res.send(student);
});


//Run the server
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`server running on port ${port}...`);
});