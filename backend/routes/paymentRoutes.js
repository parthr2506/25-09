const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

const router = express.Router();
router.use(bodyParser.json());

let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

router.post("/create-order", async (req, res) => {
    const { userId, cartItems } = req.body;
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
        // 1. Create a PENDING order in your database
        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount: total,
                items: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        // 2. Create the PayPal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [{
                amount: { currency_code: "USD", value: total.toFixed(2) },
                // Optional: Store your internal order ID with PayPal
                custom_id: order.id,
            }],
        });
        const paypalOrder = await client.execute(request);

        // 3. Update your database order with the PayPal Order ID
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
        // 1. Check your database for the order and prevent double payments
        const order = await prisma.order.findUnique({ where: { paypalOrderId: orderID } });
        if (!order || order.paymentStatus !== "PENDING") {
            return res.status(400).json({ error: "Order already captured or does not exist." });
        }

        // 2. Capture the payment with PayPal
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        const capture = await client.execute(request);
        const captureStatus = capture.result.status;

        // 3. Update the database order based on the capture result
        if (captureStatus === "COMPLETED") {
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentStatus: "COMPLETED" }
            });
            // Optional: clear the user's cart
            // await prisma.cart.delete({ where: { userId: order.userId } });
        } else {
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentStatus: captureStatus }
            });
        }

        res.json({ capture: capture.result });
    } catch (err) {
        console.error("PayPal Capture Error:", err.message);
        res.status(500).json({ error: "Capture failed." });
    }
});

module.exports = router;