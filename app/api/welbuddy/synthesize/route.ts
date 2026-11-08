import { NextResponse } from 'next/server';
import { generateWithFallbacks } from '@/lib/aiFallbackEngine';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export interface ExtractedTask {
  id: string;
  title: string;
  category: 'business' | 'wellness' | 'sprint';
  priority: 'high' | 'medium' | 'quick';
  estimatedMinutes: number;
}

export interface SmartChapter {
  id: string;
  timestamp: string;
  title: string;
  insight: string;
}

export interface SynthesizeResponse {
  summary: string;
  chapters: SmartChapter[];
  tasks: ExtractedTask[];
  routineRecommendation?: Array<{ time: string; title: string; category: string }>;
}

function generateLocalExtraction(rawText: string, mode: string): SynthesizeResponse {
  const lines = rawText.split(/\n|\. /).map((l) => l.trim()).filter((l) => l.length > 3);
  const tasks: ExtractedTask[] = [];

  // Keywords detection
  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    const isWellness = /sleep|stress|breathe|sigh|rest|walk|water|hydrate|nsdr|meditat|stretch|posture|fatigue|burnout/i.test(lower);
    const isSprint = /90m|flow|deep work|focus|block|code|build|feature|sprint/i.test(lower);
    const category: 'business' | 'wellness' | 'sprint' = isSprint ? 'sprint' : isWellness ? 'wellness' : 'business';
    const isQuick = /call|quick|5m|10m|email|check|ping|slack/i.test(lower);
    const priority: 'high' | 'medium' | 'quick' = isQuick ? 'quick' : (idx === 0 || lower.includes('urgent') || lower.includes('must') || lower.includes('client')) ? 'high' : 'medium';
    const estimatedMinutes = isSprint ? 90 : isQuick ? 15 : isWellness ? 20 : 45;

    // Clean up bullet symbols or numbers
    const cleanTitle = line.replace(/^[-*•0-9.)\s]+/, '').trim();
    if (cleanTitle.length > 5 && tasks.length < 5) {
      tasks.push({
        id: `task_${Date.now()}_${idx}`,
        title: cleanTitle.length > 80 ? cleanTitle.slice(0, 77) + '...' : cleanTitle,
        category,
        priority,
        estimatedMinutes,
      });
    }
  });

  if (tasks.length === 0) {
    tasks.push(
      { id: `t1_${Date.now()}`, title: '90m High-Leverage Execution Sprint', category: 'sprint', priority: 'high', estimatedMinutes: 90 },
      { id: `t2_${Date.now()}`, title: '2-Minute Vagal Reset & Eye De-strain', category: 'wellness', priority: 'quick', estimatedMinutes: 5 },
      { id: `t3_${Date.now()}`, title: 'Clear top 3 client communications', category: 'business', priority: 'medium', estimatedMinutes: 30 }
    );
  }

  const chapters: SmartChapter[] = [
    {
      id: 'c1',
      timestamp: '00:00',
      title: 'Context & Executive Priorities',
      insight: lines[0] ? `Primary focus centered around: ${lines[0].slice(0, 90)}` : 'Establishing primary business leverage and mental energy constraints.',
    },
    {
      id: 'c2',
      timestamp: '02:30',
      title: 'High-Impact Action Roadmap',
      insight: 'Targeting top 20% actions that deliver 80% outcome velocity without cognitive fragmentation.',
    },
    {
      id: 'c3',
      timestamp: '05:00',
      title: 'Nervous System Recovery Anchor',
      insight: 'Balancing intense execution with scheduled NSDR and eye relaxation to prevent afternoon burnout.',
    },
  ];

  return {
    summary: lines.length > 0 
      ? `Synthesized into ${tasks.length} actionable execution protocols. Prioritize the highest leverage business task first while guarding your nervous system.`
      : 'WelBuddy processed your notes and extracted prioritized tasks with circadian timeblocks.',
    chapters,
    tasks,
    routineRecommendation: [
      { time: '08:30 AM', title: tasks[0]?.title || '90m Flow Sprint', category: 'business' },
      { time: '02:00 PM', title: '10m Dopamine NSDR Reboot', category: 'wellness' },
      { time: '03:30 PM', title: tasks[1]?.title || 'Client Outreach & Velocity', category: 'business' },
      { time: '09:30 PM', title: 'Digital Sunset & Melatonin Architecture', category: 'wellness' },
    ],
  };
}

export async function POST(req: Request) {
  try {
    const { input, mode = 'brain_dump', taskTitle } = await req.json();

    if (!input && !taskTitle) {
      return NextResponse.json({ error: 'Input text or task title is required.' }, { status: 400 });
    }

    const contentToProcess = input || `Deconstruct and build an execution plan for task: ${taskTitle}`;

    const prompt = `You are WelBuddy™, the premier AI Assistant for the wellness of your user's mental and business life (inspired by Muse.ai's intelligent indexing, smart chaptering, and autonomous action planning).
You analyze raw brain dumps, meeting transcripts, or task descriptions, and transform them into structured, high-leverage execution plans.

USER INPUT TO SYNTHESIZE (${mode}):
"""
${contentToProcess}
"""

You must respond ONLY with a valid JSON object. Do not include markdown formatting or extra text.
Schema:
{
  "summary": "Crisp 1-2 sentence executive summary of the core objective and mental energy state.",
  "chapters": [
    {
      "id": "c1",
      "timestamp": "00:00",
      "title": "Short Chapter Title",
      "insight": "1-sentence key takeaway or strategic decision."
    },
    {
      "id": "c2",
      "timestamp": "02:15",
      "title": "Short Chapter Title",
      "insight": "1-sentence key takeaway."
    },
    {
      "id": "c3",
      "timestamp": "04:45",
      "title": "Short Chapter Title",
      "insight": "1-sentence key takeaway."
    }
  ],
  "tasks": [
    {
      "id": "t1",
      "title": "Actionable task starting with an active verb",
      "category": "business" | "wellness" | "sprint",
      "priority": "high" | "medium" | "quick",
      "estimatedMinutes": 45
    }
  ],
  "routineRecommendation": [
    {
      "time": "08:30 AM",
      "title": "Specific action for morning focus",
      "category": "business" | "wellness"
    },
    {
      "time": "02:00 PM",
      "title": "Specific recovery / NSDR protocol",
      "category": "wellness"
    },
    {
      "time": "03:30 PM",
      "title": "Afternoon tactical execution",
      "category": "business"
    }
  ]
}

RULES:
1. Extract 3-5 concrete, non-fluff tasks. Every task must be realistically executable.
2. Balance business velocity with nervous system preservation (include at least 1 mental wellness/recovery item).
3. If mode is 'task_breakdown', generate 3 sequential sub-steps to execute the target task.`;

    try {
      const rawAiResponse = await generateWithFallbacks(prompt);
      const parsed = JSON.parse(rawAiResponse);

      if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.chapters)) {
        return NextResponse.json({
          success: true,
          ...parsed,
        });
      }
    } catch (aiErr) {
      console.warn('[WelBuddy Synthesize] AI Engine unavailable, using local synthesis:', aiErr);
    }

    // High quality local heuristic extraction fallback
    const localResult = generateLocalExtraction(contentToProcess, mode);
    return NextResponse.json({
      success: true,
      ...localResult,
      isLocalFallback: true,
    });
  } catch (err: unknown) {
    console.error('[WelBuddy Synthesize API] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to synthesize plan' },
      { status: 500 }
    );
  }
}
