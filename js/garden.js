// Garden Module
const Garden = {
  init() {
    console.log('Garden initialized');
  },

  // Get garden plants
  async getPlants() {
    return await Database.getAll('plants');
  },

  // Add plant to garden
  async addPlant(habitId, plantType) {
    const plant = {
      habitId: habitId,
      type: plantType, // seedling, sprout, plant, flower, tree
      stage: 0,
      plantedAt: new Date().toISOString(),
      health: 100
    };

    return await Database.add('plants', plant);
  },

  // Update plant stage
  async updatePlant(plantId, stage) {
    const plant = await Database.get('plants', plantId);
    plant.stage = stage;
    return await Database.update('plants', plant);
  },

  // Calculate plant growth based on habit completion
  async growPlant(habitId) {
    const plants = await this.getPlants();
    const plant = plants.find(p => p.habitId === habitId);

    if (!plant) return null;

    const logs = await Habit.getHabitLogs(habitId);
    const completionRate = logs.length;

    // Determine plant stage based on completion rate
    let newStage = 0;
    if (completionRate >= 7) newStage = 1;
    if (completionRate >= 14) newStage = 2;
    if (completionRate >= 30) newStage = 3;
    if (completionRate >= 60) newStage = 4;

    if (newStage > plant.stage) {
      return await this.updatePlant(plant.id, newStage);
    }

    return plant;
  },

  // Remove plant
  async removePlant(plantId) {
    return await Database.delete('plants', plantId);
  },

  // Render garden
  async render() {
    const plants = await this.getPlants();
    console.log('Rendering garden with plants:', plants);
    // TODO: Implement rendering logic
  }
};
