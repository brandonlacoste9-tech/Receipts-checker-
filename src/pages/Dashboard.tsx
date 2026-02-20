import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, TrendingUp, AlertCircle } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userStats, scanReceipt, isScanning } = useAppStore();
  const navigate = useNavigate();

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

  const handleFile = async (file: File) => {
    // Show image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Scan the receipt
    try {
      const receipt = await scanReceipt(file);
      navigate(`/scan/${receipt.id}`);
    } catch (error) {
      console.error('Error scanning receipt:', error);
    }
  };

  const COLORS = ['#00FF85', '#00D9FF', '#FF6B9D', '#FFB800'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Panel - Quick Scan */}
      <div className="space-y-6">
        <h2 className="text-2xl font-['Space_Grotesk'] font-bold">Quick Scan</h2>
        
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`glass-morphism rounded-xl p-8 border-2 border-dashed transition-all cursor-pointer ${
            dragActive ? 'border-[#00FF85] bg-[#00FF85]/5' : 'border-white/20'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          {isScanning ? (
            <div className="text-center py-12">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-[#00FF85]/20 rounded-lg"></div>
                <motion.div
                  className="absolute inset-0 border-t-4 border-[#00FF85] rounded-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                ></motion.div>
              </div>
              <p className="text-xl font-semibold text-[#00FF85]">Scanning Receipt...</p>
              <p className="text-gray-400 mt-2">Extracting line items and calculating inflation impact</p>
            </div>
          ) : uploadedImage ? (
            <div className="text-center">
              <img src={uploadedImage} alt="Uploaded receipt" className="max-h-64 mx-auto rounded-lg mb-4" />
              <p className="text-gray-400">Click or drag another receipt to scan</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drop receipt here or click to upload</h3>
              <p className="text-gray-400 mb-4">Supports JPG, PNG, or PDF</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <Camera className="w-5 h-5 text-[#00FF85]" />
                <span className="text-sm text-gray-500">Camera capture available on mobile</span>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Recent Activity */}
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Scans</h3>
          <div className="space-y-3">
            {[
              { store: 'Whole Foods', date: 'Jan 20, 2025', amount: '$87.43', overpaid: '+$18.20' },
              { store: 'Shell', date: 'Jan 18, 2025', amount: '$48.63', overpaid: '+$11.50' },
              { store: 'Chipotle', date: 'Jan 15, 2025', amount: '$34.96', overpaid: '+$5.80' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-semibold">{item.store}</p>
                  <p className="text-sm text-gray-400">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.amount}</p>
                  <p className="text-sm text-red-400">{item.overpaid}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Stats Dashboard */}
      <div className="space-y-6">
        <h2 className="text-2xl font-['Space_Grotesk'] font-bold">Your Stats</h2>
        
        {/* Inflation Hit Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-xl p-6 border-2 border-red-500/50"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold">Your Inflation Hit</h3>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-5xl font-bold text-red-400 mb-2">
            +${userStats.totalInflationHit.toLocaleString()}
          </div>
          <p className="text-gray-400">Extra paid vs 2022 baseline this year</p>
        </motion.div>

        {/* Rage Score */}
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Rage Score</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${(userStats.rageScore / 100) * 351.86} 351.86`}
                  className="text-[#00FF85]"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{userStats.rageScore}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">
                You're being price gouged {userStats.rageScore > 80 ? 'severely' : userStats.rageScore > 50 ? 'moderately' : 'slightly'} compared to national average
              </p>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.floor(userStats.rageScore / 20) ? 'text-2xl' : 'text-2xl opacity-30'}>
                    🔥
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Spend Chart */}
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Spending Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={userStats.monthlySpends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1D2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="amount" stroke="#00FF85" strokeWidth={2} dot={{ fill: '#00FF85' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="40%" height={150}>
              <PieChart>
                <Pie
                  data={userStats.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {userStats.categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {userStats.categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm">{category.category}</span>
                  </div>
                  <span className="text-sm font-semibold">${category.amount.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
