import { motion } from 'framer-motion';
import { Camera, TrendingUp, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0D0F1A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-['Space_Grotesk'] text-6xl md:text-7xl font-bold mb-6">
              Stop wondering where your{' '}
              <span className="text-gradient">money went</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Snap a receipt. Expose the truth. Share the rage.
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Your receipts don't lie. Find out where your money really went.
            </p>
            
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#00FF85] text-navy px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#00FF85]/90 transition-colors inline-flex items-center gap-2"
              >
                Scan Your First Receipt Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 text-sm text-gray-500"
            >
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF85] rounded-full animate-pulse"></span>
                47,293 receipts scanned today
              </span>
            </motion.div>
          </motion.div>
          
          {/* Animated Receipt Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="glass-morphism rounded-2xl p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF85]/10 to-transparent rounded-2xl"></div>
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6">
                    <div className="text-4xl font-bold text-[#00FF85] mb-2">+$1,247</div>
                    <div className="text-gray-400">Overpaid This Year</div>
                  </div>
                  <div className="text-center p-6">
                    <div className="text-4xl font-bold text-[#00FF85] mb-2">43%</div>
                    <div className="text-gray-400">Egg Price Increase</div>
                  </div>
                  <div className="text-center p-6">
                    <div className="text-4xl font-bold text-[#00FF85] mb-2">$127</div>
                    <div className="text-gray-400">Subscription Waste</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="px-4 py-20 bg-[#1A1D2E]/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="w-12 h-12 text-[#00FF85]" />}
              title="📸 Snap Any Receipt"
              description="Upload any receipt and our AI instantly extracts every line item, no manual entry needed."
              delay={0}
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-[#00FF85]" />}
              title="📊 See Your Inflation Hit"
              description="Compare prices to 2022 baselines and discover exactly how much more you're paying today."
              delay={0.1}
            />
            <FeatureCard
              icon={<Share2 className="w-12 h-12 text-[#00FF85]" />}
              title="🔥 Share the Outrage"
              description="Generate beautiful shareable cards showing your inflation impact. Let the world know."
              delay={0.2}
            />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Free"
              price="$0"
              features={[
                '5 receipt scans per month',
                'Basic inflation tracking',
                'Shareable reports',
                'Community access',
              ]}
              cta="Get Started"
              delay={0}
            />
            <PricingCard
              title="Pro"
              price="$4.99"
              period="/month"
              features={[
                'Unlimited receipt scans',
                'Advanced insights & analytics',
                'Subscription tracker',
                'Price gouging alerts',
                'Priority support',
              ]}
              cta="Upgrade to Pro"
              highlighted
              delay={0.1}
            />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2025 ReceiptAI. Your receipts don't lie.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="glass-morphism rounded-xl p-8 hover:bg-white/10 transition-colors"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  delay: number;
}

const PricingCard = ({ title, price, period, features, cta, highlighted, delay }: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`glass-morphism rounded-xl p-8 ${
        highlighted ? 'ring-2 ring-[#00FF85]' : ''
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-5xl font-bold">{price}</span>
        {period && <span className="text-gray-400">{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-[#00FF85] mt-1">✓</span>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/app">
        <button
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            highlighted
              ? 'bg-[#00FF85] text-navy hover:bg-[#00FF85]/90'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {cta}
        </button>
      </Link>
    </motion.div>
  );
};
