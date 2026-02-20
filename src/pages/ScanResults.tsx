import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, AlertTriangle } from 'lucide-react';
import { MockDataService } from '../services/mockData';
import Layout from '../components/Layout';

export default function ScanResults() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const percentIncrease = Math.round((overpaid / totalBaseline) * 100);

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/app')}
          className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/20 to-transparent p-8 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{receipt.vendor}</h1>
              <p className="text-gray-400">{receipt.date}</p>
            </div>
            <button
              onClick={() => navigate(`/share/${receipt.id}`)}
              className="flex items-center gap-2 rounded-lg bg-primary-accent px-4 py-2 font-semibold text-primary-bg transition-all hover:bg-opacity-90"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-sm text-gray-400">Total Paid</p>
              <p className="text-2xl font-bold text-white">${receipt.total.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-sm text-gray-400">2022 Baseline</p>
              <p className="text-2xl font-bold text-white">${totalBaseline.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-red-500/20 p-4">
              <p className="text-sm text-gray-400">You Overpaid</p>
              <p className="text-2xl font-bold text-red-400">
                +${overpaid.toFixed(2)} ({percentIncrease}%)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Items Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <h2 className="mb-6 text-2xl font-bold text-white">Item Breakdown</h2>
          
          <div className="space-y-3">
            {receipt.items.map((item, index) => {
              const totalPrice = item.price * item.quantity;
              const totalBaseline = item.baselinePrice * item.quantity;
              const difference = totalPrice - totalBaseline;
              const isPriceGouging = item.percentChange > 30;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`rounded-lg p-4 ${
                    isPriceGouging
                      ? 'border-2 border-red-500/30 bg-red-500/10'
                      : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{item.name}</h3>
                        {isPriceGouging && (
                          <div className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                            <AlertTriangle className="h-3 w-3" />
                            Price Gouging
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${totalPrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-400">
                        2022: ${totalBaseline.toFixed(2)}
                      </p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + (0.1 * index) }}
                        className={`text-sm font-semibold ${
                          difference > 0 ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {difference > 0 ? '+' : ''}${difference.toFixed(2)} ({item.percentChange > 0 ? '+' : ''}{item.percentChange}%)
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Items above baseline:</span>
              <span className="font-semibold text-white">
                {receipt.items.filter(i => i.percentChange > 0).length} of {receipt.items.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Average price increase:</span>
              <span className="font-semibold text-red-400">
                +{Math.round(receipt.items.reduce((sum, i) => sum + i.percentChange, 0) / receipt.items.length)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Most overpriced item:</span>
              <span className="font-semibold text-red-400">
                {receipt.items.reduce((max, item) => item.percentChange > max.percentChange ? item : max).name}
                {' '}(+{receipt.items.reduce((max, item) => item.percentChange > max.percentChange ? item : max).percentChange}%)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/share/${receipt.id}`)}
            className="flex-1 rounded-lg bg-primary-accent py-3 font-semibold text-primary-bg transition-all hover:bg-opacity-90"
          >
            Generate Share Card
          </button>
          <button
            onClick={() => navigate('/app')}
            className="flex-1 rounded-lg border-2 border-white/20 bg-transparent py-3 font-semibold text-white transition-all hover:bg-white/5"
          >
            Scan Another
          </button>
        </div>
      </div>
    </Layout>
  );
}
