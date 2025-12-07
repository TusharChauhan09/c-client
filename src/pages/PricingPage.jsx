import { useState } from 'react';
import { motion } from 'motion/react';
import { IconCheck, IconSparkles, IconStar, IconCrown } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import useAuthStore from '@/store/useAuthStore';
import { Spinner } from '@/components/ui/spinner';

export default function PricingPage() {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annually
  const { syncUser } = useAuthStore();

  const plans = [
    {
      id: 'bronze',
      name: 'Bronze',
      subtitle: 'Free Plan',
      icon: IconSparkles,
      price: '0',
      description: 'For beginners to explore our platform and start their travel journey.',
      features: [
        'Unlimited AI Travel Guide (Mini)',
        'Basic Trip Planning',
        'Standard Support',
        'Access to travel resources',
        'Limited travel insights'
      ],
      recommended: false,
      tierColor: 'from-[#CD7F32] to-[#8B4513]',
      bgGlow: 'shadow-[0_0_40px_rgba(205,127,50,0.15)]'
    },
    {
      id: 'silver',
      name: 'Silver',
      subtitle: 'Pro Plan',
      icon: IconStar,
      price: billingCycle === 'monthly' ? '499' : '4990',
      description: 'For active travelers who want advanced AI assistance and premium features.',
      features: [
        '10 Credits for GPT-4o (20 mins)',
        'Unlimited AI Travel Guide (Mini)',
        'Advanced Trip Planning',
        'Priority Access',
        'Custom travel alerts',
        'Expert travel assistance'
      ],
      recommended: true,
      tierColor: 'from-[#E8E8E8] to-[#C0C0C0]',
      bgGlow: 'shadow-[0_0_50px_rgba(192,192,192,0.2)]'
    },
    {
      id: 'gold',
      name: 'Gold',
      subtitle: 'Advance Plan',  
      icon: IconCrown,
      price: billingCycle === 'monthly' ? '999' : '9990',
      description: 'For institutions or high net worth individuals who need unlimited access.',
      features: [
        '20 Credits for GPT-4o (40 mins)',
        'Unlimited AI Travel Guide (Mini)',
        'Premium Support 24/7',
        'Exclusive Travel Deals',
        'Dedicated account manager',
        'Team collaboration tools'
      ],
      recommended: false,
      tierColor: 'from-[#FFD700] to-[#FFA500]',
      bgGlow: 'shadow-[0_0_60px_rgba(255,215,0,0.25)]'
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

  const handlePayment = async (amount, planName) => {
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

      if (!orderData.success) {
        toast.error('Error creating order: ' + (orderData.message || 'Unknown error'));
        setLoading(false);
        return;
      }

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error("Configuration Error: Razorpay Key ID is missing in frontend .env");
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Travel Planner",
        description: `${planName} Subscription`,
        order_id: orderData.order.id,
        handler: async function (response) {
          const verifyResponse = await fetch('http://localhost:3000/api/payment/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user?.id,
              amount: Number(amount)
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast.success(`Payment Successful! Welcome to ${planName}.`);
            if (user) syncUser(user.id);
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
    <div className="min-h-screen flex flex-col justify-center py-4 px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <IconSparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Pricing</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
          >
            Plans and Pricing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-4"
          >
            Choose a plan that fits your investment goals.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 p-1 rounded-full bg-muted/50 backdrop-blur-sm border border-border"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-background text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                billingCycle === 'annually'
                  ? 'bg-background text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annually
              <span className="ml-1.5 text-[10px] text-green-500 font-bold">-20%</span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 items-start">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="relative group h-full"
              >
                {/* Popular Badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`
                  relative h-full p-5 md:p-6 rounded-2xl flex flex-col
                  bg-card/50 backdrop-blur-xl
                  border-2 transition-all duration-300
                  ${plan.recommended 
                    ? 'border-primary/50 ' + plan.bgGlow + ' scale-[1.02] z-10' 
                    : 'border-border hover:border-border/80 ' + plan.bgGlow
                  }
                `}>
                  {/* Header Part */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="mb-0">
                       <IconComponent 
                        size={28} 
                        className={`bg-gradient-to-br ${plan.tierColor} bg-clip-text text-transparent`}
                        stroke={2}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">{plan.subtitle}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        ₹{plan.price}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePayment(plan.price, plan.name)}
                    disabled={loading}
                    className={`
                      w-full mb-5 h-9 text-sm font-semibold transition-all
                      ${plan.recommended 
                        ? 'bg-gradient-to-r ' + plan.tierColor + ' hover:opacity-90 text-black shadow-lg'
                        : 'bg-background hover:bg-accent border-2 border-border'
                      }
                    `}
                    variant={plan.recommended ? 'default' : 'outline'}
                    size="sm"
                  >
                    {loading ? <Spinner /> : plan.price === '0' ? 'Start Free' : 'Get Started'}
                  </Button>

                  {/* Features List */}
                  <div className="space-y-2 mt-auto">
                    {plan.features.slice(0, 5).map((feature, idx) => ( // Accessing slice to prevent card from growing too large
                      <div key={idx} className="flex items-start gap-2">
                        <div className={`
                          mt-0.5 p-0.5 rounded-full shrink-0
                          ${plan.recommended ? 'bg-primary/20' : 'bg-accent'}
                        `}>
                          <IconCheck 
                            size={12} 
                            className={plan.recommended ? 'text-primary' : 'text-muted-foreground'}
                            stroke={3}
                          />
                        </div>
                        <span className="text-xs text-foreground/80 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <div className="text-[10px] text-muted-foreground pl-5 pt-1">
                        + {plan.features.length - 5} more features
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            No credit card required for free plan.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
