// Utility Module - Helper functions
const Utils = {
  // Format date to readable format
  formatDate(date) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('id-ID', options);
  },

  // Format time to readable format
  formatTime(date) {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(date).toLocaleTimeString('id-ID', options);
  },

  // Calculate days difference
  daysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
  },

  // Get week number
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Show toast notification
  showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  },

  // Local storage operations
  storage: {
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    remove(key) {
      localStorage.removeItem(key);
    },
    clear() {
      localStorage.clear();
    }
  },

  // Get streak color based on days
  getStreakColor(days) {
    if (days === 0) return '#ccc';
    if (days < 7) return '#FFB74D';
    if (days < 30) return '#4ECDC4';
    return '#2ecc71';
  },

  // Animate number change
  animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  },

  // Generate random ID
  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  },

  // Copy to clipboard
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Copied to clipboard!');
    }).catch(() => {
      this.showToast('Failed to copy');
    });
  },

  // Check if online
  isOnline() {
    return navigator.onLine;
  },

  // Request permission (generic)
  async requestPermission(type) {
    if (type === 'notification' && 'Notification' in window) {
      return await Notification.requestPermission();
    }
  },

  // Get device info
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      onLine: navigator.onLine,
      memory: navigator.deviceMemory,
      cores: navigator.hardwareConcurrency
    };
  },

  // Performance mark
  mark(name) {
    if (performance && performance.mark) {
      performance.mark(name);
    }
  },

  // Performance measure
  measure(name, startMark, endMark) {
    if (performance && performance.measure) {
      performance.measure(name, startMark, endMark);
    }
  }
};
