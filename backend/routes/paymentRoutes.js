const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const dotenv = require("dotenv");
// const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const prisma = require("../prisma/prismaClient")

dotenv.config();

const router = express.Router();
router.use(express.json());

let environment = new paypal.core.SandboxEnvironment(
    process.env.VITE_PAYPAL_CLIENT_ID,
    process.env.VITE_PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);


router.post("/create-order", async (req, res) => {
    const { userId, cartItems } = req.body;

    if (!userId || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "Invalid request data" });
    }

    let paypalOrder;
    const temporaryId = uuidv4();

    try {
        let total = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.product.price);
            return sum + (price || 0) * (item.quantity || 0);
        }, 0);

        if (isNaN(total)) {
            return res.status(400).json({ error: "Could not calculate a total amount" });
        }

        const orderItemsToCreate = cartItems.map(item => ({
            product: { connect: { id: item.product.id } },
            quantity: item.quantity,
            price: item.product.price,
        }));

        //create prisma order with a temp transaction id 
        const order = await prisma.order.create({
            data: {
                user: { connect: { id: userId } },
                totalAmount: total,
                paymentStatus: "PENDING",
                paypalOrderId: temporaryId,
                items: { create: orderItemsToCreate },
            },
        });

        //create paypal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{
                amount: { currency_code: "USD", value: total.toFixed(2) },
                custom_id: order.id,
            }],
        });
        paypalOrder = await client.execute(request);

        //updating the db order with actual paypal order id
        await prisma.order.update({
            where: { id: order.id },
            data: { paypalOrderId: paypalOrder.result.id }
        });

        res.json({ id: paypalOrder.result.id });
    } catch (err) {
        console.error("PayPal API Error:", err.message);
        res.status(500).json({ error: "Order creation failed." });
    }
});

router.post("/capture-order", async (req, res) => {
    const { orderID } = req.body;
    try {
        const order = await prisma.order.findUnique({
            where: {
                paypalOrderId: orderID
            },
            include: { items: true }
        })
        if (!order) {
            return res.status(400).json({ error: "Order not found" })
        }
        if (order.paymentStatus !== "PENDING") {
            return res.status(400).json({ error: "Order is already processed" })
        }
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        const captureRespone = await client.execute(request);

        const captureResult = captureRespone.result;
        const capture = captureResult.purchase_units?.[0]?.payments?.captures?.[0];
        const payer = captureResult.payer;

        if (capture && capture.status === "COMPLETED") {
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: "COMPLETED",
                    paypalCaptureId: capture.id,
                    payerEmail: payer?.email_address || null,
                    payerName: `${payer?.name?.given_name || ""} ${payer?.name?.surname || ""}`,
                }
            })


            const userCart = await prisma.cart.findFirst({
                where: { userId: order.userId },
            });

            //using transactions for success(remove cart items on successfull payment)
            if (userCart) {
                await prisma.$transaction([
                    //deleting user's cart 
                    prisma.cartItem.deleteMany({
                        where: { cartId: userCart.id },
                    }),
                    //deleting the cart's record
                    prisma.cart.delete({
                        where: { id: userCart.id },
                    }),
                ]);
            }

            // await prisma.cart.deleteMany({ where: { userId: order.userId } }); 
        }
        //sending response back to client
        res.json({ capture: captureResult });
    } catch (err) {
        console.error("PayPal Capture Error:", err.message);
        res.status(500).json({ error: "Capture failed." });
    }
});

module.exports = router;