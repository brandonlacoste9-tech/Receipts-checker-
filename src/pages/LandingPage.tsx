import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, TrendingUp, Share2, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              Stop wondering where your <span className="text-primary-accent">money</span> went.
            </h1>
            <p className="mb-8 text-xl text-gray-300 md:text-2xl">
              Snap a receipt. Expose the truth. Share the rage.
            </p>
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-primary-accent px-8 py-4 text-lg font-semibold text-primary-bg transition-all hover:bg-opacity-90"
              >
                Scan Your First Receipt Free
              </motion.button>
            </Link>
          </motion.div>

          {/* Animated Receipt Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16"
          >
            <div className="relative mx-auto h-64 w-48 rounded-lg border-2 border-primary-accent/30 bg-white/5 p-4 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, 200, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 top-0 h-1 bg-primary-accent shadow-[0_0_20px_rgba(0,255,133,0.8)]"
              />
              <div className="space-y-2 text-xs text-gray-400">
                <div className="h-2 w-3/4 bg-gray-700 rounded" />
                <div className="h-2 w-1/2 bg-gray-700 rounded" />
                <div className="mt-4 space-y-1">
                  <div className="h-2 w-full bg-gray-700 rounded" />
                  <div className="h-2 w-full bg-gray-700 rounded" />
                  <div className="h-2 w-5/6 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-sm text-gray-400"
          >
            <Sparkles className="inline mr-2 h-4 w-4 text-primary-accent" />
            47,293 receipts scanned today
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Camera,
                title: 'Snap Any Receipt',
                description: 'Take a photo or upload any receipt. Our AI extracts every detail instantly.',
              },
              {
                icon: TrendingUp,
                title: 'See Your Inflation Hit',
                description: 'Compare current prices to 2022 baselines. Know exactly how much more you\'re paying.',
              },
              {
                icon: Share2,
                title: 'Share the Outrage',
                description: 'Generate beautiful shareable cards. Let everyone know about price gouging.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              >
                <feature.icon className="mb-4 h-12 w-12 text-primary-accent" />
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-4xl font-bold text-white">Simple Pricing</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Tier */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <h3 className="mb-4 text-2xl font-semibold text-white">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="mb-8 space-y-3 text-left text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2 text-primary-accent">✓</span> 5 scans per month
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary-accent">✓</span> Basic insights
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary-accent">✓</span> Share to social
                </li>
              </ul>
              <Link to="/app">
                <button className="w-full rounded-lg border-2 border-primary-accent bg-transparent px-6 py-3 font-semibold text-primary-accent transition-all hover:bg-primary-accent hover:text-primary-bg">
                  Get Started
                </button>
              </Link>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl border-2 border-primary-accent bg-gradient-to-b from-primary-accent/20 to-transparent p-8 backdrop-blur-sm"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary-accent px-4 py-1 text-sm font-semibold text-primary-bg">
                POPULAR
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-white">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$4.99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="mb-8 space-y-3 text-left text-gray-300">
                <li className="flex items-center">
                  <span className="mr-2 text-primary-accent">✓</span> Unlimited scans
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary-accent">✓</span> Advanced insights
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary-accent">✓</span> Subscription tracker
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-primary-accent">✓</span> Priority support
                </li>
              </ul>
              <Link to="/app">
                <button className="w-full rounded-lg bg-primary-accent px-6 py-3 font-semibold text-primary-bg transition-all hover:bg-opacity-90">
                  Upgrade to Pro
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8 text-center">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-2xl font-bold text-primary-accent">ReceiptAI</div>
          <div className="space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            © 2026 ReceiptAI. Your receipts don't lie.
          </p>
        </div>
      </footer>
    </div>
  );
}
