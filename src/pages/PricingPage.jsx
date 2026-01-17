import { useState } from "react";
import { motion } from "motion/react";
import {
  IconCheck,
  IconSparkles,
  IconStar,
  IconCrown,
  IconRocket,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import { Spinner } from "@/components/ui/spinner";

export default function PricingPage() {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const { syncUser } = useAuthStore();

  const plans = [
    {
      id: "bronze",
      name: "Bronze",
      subtitle: "Free Forever",
      icon: IconSparkles,
      price: "0",
      description: "Perfect for exploring and getting started.",
      features: [
        "Unlimited AI Travel Guide (Mini)",
        "Basic Trip Planning",
        "Standard Support",
        "Access to travel resources",
        "Limited travel insights",
      ],
      recommended: false,
      gradient: "from-amber-700 via-orange-600 to-amber-800",
      iconBg: "bg-gradient-to-br from-amber-600 to-orange-700",
      glowColor: "group-hover:shadow-amber-500/20",
    },
    {
      id: "silver",
      name: "Silver",
      subtitle: "Most Popular",
      icon: IconStar,
      price: billingCycle === "monthly" ? "499" : "4990",
      description: "For active travelers who want premium features.",
      features: [
        "10 Credits for GPT-4o (20 mins)",
        "Unlimited AI Travel Guide (Mini)",
        "Advanced Trip Planning",
        "Priority Access",
        "Custom travel alerts",
        "Expert travel assistance",
      ],
      recommended: true,
      gradient: "from-slate-400 via-gray-300 to-slate-400",
      iconBg: "bg-gradient-to-br from-slate-400 to-gray-500",
      glowColor: "group-hover:shadow-slate-400/30",
    },
    {
      id: "gold",
      name: "Gold",
      subtitle: "Best Value",
      icon: IconCrown,
      price: billingCycle === "monthly" ? "999" : "9990",
      description: "Unlimited access for power users and teams.",
      features: [
        "20 Credits for GPT-4o (40 mins)",
        "Unlimited AI Travel Guide (Mini)",
        "Premium Support 24/7",
        "Exclusive Travel Deals",
        "Dedicated account manager",
        "Team collaboration tools",
      ],
      recommended: false,
      gradient: "from-yellow-400 via-amber-400 to-yellow-500",
      iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
      glowColor: "group-hover:shadow-yellow-400/30",
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
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

    if (amount === "0") {
      toast.success("You are already on the Free plan!");
      return;
    }

    setLoading(true);

    try {
      const res = await loadRazorpayScript();

      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const orderResponse = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error(`HTTP error! status: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error(
          "Error creating order: " + (orderData.message || "Unknown error")
        );
        setLoading(false);
        return;
      }

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        toast.error(
          "Configuration Error: Razorpay Key ID is missing in frontend .env"
        );
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Travel Buddy",
        description: `${planName} Subscription`,
        order_id: orderData.order.id,
        handler: async function (response) {
          const verifyResponse = await fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:3000"
            }/api/payment/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?.id,
                amount: Number(amount),
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            toast.success(`Payment Successful! Welcome to ${planName}.`);
            if (user) syncUser(user.id);
          } else {
            toast.error("Payment Verification Failed");
          }
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          contact: "",
        },
        theme: {
          color: "#10b981",
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
    <div className="min-h-screen flex flex-col justify-center py-8 px-4 relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <IconRocket size={16} className="text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">
                Simple Pricing
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              Perfect Plan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-lg mx-auto mb-6"
          >
            Start free and upgrade as you grow. All plans include core features.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1 p-1 rounded-full bg-muted border border-border"
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billingCycle === "annually"
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annually
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold">
                -20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className={`group relative ${
                  plan.recommended ? "md:-mt-4 md:mb-4" : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      ✨ Most Popular
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`
                  relative h-full p-6 rounded-2xl flex flex-col
                  bg-card border-2 transition-all duration-500
                  ${
                    plan.recommended
                      ? "border-emerald-500/50 shadow-xl shadow-emerald-500/10"
                      : "border-border hover:border-muted-foreground/30"
                  }
                  shadow-lg hover:shadow-xl
                  hover:-translate-y-1
                `}
                >
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${plan.iconBg} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent
                        size={24}
                        className="text-white"
                        stroke={1.5}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground text-sm">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePayment(plan.price, plan.name)}
                    disabled={loading}
                    className={`
                      w-full mb-5 py-5 text-sm font-semibold transition-all duration-300 rounded-xl
                      ${
                        plan.recommended
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                          : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                      }
                    `}
                  >
                    {loading ? (
                      <Spinner />
                    ) : plan.price === "0" ? (
                      "Get Started Free"
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>

                  {/* Features List */}
                  <div className="space-y-3 mt-auto">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      What's included:
                    </p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`
                          mt-0.5 p-1 rounded-full shrink-0
                          ${
                            plan.recommended
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                        >
                          <IconCheck size={12} stroke={3} />
                        </div>
                        <span className="text-sm text-foreground/80">
                          {feature}
                        </span>
                      </div>
                    ))}
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
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            🔒 Secure payments powered by Razorpay. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
