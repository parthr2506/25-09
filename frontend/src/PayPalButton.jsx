import { useEffect, useRef, useState } from 'react';

const PayPalButton = ({ clientId, currency, cartItems, userId, onPaymentSuccess }) => {
    const buttonContainerRef = useRef(null);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    useEffect(() => {
        if (window.paypal && buttonContainerRef.current && cartItems.length > 0) {
            const paypalButtonsInstance = window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return fetch("http://localhost:5000/api/payment/create-order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userId, cartItems }),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to create PayPal order on server');
                            }
                            return response.json();
                        })
                        .then(order => order.id)

                        .catch(error => {
                            console.error("Error creating PayPal order:", error);

                        });
                },

                onApprove: (data, actions) => {
                    //backend call
                    return fetch("http://localhost:5000/api/payment/capture-order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ orderID: data.orderID }),
                    })
                        .then(response => response.json())
                        .then((captureDetails) => {
                            console.log('Capture result:', captureDetails);
                            setPaymentSuccessful(true);
                            //after payment success refresh the cart page to remove the items in cart 
                            if (onPaymentSuccess) {
                                onPaymentSuccess();
                            }
                        })
                        .catch(error => {
                            console.error("Error capturing PayPal order:", error);
                            setPaymentSuccessful(false);
                        });
                },

                onCancel: (data) => {
                    console.log('Payment cancelled', data);
                    setPaymentSuccessful(false);
                },
                onError: (err) => {
                    console.error('PayPal button error', err);
                    setPaymentSuccessful(false);
                }
            });

            paypalButtonsInstance.render(buttonContainerRef.current)
                .catch(err => {
                    console.error("Failed to render PayPal Buttons", err);
                });

            //clean up
            return () => {
                if (paypalButtonsInstance) {
                    try {
                        paypalButtonsInstance.close();
                    } catch (e) {
                        console.warn("Error during PayPal button cleanup:", e);
                    }
                }
            };
        }
    }, [clientId, currency, cartItems, userId]);

    if (paymentSuccessful) {
        return <div>Thank you for your payment</div>;
    }

    return (
        <div ref={buttonContainerRef} id="paypal-button-container"></div>
    );
};

export default PayPalButton;

