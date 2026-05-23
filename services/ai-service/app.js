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

function recognizeSpeechFromBuffer(buffer, sourceLanguage = 'ur-IN') {
  return new Promise((resolve, reject) => {
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return reject(new Error('SPEECH_KEY and SPEECH_REGION must be set in environment variables.'));
    }

    try {
      // Initialize translation config
      const translationConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(speechKey, speechRegion);
      
      // Set source language (must be supported: hi-IN, es-ES, fr-FR, etc.)
      translationConfig.speechRecognitionLanguage = sourceLanguage; 
      translationConfig.addTargetLanguage('en'); 

      // Use push stream with proper WAV audio format (16kHz, 16-bit, mono)
      const audioFormat = SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1);
      const pushStream = SpeechSDK.AudioInputStream.createPushStream(audioFormat);
      pushStream.write(buffer);
      pushStream.close();

      const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
      const recognizer = new SpeechSDK.TranslationRecognizer(translationConfig, audioConfig);

      console.log(`[Speech Translation] Starting translation from ${sourceLanguage} to English, buffer size: ${buffer.length} bytes`);

      recognizer.recognizeOnceAsync(
        (result) => {
          recognizer.close();

          switch (result.reason) {
            case SpeechSDK.ResultReason.TranslatedSpeech:
              const originalText = result.text;
              const translatedText = result.translations.get('en');
              console.log(`[Speech Translation] Original (${sourceLanguage}): "${originalText}"`);
              console.log(`[Speech Translation] Translated (English): "${translatedText}"`);
              resolve({ 
                originalText,
                translatedText,
                sourceLanguage,
                targetLanguage: 'en'
              });
              break;
            case SpeechSDK.ResultReason.NoMatch:
              console.warn('[Speech Translation] No speech could be recognized');
              reject(new Error('No speech could be recognized. Speak clearly in Hindi.'));
              break;
            case SpeechSDK.ResultReason.Canceled: {
              const cancellation = SpeechSDK.CancellationDetails.fromResult(result);
              console.error(`[Speech Translation] Canceled: ${cancellation.errorDetails}`);
              reject(new Error(`Recognition canceled: ${cancellation.errorDetails}`));
              break;
            }
            default:
              reject(new Error('Speech translation failed.'));
          }
        },
        (err) => {
          recognizer.close();
          console.error('[Speech Translation] Error:', err);
          reject(err);
        }
      );
    } catch (error) {
      console.error('[Speech Translation] Setup error:', error);
      reject(error);
    }
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

    const { buffer, originalname } = req.file;
    
    // Use Urdu (ur-PK) which is supported by Azure Speech Translation
    const result = await recognizeSpeechFromBuffer(buffer, 'ur-IN'); 

    res.json({
      fileName: originalname,
      sourceLanguage: result.sourceLanguage,
      original: result.originalText,
      english: result.translatedText,
      targetLanguage: result.targetLanguage
    });
  } catch (error) {
    console.error('Speech translation error:', error);
    res.status(500).json({ error: error.message || 'Speech translation failed.' });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`AI Service listening on port ${port}`);
});


