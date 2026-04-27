const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const SpeechSDK = require('microsoft-cognitiveservices-speech-sdk');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
  },
});

function recognizeSpeechFromBuffer(buffer, language = 'en-US') {
  return new Promise((resolve, reject) => {
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return reject(new Error('SPEECH_KEY and SPEECH_REGION must be set in environment variables.'));
    }

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechRecognitionLanguage = language;

    const pushStream = SpeechSDK.AudioInputStream.createPushStream();
    pushStream.write(buffer);
    pushStream.close();

    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();

        switch (result.reason) {
          case SpeechSDK.ResultReason.RecognizedSpeech:
            resolve({ text: result.text, language });
            break;
          case SpeechSDK.ResultReason.NoMatch:
            reject(new Error('No speech could be recognized.'));
            break;
          case SpeechSDK.ResultReason.Canceled: {
            const cancellation = SpeechSDK.CancellationDetails.fromResult(result);
            reject(new Error(`Recognition canceled: ${cancellation.errorDetails}`));
            break;
          }
          default:
            reject(new Error('Speech recognition failed.'));
        }
      },
      (err) => {
        recognizer.close();
        reject(err);
      }
    );
  });
}

app.get('/', (req, res) => {
  res.send('AI Service is running. Use POST /api/speech-to-english with a WAV audio file.');
});


app.post('/api/speech-to-english', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded. Use form field name "audio".' });
    }

    const targetLanguage = 'en-US';
    const { buffer, originalname } = req.file;
    const result = await recognizeSpeechFromBuffer(buffer, targetLanguage);

    res.json({
      fileName: originalname,
      language: targetLanguage,
      text: result.text,
    });
  } catch (error) {
    console.error('Speech recognition error:', error);
    res.status(500).json({ error: error.message || 'Speech recognition failed.' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`AI Service listening on port ${port}`);
});

