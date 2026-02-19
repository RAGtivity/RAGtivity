import express from 'express';

const router = express.Router();
const RAG_URL = 'http://rag:8000';

//query
router.post('/query', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const response = await fetch(`${RAG_URL}/query`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({question: question, userId: req.cookies.userId})
    });

    // Check if the response is OK
    if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: 'RAG query failed', details: errorText });
    }

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the response stream to the client
    if (response.body) {
      // Iterate through each stream response
      for await (const chunk of response.body) {
            res.write(chunk);
        }
        res.end();
    } else {
        res.end();
    }

  } catch (err) {
    console.error("Backend error:", err);
    // If headers are already sent, we can't send a JSON error response
    if (!res.headersSent) {
        res.status(500).json({ error: 'RAG query failed', details: err.message });
    } else {
        res.end();
    }
  }
});

export default router;
