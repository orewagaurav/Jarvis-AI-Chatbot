const API_KEY = 'AIzaSyAg1ZYMF4AQ5XQZihywZzZ2NFUb51et7Xc';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    const prefix = isUser ? 'Tony Stark: ' : 'JARVIS: ';
    messageDiv.textContent = prefix + message;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message', 'loading');
    loadingDiv.id = 'loading-message';
    loadingDiv.textContent = 'JARVIS is processing';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoading() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

async function sendToGemini(message) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message + " (Please respond as if you are JARVIS from Iron Man, addressing the user as 'sir' or 'Mr. Stark')"
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response from API');
        }
    } catch (error) {
        console.error('Error:', error);
        return 'My apologies, sir. I seem to be experiencing technical difficulties. Shall we try again?';
    }
}

async function handleSend() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, true);
    userInput.value = '';

    showLoading();

    const response = await sendToGemini(message);
    
    removeLoading();
    addMessage(response, false);

    playNotificationSound();
}

sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
});

addMessage('Good evening, sir. JARVIS at your service. How may I assist you today?', false);