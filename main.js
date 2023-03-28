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
    const distortion1 = document.getElementById("distortion1");
    const distortion2 = document.getElementById("distortion2");
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
        if (distortion1.checked) {
            // Apply distortion 1
        }
        if (distortion2.checked) {
            // Apply distortion 2
        }
        source.connect(audioContext.destination);
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
