/**
 * WelBuddy Task Synchronization Engine
 * Automatically extracts and synchronizes physical exercises and movement protocols 
 * from Daily Routines, Custom AI Routines, and Sensei Workouts directly into WelBuddy Tasks.
 */

export interface WelBuddyTask {
  id: string;
  title: string;
  category: "business" | "wellness" | "sprint";
  priority: "high" | "medium" | "quick";
  estimatedMinutes: number;
  completed: boolean;
  createdAt: number;
  subTasks?: Array<{ id: string; title: string; completed: boolean }>;
  fromRoutine?: boolean;
  routineSourceId?: string;
  routineTime?: string;
  routineCategory?: string;
}

export interface RoutineTaskInput {
  id?: string;
  time?: string;
  title: string;
  desc?: string;
  durationMinutes?: number;
  completed?: boolean;
  category?: string;
}

// Regex patterns to identify physical movements, calisthenics, mobility, and exercise protocols
export const EXERCISE_PATTERNS = [
  /kinetic\s*activation/i,
  /anaerobic\s*threshold/i,
  /anaerobic/i,
  /zone\s*2/i,
  /mobility/i,
  /stretching|stretch/i,
  /cardio|cardiovascular/i,
  /movement/i,
  /exercise/i,
  /workout/i,
  /calisthenics/i,
  /push-?up/i,
  /squat/i,
  /lunge/i,
  /chin-?up|pull-?up/i,
  /dead\s*hang/i,
  /running|jogging|sprint/i,
  /jump\s*rope/i,
  /resistance\s*training/i,
  /burpee/i,
  /hiit/i,
  /plank/i,
  /yoga/i,
  /walk|walking|micro-walk/i,
  /decompression/i,
  /somatic.*physical/i,
  /strength/i,
  /aerobic/i,
  /hollow\s*body/i,
  /l-sit/i,
  /core\s*matrix/i,
  /dips/i,
  /pistol\s*squat/i,
  /spinal/i,
];

/**
 * Checks if a routine task represents a physical exercise, workout, or kinetic movement.
 */
export function isExerciseTask(title: string, desc = ""): boolean {
  if (!title) return false;
  const combined = `${title} ${desc}`.toLowerCase();
  return EXERCISE_PATTERNS.some((pattern) => pattern.test(combined));
}

/**
 * Safe retrieval of WelBuddy tasks from localStorage.
 */
export function getSavedWelBuddyTasks(): WelBuddyTask[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("welbuddy_tasks");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to parse welbuddy_tasks:", e);
    return [];
  }
}

/**
 * Safe persistence of WelBuddy tasks to localStorage + notification dispatch.
 */
export function saveWelBuddyTasks(tasks: WelBuddyTask[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("welbuddy_tasks", JSON.stringify(tasks));
  // Dispatch standard storage event and custom welbuddy event
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("welbuddy_tasks_updated", { detail: tasks }));
}

/**
 * Automatically sync a single routine exercise into WelBuddy Tasks.
 * Prevents duplicates by matching routineSourceId or normalized title.
 */
export function syncExerciseToWelBuddyTasks(exercise: RoutineTaskInput): boolean {
  if (typeof window === "undefined" || !exercise.title) return false;

  const currentTasks = getSavedWelBuddyTasks();
  const normalizedTitle = exercise.title.trim().toLowerCase();

  // Check if task already exists
  const existingIndex = currentTasks.findIndex((t) => {
    if (exercise.id && t.routineSourceId === exercise.id) return true;
    const tTitle = t.title.trim().toLowerCase();
    return tTitle === normalizedTitle || tTitle.includes(normalizedTitle) || normalizedTitle.includes(tTitle);
  });

  if (existingIndex >= 0) {
    // If it exists but completion status changed from routine, update it
    if (exercise.completed !== undefined && currentTasks[existingIndex].completed !== exercise.completed) {
      currentTasks[existingIndex].completed = exercise.completed;
      saveWelBuddyTasks(currentTasks);
      return true;
    }
    return false;
  }

  // Create sub-tasks tailored for the exercise
  const isHighIntensity = /sprint|hiit|anaerobic|threshold|resistance|push-up|squat/i.test(
    `${exercise.title} ${exercise.desc || ""}`
  );

  const subTasks = [
    {
      id: `sub_${Date.now()}_1`,
      title: "Dynamic joint mobility & neuromuscular prep (3 min)",
      completed: Boolean(exercise.completed),
    },
    {
      id: `sub_${Date.now()}_2`,
      title: exercise.desc && exercise.desc.length > 5
        ? exercise.desc.slice(0, 75) + (exercise.desc.length > 75 ? "..." : "")
        : "Execute primary sets/intervals with proper biomechanical form",
      completed: Boolean(exercise.completed),
    },
    {
      id: `sub_${Date.now()}_3`,
      title: "Electrolyte hydration & physiological down-regulation (2 min)",
      completed: Boolean(exercise.completed),
    },
  ];

  const newTask: WelBuddyTask = {
    id: `routine_ex_${exercise.id || Date.now()}`,
    title: exercise.title.trim(),
    category: isHighIntensity ? "sprint" : "wellness",
    priority: isHighIntensity ? "high" : "medium",
    estimatedMinutes: exercise.durationMinutes || (isHighIntensity ? 30 : 20),
    completed: Boolean(exercise.completed),
    createdAt: Date.now(),
    fromRoutine: true,
    routineSourceId: exercise.id,
    routineTime: exercise.time,
    routineCategory: exercise.category || (isHighIntensity ? "Resistance / HIIT" : "Mobility / Movement"),
    subTasks,
  };

  // Prepend to give immediate visibility at the top of WelBuddy Tasks
  const updatedTasks = [newTask, ...currentTasks];
  saveWelBuddyTasks(updatedTasks);
  return true;
}

/**
 * Syncs all exercise tasks from active routine sources into WelBuddy Tasks.
 * Returns the count of newly added tasks.
 */
export function syncAllRoutineExercises(options?: {
  routineTasks?: RoutineTaskInput[];
  customTasks?: RoutineTaskInput[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dailyPlan?: any;
}): number {
  if (typeof window === "undefined") return 0;

  const candidates: RoutineTaskInput[] = [];

  // 1. Explicitly passed routine tasks
  if (options?.routineTasks && options.routineTasks.length > 0) {
    candidates.push(...options.routineTasks);
  }

  // 2. Custom AI generated tasks
  if (options?.customTasks && options.customTasks.length > 0) {
    candidates.push(...options.customTasks);
  }

  // 3. User's daily plan from profile
  if (options?.dailyPlan) {
    if (Array.isArray(options.dailyPlan.morning)) candidates.push(...options.dailyPlan.morning);
    if (Array.isArray(options.dailyPlan.afternoon)) candidates.push(...options.dailyPlan.afternoon);
    if (Array.isArray(options.dailyPlan.evening)) candidates.push(...options.dailyPlan.evening);
  }

  // 4. Default Routine Fallbacks (Kinetic Activation, Anaerobic Threshold, Somatic Vagus Reset)
  candidates.push(
    {
      id: "m3",
      time: "07:45 AM",
      title: "Kinetic Activation",
      desc: "20 minutes of Zone 2 movement or mobility stretching to spike core body temperature.",
      durationMinutes: 20,
    },
    {
      id: "a4",
      time: "05:00 PM",
      title: "Anaerobic Threshold",
      desc: "High-intensity resistance training or cardiovascular interval work.",
      durationMinutes: 35,
    },
    {
      id: "r6",
      time: "06:30 PM",
      title: "Somatic Vagus Reset & Physical Decompression",
      desc: "Spinal decompression, dead hangs, slow diaphragmatic nasal breathing, and physical boundary shift.",
      durationMinutes: 20,
    }
  );

  let newlyAdded = 0;
  for (const candidate of candidates) {
    if (isExerciseTask(candidate.title, candidate.desc)) {
      const added = syncExerciseToWelBuddyTasks(candidate);
      if (added) newlyAdded++;
    }
  }

  return newlyAdded;
}

/**
 * Updates task completion in WelBuddy Tasks when checked off in Routine Tracker.
 */
export function syncRoutineCompletionToWelBuddy(sourceId: string, completed: boolean) {
  if (typeof window === "undefined") return;
  const current = getSavedWelBuddyTasks();
  let changed = false;

  const updated = current.map((t) => {
    if (t.routineSourceId === sourceId || t.id === sourceId || t.id === `routine_ex_${sourceId}`) {
      changed = true;
      const subUpdated = t.subTasks?.map((s) => ({ ...s, completed })) || t.subTasks;
      return { ...t, completed, subTasks: subUpdated };
    }
    return t;
  });

  if (changed) {
    saveWelBuddyTasks(updated);
  }
}
