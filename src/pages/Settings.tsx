import { motion } from 'framer-motion';
import { Bell, Globe, CreditCard, Mail } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

export const Settings = () => {
  const { userProfile } = useAppStore();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-['Space_Grotesk'] font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-xl p-8"
      >
        <div className="flex items-start gap-6 mb-8">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full ring-4 ring-[#00FF85]/50"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{userProfile.name}</h2>
            <p className="text-gray-400 mb-3">{userProfile.email}</p>
            <div className="flex items-center gap-3">
              {userProfile.isPro && (
                <span className="bg-[#00FF85]/20 text-[#00FF85] px-3 py-1 rounded-lg font-semibold text-sm">
                  PRO
                </span>
              )}
              <span className="text-sm text-gray-400">Joined {new Date(userProfile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-semibold transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={userProfile.name}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF85]"
            />
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              defaultValue={userProfile.email}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF85]"
            />
          </div>
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-morphism rounded-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-[#00FF85]" />
          <h2 className="text-xl font-bold">Notification Preferences</h2>
        </div>

        <div className="space-y-4">
          <SettingToggle
            label="Price Gouging Alerts"
            description="Get notified when items are priced significantly above regional averages"
            defaultChecked
          />
          <SettingToggle
            label="Monthly Reports"
            description="Receive a monthly summary of your spending and inflation impact"
            defaultChecked
          />
          <SettingToggle
            label="Subscription Reminders"
            description="Get alerts about unused subscriptions"
            defaultChecked={false}
          />
          <SettingToggle
            label="Product Updates"
            description="Stay updated on new features and improvements"
            defaultChecked
          />
        </div>
      </motion.div>

      {/* Connected Accounts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-morphism rounded-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-[#00FF85]" />
          <h2 className="text-xl font-bold">Connected Accounts</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="font-semibold">Gmail</p>
                <p className="text-sm text-gray-400">Connected • Scanning for subscriptions</p>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              Disconnect
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border-2 border-dashed border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-semibold">Outlook</p>
                <p className="text-sm text-gray-400">Not connected</p>
              </div>
            </div>
            <button className="bg-[#00FF85] text-navy px-4 py-2 rounded-lg font-semibold hover:bg-[#00FF85]/90 transition-colors">
              Connect
            </button>
          </div>
        </div>
      </motion.div>

      {/* Region & Currency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-morphism rounded-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-[#00FF85]" />
          <h2 className="text-xl font-bold">Region & Currency</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Region</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF85]">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Europe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Currency</label>
            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF85]">
              <option>USD ($)</option>
              <option>CAD ($)</option>
              <option>GBP (£)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Pro Upgrade CTA */}
      {!userProfile.isPro && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-morphism rounded-xl p-8 border-2 border-[#00FF85]/50"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#00FF85]/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-[#00FF85]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
              <p className="text-gray-400 mb-4">
                Get unlimited scans, advanced insights, subscription tracking, and priority support for just $4.99/month.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#00FF85]">✓</span>
                  Unlimited receipt scans
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#00FF85]">✓</span>
                  AI-powered insights & analytics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#00FF85]">✓</span>
                  Automatic subscription tracking
                </li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#00FF85] text-navy px-8 py-3 rounded-lg font-semibold hover:bg-[#00FF85]/90 transition-colors"
              >
                Upgrade Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface SettingToggleProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

const SettingToggle = ({ label, description, defaultChecked = false }: SettingToggleProps) => {
  return (
    <div className="flex items-start justify-between p-4 bg-white/5 rounded-lg">
      <div className="flex-1 pr-4">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#00FF85] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF85]"></div>
      </label>
    </div>
  );
};
