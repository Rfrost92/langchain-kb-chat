import {NextRequest, NextResponse} from "next/server";

import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

// cosine similarity helper
function cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}

export async function POST(req: NextRequest) {
    try {
        const {text, question} = await req.json();

        if (!text || !question) {
            return NextResponse.json(
                {error: "Missing 'text' or 'question'."},
                {status: 400}
            );
        }

        // 1) Split into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const docs = await splitter.createDocuments([text]);
        const chunks = docs.map((d) => d.pageContent);

        // 2) Embeddings
        const embedder = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
        });

        const chunkEmbeddings = await embedder.embedDocuments(chunks);
        const [questionEmbedding] = await embedder.embedDocuments([question]);

        // 3) similarity search
        const scored = chunks
            .map((t, i) => ({
                text: t,
                score: cosineSimilarity(questionEmbedding, chunkEmbeddings[i]),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        const context = scored.map((s) => s.text).join("\n\n---\n\n");

        // 4) Build prompt manually
        const prompt = `
Answer the user's question **only** using the context below.
If the answer is not in the context, say:
"I don't know based on the provided text."

Context:
${context}

Question:
${question}

Answer:
`;

        // 5) LLM call
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.1,
        });

        const result = await model.invoke(prompt);

        return NextResponse.json({
            answer:
                typeof result.content === "string"
                    ? result.content
                    : JSON.stringify(result.content),
        });
    } catch (err: any) {
        console.error("RAG error:", err);
        return NextResponse.json(
            {error: "Server error", details: err.message},
            {status: 500}
        );
    }
}
