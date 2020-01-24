import * as Yup from 'yup'; //importando o yup
import {
startOfHour,
parseISO, 
isBefore, 
format, 
subHours
} from 'date-fns'; //importando a biblioteca que trabalha com as datas

import Notification from '../schemas/Notification'; //importando o schema de notificação do mongo

//import CancellationMail from '../jobs/CancellationMail'; //importando o cancellationMail
//import Queue from '../../lib/Queue'; //importando  a lib de queue que é uma fila

//MODELS
import Appointment from '../models/Appointment'; //importando o model appointment
import User from '../models/User';
import File from '../models/File';

class AppointmentController{

    //LISTA OS AGENDAMENTOS
    async index(req,res){

        //configurando a page
        const { page = 1 } = req.query;

        //listando os agendamentos que o cliente fez
        const appointments = await Appointment.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
            order: ['date'], //ordena pela data
            attributes: ['id','date','past','cancelable'],
            limit: 20, //informo a quantidade de registros por vez
            offset: (page - 1) * 20, //se estiver na page = 2 vai pular 20 e listar os 20 proximos

            //incluindo os dados do prestador
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],

                    //incluindo o avatar do prestador
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id','path', 'url']
                        }
                    ]
                },
            ],
        });

        return res.json(appointments);
    }

    //CRIA UM AGENDAMENTO
    async store(req, res){

        //define o formato dos dados de entrada do body
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required()
        });

        //valida se o formato foi obedecido
        if(!(await schema.isValid(req.body)) ){
            return res
            .status(400)
            .json({ error: 'Erro na Validação!' });
        }

        //pegando os dados do body
        const {provider_id, date} = req.body;

        //buscando o prestador na base de dados
        const checkIsProvider = await User.findOne({
            where: {id: provider_id, provider: true },
        });

        //verificando se foi encontrado
        if(!checkIsProvider){
            return res
            .status(401)
            .json({ error: 'Voce não pode criar um agendamento sem um prestador!' });
        }


        //o parseISO transforma a date em um formato javascript para utilizar no startOfHour
        //o startOfHour pega apenas a hora que foi passada e zera os minutos e segundos
        const hourStart = startOfHour( parseISO(date) );

        //verifica se a data digitada é anterior a data atual
        if( isBefore(hourStart, new Date()) ){
            return res
            .status(400)
            .json({ error: 'Data informada é anterior a data atual!' });
        }

        //buscando se tem algum agendamento do prestador na mesma data
        const checkAvailability = await Appointment.findOne({
            where:{
                provider_id, //id do prestador
                canceled_at: null, //se não esta cancelado
                date: hourStart,
            },
        });

        //verifia se retornou algum agendamento 
        if( checkAvailability ){
            return res
            .status(400)
            .json({ error: 'Ja existe um agendamento para esta mesma data!' });
        }

        //salva no banco
        const appointment = await Appointment.create({
           user_id: req.userId,
           provider_id,
           date, 
        });

        //trazendo os dados do usuario que fez o agendamento
        const user = await User.findByPk(req.userId);

        //formatando a data
        //o format permite formatar as datas
        const formattedDate = format(
            hourStart, //passo a data que quero formatar
            " 'dia' dd 'de' MMMM 'às' hh':'mm ", //o que esta dentro de aspas simples é texto
        );

        //NOTIFICANDO O PRESTADOR QUE FOI FEITO UM AGENDAMENTO
        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
        });

        return res.json(appointment);
    }

    //CANCELA UM AGENDAMENTO
    async delete(req,res){

        //pegando o agendamento do banco de dados e os dados do prestador
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name','email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                }
            ],
        }); //trazendo o id da url


        //verificando se o usuario que esta excluindo é igual ao que abriu o agendamento
        if(appointment.user_id != req.userId){
            return res
            .status(401)
            .json({ error: 'Usuário não possui permissão para excluir esse agendamento!' });
        }

        //diminui em duas horas a hora que esta no banco de dados
        //o subHours diminui a hora passada
        const dateWithSub = subHours(appointment.date, 2);

        //verifica se a hora que o usuario esta tentando deletar é igual as duas horas a menos que o agendamento
        if(isBefore( dateWithSub, new Date() ) ){
            return res
            .status(401)
            .json({ error: 'Horário de cancelamento expirou!' });
        }

        //seto a data de cancelamento
        appointment.canceled_at = new Date();

        await appointment.save(); //salvo no banco

        //envia o email notificando o prestador do cancelamento
        //chama o método que adiciona um email  na fila
        /* 
        await Queue.add(CancellationMail.key, {
            appointment, //passando os dados do appointment para o método
        });
        */

        return res.json(appointment);
    }
}

export default new AppointmentController;