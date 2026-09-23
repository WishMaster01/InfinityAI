import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAI } from "@google/generative-ai";

const qdrant = process.env.QDRANT_URL
  ? new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY || undefined,
    })
  : null;
const collection = process.env.QDRANT_COLLECTION || "infinityai_documents";
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const embed = async (text) => {
  if (!genAI) return null;
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004",
  });
  return (await model.embedContent(text)).embedding.values;
};

export const indexDocumentChunks = async (documentId, chunks) => {
  if (!qdrant || !chunks.length) return { indexed: false };
  const vectors = [];
  for (const chunk of chunks) {
    const vector = await embed(chunk.text);
    if (vector)
      vectors.push({
        id: chunk.id,
        vector,
        payload: { documentId, chunkIndex: chunk.chunkIndex, text: chunk.text },
      });
  }
  if (!vectors.length) return { indexed: false };
  try {
    await qdrant
      .createCollection(collection, {
        vectors: { size: vectors[0].vector.length, distance: "Cosine" },
      })
      .catch(() => {});
    await qdrant.upsert(collection, { wait: true, points: vectors });
    return { indexed: true, count: vectors.length };
  } catch (error) {
    console.error("RAG vector indexing failed:", error.message);
    return { indexed: false };
  }
};

export const searchDocumentChunks = async (documentId, query, limit = 4) => {
  if (!qdrant) return null;
  const vector = await embed(query);
  if (!vector) return null;
  const result = await qdrant.search(collection, {
    vector,
    limit,
    with_payload: true,
    filter: { must: [{ key: "documentId", match: { value: documentId } }] },
  });
  return result.map((item) => ({
    index: item.payload.chunkIndex,
    chunk: item.payload.text,
    priority: item.score,
  }));
};
