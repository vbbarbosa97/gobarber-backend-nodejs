import multer from 'multer';//permite trabalhar com multpartform
import crypto from 'crypto';//pertence ao node
import { extname, resolve } from 'path'; //extname permite trabalhar com a extensao e resolve caminhar

export default {

    //configurando o upload
    storage: multer.diskStorage({
        
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),//caminho onde sera salvo
        //configurando o nome unico da imagem
        filename: (req, file, cb) => {
            
            crypto.randomBytes(16, (err, res) => {
                if(err) return cb(err);

                //se não retornar erro vai concatenar os 16 bytes de forma hexadecimal com a extensão 
                //o null antes diz respeito ao erro
                return cb(null, res.toString('hex') + extname(file.originalname) );
            })
        },
    }),
};