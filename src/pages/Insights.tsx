import { motion } from 'framer-motion';
import { Flame, AlertTriangle, X } from 'lucide-react';
import { mockDataService } from '../services/mockData';

export const Insights = () => {
  const subscriptions = mockDataService.getSubscriptions();
  const topGougingItems = mockDataService.getTopPriceGougingItems(5);
  const userStats = mockDataService.getUserStats();

  const monthsSinceLastUsed = (lastUsed: string) => {
    const last = new Date(lastUsed);
    const now = new Date();
    const months = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-['Space_Grotesk'] font-bold mb-2">Your Money Story</h1>
        <p className="text-gray-400">AI-generated insights from your spending patterns</p>
      </div>

      {/* AI Narrative Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-xl p-8"
      >
        <h2 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 text-[#00FF85]">This Month's Summary</h2>
        <div className="space-y-4 text-lg leading-relaxed text-gray-300">
          <p>
            This month you spent <span className="font-bold text-white">${userStats.monthlySpends[userStats.monthlySpends.length - 1]?.amount || 0}</span> across {userStats.receiptsScanned} receipts,
            which is <span className="font-bold text-red-400">${userStats.monthlySpends[userStats.monthlySpends.length - 1]?.inflationImpact || 0} more</span> than your 2022 equivalent.
          </p>
          <p>
            <span className="font-bold text-white">Groceries are killing you</span> — they're up{' '}
            <span className="font-bold text-red-400">23%</span> from your baseline. Eggs alone have jumped{' '}
            <span className="font-bold text-red-400">43%</span>, and chicken is up{' '}
            <span className="font-bold text-red-400">30%</span>.
          </p>
          <p>
            Your <span className="font-bold text-white">Rage Score of {userStats.rageScore}</span> puts you in the top 20% of price-gouged consumers in your region. 
            You're not imagining it — the data proves you're getting squeezed.
          </p>
          <p>
            On the subscription front, you're burning <span className="font-bold text-red-400">${userStats.subscriptionWaste.toFixed(2)}/month</span> on services 
            you barely use. That's <span className="font-bold text-white">${(userStats.subscriptionWaste * 12).toFixed(2)}/year</span> down the drain.
          </p>
        </div>
      </motion.div>

      {/* Subscription Graveyard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-morphism rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-['Space_Grotesk'] font-bold flex items-center gap-2">
                💀 Subscription Graveyard
              </h2>
              <p className="text-gray-400 mt-1">
                You're burning <span className="text-red-400 font-bold">${userStats.subscriptionWaste.toFixed(2)}/month</span> on forgotten subscriptions
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {subscriptions.map((sub, index) => {
            const monthsUnused = monthsSinceLastUsed(sub.lastUsed);
            const isWasted = monthsUnused > 2;

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 hover:bg-white/5 transition-colors ${isWasted ? 'bg-red-500/5' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{sub.name}</h3>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded">{sub.category}</span>
                      {isWasted && (
                        <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          {monthsUnused} months unused
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      Last used: {new Date(sub.lastUsed).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${sub.monthlyCost.toFixed(2)}</p>
                      <p className="text-sm text-gray-400">per month</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-red-500/20 text-red-400 p-3 rounded-lg hover:bg-red-500/30 transition-colors"
                      onClick={() => alert(`Cancellation link for ${sub.name} would open here`)}
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-6 bg-white/5 text-center">
          <p className="text-xl font-semibold">
            Total waste: <span className="text-red-400">${userStats.subscriptionWaste.toFixed(2)}/month</span>
          </p>
          <p className="text-gray-400 mt-1">
            That's <span className="font-bold">${(userStats.subscriptionWaste * 12).toFixed(2)}/year</span> you could save
          </p>
        </div>
      </motion.div>

      {/* Price Gouging Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-morphism rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-['Space_Grotesk'] font-bold flex items-center gap-2">
            <Flame className="w-7 h-7 text-red-500" />
            Price Gouging Leaderboard
          </h2>
          <p className="text-gray-400 mt-1">The most overpriced items you bought this month</p>
        </div>

        <div className="divide-y divide-white/5">
          {topGougingItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 font-bold text-xl">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400">
                    ${item.unitPrice.toFixed(2)} (was ${item.price2022.toFixed(2)} in 2022)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-400">+{item.percentChange}%</p>
                  <p className="text-sm text-gray-400">price increase</p>
                </div>
                {index === 0 && <Flame className="w-8 h-8 text-red-500 animate-pulse" />}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-morphism rounded-xl p-8 text-center border-2 border-[#00FF85]/50"
      >
        <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4">Share Your Inflation Truth</h3>
        <p className="text-gray-400 mb-6">
          Let the world know how much you're being squeezed. Generate your shareable report card.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/app'}
          className="bg-[#00FF85] text-navy px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#00FF85]/90 transition-colors"
        >
          Scan Another Receipt
        </motion.button>
      </motion.div>
    </div>
  );
};
