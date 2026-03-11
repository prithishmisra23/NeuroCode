# NeuroCode

AI-powered Code Intelligence Engine for VS Code.

## 🧠 Overview

NeuroCode is a production-grade VS Code extension that transforms your development workflow with deep repository analysis, architecture visualization, and AI-driven code refactoring.

## 🚀 Features

- **Repository Scanning**: Instantly map your project structure and dependencies.
- **Architecture Visualization**: Interactive dependency graphs powered by Cytoscape.js.
- **Bug Prediction**: Risk scoring using a weighted formula (Complexity, History, Size).
- **AI Refactoring**: Senior-level code improvements with safe side-by-side diff previews.
- **Developer Dashboard**: A premium analytics console for repository health.

### 1. Set API Key

1. Install the **NeuroCode** extension from the Marketplace.
2. Open your VS Code Settings (`Ctrl+,`).
3. Search for `neurocode.apiKey` and enter your **Groq API Key**.
4. Restart VS Code or Reload the Window.

## 📖 Usage

### 1. Scan Repository

Press `Ctrl+Shift+P` and run **NeuroCode: Scan Repository**. This builds the initial dependency map.

### 2. Open Dashboard

Run **NeuroCode: Open Dashboard** to see the high-level health metrics and architecture map.

### 3. Refactor Code

Select any block of code, right-click (or use Command Palette), and choose **NeuroCode: Refactor Selection**. Preview the diff before applying.

## 🏗️ Architecture

NeuroCode follows a modular design:

- **Analyzers**: Pure logic for complexity and dependency mapping.
- **AI Engine**: Context-aware prompt engineering with OpenAI GPT-4.
- **WebView**: A React-inspired reactive dashboard with interactive visualizations.

## 🗺️ Roadmap

- [ ] Support for Python and Java AST analysis.
- [ ] Integration with GitHub Actions for PR analysis.
- [ ] Custom rule definition for smell detection.
- [ ] Offline analysis using local LLMs (Llama 3).

---

Built with ❤️ for the Developer Community.
