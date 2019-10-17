import User from '../models/User'; //importando o model de Usuario
import File from '../models/File'; //importando o model File

class ProviderController{

    //LISTA OS USUARIOS QUE SÃO PRESTADORES
    async index(req, res){

        //buscando os usuarios que sao prestadores
        const providers = await User.findAll({
            where: { provider: true },
            attributes: ['id','name','email','avatar_id'], //passo os atributos que eu quero que passe
            //inclui os dados do relacionamento 
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name','path','url']
                }
            ], 
        });
   

        return res.json(providers);
    }
}

export default new ProviderController;