import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Twitter, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { MockDataService } from '../services/mockData';
import Layout from '../components/Layout';

export default function SharePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const receipt = MockDataService.getReceipt(id || '');

  if (!receipt) {
    return (
      <Layout>
        <div className="text-center text-white">
          <p>Receipt not found</p>
          <button
            onClick={() => navigate('/app')}
            className="mt-4 text-primary-accent hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const totalBaseline = receipt.items.reduce((sum, item) => sum + (item.baselinePrice * item.quantity), 0);
  const overpaid = receipt.total - totalBaseline;
  const rageScore = Math.min(100, Math.round((overpaid / totalBaseline) * 100));
  const mostOverpriced = receipt.items.reduce((max, item) => 
    item.percentChange > max.percentChange ? item : max
  );

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0D0F1A',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `receiptai-report-${receipt.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleTwitterShare = () => {
    const text = `I just found out I overpaid $${overpaid.toFixed(2)} on my recent ${receipt.vendor} receipt! That's ${Math.round((overpaid/totalBaseline)*100)}% more than 2022 prices. Find your number at ReceiptAI.app`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/scan/${receipt.id}`)}
          className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Receipt
        </button>

        <h1 className="mb-8 text-3xl font-bold text-white">Share Your Receipt Report</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Share Card Preview */}
          <div>
            <div ref={cardRef} className="aspect-[9/16] w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-primary-bg p-8">
              {/* Logo */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-primary-accent">ReceiptAI</h2>
                <p className="text-sm text-gray-400">My Receipt Report</p>
              </div>

              {/* Main Stats */}
              <div className="mb-8 space-y-6">
                {/* Overpaid Amount */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="text-center"
                >
                  <p className="mb-2 text-sm text-gray-400">I overpaid in 2026</p>
                  <p className="text-6xl font-bold text-red-400">
                    +${overpaid.toFixed(2)}
                  </p>
                  <p className="mt-2 text-xl text-gray-300">at {receipt.vendor}</p>
                  <p className="text-sm text-gray-500">{receipt.date}</p>
                </motion.div>

                {/* Rage Score */}
                <div className="rounded-xl border border-white/20 bg-white/5 p-6">
                  <p className="mb-3 text-center text-sm text-gray-400">Rage Score</p>
                  <div className="relative h-4 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rageScore}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
                    />
                  </div>
                  <p className="mt-3 text-center text-3xl font-bold text-orange-500">
                    {rageScore}/100 🔥
                  </p>
                </div>

                {/* Most Overpriced */}
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="mb-2 text-xs text-gray-400">Most Overpriced Item</p>
                  <p className="font-semibold text-white">{mostOverpriced.name}</p>
                  <p className="text-2xl font-bold text-red-400">+{mostOverpriced.percentChange}%</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/20 pt-4 text-center">
                <p className="text-sm text-gray-400">Find your number at</p>
                <p className="text-lg font-bold text-primary-accent">ReceiptAI.app</p>
              </div>
            </div>
          </div>

          {/* Share Actions */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary-accent py-4 font-semibold text-primary-bg transition-all hover:bg-opacity-90"
            >
              <Download className="h-5 w-5" />
              Download as PNG
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTwitterShare}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#1DA1F2] py-4 font-semibold text-white transition-all hover:bg-opacity-90"
            >
              <Twitter className="h-5 w-5" />
              Share on Twitter
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-white/20 bg-transparent py-4 font-semibold text-white transition-all hover:bg-white/5"
            >
              <LinkIcon className="h-5 w-5" />
              Copy Link
            </motion.button>

            {/* Tips */}
            <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="mb-3 font-semibold text-white">💡 Sharing Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Download the image and share on Instagram Stories</li>
                <li>• Tag us @ReceiptAI for a chance to be featured</li>
                <li>• Use #PriceGouging #InflationCheck to join the conversation</li>
              </ul>
            </div>

            {/* Stats Preview */}
            <div className="rounded-lg border border-white/10 bg-white/5 p-6">
              <h3 className="mb-3 font-semibold text-white">Your Receipt Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items scanned:</span>
                  <span className="font-semibold text-white">{receipt.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg price increase:</span>
                  <span className="font-semibold text-red-400">
                    +{Math.round(receipt.items.reduce((sum, i) => sum + i.percentChange, 0) / receipt.items.length)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-semibold text-white capitalize">{receipt.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
