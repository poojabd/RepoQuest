# RepoQuest — AI-Powered Open-Source Discovery and Contribution Platform

> **Tagline:** Explore Repositories. Discover Issues. Start Contributing.

RepoQuest is a modern web application designed to help students, beginner developers, and aspiring open-source contributors navigate the complex world of GitHub. It demystifies monolithic codebases, explains README files and folder structures in plain English, surfaces verified beginner-friendly issues, and provides an actionable 8-stage roadmap to help you submit your first pull request with confidence.

---

## 🌟 Key Features

1. **Repository Explorer**
   - Live public GitHub repository search by keywords, categories, and programming languages.
   - Smart tags for beginner-friendly projects, star metrics, and topics.
   - 1-click **"Analyze"** shortcut to inspect any discovered repository.

2. **AI Repository Analyzer**
   - Paste any GitHub URL (`https://github.com/owner/repo` or `owner/repo`).
   - Retrieves live metadata, README, languages, and top-level file trees from GitHub.
   - Provides a comprehensive 7-section breakdown:
     - **A. Project Overview:** Core problem solved & target users.
     - **B. Explain It Simply (ELI5):** Clear explanation for students without technical jargon.
     - **C. Understand the File Structure:** Interactive file tree viewer with file purpose indicators.
     - **D. Where Should I Start:** Specific file and documentation recommendations.
     - **E. Technologies Used:** Detected languages with percentage breakdowns.
     - **F. Beginner-Friendly Next Steps:** Practical setup & branch guidance.
     - **G. Important Notes:** Flags missing documentation or complex setups honestly.

3. **Beginner-Friendly Issue Finder**
   - Live search across open GitHub issues with labels like `good first issue`, `beginner-friendly`, `help wanted`, `documentation`, and `bug`.
   - **"Understand This Issue"** AI assistant: Explains what needs to be fixed, why it matters, required skills, files to inspect, and questions to ask maintainers.

4. **My Contribution Roadmap**
   - 8-stage interactive progress tracker: from environment setup to your first merged PR.
   - Built-in Git cheat sheet command generator (`clone`, `branch`, `commit`, `test`, `push`).
   - Contributor session notes persisted in local session storage.

5. **Local Ollama Open-Weight AI Architecture**
   - Designed to run seamlessly with locally hosted open-weight models: **`qwen3:0.6b`** via Ollama on Windows/Mac/Linux.
   - Complete privacy: No cloud subscriptions, no API keys required, no personal code sent to proprietary third-party servers.
   - Transparent fallback: When Ollama is offline, RepoQuest performs deterministic structural analysis from live GitHub metadata rather than fabricating fake answers.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend / Proxy:** Node.js, Express, tsx
- **Build Tool:** Vite 8
- **AI Integration:** Local Ollama API (`http://localhost:11434`, default model `qwen3:0.6b`) with optional Google Gemini fallback

---

## 💻 Windows Setup Instructions

### Prerequisites
1. **Node.js** (v18 or higher): Download from [nodejs.org](https://nodejs.org/)
2. **Git**: Download from [git-scm.com](https://git-scm.com/)
3. **Ollama for Windows**: Download from [ollama.com/download/windows](https://ollama.com/download/windows)

---

### Step 1: Install Ollama & Pull the Model

Open **Windows PowerShell** or Command Prompt and run:

```powershell
# 1. Pull and test the ultra-lightweight Qwen3 0.6B model
ollama run qwen3:0.6b
```

> **Note:** Once it finishes downloading and starts an interactive prompt, you can type `/bye` and hit Enter to exit the prompt.

Next, start the Ollama background server with cross-origin access enabled so the RepoQuest backend can communicate with it:

```powershell
# In PowerShell:
$env:OLLAMA_ORIGINS="*"
ollama serve
```

*(Leave this PowerShell window open to keep Ollama running in the background).*

---

### Step 2: Install RepoQuest & Start the Application

Open a **new** PowerShell terminal inside the project directory:

```powershell
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

RepoQuest will start at:
👉 **`http://localhost:3000`**

Open this address in your browser (Chrome, Edge, or Firefox).

---

## 🧪 Testing the Features

### 1. Test the Ollama Connection
- Click the **"Ollama: qwen3:0.6b"** badge in the top right navigation bar.
- Click **"Test Connection"**.
- If Ollama is running, you will see a green checkmark indicating active status and a list of detected local models.

### 2. Test Repository Search
- Go to the **"Explore Repositories"** tab.
- Type `react` or `algorithm` in the search bar.
- Filter by categories such as **"Beginner-Friendly"** or **"Python"**.
- Observe live GitHub repository cards with star counts, forks, and language badges.

### 3. Test Repository Analysis
- Go to the **"Repository Analyzer"** tab.
- Click one of the quick picks (e.g., `firstcontributions/first-contributions` or `pallets/flask`), or paste any public repository URL.
- Click **"Analyze Repository"**.
- Review the 5 tabs: Overview, File Structure, Where Should I Start, Technologies, and Next Steps.

### 4. Test Issue Explanation
- Go to the **"Find Issues"** tab.
- Select an issue and click **"Understand Issue"**.
- Read the AI-generated 5-point beginner breakdown.
- Click **"Add to My Contribution Roadmap"** to track the issue in your roadmap!

---

## ⚙️ Environment Variables (Optional)

Configure via `.env` file if desired:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port for the local dev server |
| `OLLAMA_HOST` | `http://localhost:11434` | URL to your local Ollama instance |
| `OLLAMA_MODEL` | `qwen3:0.6b` | Model name to invoke in Ollama |
| `GITHUB_TOKEN` | *empty* | GitHub Personal Access Token (boosts rate limit from 60 to 5,000 req/hr) |
| `GEMINI_API_KEY`| *empty* | Optional cloud fallback if Ollama is not installed |

---

## 🛡️ Troubleshooting & Known Limitations

1. **GitHub API Rate Limits:**
   - Unauthenticated GitHub API calls are limited to 60 requests per hour per IP.
   - If this limit is exceeded, RepoQuest automatically activates a curated offline preview dataset, displaying an informative yellow status badge so the UI never crashes.
   - To increase your limit to 5,000 req/hr, add a standard GitHub Personal Access Token to `GITHUB_TOKEN` in `.env`.

2. **Ollama Shows "Offline / Unreachable":**
   - Ensure Ollama is running on your machine: run `ollama serve` in a terminal.
   - Ensure `$env:OLLAMA_ORIGINS="*"` is set in PowerShell so localhost requests are accepted.
   - If using WSL or Docker, set `OLLAMA_HOST="http://host.docker.internal:11434"`.

3. **Very Large Repositories:**
   - For repositories with hundreds of root files, RepoQuest focuses on the primary configuration, source directories, and README to respect the memory budget of `qwen3:0.6b`.

---

## 📜 License
Distributed under the MIT License. Built for hackathon presentation and open-source education.
