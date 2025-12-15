// src/pages/dashboard/user/LoanPayment.jsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaCreditCard } from 'react-icons/fa';
import CheckoutForm from '../../../Components/CheckOutForms/CheckOutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const LoanPayment = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: clientSecret, isLoading } = useQuery({
        queryKey: ['clientSecret', id],
        queryFn: async () => {
            const res = await axiosSecure.post('/create-payment-intent'); // no applicationId needed
            return res.data.clientSecret;
        },
        enabled: !!id,
        retry: false,
    });

    if (isLoading) return <p className="text-center mt-10">Preparing payment gateway...</p>;
    if (!clientSecret) return <p className="text-center mt-10 text-error">Failed to load payment details.</p>;

    return (
        <div className="p-4 md:p-8">
            <Helmet><title>Dashboard | Loan Payment</title></Helmet>
            <h2 className="text-3xl font-bold mb-8 text-center text-primary-600">
                <FaCreditCard className="inline mr-2" /> Application Fee Payment
            </h2>
            <div className="max-w-xl mx-auto bg-white p-6 md:p-10 shadow-2xl rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">
                    Total Payment: $10.00 (Non-refundable)
                </h3>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm applicationId={id} clientSecret={clientSecret} />
                </Elements>
            </div>
        </div>
    );
};

export default LoanPayment;
