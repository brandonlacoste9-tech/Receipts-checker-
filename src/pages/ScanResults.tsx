import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, AlertTriangle, Download } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { mockDataService } from '../services/mockData';
import { generateShareableCard, downloadImage, shareToTwitter } from '../utils/shareUtils';
import { useState } from 'react';

export const ScanResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addReceipt } = useAppStore();
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  
  const receipt = mockDataService.getReceiptById(id || '');

  if (!receipt) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Receipt not found</h2>
        <button onClick={() => navigate('/app')} className="text-[#00FF85] hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    setIsGeneratingCard(true);
    try {
      const dataUrl = await generateShareableCard('shareable-card');
      downloadImage(dataUrl);
      
      // Confetti effect
      const confetti = document.createElement('div');
      confetti.className = 'fixed inset-0 pointer-events-none z-50';
      confetti.innerHTML = '🎉'.repeat(20);
      confetti.style.cssText = 'font-size: 3rem; display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; align-items: center; animation: confetti 2s ease-out;';
      document.body.appendChild(confetti);
      setTimeout(() => document.body.removeChild(confetti), 2000);
    } catch (error) {
      console.error('Error generating shareable card:', error);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleShareTwitter = () => {
    const text = `I just discovered I'm paying $${receipt.overpaid.toFixed(2)} more than I should have! 😤 Find your inflation truth at`;
    shareToTwitter(text);
  };

  const handleAddToHistory = () => {
    addReceipt(receipt);
    alert('Receipt added to history!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            disabled={isGeneratingCard}
            className="flex items-center gap-2 bg-[#00FF85] text-navy px-6 py-3 rounded-lg font-semibold hover:bg-[#00FF85]/90 transition-colors disabled:opacity-50"
          >
            {isGeneratingCard ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-navy border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Card
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShareTwitter}
            className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </motion.button>
        </div>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-xl p-8 border-2 border-red-500/50"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-['Space_Grotesk'] font-bold mb-2">{receipt.storeName}</h1>
            <p className="text-gray-400">{new Date(receipt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <span className="bg-[#00FF85]/20 text-[#00FF85] px-4 py-2 rounded-lg font-semibold uppercase text-sm">
            {receipt.category}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 mb-1">Total Paid</p>
            <p className="text-3xl font-bold">${receipt.totalPaid.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">2022 Equivalent</p>
            <p className="text-3xl font-bold text-gray-300">${receipt.total2022.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">You Overpaid</p>
            <p className="text-3xl font-bold text-red-400">+${receipt.overpaid.toFixed(2)}</p>
          </div>
        </div>
      </motion.div>

      {/* Line Items Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-morphism rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-['Space_Grotesk'] font-bold">Receipt Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 font-semibold">Item</th>
                <th className="text-center p-4 font-semibold">Qty</th>
                <th className="text-right p-4 font-semibold">Unit Price</th>
                <th className="text-right p-4 font-semibold">2022 Price</th>
                <th className="text-right p-4 font-semibold">Change</th>
                <th className="text-right p-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item.name}
                      {item.isPriceGouging && (
                        <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-semibold">
                          <AlertTriangle className="w-3 h-3" />
                          GOUGING
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center p-4 text-gray-400">{item.quantity}</td>
                  <td className="text-right p-4">${item.unitPrice.toFixed(2)}</td>
                  <td className="text-right p-4 text-gray-400">${item.price2022.toFixed(2)}</td>
                  <td className={`text-right p-4 font-semibold ${item.percentChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {item.percentChange > 0 ? '+' : ''}{item.percentChange}%
                  </td>
                  <td className="text-right p-4 font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToHistory}
          className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
        >
          Add to History
        </button>
        <button
          onClick={() => navigate('/insights')}
          className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
        >
          View Full Insights
        </button>
      </div>

      {/* Hidden Shareable Card for Export */}
      <div id="shareable-card" className="fixed -left-[9999px] w-[1200px] h-[630px] bg-[#0D0F1A] p-16">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="text-6xl font-['Space_Grotesk'] font-bold mb-8 text-[#00FF85]">ReceiptAI</div>
          <div className="text-3xl text-gray-400 mb-12">My Receipt Report</div>
          <div className="text-8xl font-bold text-red-400 mb-4">+${receipt.overpaid.toFixed(2)}</div>
          <div className="text-4xl text-gray-300 mb-12">overpaid vs 2022</div>
          <div className="flex gap-4 items-center mb-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-5xl">
                {i < Math.floor((receipt.overpaid / receipt.totalPaid) * 100 / 20) ? '🔥' : ''}
              </span>
            ))}
          </div>
          <div className="text-2xl text-gray-400">Find your inflation truth at ReceiptAI.app</div>
        </div>
      </div>
    </div>
  );
};
