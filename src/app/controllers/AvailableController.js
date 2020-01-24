import 
{
    startOfDay,
    endOfDay,
    setHours,
    setMinutes,
    setSeconds,
    format,
    isAfter

} from 'date-fns'; //importando o date-fns

import {Op} from 'sequelize'; //importando o Op do sequelize
import Appointment from '../models/Appointment'; //importando model de appointment



class AvailableController {

    //LISTA TODOS HORARIOS DISPONIVEIS DO PRESTADOR INFORMADO
    async index(req, res){

        //pegando a date passada na query
        const { date } = req.query;

        //verifica se a data existe
        if(!date){
            return res
            .status(400)
            .json({ error: 'Data Invalida!' });
        }

        //transformando a data em um numero inteiro
        const searchDate = Number(date);

        //trazendo do banco de dados
        const appointment = await Appointment.findAll({
            where: {
                provider_id: req.params.providerId, //vem da url
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
                },
            },
        });

        //array com os horarios 
        const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
        ];

        //percorrendo o vetor schedule
        //o time recebe cada item do vetor 
        const available = schedule.map(time => {

            //o split separa entre os ':' e hour vai receber as horas e minute recebe os minutos
            const [hour, minute] = time.split(':');

            //setando a data no valor padrão para comparação
            //o value fica no formato de data  ex: 2018-06-23 08:00 todos os values vao ficar nesse formato
            const value = setSeconds( setMinutes( setHours(searchDate, hour), minute), 0);

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                available: 
                    //verifica se o horario é depois do momento da consulta E
                    //verifica se não foi encontrado no banco 
                    isAfter(value, new Date()) &&
                    !appointment.find(a => 
                        format(a.date, "HH:mm") == time
                    )
            };

        });

        return res.json(available);
    }
}

export default new AvailableController();