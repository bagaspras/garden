// Notification Module
const NotificationModule = {
  init() {
    console.log('Notification module initialized');
    this.requestPermission();
  },

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  // Send notification
  async notify(title, options = {}) {
    if (Notification.permission === 'granted') {
      const defaultOptions = {
        icon: 'assets/icons/icon-192.png',
        badge: 'assets/icons/badge.png',
        tag: 'habit-notification',
        requireInteraction: false
      };

      const notification = new Notification(title, { ...defaultOptions, ...options });
      return notification;
    }
  },

  // Send habit reminder
  async sendHabitReminder(habitName) {
    return await this.notify(`Waktu untuk ${habitName}!`, {
      body: 'Jangan lupa menjalankan kebiasaan Anda hari ini',
      icon: 'assets/icons/reminder.png'
    });
  },

  // Send milestone notification
  async sendMilestoneNotification(habitName, milestone) {
    return await this.notify(`🎉 Selamat ${habitName}!`, {
      body: `Anda telah mencapai ${milestone} hari berturut-turut!`,
      tag: `milestone-${habitName}`
    });
  },

  // Send completion notification
  async sendCompletionNotification(habitName) {
    return await this.notify(`✅ ${habitName} Selesai!`, {
      body: 'Kerja bagus! Taman Anda berkembang 🌱',
      tag: 'completion'
    });
  },

  // Schedule notification (requires Service Worker)
  async scheduleNotification(title, options, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.notify(title, options).then(resolve);
      }, delay);
    });
  }
};

// Alias untuk Notification module
const Notification = NotificationModule;
