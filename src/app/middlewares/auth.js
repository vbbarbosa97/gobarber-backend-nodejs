import jwt from 'jsonwebtoken'; //importanto a lib do jwt
import { promisify } from 'util'; //transforma as funçoes de callback
import authConfig from '../../config/auth'; //importando o segredo do token

//exportando o middleware
export default async (req, res, next) => {
  
    const authHeader = req.headers.authorization; //recebendo o token gerado na autenticação

    //verifica se o token foi passado
    if(!authHeader){
        return res.status(401).json({ error: 'Token não foi enviado na requisição' });
    }

    //usando a desestruturação para pegar apenas o token
    const [, token] = authHeader.split(' ');

    //try se não retornar erro e catch se retornar erro
    try{
        const decoded = await promisify(jwt.verify)(token, authConfig.secret); //decodifica o token passado
        
        req.userId = decoded.id; //incluindo o id do usuario dentro do req

        return next();

    } catch(err){
        return res.status(401).json({ error: 'Token invalido' });
    }
};