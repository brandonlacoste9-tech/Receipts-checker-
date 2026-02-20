import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import { MockDataService } from '../services/mockData';
import Layout from '../components/Layout';

export default function InsightsPage() {
  const subscriptions = MockDataService.getSubscriptions();
  const mostOverpriced = MockDataService.getMostOverpricedItems();
  const totalSubscriptionCost = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);

  const monthsSinceLastUsed = (lastUsed: string) => {
    const last = new Date(lastUsed);
    const now = new Date();
    const months = (now.getFullYear() - last.getFullYear()) * 12 + (now.getMonth() - last.getMonth());
    return months;
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Your Money Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <h2 className="mb-6 text-2xl font-bold text-white">Your Money Story</h2>
          <div className="space-y-4 text-gray-300">
            <p className="text-lg leading-relaxed">
              This week you spent <span className="font-bold text-primary-accent">$234</span> on groceries,
              <span className="font-bold text-red-400"> $67 more</span> than your 2022 equivalent.
            </p>
            <p className="text-lg leading-relaxed">
              Eggs are killing you — up <span className="font-bold text-red-400">74%</span> from baseline.
              Your gas spending increased by <span className="font-bold text-red-400">31%</span>, 
              adding an extra <span className="font-bold text-red-400">$18</span> per fill-up.
            </p>
            <p className="text-lg leading-relaxed">
              Dining out is costing you <span className="font-bold text-red-400">22% more</span> than 2022.
              That $13 burrito bowl? It was $10 two years ago.
            </p>
            <p className="mt-6 text-base italic text-gray-400">
              Bottom line: Inflation has cost you an estimated{' '}
              <span className="font-bold text-red-400">+$1,247</span> so far this year.
            </p>
          </div>
        </motion.div>

        {/* Subscription Graveyard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Subscription Graveyard 💀</h2>
            <div className="rounded-lg bg-red-500/20 px-4 py-2">
              <p className="text-sm text-gray-400">Burning per month</p>
              <p className="text-2xl font-bold text-red-400">${totalSubscriptionCost.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4">
            {subscriptions.map((sub, index) => {
              const monthsUnused = monthsSinceLastUsed(sub.lastUsed);
              const isUnused = monthsUnused > 2;

              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`rounded-lg p-4 ${
                    isUnused
                      ? 'border-2 border-red-500/30 bg-red-500/10'
                      : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">{sub.name}</h3>
                        {isUnused && (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                            Unused {monthsUnused}+ months
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{sub.category}</p>
                      <p className="text-xs text-gray-500">Last used: {sub.lastUsed}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-white">${sub.monthlyCost}/mo</p>
                        {isUnused && (
                          <p className="text-sm text-red-400">
                            Wasted: ${(sub.monthlyCost * monthsUnused).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600">
                        Cancel This
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total monthly subscriptions</p>
                <p className="text-2xl font-bold text-white">${totalSubscriptionCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Potential savings</p>
                <p className="text-2xl font-bold text-primary-accent">
                  $
                  {subscriptions
                    .filter(s => monthsSinceLastUsed(s.lastUsed) > 2)
                    .reduce((sum, s) => sum + s.monthlyCost, 0)
                    .toFixed(2)}
                  /mo
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Price Gouging Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <Flame className="h-8 w-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-white">Price Gouging Leaderboard</h2>
          </div>

          <div className="space-y-3">
            {mostOverpriced.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="relative overflow-hidden rounded-lg bg-gradient-to-r from-red-500/20 to-transparent p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${
                    index === 0 ? 'bg-yellow-500 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-800' :
                    index === 2 ? 'bg-orange-600 text-orange-100' :
                    'bg-white/10 text-white'
                  }`}>
                    {index === 0 && '🔥'}
                    {index > 0 && `#${index + 1}`}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.vendor}</p>
                  </div>

                  {/* Percentage */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + (0.1 * index), type: "spring" }}
                    className="text-right"
                  >
                    <p className="text-3xl font-bold text-red-400">+{item.percentChange}%</p>
                    <p className="text-xs text-gray-400">vs 2022</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Summary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border-2 border-primary-accent/30 bg-gradient-to-br from-primary-accent/20 to-transparent p-8 text-center backdrop-blur-sm"
        >
          <TrendingUp className="mx-auto mb-4 h-12 w-12 text-primary-accent" />
          <h3 className="mb-2 text-2xl font-bold text-white">Want Weekly Insights?</h3>
          <p className="mb-6 text-gray-300">
            Upgrade to Pro for AI-generated weekly reports and advanced analytics
          </p>
          <button className="rounded-lg bg-primary-accent px-8 py-3 font-semibold text-primary-bg transition-all hover:bg-opacity-90">
            Upgrade to Pro - $4.99/mo
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
