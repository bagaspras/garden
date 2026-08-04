// Main Application File
console.log('🌱 Habit Garden Starting...');

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
  console.log('✅ DOM Content Loaded');
  await initializeApp();
});

async function initializeApp() {
  try {
    // 1. Initialize database
    console.log('📦 Initializing database...');
    await Database.init();

    // 2. Initialize notification system
    console.log('🔔 Initializing notifications...');
    Notification.init();

    // 3. Initialize UI
    console.log('🎨 Initializing UI...');
    UI.init();

    // 4. Load data
    console.log('📊 Loading data...');
    await UI.refresh();

    console.log('🎉 Application initialized successfully!');

    // Auto-refresh every minute
    setInterval(async () => {
      await UI.refresh();
    }, 60000);

  } catch (error) {
    console.error('❌ Error initializing application:', error);
    alert('Gagal menginisialisasi aplikasi. Silakan refresh halaman.');
  }
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('✅ Service Worker registered'))
    .catch(err => console.log('❌ Service Worker registration failed:', err));
}

// Handle before unload
window.addEventListener('beforeunload', async () => {
  // Backup data to LocalStorage
  try {
    await Backup.backupToLocalStorage();
  } catch (error) {
    console.error('Error backing up data:', error);
  }
});

// Export for external use
window.HabitGarden = {
  initializeApp,
  UI,
  Database,
  Habit,
  Garden,
  Calendar,
  Stats,
  Notification,
  Backup
};

