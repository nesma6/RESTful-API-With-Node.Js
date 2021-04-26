const express = require('express');
const courseController = require('../controllers/courseController');
const router = express.Router();


router.get('/api/courses/', courseController.Get_All_Courses);

router.get('/api/courses/:id' , courseController.Get_Course);

router.get('/web/courses/create' , courseController.get_course_create);

router.post('/api/courses/', courseController.addCourse);

router.put('/api/courses/:id', courseController.Updat_course);

router.delete('/api/courses/:id', courseController.Delete_course);

module.exports = {
    routes: router
}