import Constants from 'expo-constants';

export type BackendTutorial = {
  id: string;
  name: string;
  url: string;
  description: string;
  transcript: string;
};

export type SemanticSearchResult = {
  tutorialId?: string;
  tutorialName?: string;
  chunkText?: string;
  score?: number;
};

export type Tutorial = {
  id: string;
  title: string;
  minutes: number;
  focus: string;
  summary: string;
  steps: string[];
  color: string;
  url?: string;
};

const FALLBACK_BASE_URL = 'https://backend-stepkind.onrender.com';

const palette = ['#FFE1D6', '#FFEBD1', '#FCE1DC', '#FCE8D6', '#FFE7D9', '#FFEFD1'];

const getBaseUrl = () => {
  const configured =
    process.env.EXPO_PUBLIC_API_URL ??
    Constants.expoConfig?.extra?.apiUrl ??
    Constants.manifest2?.extra?.expoClient?.extra?.apiUrl;

  return typeof configured === 'string' && configured.trim().length > 0
    ? configured.replace(/\/$/, '')
    : FALLBACK_BASE_URL;
};

const deriveSteps = (transcript: string) => {
  if (!transcript?.trim()) return ['Open tutorial', 'Review content'];

  return transcript
    .split(/\n+|\./)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .slice(0, 4);
};

const deriveMinutes = (transcript: string) => {
  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.min(20, Math.ceil(wordCount / 120)));
};

const inferFocus = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('asp.net') || lower.includes('postgresql') || lower.includes('ef core')) {
    return 'Backend';
  }
  if (lower.includes('mobile') || lower.includes('react native')) return 'Mobile';
  if (lower.includes('api')) return 'API';
  return 'Tech';
};

const toTutorial = (tutorial: BackendTutorial, index = 0): Tutorial => ({
  id: tutorial.id,
  title: tutorial.name,
  minutes: deriveMinutes(tutorial.transcript),
  focus: inferFocus(tutorial.name),
  summary: tutorial.description,
  steps: deriveSteps(tutorial.transcript),
  color: palette[index % palette.length],
  url: tutorial.url,
});

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || 'Unknown error'}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function fetchTutorials(): Promise<Tutorial[]> {
  const data = await request<BackendTutorial[]>('/api/tutorials');
  return data.map((tutorial, index) => toTutorial(tutorial, index));
}

export async function fetchTutorialById(id: string): Promise<Tutorial> {
  const data = await request<BackendTutorial>(`/api/tutorials/${id}`);
  return toTutorial(data);
}

export async function searchSemanticTutorials(query: string, topK = 10): Promise<Tutorial[]> {
  const results = await request<SemanticSearchResult[]>('/api/search/semantic', {
    method: 'POST',
    body: JSON.stringify({ query, topK }),
  });

  const seen = new Set<string>();
  const tutorials: Tutorial[] = [];

  results.forEach((result, index) => {
    const tutorialId = result.tutorialId?.trim();
    if (!tutorialId || seen.has(tutorialId)) return;

    seen.add(tutorialId);
    tutorials.push({
      id: tutorialId,
      title: result.tutorialName?.trim() || tutorialId,
      minutes: 5,
      focus: 'Semantic result',
      summary: result.chunkText?.trim() || 'Relevant result from semantic search.',
      steps: ['Open tutorial details', 'Review indexed content'],
      color: palette[index % palette.length],
    });
  });

  return tutorials;
}
