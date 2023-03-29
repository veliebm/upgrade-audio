function generateDistortionCurve(amount: number): Float32Array {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  const x = 2 * amount * deg;

  for (let i = 0; i < samples; ++i) {
    const t = (i * 2) / samples - 1;
    curve[i] = ((3 + x) * t * 20 * deg) / (Math.PI + x * Math.abs(t));
  }

  return curve;
}

async function applyDownsampling(
  audioBuffer: AudioBuffer
): Promise<AudioBuffer> {
  const offlineCtx = new OfflineAudioContext(
    1,
    audioBuffer.duration * 8000,
    8000
  );
  const offlineSource = offlineCtx.createBufferSource();
  offlineSource.buffer = audioBuffer;
  offlineSource.connect(offlineCtx.destination);
  offlineSource.start();
  const renderedBuffer = await offlineCtx.startRendering();
  return renderedBuffer;
}

function applyBandPassFilter(
  audioContext: AudioContext,
  lastNode: AudioNode
): AudioNode {
  const filter = audioContext.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1000;
  filter.Q.value = 0.7;
  lastNode.connect(filter);
  return filter;
}

function applyCompression(
  audioContext: AudioContext,
  lastNode: AudioNode
): AudioNode {
  const compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 30;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;
  lastNode.connect(compressor);
  return compressor;
}

function applyDistortion(
  audioContext: AudioContext,
  lastNode: AudioNode
): AudioNode {
  const waveshaper = audioContext.createWaveShaper();
  waveshaper.curve = generateDistortionCurve(400);
  lastNode.connect(waveshaper);
  return waveshaper;
}

function applyEcho(audioContext: AudioContext, lastNode: AudioNode): AudioNode {
  const delay = audioContext.createDelay(2);
  const feedback = audioContext.createGain();
  delay.delayTime.value = 0.1;
  feedback.gain.value = 0.3;
  lastNode.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  return delay;
}

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

  audioInput.addEventListener("change", async (e) => {
    // Audio file input handling
  });

  processButton.addEventListener("click", async () => {
    if (!audioBuffer) {
      status.textContent = "Please select an audio file first.";
      return;
    }

    const audioContext = new AudioContext();

    if (downsample.checked) {
      audioBuffer = await applyDownsampling(audioBuffer);
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    let lastNode: AudioNode = source;

    if (bandPassFilter.checked) {
      lastNode = applyBandPassFilter(audioContext, lastNode);
    }
    if (compression.checked) {
      lastNode = applyCompression(audioContext, lastNode);
    }
    if (distortion.checked) {
      lastNode = applyDistortion(audioContext, lastNode);
    }
    if (echo.checked) {
      lastNode = applyEcho(audioContext, lastNode);
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
