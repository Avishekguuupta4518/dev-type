export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  wpm: number;
  accuracy: number;
  testsCompleted: number;
  dailyStreak: number;
  personalBest: number;
}

export const achievements: Achievement[] = [
  {
    id: 'first-test',
    name: 'First Steps',
    description: 'Complete your first typing test',
    condition: (stats) => stats.testsCompleted >= 1,
  },
  {
    id: 'speed-demon-50',
    name: 'Getting Warmed Up',
    description: 'Reach 50 WPM',
    condition: (stats) => stats.wpm >= 50,
  },
  {
    id: 'speed-demon-75',
    name: 'Speed Demon',
    description: 'Reach 75 WPM',
    condition: (stats) => stats.wpm >= 75,
  },
  {
    id: 'speed-demon-100',
    name: '100 WPM Club',
    description: 'Reach 100 WPM',
    condition: (stats) => stats.wpm >= 100,
  },
  {
    id: 'speed-demon-125',
    name: 'Lightning Fingers',
    description: 'Reach 125 WPM',
    condition: (stats) => stats.wpm >= 125,
  },
  {
    id: 'speed-demon-150',
    name: 'Keyboard Warrior',
    description: 'Reach 150 WPM',
    condition: (stats) => stats.wpm >= 150,
  },
  {
    id: 'accuracy-master-95',
    name: 'Accuracy Ace',
    description: 'Achieve 95% accuracy',
    condition: (stats) => stats.accuracy >= 95,
  },
  {
    id: 'accuracy-master-99',
    name: 'Perfectionist',
    description: 'Achieve 99% accuracy',
    condition: (stats) => stats.accuracy >= 99,
  },
  {
    id: 'accuracy-master-100',
    name: 'Flawless',
    description: 'Achieve 100% accuracy',
    condition: (stats) => stats.accuracy === 100,
  },
  {
    id: 'streak-3',
    name: 'Getting Consistent',
    description: '3 day streak',
    condition: (stats) => stats.dailyStreak >= 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7 day streak',
    condition: (stats) => stats.dailyStreak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Dedicated Typist',
    description: '30 day streak',
    condition: (stats) => stats.dailyStreak >= 30,
  },
  {
    id: 'tests-10',
    name: 'Practice Makes Perfect',
    description: 'Complete 10 tests',
    condition: (stats) => stats.testsCompleted >= 10,
  },
  {
    id: 'tests-50',
    name: 'Committed Coder',
    description: 'Complete 50 tests',
    condition: (stats) => stats.testsCompleted >= 50,
  },
  {
    id: 'tests-100',
    name: 'Century Club',
    description: 'Complete 100 tests',
    condition: (stats) => stats.testsCompleted >= 100,
  },
];

export function getUnlockedAchievements(stats: AchievementStats): Achievement[] {
  return achievements.filter(a => a.condition(stats));
}

export function getNewAchievements(
  stats: AchievementStats, 
  previouslyUnlocked: string[]
): Achievement[] {
  return achievements.filter(a => 
    a.condition(stats) && !previouslyUnlocked.includes(a.id)
  );
}
