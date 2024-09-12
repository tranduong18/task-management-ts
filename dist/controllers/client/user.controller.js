"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate_helper_1 = require("../../helpers/generate.helper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existUser = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existUser) {
            res.json({
                code: 400,
                message: "Email đã tồn tại!"
            });
            return;
        }
        const token = (0, generate_helper_1.generateRandomString)(30);
        const dataUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            password: (0, md5_1.default)(req.body.password),
            token: token,
        };
        const user = new user_model_1.default(dataUser);
        yield user.save();
        res.json({
            code: 200,
            message: "Đăng ký thành công!",
            token: token
        });
    }
    catch (error) {
        res.json({
            message: "Not Found"
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }
    if ((0, md5_1.default)(password) != user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu!"
        });
        return;
    }
    res.json({
        code: 200,
        message: "Đăng nhập thành công!",
        token: user.token
    });
});
exports.login = login;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        token: req["tokenVerify"],
        deleted: false
    }).select("-password -token");
    res.json({
        code: 200,
        message: "Thành công!",
        user: user
    });
});
exports.profile = profile;
