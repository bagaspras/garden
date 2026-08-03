# Quick Start Guide - Habit Garden

## 🚀 Cara Menjalankan Aplikasi

### Method 1: Direct Opening (Paling Mudah)
```bash
# Buka file index.html langsung di browser
# Double-click pada index.html atau
# Drag & drop ke browser
```

### Method 2: Menggunakan Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# Live Server (VS Code Extension)
# Install: ms-vscode.live-server
# Right-click index.html → Open with Live Server
```

Kemudian buka di browser: `http://localhost:8000`

### Method 3: VSCode Live Preview
```bash
# Buka file, tekan Shift+Alt+L untuk Live Preview
```

## ✅ Testing Checklist

### 1. Database Functionality
- [ ] Buka Console (F12)
- [ ] Ketik: `Database.getAll('habits')`
- [ ] Pastikan mengembalikan array kosong `[]`

### 2. Add Habit
- [ ] Klik FAB button (+)
- [ ] Masukkan nama habit (e.g., "Olahraga")
- [ ] Pilih XP (default 5)
- [ ] Klik "Simpan"
- [ ] Habit muncul di list ✅

### 3. Complete Habit
- [ ] Check checkbox di habit
- [ ] Lihat progress bar update
- [ ] Streak counter meningkat ✅
- [ ] Toast notification muncul ✅

### 4. Garden Visualization
- [ ] Habit ditambahkan, lihat tanaman di garden
- [ ] Klik tab "Garden"
- [ ] Lihat visual garden dengan emoji plants ✅

### 5. Statistics
- [ ] Klik tab "Statistik"
- [ ] Lihat stats cards update
- [ ] Calendar menunjukkan hari yang selesai ✅

### 6. Calendar
- [ ] Lihat bulan saat ini
- [ ] Hari selesai highlight dengan warna hijau
- [ ] Click hari untuk detail ✅

### 7. Local Storage
- [ ] F12 → Application → Local Storage
- [ ] Lihat `habitGardenBackup` tersimpan ✅

### 8. IndexedDB
- [ ] F12 → Application → IndexedDB
- [ ] Expand `HabitGardenDB`
- [ ] Lihat object stores: habits, logs, plants ✅

### 9. Responsiveness
- [ ] F12 → Toggle Device Toolbar (Ctrl+Shift+M)
- [ ] Test di berbagai ukuran layar
- [ ] Mobile view terlihat bagus ✅
- [ ] Bottom navigation accessible ✅

### 10. Performance
- [ ] F12 → Network tab
- [ ] Reload page
- [ ] Total size < 100KB ✅
- [ ] Load time < 2s ✅

## 🐛 Debugging Tips

### Console Commands
```javascript
// View semua habits
HabitGarden.Habit.getAll().then(h => console.log(h))

// Add test habit
HabitGarden.Habit.create({
  name: "Test Habit",
  xp: 20
})

// View today's logs
HabitGarden.Habit.getTodayLogs().then(l => console.log(l))

// Get specific streak
HabitGarden.Habit.getStreak(1).then(s => console.log(s))

// Export all data
HabitGarden.Backup.exportData().then(d => console.log(d))

// Force refresh UI
HabitGarden.UI.refresh()

// Clear all data
HabitGarden.Database.clear('habits')
HabitGarden.Database.clear('logs')
HabitGarden.Database.clear('plants')
```

### Browser DevTools
```
Network: Monitor API calls & file sizes
Console: Check for errors & warnings
Application: View database & storage
Performance: Monitor frame rate
Lighthouse: Check PWA readiness
```

## 🎨 Customization

### Change Primary Color
Edit `style.css`:
```css
:root {
  --primary: #4CAF50;  /* Change this */
  --secondary: #8BC34A;
  --accent: #FFC107;
}
```

### Change App Name
Edit `index.html`:
```html
<title>🌱 Habit Garden</title>
<h1>🌱 Habit Garden</h1>
```

### Change Plant Emojis
Edit `js/ui.js` → `getPlantEmoji()` method

### Add Custom XP Values
Edit `index.html` modal:
```html
<option value="50">50 XP</option>
<option value="100">100 XP</option>
```

## 📊 Demo Data

Untuk test, bisa tambahkan demo habits:

```javascript
const demoHabits = [
  { name: '🏃 Olahraga', xp: 20 },
  { name: '📚 Membaca', xp: 15 },
  { name: '💧 Minum Air', xp: 5 },
  { name: '🧘 Meditasi', xp: 10 },
  { name: '✍️ Journaling', xp: 10 }
];

// Add demo data
demoHabits.forEach(h => {
  HabitGarden.Habit.create(h);
});
```

## 🔧 Troubleshooting

### Problem: Habit tidak muncul
**Solution:**
```javascript
// Check database
await HabitGarden.Database.getAll('habits')

// Refresh UI
await HabitGarden.UI.refresh()
```

### Problem: Progress bar tidak update
**Solution:**
- Clear cache (Ctrl+Shift+Delete)
- Reload page
- Check console for errors

### Problem: Modal tidak close
**Solution:**
- Click outside modal
- Press Esc key
- Check browser console

### Problem: Service Worker error
**Solution:**
- Check Application tab → Service Workers
- Unregister & re-register
- Clear cache

### Problem: IndexedDB error
**Solution:**
```javascript
// Clear all data
await HabitGarden.Database.clear('habits')
await HabitGarden.Database.clear('logs')
await HabitGarden.Database.clear('plants')

// Refresh
location.reload()
```

## 📱 Mobile Testing

### Android
- Use Chrome DevTools remote debugging
- Test on actual device if possible
- Check landscape & portrait modes

### iOS
- Use Safari DevTools
- Test home screen web app
- Check full-screen mode

### Responsive Sizes
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px+

## 🚀 Deployment

### Deploy to GitHub Pages
```bash
# Copy folder ke repo
# Push to GitHub
# Enable Pages di Settings
# Site live at: https://username.github.io/habit-garden
```

### Deploy to Netlify
```bash
# Drag & drop folder to Netlify
# Or connect GitHub repo
# Auto-deploying on push
```

### Deploy to Vercel
```bash
# Deploy from GitHub via Vercel
# Auto-updates on commits
```

### Deploy ke Server Sendiri
```bash
# Copy folder ke public_html/
# Access via domain.com/habit-garden
# Ensure gzip compression enabled
```

## 📊 Performance Checklist

- [ ] CSS < 20KB
- [ ] JS < 60KB
- [ ] First Load < 2s
- [ ] Lighthouse score > 80
- [ ] Mobile responsive
- [ ] Offline working
- [ ] No console errors
- [ ] Network waterfall optimized
- [ ] Images optimized (if any)
- [ ] Fonts optimized

## 🎓 Learning Path

1. **Understand Structure**: Read FRONTEND.md
2. **Modify UI**: Change style.css colors
3. **Add Features**: Extend UI.js methods
4. **Debug**: Use console commands
5. **Deploy**: Follow deployment guide
6. **Scale**: Add more features

## 💡 Feature Ideas

### Easy to Add
- [ ] Dark mode toggle
- [ ] Custom colors per habit
- [ ] Sound effects
- [ ] More achievement badges
- [ ] Habit categories/filtering

### Medium Difficulty
- [ ] Habit sharing
- [ ] Social features
- [ ] Data visualization charts
- [ ] Habit recommendations
- [ ] Tags/filtering system

### Advanced
- [ ] Cloud sync
- [ ] Multiplayer challenges
- [ ] AI-powered insights
- [ ] Mobile app (React Native)
- [ ] Browser extension

## 📚 Resources

### Useful Links
- [MDN Web Docs](https://developer.mozilla.org)
- [IndexedDB Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)

### Tools
- Chrome DevTools
- VS Code
- Web.dev (Performance testing)
- Lighthouse
- GTmetrix

## ✨ Tips & Tricks

### Faster Development
- Use Live Server for auto-reload
- Keep console open for errors
- Use debugger breakpoints
- Test on mobile early

### Better UX
- Add loading states
- Clear error messages
- Confirm destructive actions
- Progress indicators
- Success feedback

### Code Quality
- Consistent formatting
- Meaningful variable names
- DRY principles
- Comments for complex logic
- Error handling

---

**Selamat coding! Happy Gardening! 🌱**

*Last Updated: 2026-08-02*
