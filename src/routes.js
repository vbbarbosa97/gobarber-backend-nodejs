import { Router } from 'express'; //importando o Router do express
import multer from 'multer'; //importando o multer
import multerConfig from './config/multer'; //importando as configurações do multer

//CONTROLLERS 
import UserController from './app/controllers/UserController'; //importando o controller
import SessionController from './app/controllers/SessionController'; //importando o controller
import FileController from './app/controllers/FileController'; //importando o controller
import ProviderController from './app/controllers/ProviderController'; //importando o controller
import AppointmentController from './app/controllers/AppointmentController'; //importando o controller
import ScheduleController from './app/controllers/ScheduleController';// importando o conttrller
import NotificationController from './app/controllers/NotificationController'; //importando controller
import AvailableController from './app/controllers/AvailableController'; //importando o controller

import authMiddleware from './app/middlewares/auth'; //importando os middlewares

const routes = new Router(); 
const upload = multer(multerConfig); //instanciando o multer e passando as configurações

routes.post('/users', UserController.store); //passando o método que foi criado no controller
routes.post('/session', SessionController.store); 
routes.get('/session', SessionController.index);  //rota de teste

//ROTAS ABAIXO SÃO AUTENTICADAS
routes.use(authMiddleware); //daqui para baixo todas as rotas vao usar ess middleaware

routes.put('/users',UserController.update); //rota de atualizar os dados do usuario

routes.post('/files', upload.single('file'), FileController.store );//o sigle é de apenas um arquivo por vez

routes.get('/provider', ProviderController.index); //listagem dos usuarios prestadores
routes.get('/provider/:providerId/available', AvailableController.index); //lista oso horarios disponiveis

routes.post('/appointments', AppointmentController.store); //rota de adicionar agendamentos
routes.get('/appointments', AppointmentController.index); //rota de listagem de agendamentos
routes.delete('/appointments/:id', AppointmentController.delete); //rota que deleta um agendamento

routes.get('/schedules', ScheduleController.index); //rota que lista os agendamentos do prestador

routes.get('/notifications', NotificationController.index); //rota que lista as notificações
routes.put('/notifications/:id', NotificationController.update); //rota que marca como lida a notificação

export default routes;