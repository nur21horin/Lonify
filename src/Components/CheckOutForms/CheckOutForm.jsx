// src/components/CheckoutForm.jsx
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckoutForm = ({ clientSecret, applicationId }) => {
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        setError('');
        setProcessing(false);
    }, [clientSecret]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || processing) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        setProcessing(true);
        setError('');

        const { error: creationError } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (creationError) {
            console.error('[PaymentMethod Error]', creationError);
            setError(creationError.message);
            setProcessing(false);
            return;
        }

        // 3. Confirm Payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                },
            },
        );

        if (confirmError) {
            console.error('[Confirm Payment Error]', confirmError);
            setError(confirmError.message);
            setProcessing(false);
            return;
        }

        // 4. Update Database (Payment Success)
        if (paymentIntent.status === 'succeeded') {
            const transactionId = paymentIntent.id;

            try {
                // Endpoint: /loan-applications/:id/pay
                const res = await axiosSecure.patch(`/loan-applications/${applicationId}/pay`, {
                    transactionId,
                });

                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        title: "Payment Successful!",
                        text: `Application fee paid. ID: ${transactionId}`,
                        icon: "success",
                        confirmButtonText: "View Applications"
                    }).then(() => {
                        // Navigate back to the loan applications list
                        navigate('/dashboard/my-loans'); 
                    });
                } else {
                    Swal.fire('Error', 'Payment succeeded, but failed to update application status.', 'error');
                }
            } catch (updateError) {
                console.error("Database Update Error:", updateError);
                Swal.fire('Error', 'An error occurred after payment. Please contact support.', 'error');
            }
        }
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            {error && <p className="text-red-600 font-medium">{error}</p>}
            <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!stripe || processing}
            >
                {processing ? 'Processing...' : 'Pay $10.00'}
            </button>
        </form>
    );
};

export default CheckoutForm;