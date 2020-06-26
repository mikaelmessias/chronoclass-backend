import express from 'express';
import PeriodController from './controllers/PeriodController';
import TeacherController from './controllers/TeacherController';
import UserController from './controllers/UserController';
// import multer from 'multer';
// import multerConfig from './utils/multer';

const userController = new UserController();
const periodController = new PeriodController();
const teacherController = new TeacherController();

const routes = express.Router();
// const upload = multer(multerConfig);

routes.get('/users', userController.index);
routes.get('/user/:userId', userController.show);
routes.post('/user', userController.store);
// routes.post('/', upload.single('image'), route);

routes.get('/periods', periodController.index);
routes.post('/periods', periodController.populate);

routes.post('/teacher', teacherController.store);

export default routes;
