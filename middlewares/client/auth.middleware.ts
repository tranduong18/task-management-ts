import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authorization: string = req.headers.authorization;
    if(!authorization){
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm theo token"
        });
        return;
    }

    const token: string = authorization.split(" ")[1];
    if(!token){
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm theo token."
        });
        return;
    }

    const user = await User.findOne({
        token: token,
        deleted: false
    });

    if(!user){
        res.json({
            code: 403,
            message: "Token không hợp lệ."
        });
        return;
    }

    req["user"] = user;
    req["tokenVerify"] = token;

    next();
}