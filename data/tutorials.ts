export type Tutorial = {
  id: string;
  title: string;
  minutes: number;
  focus: string;
  summary: string;
  steps: string[];
  color: string;
};

export const tutorials: Tutorial[] = [
  {
    id: 'prioritize-5',
    title: 'How to prioritize tasks in 5 minutes',
    minutes: 5,
    focus: 'Productivity',
    summary: 'Pick the one task that moves everything forward today.',
    steps: ['List the top 5 tasks', 'Choose the 1 that matters most', 'Block 25 minutes'],
    color: '#FFE1D6',
  },
  {
    id: 'morning-routine',
    title: 'Build a clean morning routine',
    minutes: 6,
    focus: 'Habits',
    summary: 'A short routine that makes your day feel organized.',
    steps: ['Pick 3 actions', 'Do them in the same order', 'Track for 7 days'],
    color: '#FFEBD1',
  },
  {
    id: 'voice-note',
    title: 'Make a sharp voice note',
    minutes: 4,
    focus: 'Communication',
    summary: 'Say more with less using a clear structure.',
    steps: ['State the purpose', 'Deliver the key point', 'End with next action'],
    color: '#FCE1DC',
  },
  {
    id: 'weekly-review',
    title: 'Plan a quick weekly review',
    minutes: 8,
    focus: 'Planning',
    summary: 'Reset your week in under 10 minutes.',
    steps: ['Review wins', 'Check open loops', 'Pick next focus'],
    color: '#FCE8D6',
  },
  {
    id: 'email-clarity',
    title: 'Write a clear email in 4 steps',
    minutes: 7,
    focus: 'Writing',
    summary: 'Make emails easy to read and act on.',
    steps: ['One-line subject', 'Context in 2 lines', 'Request + deadline'],
    color: '#FFE7D9',
  },
  {
    id: 'idea-capture',
    title: 'Capture ideas before they fade',
    minutes: 3,
    focus: 'Creativity',
    summary: 'Save ideas fast with a simple system.',
    steps: ['Open one note', 'Write in fragments', 'Tag with a keyword'],
    color: '#FFEFD1',
  },
];
