import Sequelize, { Model } from 'sequelize'; //importando o model e o sequelize
import bcrypt from 'bcryptjs'; //importando o bcrypt completo

class User extends Model{
    static init(sequelize){
        
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,  //campo virtual, não vai direto para o banco
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        //metodo que executa uma funçao antes de salvar
        this.addHook('beforeSave', async(user) =>{
            if(user.password){
                user.password_hash = await bcrypt.hash(user.password, 8); //8 é o nivel de segurança
            }
        });

        return this;
    }

    //CRIA O RELACIONAMENTO DOS MODELS
    static associate(models){
        this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar'}); //um model de usuario pertence a um model de file
    }

    //vai checar se a senha que esta tentando logar é a mesma do banco
    checkPassword(password){
        return bcrypt.compare(password, this.password_hash); //comparando a senha do body com a hash
    }
}

export default User;