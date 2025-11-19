# AI Knowledge Base Chat (LangChain RAG Demo)

A simple and clean Retrieval-Augmented Generation (RAG) demo built with **Next.js**, **LangChain**, and **OpenAI**.  
Paste any text (FAQ, docs, articles, policies) and ask questions — the AI answers **strictly based on your provided content**.

---

## Features
- Paste any long-form text as a knowledge base
- Automatic text chunking with LangChain
- OpenAI embeddings (`text-embedding-3-small`)
- In-memory vector search using cosine similarity
- Clean chat-style interface
- GPT-4o-mini for accurate, context-based answers
- Fully local demo — nothing stored

---

## Tech Stack
- **Next.js 14** (App Router)
- **React / TypeScript**
- **Tailwind CSS**
- **OpenAI API** (GPT-4o-mini, embeddings)
- **LangChain** (text splitting)

---

## Getting Started

### 1. Clone the repo
```bash
1. git clone https://github.com/YOUR_USERNAME/langchain-kb-chat.git
cd langchain-kb-chat
2. Install dependencies
npm install

3. Add your API key

Create .env.local:

OPENAI_API_KEY=your_key_here

4. Run the dev server
npm run dev

Visit:

http://localhost:3000
