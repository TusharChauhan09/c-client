import { motion } from "motion/react";
import { IconSparkles, IconCrown, IconStar } from "@tabler/icons-react";

/**
 * Subscription Tier Ring Component
 * Displays a colored, animated ring around the user's profile picture
 * based on their subscription tier (bronze, silver, gold)
 */
export function SubscriptionRing({ tier, children }) {
  const getTierConfig = () => {
    switch (tier) {
      case 'gold':
        return {
          ringClasses: 'bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#FFD700] animate-[spin_3s_linear_infinite] shadow-[0_0_20px_rgba(255,215,0,0.5)]',
          badgeClasses: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black',
          icon: <IconCrown size={12} />,
          label: 'Gold Member',
          description: 'Unlimited access'
        };
      case 'silver':
        return {
          ringClasses: 'bg-gradient-to-br from-[#E8E8E8] via-[#C0C0C0] to-[#A8A8A8] shadow-[0_0_15px_rgba(192,192,192,0.4)]',
          badgeClasses: 'bg-gradient-to-r from-[#E8E8E8] to-[#C0C0C0] text-black',
          icon: <IconStar size={12} />,
          label: 'Silver Member',
          description: 'Premium features'
        };
      case 'bronze':
        return {
          ringClasses: 'bg-gradient-to-br from-[#CD7F32] via-[#B8733C] to-[#8B4513] shadow-[0_0_12px_rgba(205,127,50,0.4)]',
          badgeClasses: 'bg-gradient-to-r from-[#CD7F32] to-[#8B4513] text-white',
          icon: <IconSparkles size={12} />,
          label: 'Bronze Member',
          description: 'Basic features'
        };
      default:
        return {
          ringClasses: 'bg-transparent border border-transparent',
          badgeClasses: '',
          icon: null,
          label: 'Free',
          description: 'Limited access'
        };
    }
  };

  const config = getTierConfig();

  return (
    <div className="relative group">
      {/* Ring with Glow */}
      <div className={`
        relative rounded-full p-[3px] transition-all duration-300
        ${config.ringClasses}
      `}>
        {/* Inner circle to prevent the avatar from rotating */}
        <div className={`
          rounded-full p-0.5
          ${tier ? 'bg-background' : 'bg-transparent'}
        `}>
          {children}
        </div>
        
        {/* Subscription Tier Badge (only for silver and gold) */}
        {tier && tier !== 'bronze' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-1 -right-1 z-10"
          >
            <div className={`
              px-1.5 py-0.5 rounded-full text-[10px] font-bold
              flex items-center justify-center
              ${config.badgeClasses}
            `}>
              {tier === 'gold' ? '👑' : '⭐'}
            </div>
          </motion.div>
        )}
      </div>

      {/* Tooltip on Hover */}
      {tier && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
        >
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg px-3 py-2 min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <div className={`
                p-1 rounded-full
                ${tier === 'gold' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 
                  tier === 'silver' ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' : 
                  'bg-[#CD7F32]/20 text-[#CD7F32]'}
              `}>
                {config.icon}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {config.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {config.description}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Subscription Tier Colors Reference
 * Can be displayed on the pricing page or user profile
 */
export function SubscriptionLegend() {
  const tiers = [
    { 
      name: 'Bronze', 
      color: 'from-[#CD7F32] to-[#8B4513]',
      icon: '✨',
      features: ['Basic AI assistance', '50 credits/month']
    },
    { 
      name: 'Silver', 
      color: 'from-[#E8E8E8] to-[#C0C0C0]',
      icon: '⭐',
      features: ['Advanced AI features', '200 credits/month']
    },
    { 
      name: 'Gold', 
      color: 'from-[#FFD700] to-[#FFA500]',
      icon: '👑',
      features: ['Unlimited AI access', 'Priority support']
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {tiers.map((tier) => (
        <motion.div
          key={tier.name}
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className="border border-border rounded-xl p-4 bg-card hover:shadow-lg transition-shadow">
            {/* Tier Ring Demo */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`
                w-12 h-12 rounded-full p-[3px]
                bg-gradient-to-br ${tier.color}
                ${tier.name === 'Gold' ? 'animate-[spin_3s_linear_infinite]' : ''}
              `}>
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl">
                  {tier.icon}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{tier.name}</h3>
                <p className="text-xs text-muted-foreground">Membership</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
