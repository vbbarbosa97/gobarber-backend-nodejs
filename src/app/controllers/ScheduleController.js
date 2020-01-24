import User from '../models/User'; //importando o modeluser
import Appointment from '../models/Appointment'; //importando o model Appointment
import {startOfDay, endOfDay, parseISO} from 'date-fns'; //importando a biblioteca date-fns
import {Op} from 'sequelize'; //importando o Op do sequelize

class ScheduleController {
    
    //RETORNA OS AGENDAMENTOS QUE O PRESTADOR TEM NO DIA
    async index(req, res){
        
        //verificando se o usuario logado é prestador
        const checkIsProvider = await User.findOne({
            where:{id: req.userId, provider: true},
        });
        if(!checkIsProvider){
            return res
            .status(401)
            .json({ error: 'Usuário não é prestador!' });
        }

        //pegando a data passada
        const {date} = req.query;

        //transformando a date passada na query
        const parseDate = parseISO(date);

        //trazendo os agendamentos da data que foi passada
        const appointments = await Appointment.findAll({
            where:{
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
                },
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                }
            ],
            order: ['date'],
        });

        return res.json(appointments);
    }
}

export default new ScheduleController();