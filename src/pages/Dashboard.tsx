import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, TrendingUp, Flame } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MockDataService } from '../services/mockData';
import { useStore } from '../store';
import Layout from '../components/Layout';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isScanning, setIsScanning, setCurrentReceipt, addReceipt } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const monthlyData = MockDataService.getMonthlySpend();
  const categoryData = MockDataService.getCategorySpend();
  const inflationHit = MockDataService.getYearToDateInflation();
  const rageScore = MockDataService.getRageScore();

  const COLORS = ['#00FF85', '#00C766', '#009F52', '#00773D', '#004F28'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (_file: File) => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const scannedReceipt = MockDataService.simulateScan();
      const newReceipt = {
        ...scannedReceipt,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
      };
      
      addReceipt(newReceipt);
      setCurrentReceipt(newReceipt);
      setIsScanning(false);
      
      navigate(`/scan/${newReceipt.id}`);
    }, 3000);
  };

  return (
    <Layout>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scan Panel */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Quick Scan</h2>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              dragActive
                ? 'border-primary-accent bg-primary-accent/10'
                : 'border-white/20 bg-white/5'
            } ${isScanning ? 'pointer-events-none' : 'cursor-pointer hover:border-primary-accent'}`}
            onClick={() => !isScanning && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative mx-auto h-32 w-24 overflow-hidden rounded-lg bg-white/10">
                    <motion.div
                      animate={{ y: [0, 128, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 top-0 h-1 bg-primary-accent shadow-[0_0_20px_rgba(0,255,133,0.8)]"
                    />
                  </div>
                  <p className="text-lg font-semibold text-primary-accent">Scanning receipt...</p>
                  <p className="text-sm text-gray-400">Extracting data with AI</p>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <Upload className="mx-auto h-16 w-16 text-primary-accent" />
                  <div>
                    <p className="text-lg font-semibold text-white">
                      Drop your receipt here
                    </p>
                    <p className="text-sm text-gray-400">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Camera className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Supports JPG, PNG, HEIC
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent Scans */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Recent Scans</h3>
            <div className="space-y-3">
              {MockDataService.getReceipts().slice(0, 5).map((receipt) => (
                <motion.div
                  key={receipt.id}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(`/scan/${receipt.id}`)}
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <div>
                    <p className="font-medium text-white">{receipt.vendor}</p>
                    <p className="text-sm text-gray-400">{receipt.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${receipt.total.toFixed(2)}</p>
                    <p className="text-xs text-red-400">
                      +{Math.round((receipt.total / receipt.items.reduce((sum, i) => sum + (i.baselinePrice * i.quantity), 0) - 1) * 100)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Your Stats</h2>

          {/* Inflation Hit Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/20 to-transparent p-6 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Your Inflation Hit (2026 YTD)</p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mt-2 text-5xl font-bold text-red-400"
                >
                  +${inflationHit.toLocaleString()}
                </motion.p>
                <p className="mt-2 text-sm text-gray-300">
                  vs 2022 baseline prices
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-red-400" />
            </div>
          </motion.div>

          {/* Rage Score */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Rage Score</h3>
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div className="relative h-8 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rageScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">Price gouging vs national avg</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-orange-500"
              >
                {rageScore}/100
              </motion.p>
            </div>
          </div>

          {/* Monthly Spend Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Monthly Spend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D0F1A',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#00FF85"
                  strokeWidth={2}
                  dot={{ fill: '#00FF85', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Category Breakdown</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0F1A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryData.map((cat, index) => (
                  <div key={cat.category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-gray-300">{cat.category}</span>
                    </div>
                    <span className="font-semibold text-white">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
