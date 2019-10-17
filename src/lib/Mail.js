import nodemailer from 'nodemailer'; //importando o node mailer
import mailConfig from '../config/mail'; //importando as configurações do email
import exphbs from 'express-handlebars'; //importando a biblioteca do template p/ email
import nodemailerhbs from 'nodemailer-express-handlebars'; //importando o a biblioteca de template  p/ email
import { resolve } from 'path'; //importando do node

class Mail{

    constructor(){

        //pegando do arquivo mailsConfig
        const {host, port, secure, auth} = mailConfig; 

        //chamando o método
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null, 
        });

        //chamando o método
        this.configureTemplates();
    }

    //método de configuração de template
    configureTemplates(){
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails'); //navegando ate o template

        //passando configurações
        this.transporter.use(
            
            'compile', 
            nodemailerhbs({
                viewEngine: exphbs.create({

                    layoutsDir: resolve(viewPath, 'layouts'),
                    partialsDir: resolve(viewPath, 'partials'),
                    defaultLayout: 'default',
                    extname: '.hbs'
                }),
                viewPath,
                extName: '.hbs',
            })
        );
    }

    //método de enviar o email
    sendMail(message){
        
        return this.transporter.sendMail({
            ...mailConfig.default, //joga tudo que tem em default
            ...message, //joga tudo que tem na message
        });
    }
}

export default new Mail;