import { useState } from "react";
import api from "./api";
//This is for the razor pay but it requires kyc for signup
const PaymentPage = ({ cart, user }) => {
    const [isPaying, setIsPaying] = useState(false);
    const handlePayment = async () => {
        try {
            setIsPaying(true);
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const { data } = await api.post("payment/create-order", { amount: total });
            const { orderId, amount } = data;
            const options = {
                key: "rzp_key",
                amount: amount,
                currency: "INR",
                name: "Stop&Shop",
                description: "Test Transaction",
                order_id: orderId,
                handler: async function (response) {
                    const verifyRes = await api.post("payment/verify", response)
                    if (verifyRes.data.success) {
                        alert("Payment Success")

                        await api.post("/orders", {
                            userId: user.id,
                            items: cart,
                            totalAmount: total,
                            paymentStatus: "Paid"

                        })
                    } else {
                        alert("Payment Failed")
                    }
                },
                prefill: {
                    email: user.email,
                    contact: " 9999999999"
                },
                theme: {
                    color: "#0d6efd"
                }

            };
            const rzp = new window.Razorpay(options);
            rzp.open();
            rzp.on("payment.failed", function () {
                alert("Payment Failed try again")
            })
        } catch (error) {
            console.log(error)

        } finally {
            setIsPaying(false)
        }
    }
    return (
        <div>
            <h2>Checkout</h2>
            <p>Total Amount Rs:{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}</p>
            <button onClick={handlePayment} disabled={isPaying}>
                {isPaying ? "Processing" : "Pay with RazorPay"}
            </button>
        </div>
    )
}

export default PaymentPage
