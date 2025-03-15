
import { sendEmail } from "./sendemail.util"

interface IOrderDetails {
    orderId: string,
    items: any[],
    totalAmount: number,
    createdAt : Date
}

interface IOptions {
    to:string,
    orderDetails?: IOrderDetails 
}

export const sendOrderConfirmationEmail = async (options: IOptions) => {
const {to,orderDetails} = options


    const html = `
    <h1>Your order placed successfully</h1>
    <p>OrderId:${orderDetails.orderId}</p>
    <h1>Order:</h1>
    <ol>
    ${orderDetails.items.map((item)=> `<li>${item.product.name}-${item.quantity}x${item.product.price}</li>`).join("")}
    </ol>
    <p>Total: Rs.${orderDetails.totalAmount.toFixed(2)}</p>
    <p>Order date: ${new Date(orderDetails.createdAt).toLocaleString()}</p>
    <p>Thank you for purchasing from us.</p>
    `



    const mailOptions = {
        html,
        subject: 'order confirmation',
        to,
    }

    await sendEmail(mailOptions);
}
