// Simple toast utility without external dependencies
export const toast = {
  success: (message: string) => {
    console.log('✅ Toast Success:', message);
    showToast(message, 'success');
  },
  
  error: (message: string) => {
    console.error('❌ Toast Error:', message);
    showToast(message, 'error');
  },
  
  info: (message: string) => {
    console.log('ℹ️ Toast Info:', message);
    showToast(message, 'info');
  }
};

function showToast(message: string, type: 'success' | 'error' | 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity = '1';
  }, 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 4000);
}