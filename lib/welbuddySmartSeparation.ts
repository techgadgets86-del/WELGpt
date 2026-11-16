/**
 * WelBuddy Intelligent Autonomous Extraction Engine
 * 
 * Uses AI intelligence to take notes and automatically separate:
 * 1. Notes (reflections, meeting notes, ideas, insights, summaries)
 * 2. Tasks (actionable to-dos with priority, duration, and category)
 * 3. Routines (recurring circadian anchors, habits, workouts, timeblocks)
 * 4. Reminders (time-sensitive alerts, deadlines, lock-screen notifications)
 * 
 * Automatically persists each item into its respective store and dispatches
 * real-time cross-tab synchronization events.
 */

import { WelBuddyTask, getSavedWelBuddyTasks, saveWelBuddyTasks } from "./welbuddyTaskSync";

export interface WelBuddyNote {
  id: string;
  title: string;
  summary: string;
  insights: string[];
  tags: string[];
  createdAt: number;
  sourceText?: string;
}

export interface RoutineBlock {
  id: string;
  time: string; // e.g. "07:30 AM"
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  title: string;
  category: "circadian" | "deep_work" | "recovery" | "nutrition" | "sleep";
  description: string;
  completed: boolean;
  frequency?: "daily" | "weekdays" | "weekends" | "weekly";
}

export interface WelBuddyReminder {
  id: string;
  title: string;
  targetTime: string; // e.g. "Tomorrow at 09:00 AM", "3:30 PM"
  category: "deadline" | "wellness" | "action" | "checkin";
  priority: "urgent" | "high" | "normal";
  completed: boolean;
  createdAt: number;
}

export interface ExtractionBatch {
  id: string;
  timestamp: number;
  source: "chat" | "voice" | "note";
  summary: string;
  notes: WelBuddyNote[];
  tasks: WelBuddyTask[];
  routines: RoutineBlock[];
  reminders: WelBuddyReminder[];
  savedSummary?: {
    notesAdded: number;
    tasksAdded: number;
    routinesAdded: number;
    remindersAdded: number;
  };
}

// Storage keys
export const STORAGE_KEY_NOTES = "welbuddy_notes";
export const STORAGE_KEY_ROUTINE = "welbuddy_routine_schedule";
export const STORAGE_KEY_REMINDERS = "welbuddy_reminders";

// -----------------------------------------------------------------------------
// Safe Local Storage Helpers
// -----------------------------------------------------------------------------

export function getSavedWelBuddyNotes(): WelBuddyNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to get notes:", e);
    return [];
  }
}

export function saveWelBuddyNotes(notes: WelBuddyNote[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("welbuddy_notes_updated", { detail: notes }));
}

export function getSavedWelBuddyReminders(): WelBuddyReminder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to get reminders:", e);
    return [];
  }
}

export function saveWelBuddyReminders(reminders: WelBuddyReminder[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("welbuddy_reminders_updated", { detail: reminders }));
}

export function getSavedRoutineBlocks(): RoutineBlock[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROUTINE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to get routine schedule:", e);
    return [];
  }
}

export function saveRoutineBlocks(blocks: RoutineBlock[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ROUTINE, JSON.stringify(blocks));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("welbuddy_routine_updated", { detail: blocks }));
}

// -----------------------------------------------------------------------------
// Auto-Save Extracted Items Engine
// -----------------------------------------------------------------------------

export function autoSaveExtractedItems(batch: ExtractionBatch): {
  notesAdded: number;
  tasksAdded: number;
  routinesAdded: number;
  remindersAdded: number;
} {
  if (typeof window === "undefined") {
    return { notesAdded: 0, tasksAdded: 0, routinesAdded: 0, remindersAdded: 0 };
  }

  let notesAdded = 0;
  let tasksAdded = 0;
  let routinesAdded = 0;
  let remindersAdded = 0;

  // 1. Commit Tasks
  if (batch.tasks && batch.tasks.length > 0) {
    const currentTasks = getSavedWelBuddyTasks();
    const newTasksToSave: WelBuddyTask[] = [];

    for (const task of batch.tasks) {
      const norm = task.title.trim().toLowerCase();
      const exists = currentTasks.some(
        (t) => t.title.trim().toLowerCase() === norm || norm.includes(t.title.trim().toLowerCase())
      );
      if (!exists) {
        newTasksToSave.push(task);
        notesAdded++;
      }
    }

    if (newTasksToSave.length > 0) {
      saveWelBuddyTasks([...newTasksToSave, ...currentTasks]);
      tasksAdded = newTasksToSave.length;
    }
  }

  // 2. Commit Routines
  if (batch.routines && batch.routines.length > 0) {
    const currentBlocks = getSavedRoutineBlocks();
    const newBlocks: RoutineBlock[] = [];

    for (const r of batch.routines) {
      const norm = r.title.trim().toLowerCase();
      const exists = currentBlocks.some(
        (b) => b.title.trim().toLowerCase() === norm || (b.time === r.time && norm.includes(b.title.toLowerCase()))
      );
      if (!exists) {
        newBlocks.push(r);
      }
    }

    if (newBlocks.length > 0) {
      saveRoutineBlocks([...currentBlocks, ...newBlocks]);
      routinesAdded = newBlocks.length;
    }
  }

  // 3. Commit Notes
  if (batch.notes && batch.notes.length > 0) {
    const currentNotes = getSavedWelBuddyNotes();
    const newNotes: WelBuddyNote[] = [];

    for (const note of batch.notes) {
      const norm = note.title.trim().toLowerCase();
      const exists = currentNotes.some((n) => n.title.trim().toLowerCase() === norm);
      if (!exists) {
        newNotes.push(note);
      }
    }

    if (newNotes.length > 0) {
      saveWelBuddyNotes([...newNotes, ...currentNotes]);
      notesAdded = newNotes.length;
    }
  }

  // 4. Commit Reminders
  if (batch.reminders && batch.reminders.length > 0) {
    const currentReminders = getSavedWelBuddyReminders();
    const newReminders: WelBuddyReminder[] = [];

    for (const reminder of batch.reminders) {
      const norm = reminder.title.trim().toLowerCase();
      const exists = currentReminders.some((r) => r.title.trim().toLowerCase() === norm);
      if (!exists) {
        newReminders.push(reminder);
      }
    }

    if (newReminders.length > 0) {
      saveWelBuddyReminders([...newReminders, ...currentReminders]);
      remindersAdded = newReminders.length;
    }
  }

  return { notesAdded, tasksAdded, routinesAdded, remindersAdded };
}

// -----------------------------------------------------------------------------
// Local Heuristic Separation Engine (Fallback & Fast Instant Parse)
// -----------------------------------------------------------------------------

export function parseLocalHeuristic(text: string, context = ""): ExtractionBatch {
  const combined = `${text}\n${context}`;
  const lines = combined
    .split(/\n|;|\s*,\s*(?:and\s+|then\s+|also\s+|plus\s+|additionally\s+)?|(?<=[.!?])\s+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 5);

  const notes: WelBuddyNote[] = [];
  const tasks: WelBuddyTask[] = [];
  const routines: RoutineBlock[] = [];
  const reminders: WelBuddyReminder[] = [];

  // 1. Explicit Reminder Detection Patterns
  const reminderRegex = /(?:remind\s+me|don['’]t\s+forget|alert\s+me|schedule\s+reminder|notify\s+me|ping\s+me)\b/i;

  // 2. Routine Detection Patterns (Recurring daily/weekly habits or circadian anchors)
  const routineRegex = /(?:every\s+(?:morning|day|evening|night|afternoon|week)|daily|each\s+day|circadian|routine|habit\s+loop|anchor)\b/i;

  // 3. Task Action Verb Patterns
  const taskActionRegex = /(?:prepare|build|send|draft|finish|code|review|call|test|deploy|submit|write|organize|schedule|fix|analyze|update|create|buy|contact|implement|set\s+up|clean|read|record|need\s+to|have\s+to|must\s+finish|to-?do)\b/i;

  // 4. Note / Insight / Reflection Keywords
  const noteRegex = /(?:realized|note\s+that|insight|meeting\s+with|key\s+takeaway|summary|learned|idea|reflection|observed|thought|noticed\s+that)\b/i;

  lines.forEach((line, idx) => {
    const clean = line.replace(/^(?:\[\s*\]|[-*•0-9.)]+\s*)+/, "").trim();
    if (clean.length < 5) return;

    // 1. Check Explicit Reminders first
    if (reminderRegex.test(clean) && reminders.length < 3) {
      const timeMatch = clean.match(/(?:at|by|tomorrow|in|friday|monday|tuesday|wednesday|thursday|saturday|sunday)\s+([0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm)?|\w+\s+at\s+[0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm)?)/i);
      const targetTime = timeMatch ? timeMatch[0] : "Scheduled reminder";
      const reminderTitle = clean.replace(reminderRegex, "").replace(/^to\s+/i, "").trim() || clean;

      reminders.push({
        id: `rem_${Date.now()}_${idx}`,
        title: reminderTitle.length > 70 ? reminderTitle.slice(0, 67) + "..." : reminderTitle,
        targetTime,
        category: /sleep|water|walk|nsdr/i.test(clean) ? "wellness" : "deadline",
        priority: /urgent|asap|important/i.test(clean) ? "urgent" : "high",
        completed: false,
        createdAt: Date.now() + idx,
      });
      return;
    }

    // 2. Check Routines (Recurring habit, anchor)
    if (routineRegex.test(clean) && routines.length < 3) {
      const timeMatch = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      let hour = 8;
      let minute = 0;
      let timeStr = "08:00 AM";

      if (timeMatch) {
        let rawH = parseInt(timeMatch[1], 10);
        const rawM = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        const ampm = timeMatch[3]?.toLowerCase();
        if (ampm === "pm" && rawH < 12) rawH += 12;
        if (ampm === "am" && rawH === 12) rawH = 0;
        hour = rawH;
        minute = rawM;
        const displayH = hour % 12 || 12;
        timeStr = `${displayH.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
      }

      const isSleep = /sleep|sunset|wind down|night/i.test(clean);
      const isRecovery = /nsdr|rest|reset|vagus|meditat|breathe/i.test(clean);
      const isNutrition = /lunch|meal|eat|water|hydrate|coffee|fast/i.test(clean);
      const isCircadian = /sunlight|morning|circadian|optic/i.test(clean);

      const category = isSleep ? "sleep" : isRecovery ? "recovery" : isNutrition ? "nutrition" : isCircadian ? "circadian" : "deep_work";

      routines.push({
        id: `rout_${Date.now()}_${idx}`,
        time: timeStr,
        startHour: hour,
        startMinute: minute,
        durationMinutes: category === "deep_work" ? 90 : 20,
        title: clean.length > 60 ? clean.slice(0, 57) + "..." : clean,
        category,
        description: `Circadian routine anchor: ${clean}`,
        completed: false,
        frequency: "daily",
      });
      return;
    }

    // 3. Check Actionable Tasks
    if ((taskActionRegex.test(clean) || clean.startsWith("- [ ]") || clean.startsWith("•") || idx < 3) && !noteRegex.test(clean) && tasks.length < 5) {
      const lower = clean.toLowerCase();
      const isWellness = /sleep|stress|sigh|rest|water|hydrate|nsdr|walk|meditat|stretch|exercise|workout/i.test(lower);
      const isSprint = /90m|flow|deep work|code|sprint|feature|build/i.test(lower);
      const isQuick = /quick|5m|10m|call|email|slack|ping/i.test(lower);

      tasks.push({
        id: `task_${Date.now()}_${idx}`,
        title: clean.length > 80 ? clean.slice(0, 77) + "..." : clean,
        category: isSprint ? "sprint" : isWellness ? "wellness" : "business",
        priority: isQuick ? "quick" : idx === 0 ? "high" : "medium",
        estimatedMinutes: isSprint ? 90 : isWellness ? 15 : isQuick ? 10 : 45,
        completed: false,
        createdAt: Date.now() + idx,
      });
      return;
    }

    // 4. Check Notes / Insights
    if ((noteRegex.test(clean) || clean.length > 20) && notes.length < 3) {
      notes.push({
        id: `note_${Date.now()}_${idx}`,
        title: clean.slice(0, 40) + (clean.length > 40 ? "..." : ""),
        summary: clean,
        insights: [clean],
        tags: ["CoPilot", "Insight"],
        createdAt: Date.now() + idx,
        sourceText: clean,
      });
    }
  });

  // Ensure at least a cohesive note or task exists if user provided substantial text
  if (notes.length === 0 && tasks.length === 0 && routines.length === 0 && reminders.length === 0 && text.trim().length > 15) {
    notes.push({
      id: `note_${Date.now()}`,
      title: text.slice(0, 36) + "...",
      summary: text,
      insights: [text],
      tags: ["VoiceNote", "CoPilot"],
      createdAt: Date.now(),
      sourceText: text,
    });
  }

  const batch: ExtractionBatch = {
    id: `batch_${Date.now()}`,
    timestamp: Date.now(),
    source: "chat",
    summary: `Extracted ${notes.length} note(s), ${tasks.length} task(s), ${routines.length} routine(s), and ${reminders.length} reminder(s).`,
    notes,
    tasks,
    routines,
    reminders,
  };

  return batch;
}

// -----------------------------------------------------------------------------
// Autonomous Separation Trigger (Client-Side Async Runner)
// -----------------------------------------------------------------------------

export async function separateAndSaveIntelligently({
  userMessage,
  assistantReply = "",
  persona = "operator",
}: {
  userMessage: string;
  assistantReply?: string;
  persona?: string;
}): Promise<ExtractionBatch | null> {
  const combinedLength = (userMessage + assistantReply).trim().length;
  if (combinedLength < 10) return null;

  try {
    const res = await fetch("/api/welbuddy/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        assistantReply,
        persona,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.batch) {
        const batch: ExtractionBatch = data.batch;
        // Auto-save each item on its own
        const savedCounts = autoSaveExtractedItems(batch);
        batch.savedSummary = savedCounts;
        return batch;
      }
    }
  } catch (err) {
    console.warn("[WelBuddy Separation] Server AI extract failed, using local fallback:", err);
  }

  // Fallback to local heuristic extraction
  const localBatch = parseLocalHeuristic(userMessage, assistantReply);
  const savedCounts = autoSaveExtractedItems(localBatch);
  localBatch.savedSummary = savedCounts;
  return localBatch;
}
