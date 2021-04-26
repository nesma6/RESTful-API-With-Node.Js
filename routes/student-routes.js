const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

router.get('/api/students/', studentController.Get_All_Students);

router.get('/api/students/:id' , studentController.Get_Student);

router.get('/web/students/create' , studentController.get_create_student);

router.post('/api/students/', studentController.add_Student);

router.put('/api/students/:id', studentController.Updat_student);

router.delete('/api/students/:id', studentController.Delete_student);

module.exports = {
    routes: router
}
