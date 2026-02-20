export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-8 right-8 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === 'success' ? 'bg-[#00FF85] text-[#0D0F1A]' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-blue-500 text-white'
  } font-semibold`;
  toast.textContent = message;
  toast.style.animation = 'slideIn 0.3s ease-out';
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
