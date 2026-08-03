// UI Module - Menangani semua interaksi dengan DOM
const UI = {
  // Cache DOM elements
  habitList: document.getElementById('habit-list'),
  habitModal: document.getElementById('habitModal'),
  addHabitBtn: document.getElementById('addHabit'),
  saveHabitBtn: document.getElementById('saveHabit'),
  closeModalBtn: document.getElementById('closeModal'),
  habitNameInput: document.getElementById('habitName'),
  habitXpInput: document.getElementById('habitXP'),
  calendar: document.getElementById('calendar'),
  fab: document.getElementById('fab'),
  bottomNav: document.querySelector('.bottom-nav'),

  // State
  currentHabits: [],
  currentPlants: [],
  dailyResetKey: 'habitGardenLastResetDate',

  // Initialize UI
  init() {
    this.attachEventListeners();
    this.renderDashboard();
  },

  // Attach event listeners
  attachEventListeners() {
    this.addHabitBtn.addEventListener('click', () => this.openModal());
    this.saveHabitBtn.addEventListener('click', () => this.handleSaveHabit());
    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    this.fab.addEventListener('click', () => this.openModal());
    this.habitModal.addEventListener('click', (e) => {
      if (e.target === this.habitModal) this.closeModal();
    });

    // Bottom nav
    const navButtons = this.bottomNav.querySelectorAll('button');
    navButtons[0].addEventListener('click', () => this.showSection('home'));
    navButtons[1].addEventListener('click', () => this.showSection('stats'));

    window.addEventListener('focus', () => this.syncDailyReset());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.syncDailyReset();
      }
    });
  },

  // Modal operations
  openModal() {
    this.habitModal.classList.add('active');
    this.habitNameInput.focus();
  },

  closeModal() {
    this.habitModal.classList.remove('active');
    this.habitNameInput.value = '';
    this.habitXpInput.value = '5';
  },

  // Save habit
  async handleSaveHabit() {
    const name = this.habitNameInput.value.trim();
    const xp = parseInt(this.habitXpInput.value);

    if (!name) {
      alert('Masukkan nama habit!');
      return;
    }

    try {
      const habitId = await Habit.create({
        name: name,
        description: '',
        frequency: 'daily',
        category: 'general',
        target: 1,
        unit: 'times',
        xp: xp,
        color: this.getRandomColor(),
        icon: this.getRandomIcon()
      });

      // Create plant for this habit
      await Garden.addPlant(habitId, 'seedling');

      this.closeModal();
      await this.refresh();
      
      // Show success notification
      Notification.sendCompletionNotification(`"${name}" ditambahkan!`);
    } catch (error) {
      console.error('Error saving habit:', error);
      alert('Gagal menambah habit!');
    }
  },

  // Render dashboard
  async renderDashboard() {
    const didReset = await this.syncDailyReset();
    if (didReset) return;

    await this.loadHabits();
    await this.renderHabitList();
    await this.updateStats();
    await this.renderCalendar();
  },

  // Load habits from database
  async loadHabits() {
    this.currentHabits = await Habit.getAll();
  },

  // Render habit list
  async renderHabitList() {
    this.habitList.innerHTML = '';

    if (this.currentHabits.length === 0) {
      this.habitList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Belum ada habit. Tambahkan habit baru sekarang!</p>';
      return;
    }

    const todayLogs = await Habit.getTodayLogs();
    const completedHabitIds = new Set(todayLogs.map(log => log.habitId));

    this.currentHabits.forEach(habit => {
      const isCompleted = completedHabitIds.has(habit.id);
      const habitEl = this.createHabitElement(habit, isCompleted);
      this.habitList.appendChild(habitEl);
    });
  },

  // Create habit element
  createHabitElement(habit, isCompleted = false) {
    const div = document.createElement('div');
    div.className = 'habit-item';
    div.dataset.habitId = habit.id;
    div.classList.toggle('completed', isCompleted);

    div.innerHTML = `
      <div class="habit-info">
        <div class="habit-name">${habit.icon} ${habit.name}</div>
        <div class="habit-xp">+${habit.xp} XP</div>
      </div>
      <button
        type="button"
        class="habit-check-btn ${isCompleted ? 'is-complete' : ''}"
        data-habit-id="${habit.id}"
        aria-label="${isCompleted ? `Habit ${habit.name} selesai` : `Tandai ${habit.name} selesai`}"
        ${isCompleted ? 'disabled' : ''}
      >
        ${isCompleted ? '✓' : '○'}
      </button>
    `;

    const button = div.querySelector('.habit-check-btn');
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      if (button.disabled || button.classList.contains('is-complete')) return;
      await this.completeHabit(habit.id, habit.name);
    });

    return div;
  },

  // Complete habit
  async completeHabit(habitId, habitName) {
    try {
      const todayLogs = await Habit.getTodayLogs();
      if (todayLogs.some(log => log.habitId === habitId)) {
        await this.refresh();
        return;
      }

      await Habit.logCompletion(habitId, 1);
      await Garden.growPlant(habitId);
      
      // Update XP and stats
      await this.updateStats();
      
      // Show celebration
      Notification.sendCompletionNotification(habitName);
      
      // Refresh UI
      await this.refresh();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  },

  // Update statistics
  async updateStats() {
    try {
      const stats = await Stats.getAllStats();
      
      // Update dashboard
      const todayLogs = await Habit.getTodayLogs();
      const completed = todayLogs.length;
      const total = stats.totalHabits;
      const percentage = total > 0 ? (completed / total) * 100 : 0;

      document.getElementById('progress-fill').style.width = percentage + '%';
      document.getElementById('progress-text').textContent = `${completed} / ${total} Habit Selesai`;
      document.getElementById('totalHabit').textContent = total;
      document.getElementById('completedHabit').textContent = completed;
      
      // Calculate level and XP
      const xp = completed * 10;
      const level = Math.floor(xp / 50) + 1;
      document.getElementById('xp').textContent = xp + ' XP';
      document.getElementById('level').textContent = level;

      await Stats.render();
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  },

  // Render calendar
  async renderCalendar() {
    const today = new Date();
    const monthData = Calendar.getCurrentMonth(today.getFullYear(), today.getMonth());
    
    this.calendar.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <h3>${monthData.monthName} ${monthData.year}</h3>
      </div>
      <div class="calendar-grid" id="calendar-grid"></div>
    `;

    const calendarGrid = document.getElementById('calendar-grid');
    
    // Day headers
    const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayHeaders.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = day;
      dayEl.style.fontWeight = 'bold';
      dayEl.style.cursor = 'default';
      calendarGrid.appendChild(dayEl);
    });

    // Empty cells
    for (let i = 0; i < monthData.startingDayOfWeek; i++) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'calendar-day empty';
      calendarGrid.appendChild(emptyEl);
    }

    // Days
    const allLogs = await Habit.getTodayLogs();
    const completedDays = new Set(allLogs.map(log => {
      const date = new Date(log.completedAt);
      return date.getDate();
    }));

    for (let day = 1; day <= monthData.daysInMonth; day++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = day;

      if (completedDays.has(day)) {
        dayEl.classList.add('completed');
      }

      calendarGrid.appendChild(dayEl);
    }
  },

  async syncDailyReset() {
    const todayKey = this.getTodayKey();
    const lastDate = localStorage.getItem(this.dailyResetKey);

    if (lastDate === todayKey) {
      return false;
    }

    localStorage.setItem(this.dailyResetKey, todayKey);
    await this.refresh();
    return true;
  },

  getTodayKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Refresh all UI
  async refresh() {
    await this.loadHabits();
    await this.renderHabitList();
    await this.updateStats();
    await this.renderCalendar();
  },

  // Show/hide sections
  showSection(section) {
    const sections = document.querySelectorAll('section');
    sections.forEach(s => s.style.display = 'none');

    if (section === 'home') {
      document.querySelector('.dashboard').style.display = 'grid';
      document.querySelector('.progress-section').style.display = 'block';
      document.querySelector('.habit-section').style.display = 'block';
    } else if (section === 'stats') {
      document.querySelector('.stats-section').style.display = 'block';
      document.querySelector('.achievement-section').style.display = 'block';
      document.querySelector('.calendar-section').style.display = 'block';
    }
  },

  // Utility: get random color
  getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // Utility: get random icon
  getRandomIcon() {
    const icons = ['🌱', '🌿', '🌼', '🌻', '🌷', '🌹', '🥀'];
    return icons[Math.floor(Math.random() * icons.length)];
  }
};
