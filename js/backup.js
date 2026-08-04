// Backup & Restore Module
const Backup = {
  // Export data to JSON
  async exportData() {
    try {
      const habits = await Database.getAll('habits');
      const logs = await Database.getAll('logs');
      const plants = await Database.getAll('plants');

      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
          habits,
          logs,
          plants
        }
      };

      return backup;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  // Download backup file
  async downloadBackup(filename = 'habit-garden-backup.json') {
    try {
      const backup = await this.exportData();
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Backup downloaded successfully');
      return true;
    } catch (error) {
      console.error('Error downloading backup:', error);
      throw error;
    }
  },

  // Import data from JSON
  async importData(backupData) {
    try {
      if (!backupData.data) {
        throw new Error('Invalid backup format');
      }

      const { habits, logs, plants } = backupData.data;

      // Clear existing data
      await Database.clear('habits');
      await Database.clear('logs');
      await Database.clear('plants');

      // Import habits
      for (const habit of habits) {
        await Database.add('habits', habit);
      }

      // Import logs
      for (const log of logs) {
        await Database.add('logs', log);
      }

      // Import plants
      for (const plant of plants) {
        await Database.add('plants', plant);
      }

      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  },

  // Upload and import backup file
  async uploadBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const backupData = JSON.parse(e.target.result);
          await this.importData(backupData);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    });
  },

  // Sync to cloud (placeholder)
  async syncToCloud(data) {
    // TODO: Implement cloud sync
    console.log('Syncing to cloud...');
    return true;
  },

  // Restore from cloud (placeholder)
  async restoreFromCloud() {
    // TODO: Implement cloud restore
    console.log('Restoring from cloud...');
    return null;
  },

  // Backup to LocalStorage (for additional safety)
  async backupToLocalStorage() {
    try {
      const backup = await this.exportData();
      localStorage.setItem('habitGardenBackup', JSON.stringify(backup));
      console.log('Backup saved to localStorage');
      return true;
    } catch (error) {
      console.error('Error saving backup to localStorage:', error);
      throw error;
    }
  },

  // Restore from LocalStorage
  async restoreFromLocalStorage() {
    try {
      const backupStr = localStorage.getItem('habitGardenBackup');
      if (!backupStr) {
        throw new Error('No backup found in localStorage');
      }

      const backup = JSON.parse(backupStr);
      await this.importData(backup);
      console.log('Data restored from localStorage');
      return true;
    } catch (error) {
      console.error('Error restoring from localStorage:', error);
      throw error;
    }
  }
};
