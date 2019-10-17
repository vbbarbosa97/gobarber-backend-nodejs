import Sequelize from 'sequelize';
import mongoose from 'mongoose'; //importando o mongoose 
import databaseConfig from '../config/database'; //importando as configurações do banco

//MODELS
import User from '../app/models/User'; //importando o model User
import File from '../app/models/File'; //importando o model File
import Appointment from '../app/models/Appointment'; //importando o model appointment

const models = [User, File, Appointment]; //array com todos os models

//CONFIGURANDO A CONEXÃO COM O BANCO POSTGRES
class Database {
    
    constructor() {
        //chama os metodos
        this.init();
        this.mongo(); 
    }

    init() {
        this.connection = new Sequelize(databaseConfig); // passando as configurações do banco 

        models
        .map(model => model.init(this.connection)) //passando a conexão
        //vai mapear o model associate se ele existir
        .map(model => model.associate && model.associate(this.connection.models) ); 
    }

    mongo(){
        this.mongoConnection = mongoose.connect(
            process.env.MONGO_URL, //o mongo vai criar a base de dados
            { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true}
        )
    }
}

export default new Database();