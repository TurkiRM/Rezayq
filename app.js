const { SpeechClient } = require('@google-cloud/speech');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const fs = require('fs');
const util = require('util');

// Set up Google Cloud Clients
const speechClient = new SpeechClient({ keyFilename: 'C:/Users/USER/my-voice-assistant/rezayq-aac9612fef40.json' });
const ttsClient = new TextToSpeechClient({ keyFilename: 'C:/Users/USER/my-voice-assistant/rezayq-aac9612fef40.json' });

// Set up Watson Assistant
const assistant = new AssistantV2({
  version: '2023-10-21',
  authenticator: new IamAuthenticator({ apikey: 'MrnAWVckTQdp6GkgtAhPhEIb54c_K3pSJRvfkHGqMvWO' }),
  serviceUrl: 'https://api.jp-tok.assistant.watson.cloud.ibm.com/instances/cfa306c4-955c-40ee-afa9-093c8666a014',
});

// Function to transcribe speech to text
async function transcribeAudio(audioContent) {
  const request = {
    audio: { content: audioContent },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'ar-SA',
    },
  };
  const [response] = await speechClient.recognize(request);
  const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
  return transcription;
}

// Function to get response from Watson Assistant
async function getWatsonResponse(transcription) {
  const sessionId = await assistant.createSession({ assistantId: 'd1207c5d-0d98-4620-af4c-a9e95efebf0d' });
  const response = await assistant.message({
    assistantId: 'd1207c5d-0d98-4620-af4c-a9e95efebf0d',
    sessionId: sessionId.result.session_id,
    input: { 'message_type': 'text', 'text': transcription },
  });
  return response.result.output.generic[0].text;
}

// Function to convert text to speech
async function synthesizeSpeech(text) {
  const request = {
    input: { text },
    voice: { languageCode: 'ar-SA', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await ttsClient.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  return 'output.mp3';
}

// Example usage flow
async function main() {
  const sampleAudio = 'C:/Users/USER/my-voice-assistant/Recording (48).wav'; // Load or record audio input
  const transcription = await transcribeAudio(fs.readFileSync(sampleAudio, 'base64'));
  const watsonResponse = await getWatsonResponse(transcription);
  const speechFile = await synthesizeSpeech(watsonResponse);
  console.log('Audio response saved as:', speechFile);
}

main();
