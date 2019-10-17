import Notification from '../schemas/Notification'; //importando o schema da notificação
import User from '../models/User'; //importando o medel de usuario

class NotificationController {

    //LISTA AS NOTIFICAÇÕES DO PRESTADOR LOGADO
    async index(req,res){

        //confirmando se o usuario é prestador
        const checkIsProvider = await User.findOne({
            where: {id: req.userId, provider: true},
        });
        if(!checkIsProvider){
            return res
            .status(401)
            .json({ error: 'Usuário não é prestador!' });
        }

        //trazendo do banco MONGO as notificações
        const notifications = await Notification
        .find({
            user: req.userId, //ja passa o filtro sem where
        })
        .sort({createdAt: 'desc'}) //sort diz qual deve ser a ordenação
        .limit(20); //limit que vai trazer por pesquisa

        return res.json(notifications);
    }

    //MARCA AS NOTIFCAÇÕES COMO LIDAS
    async update(req,res){

        //busca a notifcação e ja da o update
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, //pegando o id da url
            { read: true }, //seto esse campo como true
            { new: true }, //retorna a notificação  atualizada
        );

        return res.json(notification);
    }
}

export default new NotificationController;