// Простий шар над Capacitor-плагінами для локального (системного) STT/TTS
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export async function ensureVoicePerms() {
  const has = await SpeechRecognition.hasPermission();
  if (!has) await SpeechRecognition.requestPermission();
}

export async function startSystemSTT(onPartial: (t: string)=>void, onFinal: (t: string)=>void) {
  await ensureVoicePerms();

  // слухаємо події
  SpeechRecognition.addListener('partialResults', (e: any) => {
    const t = e?.matches?.[0] ?? '';
    if (t) onPartial(t);
  });
  SpeechRecognition.addListener('result', (e: any) => {
    const t = e?.matches?.[0] ?? '';
    if (t) onFinal(t);
  });

  // запускаємо розпізнавання
  await SpeechRecognition.start({
    language: 'uk-UA',
    maxResults: 1,
    partialResults: true,
    popup: false
  });
}

export async function stopSystemSTT() {
  try { await SpeechRecognition.stop(); } catch {}
}

export async function systemSpeak(text: string) {
  if (!text?.trim()) return;
  await TextToSpeech.speak({
    text,
    lang: 'uk-UA',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    category: 'ambient'
  });
}