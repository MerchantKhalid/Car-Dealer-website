'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentAPI } from '@/lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>(
    'loading',
  );
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    async function checkStatus() {
      try {
        const { data } = await paymentAPI.getStatus(orderId!);
        if (data.paymentStatus === 'COMPLETED') {
          setStatus('success');
        } else if (data.paymentStatus === 'FAILED') {
          setStatus('failed');
        } else {
          setTimeout(checkStatus, 2000);
        }
      } catch {
        setStatus('failed');
      }
    }

    checkStatus();
  }, [orderId, router]);

  // Auto-redirect to home after 5 seconds on success
  useEffect(() => {
    if (status !== 'success') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
          {/* Animated checkmark */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-500 mb-2">
            Congratulations! Your vehicle purchase is confirmed. We'll contact
            you shortly with next steps.
          </p>

          {/* Countdown message */}
          <p className="text-sm text-primary-600 font-medium mb-6">
            Redirecting to home in {countdown} second
            {countdown !== 1 ? 's' : ''}...
          </p>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => router.push('/')}>
              Go to Home Now
            </Button>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-500 mb-6">
          Something went wrong with your payment. Your order is still saved —
          you can retry from your orders page.
        </p>
        <div className="space-y-3">
          <Link href="/dashboard/orders">
            <Button className="w-full">Go to My Orders</Button>
          </Link>
          <Link href="/vehicles">
            <Button variant="outline" className="w-full">
              Back to Vehicles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
