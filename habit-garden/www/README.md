# Habit Garden 🌱

Aplikasi web untuk melacak kebiasaan Anda dengan konsep visual garden yang berkembang seiring Anda menjalankan kebiasaan.

## Struktur Proyek

```
habit-garden/
├── index.html           # Halaman utama
├── style.css            # Stylesheet global
├── app.js              # Entry point aplikasi
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
│
├── css/
│   └── main.css       # Stylesheet tambahan
│
├── js/
│   ├── database.js    # IndexedDB database management
│   ├── habit.js       # Habit management & logging
│   ├── garden.js      # Virtual garden management
│   ├── calendar.js    # Calendar & date utilities
│   ├── stats.js       # Statistics & analytics
│   ├── notification.js # Push notifications
│   └── backup.js      # Backup & restore functionality
│
├── assets/
│   ├── icons/         # App icons & favicon
│   ├── plants/        # Plant sprites & images
│   ├── backgrounds/   # Background images
│   └── sounds/        # Audio files & notifications
│
└── data/              # Local data storage placeholder
```

## Fitur Utama

### 1. **Habit Tracking**
- Buat dan kelola kebiasaan Anda
- Catat penyelesaian harian
- Pantau streak (hari berturut-turut)

### 2. **Virtual Garden**
- Taman berkembang seiring kebiasaan Anda
- Berbagai jenis tanaman yang tumbuh
- Visual feedback untuk motivasi

### 3. **Calendar View**
- Lihat riwayat penyelesaian
- Presentase pencapaian bulanan
- Tracking trend

### 4. **Statistics**
- Total penyelesaian
- Rata-rata mingguan & bulanan
- Longest streak
- Last completion time

### 5. **Notifications**
- Pengingat kebiasaan
- Milestone celebrations
- Completion notifications

### 6. **Data Backup**
- Export data ke JSON
- Import dari file
- LocalStorage backup
- Cloud sync ready

## Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: IndexedDB
- **PWA**: Service Worker, Manifest
- **API**: Notification API, Backup API

## Cara Memulai

1. Buka `index.html` di browser
2. Aplikasi akan meminta izin untuk:
   - Notification (untuk reminder)
   - Local storage (untuk data)
3. Mulai tambahkan kebiasaan Anda

## Modul Utama

### Database Module (`database.js`)
Mengelola IndexedDB dengan operasi CRUD dasar.

### Habit Module (`habit.js`)
- Create, read, update, delete habits
- Log completion
- Track streaks

### Garden Module (`garden.js`)
- Manage virtual plants
- Update plant growth stages
- Connect to habit completion

### Calendar Module (`calendar.js`)
- Monthly calendar views
- Completion tracking per day
- Percentage calculations

### Stats Module (`stats.js`)
- Comprehensive statistics
- Streak calculations
- Average metrics

### Notification Module (`notification.js`)
- Request browser permissions
- Send notifications
- Schedule reminders

### Backup Module (`backup.js`)
- Export/Import JSON
- LocalStorage backup
- Cloud sync preparation

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ⚠️ Partial PWA support
- Internet Explorer: ❌ Not supported

## Lisensi

MIT License

## Author

Habit Garden Team
