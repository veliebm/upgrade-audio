document.addEventListener("DOMContentLoaded", () => {
  const audioInput = document.getElementById("audio-input") as HTMLInputElement;
  const distortion1 = document.getElementById(
    "distortion1"
  ) as HTMLInputElement;
  const distortion2 = document.getElementById(
    "distortion2"
  ) as HTMLInputElement;
  const processButton = document.getElementById("process") as HTMLButtonElement;
  const status = document.getElementById("status") as HTMLDivElement;
  const downloadButton = document.getElementById(
    "download"
  ) as HTMLButtonElement;

  let audioBuffer: AudioBuffer;

  audioInput.addEventListener("change", async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const audioContext = new AudioContext();
    const arrayBuffer = await file.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  });

  processButton.addEventListener("click", async () => {
    if (!audioBuffer) {
      status.textContent = "Please select an audio file first.";
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    if (distortion1.checked) {
      // Apply distortion 1
    }
    if (distortion2.checked) {
      // Apply distortion 2
    }

    source.connect(audioContext.destination);
    source.start();

    // Wait for processing to complete
    await new Promise((resolve) =>
      setTimeout(resolve, audioBuffer.duration * 1000)
    );

    status.textContent = "Processing complete.";
    downloadButton.hidden = false;
  });

  downloadButton.addEventListener("click", () => {
    // Download distorted audio
  });
});
