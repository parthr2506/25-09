import React, { useEffect, useRef, useState } from 'react';


//paypal button working need to add orders to the db 
const PayPalButton = ({ clientId, currency }) => {
    const buttonContainerRef = useRef(null);
    let paypalButtonsInstance = null;
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    useEffect(() => {
        if (window.paypal && buttonContainerRef.current) {
            paypalButtonsInstance = window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '0.01',
                            },
                        }],
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        console.log('Capture result:', details);
                        setPaymentSuccessful(true);
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
        }

        return () => {
            if (paypalButtonsInstance) {
                try {
                    paypalButtonsInstance.close();
                } catch (e) {
                    console.warn("Error during PayPal button cleanup:", e);
                }
            }
        };
    }, [clientId, currency]);

    if (paymentSuccessful) {
        return <div>Thank you for your test payment!</div>;
    }

    return (
        <div ref={buttonContainerRef} id="paypal-button-container"></div>
    );
};

export default PayPalButton;
