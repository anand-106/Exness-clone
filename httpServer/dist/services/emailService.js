"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
async function sendEmail(email, data) {
    const msg = {
        to: email,
        from: "anands2003106@gmail.com",
        subject: "Order Update",
        text: "Order Update",
        html: `<p>${data}</p>`,
    };
    try {
        await mail_1.default.send(msg);
    }
    catch (err) {
        console.error("error sending email :", err);
    }
}
//# sourceMappingURL=emailService.js.map