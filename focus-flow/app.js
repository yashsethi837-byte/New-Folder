const timerDisplay = {
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

const controls = {
    start: document.getElementById('startBtn'),
    pause: document.getElementById('pauseBtn'),
    reset: document.getElementById('resetBtn'),
    modes: document.querySelectorAll('.mode-btn'),
    ambience: document.querySelectorAll('.ambience-btn'),
    adjustUp: document.getElementById('adjustUp'),
    adjustDown: document.getElementById('adjustDown')
};

const audio = {
    rain: document.getElementById('audio-rain'),
    forest: document.getElementById('audio-forest')
};

const MODES = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

let state = {
    timeLeft: MODES.focus,
    timerId: null,
    isRunning: false,
    currentMode: 'focus',
    activeSound: null
};

// Initialize
document.body.setAttribute('data-mode', 'focus');
document.body.classList.add('paused'); // Initial state

function updateDisplay() {
    const mins = Math.floor(state.timeLeft / 60);
    const secs = state.timeLeft % 60;

    timerDisplay.minutes.textContent = mins.toString().padStart(2, '0');
    timerDisplay.seconds.textContent = secs.toString().padStart(2, '0');

    document.title = `${mins}:${secs.toString().padStart(2, '0')} - Focus Flow`;
}

function startTimer() {
    if (state.isRunning) return;

    state.isRunning = true;
    document.body.classList.remove('paused');
    document.body.classList.add('running');

    controls.start.classList.add('hidden');
    controls.pause.classList.remove('hidden');

    state.timerId = setInterval(() => {
        if (state.timeLeft > 0) {
            state.timeLeft--;
            updateDisplay();
        } else {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    state.isRunning = false;
    document.body.classList.add('paused');
    document.body.classList.remove('running');

    clearInterval(state.timerId);
    controls.start.classList.remove('hidden');
    controls.pause.classList.add('hidden');
}

function resetTimer() {
    pauseTimer();
    state.timeLeft = MODES[state.currentMode];
    updateDisplay();
}

function adjustTime(amount) {
    if (state.isRunning) return;

    // Adjust current mode's default time temporarily or just current timeLeft?
    // Let's adjust timeLeft directly for flexibility.
    let newTime = state.timeLeft + (amount * 60);

    // Clamp between 1 min and 60 mins
    if (newTime < 60) newTime = 60;
    if (newTime > 60 * 60) newTime = 60 * 60;

    state.timeLeft = newTime;

    // Optionally update the default for this mode if we want persistence, 
    // but for now let's just adjust the current session.
    // MODES[state.currentMode] = newTime; 

    updateDisplay();
}

function completeTimer() {
    pauseTimer();
    // Play a notification sound (optional, using system beep logic or visual cue for now)
    alert('Timer Complete!');
    resetTimer();
}

function switchMode(mode) {
    state.currentMode = mode;
    document.body.setAttribute('data-mode', mode);

    // Update UI
    controls.modes.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    resetTimer();
}

function toggleAmbience(soundName) {
    const soundBtn = document.querySelector(`.ambience-btn[data-sound="${soundName}"]`);
    const soundEl = audio[soundName];

    if (state.activeSound === soundName) {
        // Stop current
        soundEl.pause();
        soundEl.currentTime = 0;
        state.activeSound = null;
        soundBtn.classList.remove('active');
    } else {
        // Stop others
        Object.values(audio).forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
        controls.ambience.forEach(b => b.classList.remove('active'));

        // Play new
        soundEl.play().catch(e => {
            console.error("Playback failed:", e);
            alert("Could not play audio: " + e.message);
        });
        state.activeSound = soundName;
        soundBtn.classList.add('active');
    }
}

// Event Listeners
controls.start.addEventListener('click', startTimer);
controls.pause.addEventListener('click', pauseTimer);
controls.reset.addEventListener('click', resetTimer);

controls.adjustUp.addEventListener('click', () => adjustTime(1));
controls.adjustDown.addEventListener('click', () => adjustTime(-1));

controls.modes.forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});

controls.ambience.forEach(btn => {
    btn.addEventListener('click', () => toggleAmbience(btn.dataset.sound));
});

// Initial Render
updateDisplay();
