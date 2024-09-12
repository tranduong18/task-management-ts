import { Request, Response } from "express";
import User from "../../models/user.model";
import md5 from "md5";

import { generateRandomString } from "../../helpers/generate.helper";

// [POST] /users/register
export const register = async (req: Request, res: Response) => {
    try {
      const existUser = await User.findOne({
        email: req.body.email,
        deleted: false
      });
  
      if(existUser) {
        res.json({
          code: 400,
          message: "Email đã tồn tại!"
        });
        return;
      }
  
      const token = generateRandomString(30);
  
      const dataUser = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        token: token,
      };
  
      const user = new User(dataUser);
      await user.save();
  
      res.json({
        code: 200,
        message: "Đăng ký thành công!",
        token: token
      });
    } catch (error) {
      res.json({
        message: "Not Found"
      });
    }
  }