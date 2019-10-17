import * as Yup from 'yup'; //importando o yup 
import User from '../models/User';

class UserController {

    //CRIA UM USUARIO 
    async store(req, res){

        //informando o formato que os dados devem ser inseridos
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });
       
        //vai verificar se os dados no body seguiram o schema
        if( !(await schema.isValid(req.body)) ){
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        //verificando se ja exite usuario com o email passado no body
        const userExists = await User.findOne({ where:{ email: req.body.email } }); 

        if(userExists){
            return res.status(400).json({ error: 'Usuario ja existe!' });
        }
       
        //const user = await User.create(req.body); //posso utilizar todos os dados que vem do body
        const { id, name, email, provider } = await User.create(req.body); //retorna apenas o que foi passado

        return res.json({
            id,
            name,
            email,
            provider
        });
    }

    //ATUALIZA OS DADOS DO USUARIO
    async update(req, res){

        //informando o formato que os dados devem ser inseridos
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                //o when e uma condição para requerer o password
                //só vai requirir o password se tiver digitado algo no oldPassword
                .when('oldPassword',(oldPassword, field) =>
                    oldPassword ? field.required() : field //o field representa o password
                ),
            //campo de confirmação deve ser iguala o password
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });
       
        //vai verificar se os dados no body seguiram o schema
        if( !(await schema.isValid(req.body)) ){
            return res.status(400).json({ error: 'Falha na Validação' });
        }

        //console.log(req.userId); //o userId foi passado para o req na autenticaçao da rota

        const { email, oldPassword } = req.body; //recebendo do body

        const user = await User.findByPk(req.userId); //trazendo o usuario pelo id

        //se o email no body for diferente do email do banco
        if( email != user.email ){

            //verificando se ja exite usuario com o email passado no body
            const userExists = await User.findOne({ where:{ email } }); 
            if(userExists){
                return res.status(400).json({ error: 'Usuario ja existe!' });
            }
        }

        //verifica se digitou a senha antiga corretamente
        //vai fazer a verrificação se a senha antiga for digitada
        if(oldPassword && !(await user.checkPassword(oldPassword)) ){
            return res.status(401).json({ error: 'Senha Atual Incorreta!' });
        }

        const {id, name, provider } = await user.update(req.body); //atualizando no banco

        return res.json({ 
            id,
            name,
            email,
            provider,
        });
    }
}

export default new UserController;