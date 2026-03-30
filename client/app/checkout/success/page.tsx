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

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Poll payment status — Stripe redirects here after payment
    async function checkStatus() {
      try {
        const { data } = await paymentAPI.getStatus(orderId!);
        if (data.paymentStatus === 'COMPLETED') {
          setStatus('success');
        } else if (data.paymentStatus === 'FAILED') {
          setStatus('failed');
        } else {
          // Still processing — retry after 2s
          setTimeout(checkStatus, 2000);
        }
      } catch {
        setStatus('failed');
      }
    }

    checkStatus();
  }, [orderId, router]);

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
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-500 mb-6">
            Congratulations! Your vehicle purchase is confirmed. We'll contact
            you shortly with next steps.
          </p>
          <div className="space-y-3">
            <Link href="/dashboard/orders">
              <Button className="w-full">View My Orders</Button>
            </Link>
            <Link href="/vehicles">
              <Button variant="outline" className="w-full">
                Browse More Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
