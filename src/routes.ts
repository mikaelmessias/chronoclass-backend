import express from 'express';
import UserController from './controllers/User';
// import multer from 'multer';
// import multerConfig from './utils/multer';

const userController = new UserController();

const routes = express.Router();
// const upload = multer(multerConfig);

routes.get('/users', userController.index);
routes.get('/user/:userId', userController.show);
routes.post('/user', userController.store);
// routes.post('/', upload.single('image'), route);

export default routes;
