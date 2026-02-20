import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ScanLine, TrendingUp, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

export const AppLayout = () => {
  const location = useLocation();
  const { userProfile, userStats } = useAppStore();

  const navItems = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/scan', icon: ScanLine, label: 'Scan' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app' || location.pathname === '/app/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 bg-[#1A1D2E] border-r border-white/10 p-6 flex flex-col"
      >
        {/* Logo */}
        <Link to="/" className="mb-12">
          <h1 className="text-3xl font-['Space_Grotesk'] font-bold text-[#00FF85]">ReceiptAI</h1>
          <p className="text-sm text-gray-400">Your receipts don't lie</p>
        </Link>

        {/* User Profile */}
        <div className="mb-8 p-4 glass-morphism rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <img src={userProfile.avatar} alt={userProfile.name} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold">{userProfile.name}</p>
              <p className="text-xs text-gray-400">{userProfile.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Monthly spend</span>
            <span className="font-bold text-[#00FF85]">
              ${userStats.monthlySpends[userStats.monthlySpends.length - 1]?.amount || 0}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-[#00FF85]/20 text-[#00FF85] font-semibold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 bg-[#00FF85] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Streak Badge */}
        <div className="mb-6 p-4 bg-gradient-to-br from-[#00FF85]/20 to-transparent rounded-xl border border-[#00FF85]/30">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <p className="font-semibold">7 Day Streak</p>
              <p className="text-xs text-gray-400">Keep scanning daily!</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
