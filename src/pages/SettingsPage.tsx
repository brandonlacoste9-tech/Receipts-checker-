import { motion } from 'framer-motion';
import { User, Bell, CreditCard, Globe, Crown } from 'lucide-react';
import { useStore } from '../store';
import Layout from '../components/Layout';

export default function SettingsPage() {
  const { userProfile } = useStore();

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <User className="h-6 w-6 text-primary-accent" />
            <h2 className="text-2xl font-bold text-white">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Full Name</label>
              <input
                type="text"
                defaultValue={userProfile.name}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">Email</label>
              <input
                type="email"
                defaultValue={userProfile.email}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-primary-accent focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-accent text-2xl font-bold text-primary-bg">
                {userProfile.avatar}
              </div>
              <button className="rounded-lg border-2 border-white/20 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/5">
                Change Avatar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary-accent" />
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Weekly spending reports', enabled: true },
              { label: 'Price spike alerts', enabled: true },
              { label: 'Subscription reminders', enabled: false },
              { label: 'Monthly summary', enabled: true },
              { label: 'Product updates', enabled: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{item.label}</span>
                <button
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    item.enabled ? 'bg-primary-accent' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                      item.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Connected Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-primary-accent" />
            <h2 className="text-2xl font-bold text-white">Connected Accounts</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500 p-2">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Gmail</p>
                  <p className="text-sm text-gray-400">Scanning for subscriptions</p>
                </div>
              </div>
              <button className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white">
                Connected
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500 p-2">
                  <span className="text-xl">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Bank Account</p>
                  <p className="text-sm text-gray-400">Auto-import transactions</p>
                </div>
              </div>
              <button className="rounded-lg border-2 border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">
                Connect
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <Globe className="h-6 w-6 text-primary-accent" />
            <h2 className="text-2xl font-bold text-white">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-400">Currency</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary-accent focus:outline-none">
                <option value="USD">USD - US Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">Region</label>
              <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary-accent focus:outline-none">
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="QC">Quebec</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Pro Upgrade */}
        {!userProfile.isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border-2 border-primary-accent/30 bg-gradient-to-br from-primary-accent/20 to-transparent p-8 text-center backdrop-blur-sm"
          >
            <Crown className="mx-auto mb-4 h-12 w-12 text-primary-accent" />
            <h2 className="mb-2 text-2xl font-bold text-white">Upgrade to Pro</h2>
            <p className="mb-6 text-gray-300">
              Unlock unlimited scans, advanced insights, and subscription tracking
            </p>
            <div className="mb-6 text-5xl font-bold text-white">
              $4.99<span className="text-xl text-gray-400">/month</span>
            </div>
            <ul className="mb-8 space-y-2 text-left text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-primary-accent">✓</span> Unlimited receipt scans
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-accent">✓</span> AI-powered weekly insights
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-accent">✓</span> Subscription graveyard tracker
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-accent">✓</span> Priority support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-accent">✓</span> Export data to CSV
              </li>
            </ul>
            <button className="w-full rounded-lg bg-primary-accent py-4 font-semibold text-primary-bg transition-all hover:bg-opacity-90">
              Upgrade Now
            </button>
          </motion.div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button className="rounded-lg border-2 border-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-white/5">
            Cancel
          </button>
          <button className="rounded-lg bg-primary-accent px-6 py-3 font-semibold text-primary-bg transition-all hover:bg-opacity-90">
            Save Changes
          </button>
        </div>
      </div>
    </Layout>
  );
}
