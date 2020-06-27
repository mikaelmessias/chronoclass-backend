import express from 'express';
import CourseController from './controllers/CourseController';
import PeriodController from './controllers/PeriodController';
import TeacherController from './controllers/TeacherController';
import UserController from './controllers/UserController';

// import multer from 'multer';
// import multerConfig from './utils/multer';

const userController = new UserController();
const periodController = new PeriodController();
const teacherController = new TeacherController();
const courseController = new CourseController();

const routes = express.Router();
// const upload = multer(multerConfig);

routes.post('/user', userController.store);
routes.get('/users', userController.index);
routes.get('/user/:userId', userController.show);
// routes.post('/', upload.single('image'), route);

routes.post('/periods', periodController.populate);
routes.get('/periods', periodController.index);

routes.post('/teacher', teacherController.store);
routes.get('/teachers', teacherController.index);
routes.get('/teacher/:teacherId', teacherController.show);

routes.post('/course', courseController.store);
routes.get('/courses', courseController.index);
routes.get('/course/:courseId', courseController.show);
routes.put('/course/:courseId', courseController.update);

export default routes;
