"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    const audioInput = document.getElementById("audio-input");
    const bandPassFilter = document.getElementById("band-pass-filter");
    const compression = document.getElementById("compression");
    const downsample = document.getElementById("downsample");
    const distortion = document.getElementById("distortion");
    const echo = document.getElementById("echo");
    const processButton = document.getElementById("process");
    const status = document.getElementById("status");
    const downloadButton = document.getElementById("download");
    let audioBuffer;
    audioInput.addEventListener("change", (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const audioContext = new AudioContext();
        const arrayBuffer = yield file.arrayBuffer();
        audioBuffer = yield audioContext.decodeAudioData(arrayBuffer);
    }));
    processButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!audioBuffer) {
            status.textContent = "Please select an audio file first.";
            return;
        }
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        let lastNode = source;
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
        yield new Promise((resolve) => setTimeout(resolve, audioBuffer.duration * 1000));
        status.textContent = "Processing complete.";
        downloadButton.hidden = false;
    }));
    downloadButton.addEventListener("click", () => {
        // Download distorted audio
    });
});
