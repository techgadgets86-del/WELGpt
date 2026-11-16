import { NextResponse } from 'next/server';
import { generateWithFallbacks } from '@/lib/aiFallbackEngine';
import { ExtractionBatch, parseLocalHeuristic } from '@/lib/welbuddySmartSeparation';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { userMessage, assistantReply = '', persona = 'operator' } = await req.json();

    if (!userMessage && !assistantReply) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const conversationText = `USER: ${userMessage || ''}\nASSISTANT: ${assistantReply || ''}`;

    const prompt = `You are WelBuddy™, the world's most intelligent AI executive co-pilot and nervous system regulator.
Analyze the following conversation turn between a user and WelBuddy. 
Your job is to autonomously take notes and intelligently SEPARATE any actionable content into 4 distinct buckets:

1. NOTES: Key thoughts, reflections, brainstorms, meeting notes, decisions, or strategic insights worth preserving.
2. TASKS: Discrete, actionable to-dos (e.g. "Draft Q4 pitch deck", "Send invoice", "Refactor auth API"). Include estimated duration (minutes) and category: "business" | "wellness" | "sprint".
3. ROUTINES: Recurring habits, circadian anchors, daily/weekly rituals, exercise protocols, or scheduled timeblocks (e.g. "Every morning 07:30 AM Circadian Light", "Daily 2 PM NSDR Reboot"). Specify target time (e.g. "07:30 AM"), startHour (0-23), startMinute (0-59), durationMinutes, and category: "circadian" | "deep_work" | "recovery" | "nutrition" | "sleep".
4. REMINDERS: Time-sensitive alerts, deadlines, or nudges (e.g. "Remind me at 3 PM to call John", "Submit report tomorrow at 10 AM"). Specify targetTime (human readable) and category: "deadline" | "wellness" | "action" | "checkin".

CONVERSATION:
"""
${conversationText}
"""

RESPOND ONLY WITH A VALID JSON OBJECT matching this exact schema. If a bucket has no relevant items, return an empty array [] for that bucket:
{
  "summary": "Crisp 1-sentence synthesis of what was extracted.",
  "notes": [
    {
      "id": "note_1",
      "title": "Short Note Title",
      "summary": "1-2 sentence core note or observation",
      "insights": ["Key takeaway point 1", "Key takeaway point 2"],
      "tags": ["CoPilot", "Focus"]
    }
  ],
  "tasks": [
    {
      "id": "task_1",
      "title": "Concrete task starting with active verb",
      "category": "business",
      "priority": "high",
      "estimatedMinutes": 45
    }
  ],
  "routines": [
    {
      "id": "rout_1",
      "time": "08:30 AM",
      "startHour": 8,
      "startMinute": 30,
      "durationMinutes": 90,
      "title": "90m Ultradian Focus Sprint",
      "category": "deep_work",
      "description": "Circadian routine protocol",
      "frequency": "daily"
    }
  ],
  "reminders": [
    {
      "id": "rem_1",
      "title": "Send quarterly review document to executive team",
      "targetTime": "Tomorrow at 09:00 AM",
      "category": "deadline",
      "priority": "high"
    }
  ]
}

RULES:
- Only extract items that were explicitly mentioned or clearly implied by the conversation.
- Do not invent fictional tasks that have zero basis in the user's conversation.
- Keep titles crisp and action-oriented.`;

    try {
      const aiPromise = generateWithFallbacks(prompt);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI extraction timeout')), 4000)
      );
      const rawAiResponse = await Promise.race([aiPromise, timeoutPromise]);
      const parsed = JSON.parse(rawAiResponse);

      if (parsed && typeof parsed === 'object') {
        const batch: ExtractionBatch = {
          id: `batch_${Date.now()}`,
          timestamp: Date.now(),
          source: 'chat',
          summary: parsed.summary || 'AI extracted notes, tasks, routines, and reminders.',
          notes: Array.isArray(parsed.notes)
            ? parsed.notes.map((n: any, i: number) => ({
                id: n.id || `note_${Date.now()}_${i}`,
                title: n.title || 'Note',
                summary: n.summary || '',
                insights: Array.isArray(n.insights) ? n.insights : [n.summary || ''],
                tags: Array.isArray(n.tags) ? n.tags : ['CoPilot'],
                createdAt: Date.now() + i,
                sourceText: userMessage,
              }))
            : [],
          tasks: Array.isArray(parsed.tasks)
            ? parsed.tasks.map((t: any, i: number) => ({
                id: t.id || `task_${Date.now()}_${i}`,
                title: t.title || 'Task',
                category: t.category === 'sprint' || t.category === 'wellness' ? t.category : 'business',
                priority: t.priority === 'high' || t.priority === 'quick' ? t.priority : 'medium',
                estimatedMinutes: Number(t.estimatedMinutes) || 30,
                completed: false,
                createdAt: Date.now() + i,
              }))
            : [],
          routines: Array.isArray(parsed.routines)
            ? parsed.routines.map((r: any, i: number) => ({
                id: r.id || `rout_${Date.now()}_${i}`,
                time: r.time || '08:00 AM',
                startHour: Number(r.startHour) ?? 8,
                startMinute: Number(r.startMinute) ?? 0,
                durationMinutes: Number(r.durationMinutes) || 30,
                title: r.title || 'Routine Protocol',
                category: r.category || 'deep_work',
                description: r.description || 'Circadian routine item',
                completed: false,
                frequency: r.frequency || 'daily',
              }))
            : [],
          reminders: Array.isArray(parsed.reminders)
            ? parsed.reminders.map((rem: any, i: number) => ({
                id: rem.id || `rem_${Date.now()}_${i}`,
                title: rem.title || 'Reminder',
                targetTime: rem.targetTime || 'Scheduled',
                category: rem.category || 'action',
                priority: rem.priority === 'urgent' || rem.priority === 'high' ? rem.priority : 'normal',
                completed: false,
                createdAt: Date.now() + i,
              }))
            : [],
        };

        return NextResponse.json({
          success: true,
          batch,
        });
      }
    } catch (aiErr) {
      console.warn('[WelBuddy Extract API] AI Model failed, falling back to local heuristic:', aiErr);
    }

    // High quality local heuristic extraction fallback
    const localBatch = parseLocalHeuristic(userMessage, assistantReply);
    return NextResponse.json({
      success: true,
      batch: localBatch,
      isFallback: true,
    });
  } catch (err: unknown) {
    console.error('[WelBuddy Extract API] Internal Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to extract items' },
      { status: 500 }
    );
  }
}
