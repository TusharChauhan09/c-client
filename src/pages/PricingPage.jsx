import { useState } from 'react';
import { motion } from 'motion/react';
import { IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

export default function PricingPage() {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '0',
      features: ['Basic Trip Planning', '3 Saved Trips', 'Community Access', 'Standard Support'],
      recommended: false,
    },
    {
      name: 'Pro',
      price: '499',
      features: ['Unlimited Trip Planning', 'AI Recommendations', 'Offline Access', 'Priority Support', 'Exclusive Deals'],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: '1999',
      features: ['Everything in Pro', 'Dedicated Agent', 'Custom Itineraries', 'Group Booking Tools', '24/7 Concierge'],
      recommended: false,
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount) => {
    if (!isSignedIn) {
      toast.error("Please sign in to subscribe");
      return;
    }

    if (amount === '0') {
      toast.success("You are already on the Free plan!");
      return;
    }

    setLoading(true);

    try {
      const res = await loadRazorpayScript();

      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Create Order
      console.log("Creating order with amount:", amount);
      const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
        }),
      });

      if (!orderResponse.ok) {
        throw new Error(`HTTP error! status: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      console.log("Order created:", orderData);

      if (!orderData.success) {
        toast.error('Error creating order: ' + (orderData.message || 'Unknown error'));
        setLoading(false);
        return;
      }

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error("Configuration Error: Razorpay Key ID is missing in frontend .env");
        console.error("Missing VITE_RAZORPAY_KEY_ID");
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Travel Planner",
        description: "Premium Subscription",
        image: "https://via.placeholder.com/150", // You can replace this with your logo URL
        order_id: orderData.order.id,
        handler: async function (response) {
          // Verify Payment
          const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast.success('Payment Successful! Welcome to Premium.');
          } else {
            toast.error('Payment Verification Failed');
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: "",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Something went wrong with the payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            Choose Your Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Select the perfect plan to unlock your next adventure. 
            Upgrade anytime as your travel needs grow.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative p-8 rounded-2xl border ${
                plan.recommended 
                  ? 'border-primary bg-primary/5 shadow-xl scale-105 z-10' 
                  : 'border-border bg-card shadow-lg'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.recommended ? 'bg-primary/20' : 'bg-accent'}`}>
                      <IconCheck size={14} className={plan.recommended ? 'text-primary' : 'text-foreground'} />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handlePayment(plan.price)}
                className="w-full" 
                variant={plan.recommended ? 'default' : 'outline'}
                disabled={loading}
              >
                {loading ? 'Processing...' : plan.price === '0' ? 'Get Started' : 'Subscribe Now'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
