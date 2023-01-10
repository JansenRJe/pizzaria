import { NextFunction, Request, Response }  from 'express';
import { verify } from 'jsonwebtoken';

interface PayLoad{
    sub: string;
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
){

    //Recebeu o token
    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).end();
    }

    const [ , token] = authToken.split(" ")

    try {
        //Validar esse token.
        const { sub } = verify(
            token,
            process.env.JWT_SECRET
        ) as PayLoad;

        //Recuperar i id do token ecolocar dentro de uma variavel user_id dentro do request
        req.user_id = sub;

        return next();

    }catch(err){
        return res.status(401).end();
    }
}