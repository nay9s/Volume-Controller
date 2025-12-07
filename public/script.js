const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const muteBtn = document.getElementById('mute-btn');
const iconVolUp = document.getElementById('icon-vol-up');
const iconVolMute = document.getElementById('icon-vol-mute');
const statusMessage = document.getElementById('status-message');

let isMuted = false;
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function updateUI(vol, muted) {
    volumeSlider.value = vol;
    volumeValue.textContent = vol;
    isMuted = muted;

    if (muted) {
        iconVolUp.classList.add('hidden');
        iconVolMute.classList.remove('hidden');
        muteBtn.style.borderColor = '#cf6679';
        muteBtn.style.color = '#cf6679';
    } else {
        iconVolUp.classList.remove('hidden');
        iconVolMute.classList.add('hidden');
        muteBtn.style.borderColor = '#bb86fc';
        muteBtn.style.color = '#bb86fc';
    }
}

async function fetchState() {
    try {
        const response = await fetch('/api/volume');
        const data = await response.json();
        updateUI(data.volume, data.muted);
        statusMessage.textContent = 'Connected';
    } catch (error) {
        console.error('Error fetching state:', error);
        statusMessage.textContent = 'Disconnected';
    }
}

const setVolume = debounce(async (vol) => {
    try {
        await fetch('/api/volume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ volume: parseInt(vol) })
        });
    } catch (error) {
        console.error('Error setting volume:', error);
    }
}, 50);

async function toggleMute() {
    try {
        const response = await fetch('/api/toggle-mute', {
            method: 'POST'
        });
        const data = await response.json();
        isMuted = data.muted;
        updateUI(volumeSlider.value, isMuted);
    } catch (error) {
        console.error('Error toggling mute:', error);
    }
}

volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value;
    volumeValue.textContent = vol;
    setVolume(vol);
});

muteBtn.addEventListener('click', toggleMute);

fetchState();