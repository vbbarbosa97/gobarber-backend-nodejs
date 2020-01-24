import {format, parseISO } from 'date-fns'; //importando o format do date-fns
import pt from 'date-fns/locale/pt'; //importando o pt do date-fns
import Mail from '../../lib/Mail';//importando a lib de mail

class CancellationMail {

    //permite chamar o key quando importar o CancellationMail
    get key(){
        return 'CancellationMail'; //é uma chave unica
    }

    //aqui que processa cada requisição de envio do email
    async handle({ data }){

        //desestruturando o data que foi passado
        const {appointment} = data;

        //confirmação do envio no console
        console.log('A fila executou');

        //corpo que vai ser enviado a o email
        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: {
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format( 
                    parseISO(appointment.date),
                    " dd 'de' MMMM', às' HH:mm'h' ", 
                    {
                        locale: pt,
                    }
                ),
            },
        });
    }
}

export default new CancellationMail();