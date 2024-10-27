const { SpeechClient } = require('@google-cloud/speech');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

// Google Cloud credentials setup
const googleCredentials = {
  type: 'service_account',
  project_id: process.env.GCP_PROJECT_ID,
  private_key_id: process.env.GCP_PRIVATE_KEY_ID,
  private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GCP_CLIENT_EMAIL,
  client_id: process.env.GCP_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GCP_CLIENT_EMAIL.replace('@', '%40')}`
};

// Google Cloud clients
const speechClient = new SpeechClient({ credentials: googleCredentials });
const ttsClient = new TextToSpeechClient({ credentials: googleCredentials });

// IBM Watson Assistant setup
const assistant = new AssistantV2({
  version: '2023-10-21',
  authenticator: new IamAuthenticator({ apikey: process.env.WATSON_ASSISTANT_APIKEY }),
  serviceUrl: process.env.WATSON_ASSISTANT_URL,

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
