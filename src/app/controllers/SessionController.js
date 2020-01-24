import jwt from 'jsonwebtoken'; //importando o jwt
import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth'; //importando as configuracoes no auth

class SessionController {

    //LOGA O USUARIO NA APLICAÇÃO GERANDO UM TOKEN UNICO
    async store(req,res) {

        const { email, password } = req.body; //pegando o email e senha do body

        //verifica se existe o usuario pelo email dele
        const user = await User.findOne({ 
            where: {email},
            include: [
                {
                    model:File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url'],
                }
            ]
        }); //procurando o email que foi passado no body
        
        if(!user){
            return res.status(401).json({ error: 'Usuário não existe' });
        }

        //verifica se a senha existe 
        if(!(await user.checkPassword(password)) ){
            return res.status(401).json({ error: 'Senha invalida!' });
        }

        const { id, name, avatar, provider } = user;

        return res.json({
            user: {
                id,
                name,
                email,
                provider,
                avatar,
            },
            //gerando um token 
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn, //tempo que vai expirar, setado na pasta config
            }),
        });
    }

    async index(req,res) {
        return res.status(200).json({success: 'Conectado'});
    }
}

export default new SessionController;