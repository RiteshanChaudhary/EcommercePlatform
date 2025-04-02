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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_SERVER,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', // true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOption = {
            to: mailOptions.to,
            from: `'${process.env.MAIL_FROM}' <${process.env.SMTP_EMAIL}>`, // sender address
            subject: mailOptions.subject,
            html: mailOptions.html
        };
        yield transporter.sendMail(mailOption);
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendEmail = sendEmail;
