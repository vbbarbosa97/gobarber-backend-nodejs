import File from '../models/File'; //importando o model file

class FileController {

    //SALVA A IMAGEM DO USUARIO NO BANCO DE DADOS
    async store(req, res) {
        
        //pegando do req.file e passando o nome que sera salvo
        const {originalname: name, filename: path } = req.file; //pegando apenas alguns dados do req.file

        //salvando na base de dados
        const file = await File.create({
            name,
            path,
        });

        return res.json(file);
    };
}

export default new FileController();