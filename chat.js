// 1. Message ko screen par dikhane ka function
function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    
    // Sender ke hisab se class lagao (user-msg ya ai-msg)
    msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'ai-msg');
    
    // Message ka content set karo
    msgDiv.innerHTML = `<b>${sender === 'user' ? 'You' : 'Hugli AI'}:</b> ${message}`;
    
    chatBox.appendChild(msgDiv);
    
    // Hamesha scroll neeche rakho
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 2. Message send karne ka main function
async function sendMessage() {
    const userInputField = document.getElementById('user-input');
    const userInput = userInputField.value.trim();

    // Agar khali message hai toh kuch mat karo
    if (!userInput) return;

    // Screen par user ka message dikhao
    displayMessage(userInput, 'user');
    userInputField.value = ''; // Input box khali karo

    try {
        // Render Backend ko signal bhejo
        // DHAYAN RAKHO: URL ke aakhir mein /chat hona chahiye
        const response = await fetch('https://ai-backend-8h5f.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        if (!response.ok) {
            throw new Error('Backend responding with error');
        }

        const data = await response.json();

        // Agar AI ka reply aaya toh screen par dikhao
        if (data.reply) {
            displayMessage(data.reply, 'bot');
        } else {
            displayMessage("AI ne jawab nahi diya. Dubara try karein.", 'bot');
        }

    } catch (error) {
        console.error("Error connecting to backend:", error);
        displayMessage("Backend se connect nahi ho pa raha. 1 minute ruko aur fir try karo.", 'bot');
    }
}

// 3. Button Click aur Enter Key support
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const inputField = document.getElementById('user-input');

    // Button click handle karo
    if (sendBtn) {
        sendBtn.onclick = sendMessage;
    }

    // Enter key handle karo
    if (inputField) {
        inputField.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
