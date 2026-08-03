export function playAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;

  audio.currentTime = 0;
  void audio.play().catch(() => undefined);
}
