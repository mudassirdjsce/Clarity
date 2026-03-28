const axios = require('axios');

// Default to a stable ElevenLabs voice (Rachel - natural female voice)
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';

/**
 * POST /api/tts/speak
 * Body: { text: string }
 * Returns: audio/mpeg stream
 */
async function speak(req, res) {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Missing or empty "text" field in request body.' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('❌ ELEVENLABS_API_KEY is not set in .env');
    return res.status(500).json({ error: 'TTS service is not configured on the server.' });
  }

  // Trim text to avoid hitting ElevenLabs character limits (5000 char free tier)
  const trimmedText = text.trim().substring(0, 4500);

  try {
    const response = await axios.post(
      `${ELEVENLABS_BASE}/text-to-speech/${VOICE_ID}`,
      {
        text: trimmedText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      },
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'arraybuffer',
        timeout: 30_000, // 30 s timeout
      }
    );

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.byteLength,
      'Cache-Control': 'no-store',
    });

    return res.send(Buffer.from(response.data));
  } catch (err) {
    if (err.response) {
      // ElevenLabs returned an error response
      const status = err.response.status;
      let message = `ElevenLabs API error (${status})`;
      try {
        // response is arraybuffer — decode it for the error message
        const errText = Buffer.from(err.response.data).toString('utf-8');
        const parsed = JSON.parse(errText);
        message = parsed?.detail?.message || parsed?.detail || errText;
      } catch { /* keep generic message */ }
      console.error('❌ ElevenLabs error:', status, message);
      return res.status(status >= 500 ? 502 : status).json({ error: message });
    }
    if (err.code === 'ECONNABORTED') {
      console.error('❌ ElevenLabs request timed out');
      return res.status(504).json({ error: 'TTS request timed out. Try again.' });
    }
    console.error('❌ TTS unexpected error:', err.message);
    return res.status(500).json({ error: 'Unexpected TTS error. Please try again.' });
  }
}

module.exports = { speak };
