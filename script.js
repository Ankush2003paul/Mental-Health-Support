// You can add any additional JavaScript functionality here

// Example: Add a function to log a message when the page is loaded
window.onload = function () {
    console.log("Page loaded!");
};
// Function to start/stop the breathing exercise
let isBreathing = false;
const breathingBtn = document.getElementById("breathingBtn");
const breathingAnimation = document.getElementById("breathing-animation");

breathingBtn.addEventListener("click", function () {
    isBreathing = !isBreathing;
    if (isBreathing) {
        breathingAnimation.style.transform = "scale(1.2)";
        breathingBtn.textContent = "Stop Breathing Exercise";
    } else {
        breathingAnimation.style.transform = "scale(1)";
        breathingBtn.textContent = "Start Breathing Exercise";
    }
});


// Function to fetch a random quote from an API
const quotePlaceholder = document.getElementById("quotePlaceholder");
const newQuoteBtn = document.getElementById("newQuoteBtn");

newQuoteBtn.addEventListener("click", getNewQuote);

function getNewQuote() {
    fetch("https://api.quotable.io/random")
        .then(response => response.json())
        .then(data => {
            quotePlaceholder.textContent = `"${data.content}" - ${data.author}`;
        })
        .catch(error => {
            console.error("Error fetching quote:", error);
            quotePlaceholder.textContent = "Failed to fetch quote. Please try again.";
        });
}

// Functionality for relaxing sounds using Web Audio API and Fetch API
const soundSelector = document.getElementById("soundSelector");
const playSoundBtn = document.getElementById("playSoundBtn");
const stopSoundBtn = document.getElementById("stopSoundBtn");
let audioContext;
let audioSource;

playSoundBtn.addEventListener("click", playSelectedSound);
stopSoundBtn.addEventListener("click", stopSound);

async function playSelectedSound() {
    const selectedSound = soundSelector.value;

    const soundUrl = `https://www.bensound.com/bensound-music/${selectedSound}.mp3`;

    try {
        const response = await fetch(soundUrl);
        const audioData = await response.arrayBuffer();

        if (audioContext) {
            audioContext.close();
        }

        audioContext = new (window.AudioContext || window.AudioContext)();
        audioSource = audioContext.createBufferSource();

        audioContext.decodeAudioData(audioData, (buffer) => {
            audioSource.buffer = buffer;
            audioSource.connect(audioContext.destination);
            audioSource.start(0);
        });

        // Wait for the audio to finish playing before closing the context
        audioSource.onended = () => {
            audioContext.close();
            audioSource = null;
            audioContext = null;
        };
    } catch (error) {
        console.error("Error loading audio:", error);
    }
}

function stopSound() {
    if (audioContext && audioSource) {
        audioSource.stop();
        // Do not close the context immediately, wait for the 'onended' event
    }
}
