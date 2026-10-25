import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:0.6b';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

app.use(express.json({ limit: '2mb' }));

// Helper to make GitHub API requests with proper headers
const githubHeaders: Record<string, string> = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'RepoQuest-App/1.0.0',
};
if (GITHUB_TOKEN) {
  githubHeaders['Authorization'] = `token ${GITHUB_TOKEN}`;
}

// -----------------------------------------------------------------------------
// OLLAMA INTEGRATION ENDPOINTS
// -----------------------------------------------------------------------------

// Check if local Ollama server is running and what models are installed
app.get('/api/ollama/status', async (_req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.json({
        running: false,
        host: OLLAMA_HOST,
        targetModel: OLLAMA_MODEL,
        error: `Ollama returned HTTP ${response.status}`,
        models: [],
      });
    }

    const data = await response.json();
    const models = Array.isArray(data?.models) ? data.models.map((m: any) => m.name) : [];
    const hasTargetModel = models.some((m: string) => m.includes(OLLAMA_MODEL.split(':')[0]));

    return res.json({
      running: true,
      host: OLLAMA_HOST,
      targetModel: OLLAMA_MODEL,
      hasTargetModel,
      models,
    });
  } catch (err: any) {
    return res.json({
      running: false,
      host: OLLAMA_HOST,
      targetModel: OLLAMA_MODEL,
      error: err.name === 'AbortError' ? 'Connection timed out' : 'Ollama is not running on localhost:11434',
      models: [],
    });
  }
});

// Proxy generation request to local Ollama model
app.post('/api/ollama/generate', async (req: Request, res: Response) => {
  const { prompt, system, model = OLLAMA_MODEL, temperature = 0.3 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout for local inference

    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        system: system || 'You are an expert open-source mentor helping beginners understand repositories.',
        stream: false,
        options: {
          temperature,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `Ollama error (${response.status}): ${errText}`,
      });
    }

    const data = await response.json();
    return res.json({
      success: true,
      response: data.response,
      model: data.model,
      total_duration: data.total_duration,
    });
  } catch (err: any) {
    return res.status(503).json({
      success: false,
      error: `Could not connect to Ollama at ${OLLAMA_HOST}. Run "ollama serve" and "ollama run ${OLLAMA_MODEL}" on your Windows machine.`,
      isConnectionError: true,
    });
  }
});

// -----------------------------------------------------------------------------
// GITHUB PROXY ENDPOINTS (Prevents CORS, handles rate limits & caching)
// -----------------------------------------------------------------------------

// Search Repositories
app.get('/api/github/search-repos', async (req: Request, res: Response) => {
  const q = (req.query.q as string) || 'stars:>500';
  const sort = (req.query.sort as string) || 'stars';
  const order = (req.query.order as string) || 'desc';
  const per_page = Math.min(parseInt((req.query.per_page as string) || '12', 10), 30);
  const page = parseInt((req.query.page as string) || '1', 10);

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=${sort}&order=${order}&per_page=${per_page}&page=${page}`;

  try {
    const ghRes = await fetch(url, { headers: githubHeaders });
    const rateLimitRemaining = ghRes.headers.get('x-ratelimit-remaining');

    if (!ghRes.ok) {
      const errorData = await ghRes.json().catch(() => ({}));
      return res.status(ghRes.status).json({
        error: errorData.message || `GitHub API error: ${ghRes.statusText}`,
        rateLimitRemaining,
        rateLimited: ghRes.status === 403,
      });
    }

    const data = await ghRes.json();
    return res.json({
      total_count: data.total_count,
      items: data.items,
      rateLimitRemaining,
      live: true,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to search GitHub repositories' });
  }
});

// Search Issues (especially beginner friendly ones)
app.get('/api/github/search-issues', async (req: Request, res: Response) => {
  const q = (req.query.q as string) || 'is:issue is:open label:"good first issue"';
  const sort = (req.query.sort as string) || 'created';
  const order = (req.query.order as string) || 'desc';
  const per_page = Math.min(parseInt((req.query.per_page as string) || '15', 10), 30);
  const page = parseInt((req.query.page as string) || '1', 10);

  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=${sort}&order=${order}&per_page=${per_page}&page=${page}`;

  try {
    const ghRes = await fetch(url, { headers: githubHeaders });
    const rateLimitRemaining = ghRes.headers.get('x-ratelimit-remaining');

    if (!ghRes.ok) {
      const errorData = await ghRes.json().catch(() => ({}));
      return res.status(ghRes.status).json({
        error: errorData.message || `GitHub API error: ${ghRes.statusText}`,
        rateLimitRemaining,
        rateLimited: ghRes.status === 403,
      });
    }

    const data = await ghRes.json();
    return res.json({
      total_count: data.total_count,
      items: data.items,
      rateLimitRemaining,
      live: true,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to search GitHub issues' });
  }
});

// Get Detailed Repository Info (Repo + README + Languages + Root Contents)
app.get('/api/github/repo-details', async (req: Request, res: Response) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'owner and repo query params are required' });
  }

  try {
    const [repoRes, readmeRes, langRes, contentsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: githubHeaders }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: githubHeaders }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers: githubHeaders }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers: githubHeaders }).catch(() => null),
    ]);

    if (!repoRes.ok) {
      const errData = await repoRes.json().catch(() => ({}));
      return res.status(repoRes.status).json({
        error: errData.message || `Repository not found (${repoRes.status})`,
      });
    }

    const repoData = await repoRes.json();

    let readmeText = '';
    let readmeFileName = '';
    if (readmeRes && readmeRes.ok) {
      const readmeData = await readmeRes.json();
      readmeFileName = readmeData.name || 'README.md';
      if (readmeData.content && readmeData.encoding === 'base64') {
        readmeText = Buffer.from(readmeData.content, 'base64').toString('utf-8');
      }
    }

    let languages: Record<string, number> = {};
    if (langRes && langRes.ok) {
      languages = await langRes.json();
    }

    let contents: any[] = [];
    if (contentsRes && contentsRes.ok) {
      contents = await contentsRes.json();
    }

    return res.json({
      repository: repoData,
      readme: {
        name: readmeFileName,
        content: readmeText,
      },
      languages,
      contents: Array.isArray(contents) ? contents.map((item: any) => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        html_url: item.html_url,
      })) : [],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch repository information' });
  }
});

// -----------------------------------------------------------------------------
// AI REPOSITORY ANALYZER ORCHESTRATOR
// -----------------------------------------------------------------------------
app.post('/api/ai/analyze-repo', async (req: Request, res: Response) => {
  const { owner, repo, customQuestion } = req.body;

  if (!owner || !repo) {
    return res.status(400).json({ error: 'owner and repo are required' });
  }

  // 1. Fetch real GitHub repository metadata
  let repoData: any;
  let readmeSnippet = '';
  let languagesList: string[] = [];
  let fileList: string[] = [];

  try {
    const [repoRes, readmeRes, langRes, contentsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: githubHeaders }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers: githubHeaders }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers: githubHeaders }).catch(() => null),
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers: githubHeaders }).catch(() => null),
    ]);

    if (!repoRes.ok) {
      return res.status(repoRes.status).json({ error: `Could not find GitHub repository: ${owner}/${repo}` });
    }

    repoData = await repoRes.json();

    if (readmeRes && readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content) {
        const fullReadme = Buffer.from(readmeData.content, 'base64').toString('utf-8');
        readmeSnippet = fullReadme.slice(0, 3500); // Truncate to keep compact for 0.6B LLM
      }
    }

    if (langRes && langRes.ok) {
      const langs = await langRes.json();
      languagesList = Object.keys(langs);
    }

    if (contentsRes && contentsRes.ok) {
      const items = await contentsRes.json();
      if (Array.isArray(items)) {
        fileList = items.map((i: any) => `${i.name} (${i.type})`);
      }
    }
  } catch (err: any) {
    return res.status(500).json({ error: `GitHub fetch error: ${err.message}` });
  }

  // 2. Prepare structured context
  const repoContext = `
Repository: ${repoData.full_name}
Description: ${repoData.description || 'No description provided.'}
Primary Language: ${repoData.language || 'Unknown'}
All Languages: ${languagesList.join(', ') || 'Not specified'}
Stars: ${repoData.stargazers_count} | Forks: ${repoData.forks_count} | Open Issues: ${repoData.open_issues_count}
Has License: ${repoData.license ? repoData.license.spdx_id : 'None detected'}
Top-Level Files/Folders: ${fileList.join(', ')}

README Excerpt:
${readmeSnippet.slice(0, 2500)}
`.trim();

  // 3. Check if local Ollama is available
  let isOllamaRunning = false;
  try {
    const testOllama = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(1500) });
    isOllamaRunning = testOllama.ok;
  } catch {
    isOllamaRunning = false;
  }

  // Prompt carefully crafted for qwen3:0.6b to produce high-value, structured output without rambling
  const systemPrompt = `You are RepoQuest AI, an open-source mentor for beginners and students.
Analyze the provided GitHub repository accurately using only the facts given.
Format your answer clearly with these exact sections:
1. OVERVIEW: What does this project do, what problem does it solve, and who uses it?
2. SIMPLE EXPLANATION: Explain the concept simply without technical jargon.
3. FILE STRUCTURE INSIGHT: Explain the key folders/files found in this repository.
4. WHERE TO START: Name 2-3 specific files or docs a beginner should read first and why.
5. TECHNOLOGIES DETECTED: List the actual detected technologies and libraries.
6. BEGINNER NEXT STEPS: Give 3 practical, actionable first steps to get ready to contribute.
7. IMPORTANT NOTES: Mention any missing documentation, complex setup, or limitations.`;

  const userPrompt = `Please analyze this GitHub repository for a beginner developer:
${repoContext}

${customQuestion ? `Additional user question: ${customQuestion}` : ''}`;

  if (isOllamaRunning) {
    try {
      const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: userPrompt,
          system: systemPrompt,
          stream: false,
          options: { temperature: 0.2 },
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (ollamaRes.ok) {
        const ollamaData = await ollamaRes.json();
        return res.json({
          success: true,
          engine: 'ollama',
          model: OLLAMA_MODEL,
          host: OLLAMA_HOST,
          analysis: ollamaData.response,
          repository: repoData,
          languages: languagesList,
          fileList,
          hasReadme: Boolean(readmeSnippet),
        });
      }
    } catch (e: any) {
      console.warn('Ollama call failed despite status check:', e.message);
    }
  }

  // Fallback: If Gemini API key is configured, user can optionally use Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI();
      const geminiRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\n${userPrompt}`,
      });

      return res.json({
        success: true,
        engine: 'gemini',
        model: 'gemini-2.5-flash',
        ollamaOffline: true,
        ollamaHost: OLLAMA_HOST,
        targetModel: OLLAMA_MODEL,
        analysis: geminiRes.text,
        repository: repoData,
        languages: languagesList,
        fileList,
        hasReadme: Boolean(readmeSnippet),
        note: `Generated via Gemini fallback because Ollama (${OLLAMA_MODEL}) was not running on ${OLLAMA_HOST}.`,
      });
    } catch (gErr: any) {
      console.warn('Gemini fallback failed:', gErr.message);
    }
  }

  // Deterministic Structural Analysis Fallback when no LLM is running
  // Honest, accurate, and extracts facts from real GitHub data without hallucination
  const structuredFallback = `### 1. Project Overview
${repoData.name} is an open-source project written primarily in ${repoData.language || 'various languages'}.
${repoData.description ? `**Description:** ${repoData.description}` : 'No description provided by the repository owner.'}
It currently has ${repoData.stargazers_count.toLocaleString()} stars and ${repoData.forks_count.toLocaleString()} forks on GitHub.

### 2. Explain It Simply
${repoData.description ? `In simple terms, ${repoData.name} is a software tool created to ${repoData.description.toLowerCase().replace(/\.$/, '')}. It allows developers to build, automate, or integrate features without starting from scratch.` : `${repoData.name} provides source code and tools for developers working in ${repoData.language || 'software engineering'}.`}

### 3. File Structure Insight
Detected top-level files in this repository:
${fileList.map(f => `• \`${f}\``).join('\n')}

${fileList.some(f => f.toLowerCase().includes('readme')) ? '• `README.md`: The primary documentation covering setup, usage, and project purpose.\n' : '• ⚠️ No top-level README found.\n'}${fileList.some(f => f.toLowerCase().includes('package.json')) ? '• `package.json`: Node.js manifest defining project dependencies, scripts, and version.\n' : ''}${fileList.some(f => f.toLowerCase().includes('requirements') || f.toLowerCase().includes('pyproject')) ? '• Python dependency specification (requirements.txt / pyproject.toml).\n' : ''}${fileList.some(f => f.toLowerCase().includes('contributing')) ? '• `CONTRIBUTING.md`: Dedicated guide on how the maintainers prefer bug reports and pull requests.\n' : ''}${fileList.some(f => f.toLowerCase().includes('src')) ? '• `src/`: Core application source code.\n' : ''}${fileList.some(f => f.toLowerCase().includes('test')) ? '• `tests/`: Automated unit or integration test suites.\n' : ''}

### 4. Where Should I Start?
1. **${fileList.find(f => f.toLowerCase().includes('contributing')) ? 'CONTRIBUTING.md' : 'README.md'}**: Review this first to understand how the project is run and how to install it.
2. **Setup Instructions in README**: Ensure you can clone the repository and run the build command on your local machine.
3. **Explore \`${fileList.find(f => f.toLowerCase().includes('src')) ? 'src/' : fileList[0] || 'root'}\`**: Browse the entry point to see how the code is organized.

### 5. Technologies Detected
• Primary Language: ${repoData.language || 'Unknown'}
• Detected Languages: ${languagesList.join(', ') || 'See GitHub repository'}
• Open Issues: ${repoData.open_issues_count} active issues on GitHub.

### 6. Beginner-Friendly Next Steps
1. Fork the repository to your own GitHub account.
2. Clone it locally: \`git clone ${repoData.clone_url}\`
3. Run the installation and test commands to verify your environment works before making any changes.

### 7. Important Notes
⚡ **Ollama Local AI is currently offline at ${OLLAMA_HOST}**.
This analysis was deterministically compiled from real GitHub API metadata. To enable deep neural natural-language analysis with **${OLLAMA_MODEL}**, start Ollama on your Windows machine:
\`\`\`powershell
ollama run ${OLLAMA_MODEL}
\`\`\``;

  return res.json({
    success: true,
    engine: 'heuristic',
    ollamaOffline: true,
    ollamaHost: OLLAMA_HOST,
    targetModel: OLLAMA_MODEL,
    analysis: structuredFallback,
    repository: repoData,
    languages: languagesList,
    fileList,
    hasReadme: Boolean(readmeSnippet),
  });
});

// -----------------------------------------------------------------------------
// AI ISSUE EXPLAINER ENDPOINT
// -----------------------------------------------------------------------------
app.post('/api/ai/explain-issue', async (req: Request, res: Response) => {
  const { title, body, labels, repo, number, html_url } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Issue title is required' });
  }

  const issueContext = `
Repository: ${repo || 'Unknown'}
Issue #${number || ''}: ${title}
Labels: ${Array.isArray(labels) ? labels.join(', ') : 'None'}
Issue URL: ${html_url || ''}
Issue Description:
${body ? body.slice(0, 3000) : 'No description provided by the author.'}
`.trim();

  const systemPrompt = `You are RepoQuest AI, an open-source contribution coach.
Explain this GitHub issue to a beginner developer in 5 structured sections:
1. WHAT PROBLEM NEEDS TO BE SOLVED: Plain explanation of the bug or feature requested.
2. WHY THE PROBLEM MATTERS: Why this helps the project and its users.
3. WHAT A BEGINNER NEEDS TO KNOW: Concepts, tools, or language skills required.
4. POSSIBLE FIRST STEPS TO INVESTIGATE: Concrete suggestions for where to look in code or tests.
5. QUESTIONS TO CLARIFY: Questions the contributor should verify or ask maintainers before coding.`;

  const userPrompt = `Please explain this GitHub issue for a first-time contributor:\n${issueContext}`;

  // Check Ollama
  let isOllamaRunning = false;
  try {
    const testOllama = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: AbortSignal.timeout(1500) });
    isOllamaRunning = testOllama.ok;
  } catch {
    isOllamaRunning = false;
  }

  if (isOllamaRunning) {
    try {
      const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: userPrompt,
          system: systemPrompt,
          stream: false,
          options: { temperature: 0.2 },
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (ollamaRes.ok) {
        const ollamaData = await ollamaRes.json();
        return res.json({
          success: true,
          engine: 'ollama',
          model: OLLAMA_MODEL,
          explanation: ollamaData.response,
        });
      }
    } catch (e: any) {
      console.warn('Ollama issue explanation failed:', e.message);
    }
  }

  // Gemini Fallback if available
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI();
      const geminiRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\n${userPrompt}`,
      });
      return res.json({
        success: true,
        engine: 'gemini',
        model: 'gemini-2.5-flash',
        explanation: geminiRes.text,
      });
    } catch (gErr: any) {
      console.warn('Gemini fallback failed for issue:', gErr.message);
    }
  }

  // Heuristic breakdown
  const heuristicExplanation = `### 1. What Problem Needs To Be Solved
The issue titled **"${title}"** requests changes in **${repo || 'the project'}**.
${body ? `Based on the description: "${body.slice(0, 200)}..."` : 'The author did not provide an extended description, so the title represents the core request.'}

### 2. Why The Problem Matters
Resolving this improves the project's quality, fixes unexpected behavior for users, or updates documentation so future developers have an easier onboarding experience.

### 3. What A Beginner Needs To Know
• Check the labels: ${Array.isArray(labels) && labels.length ? labels.join(', ') : 'No special labels attached'}.
• Review the repository language and setup guide in \`README.md\` or \`CONTRIBUTING.md\`.
• Basic Git workflow: branching (\`git checkout -b fix-...\`), committing, and opening a Pull Request.

### 4. Possible First Steps To Investigate
1. Clone the repository locally and verify you can run tests before writing new code.
2. Search the codebase for terms related to **"${title.split(' ').slice(0, 3).join(' ')}"**.
3. Reproduce the behavior if it is a bug, or inspect existing related components if it is a feature or documentation task.

### 5. Questions To Clarify Before Making Changes
• Has any other contributor already claimed this issue in the comments?
• Are there existing unit tests that should be updated alongside the change?
• Is the requested change still relevant in the latest \`main\` branch?

*(Note: Ollama is offline at ${OLLAMA_HOST}. Run \`ollama run ${OLLAMA_MODEL}\` to get real-time neural insights!)*`;

  return res.json({
    success: true,
    engine: 'heuristic',
    ollamaOffline: true,
    explanation: heuristicExplanation,
  });
});

// -----------------------------------------------------------------------------
// VITE SPA INTEGRATION & STATIC SERVING
// -----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RepoQuest server running at http://localhost:${PORT}`);
    console.log(`🤖 Configured Ollama Host: ${OLLAMA_HOST} | Model: ${OLLAMA_MODEL}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start RepoQuest server:', err);
  process.exit(1);
});
