const assert = require('assert');

global.Habit = {
  getDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

const { Stats } = require('../js/stats.js');

const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const yesterdayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() - 1).padStart(2, '0')}`;
const twoDaysAgo = new Date(today.getTime() - 2 * 86400000);
const twoDaysAgoKey = `${twoDaysAgo.getFullYear()}-${String(twoDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(twoDaysAgo.getDate()).padStart(2, '0')}`;
const logs = [
  { completedAt: today.toISOString(), date: todayKey },
  { completedAt: new Date(today.getTime() - 86400000).toISOString(), date: yesterdayKey },
  { completedAt: twoDaysAgo.toISOString(), date: twoDaysAgoKey }
];

assert.strictEqual(Stats.calculateLongestStreak(logs), 3, 'should detect a 3-day streak');

const weeklyData = Stats.buildWeeklyTrend([{ id: 1, logs: logs }]);
assert.strictEqual(weeklyData.length, 7, 'should build 7 days of trend data');
assert.ok(weeklyData.some(day => day.count > 0), 'should include completed days');

console.log('Stats tests passed');
