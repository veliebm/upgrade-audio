document.addEventListener("DOMContentLoaded", () => {
  const audioInput = document.getElementById("audio-input") as HTMLInputElement;
  const bandPassFilter = document.getElementById(
    "band-pass-filter"
  ) as HTMLInputElement;
  const compression = document.getElementById(
    "compression"
  ) as HTMLInputElement;
  const downsample = document.getElementById("downsample") as HTMLInputElement;
  const distortion = document.getElementById("distortion") as HTMLInputElement;
  const echo = document.getElementById("echo") as HTMLInputElement;
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

    let lastNode: AudioNode = source;

    if (bandPassFilter.checked) {
      // Apply band-pass filter
      const filter = audioContext.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000;
      filter.Q.value = 0.7;
      lastNode.connect(filter);
      lastNode = filter;
    }
    if (compression.checked) {
      // Apply compression
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      lastNode.connect(compressor);
      lastNode = compressor;
    }
    if (downsample.checked) {
      // Apply downsampling
    }
    if (distortion.checked) {
      // Apply distortion
    }
    if (echo.checked) {
      // Apply echo
      const delay = audioContext.createDelay(2);
      const feedback = audioContext.createGain();
      delay.delayTime.value = 0.25;
      feedback.gain.value = 0.5;
      lastNode.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      lastNode = delay;
    }

    lastNode.connect(audioContext.destination);
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
