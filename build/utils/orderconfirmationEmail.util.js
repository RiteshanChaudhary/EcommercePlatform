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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrderConfirmationEmail = void 0;
const sendemail_util_1 = require("./sendemail.util");
const sendOrderConfirmationEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, orderDetails } = options;
    const html = `
    <h1>Your order placed successfully</h1>
    <p>OrderId:${orderDetails.orderId}</p>
    <h1>Order:</h1>
    <ol>
    ${orderDetails.items.map((item) => `<li>${item.product.name}-${item.quantity}x${item.product.price}</li>`).join("")}
    </ol>
    <p>Total: Rs.${orderDetails.totalAmount.toFixed(2)}</p>
    <p>Order date: ${new Date(orderDetails.createdAt).toLocaleString()}</p>
    <p>Thank you for purchasing from us.</p>
    `;
    const mailOptions = {
        html,
        subject: 'order confirmation',
        to,
    };
    yield (0, sendemail_util_1.sendEmail)(mailOptions);
});
exports.sendOrderConfirmationEmail = sendOrderConfirmationEmail;
