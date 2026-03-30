'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { paymentAPI, orderAPI } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { ShieldCheck, Lock } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

// ─── Inner checkout form ───────────────────────────────────────────────────
function CheckoutForm({ order }: { order: Order }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg('');

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?orderId=${order.id}`,
      },
    });

    if (error) {
      setErrorMsg(error.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-4 border">
        <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {order.vehicle.year} {order.vehicle.make} {order.vehicle.model}
          </span>
          <span className="font-bold text-lg">
            {formatPrice(order.totalPrice)}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Order #{order.id.slice(0, 8)}
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Payment Details</h2>
        <PaymentElement />
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={loading}
        disabled={!stripe || !elements}
      >
        <Lock className="w-4 h-4 mr-2" />
        Pay {formatPrice(order.totalPrice)}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="w-4 h-4" />
        Secured by Stripe — your card details are never stored
      </div>
    </form>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [clientSecret, setClientSecret] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      router.push('/dashboard/orders');
      return;
    }

    async function init() {
      try {
        // Fetch order details
        const { data: orderData } = await orderAPI.getById(orderId!);
        setOrder(orderData);

        // Create Stripe payment intent
        const { data } = await paymentAPI.createIntent(orderId!);
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => router.push('/dashboard/orders')}
            className="mt-4 text-primary-600 underline"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order || !clientSecret) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Complete Your Purchase
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: { colorPrimary: '#2563eb' },
              },
            }}
          >
            <CheckoutForm order={order} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
