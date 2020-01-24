import 'dotenv/config'; //ja carrega as variaveis de ambiente do arquivo .env
import 'express-async-errors'; //importando a extensão que le os erros dentro do async
import express from 'express'; //importando o express
import routes from './routes'; //importando o arquivo routes
import path from 'path'; //importano o path do node.js
import cors from 'cors';
import * as Sentry from '@sentry/node'; //importando o sentry 
import sentryConfig from './config/sentry'; //importando a config do sentry
import Youch from 'youch'; //importando o youch
import './database';

class App {

    constructor(){
        this.server = express(); //instanciando o express 
        Sentry.init(sentryConfig); //iniciando o sentry e passando a config
        this.middlewares(); //chamando o método
        this.routes(); //chamando o método
        this.exceptionHandler(); //chamando o metodo de exceção 
    }

    middlewares(){
        //o sentry vai monitorar todas as rotas abaixo
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(cors());
        this.server.use(express.json()); //permitindo a leitura no formato json
        //o servidor vai servir um serviço de imagem
        this.server.use(
            '/files', //passo a rota que vai servir as imagens
            express.static(path.resolve( __dirname, '..','tmp', 'uploads') ) //digo onde estao as imagens
        );
    }

    routes(){
        this.server.use(routes); 
        this.server.use(Sentry.Handlers.errorHandler()); //monitoramento depois das rotas
    }

    //os erros que acontecerem na aplicação vao cair nesse middleware
    exceptionHandler(){

        this.server.use(async (err, req, res, next) => {
           
            if(process.env.NODE_ENV === 'development'){
                const errors = await new Youch(err, req).toJSON();
            
                return res.status(500).json(errors);
            }

            return res.status(500).json({ error: 'Erro no servidor interno!' });
            
        });
    }
}

export default  new App().server;