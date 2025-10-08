import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
//New page checkout for paypal getting some errors need to fix them
const Checkout = ({ cartItems, userId }) => {
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    const createOrder = (data, actions) => {
        // Call your backend to create the order
        return fetch("api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, cartItems })
        })
            .then(res => res.json())
            .then(order => order.id)
            .catch(err => {
                console.error("Failed to create PayPal order on backend", err);
                // Handle error (e.g., show user a message)
            });
    };

    const onApprove = (data, actions) => {
        // Call your backend to capture the order
        return fetch("api/payment/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID })
        })
            .then(res => res.json())
            .then(captureDetails => {
                console.log("Capture result:", captureDetails);
                setPaymentSuccessful(true);
            })
            .catch(err => {
                console.error("Failed to capture PayPal payment on backend", err);
                // Handle error
            });
    };

    if (paymentSuccessful) {
        return <div>Thank you for your payment!</div>;
    }

    return (
        <PayPalScriptProvider options={{ "clientId": "AV0l3KKUO--oRoQT75w2xLtWnhV4DxTix6nxggLcrxmiZaMSeQ1c3sgBz225IpBcSxDpRADb15tQ0glg" }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </PayPalScriptProvider>
    );
};

export default Checkout;
