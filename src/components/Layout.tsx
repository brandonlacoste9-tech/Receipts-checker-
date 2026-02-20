import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, History, TrendingUp, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { userProfile } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Scan', href: '/app', icon: Camera },
    { name: 'History', href: '/app', icon: History },
    { name: 'Insights', href: '/insights', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-white/10 p-2 lg:hidden"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-primary-bg p-6 transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <Link to="/" className="mb-8 block">
          <h1 className="text-2xl font-bold text-primary-accent">ReceiptAI</h1>
          <p className="text-xs text-gray-500">Your receipts don't lie</p>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-primary-accent/20 text-primary-accent'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-accent text-sm font-bold text-primary-bg">
                {userProfile.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{userProfile.name}</p>
                <p className="text-xs text-gray-400">
                  {userProfile.isPro ? 'Pro Member' : 'Free'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="border-b border-white/10 bg-primary-bg/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1 lg:ml-0 ml-12">
              <h2 className="text-xl font-semibold text-white">
                {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white/5 px-4 py-2 text-sm">
                <span className="text-gray-400">Monthly Spend: </span>
                <span className="font-semibold text-white">$1,567</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary-accent/20 px-3 py-2 text-sm">
                <span className="text-primary-accent">🔥</span>
                <span className="font-semibold text-primary-accent">15 day streak</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
