// Message dikhane ka function
function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add(sender === 'user' ? 'user-msg' : 'ai-msg');
    msgDiv.innerHTML = `<b>${sender === 'user' ? 'You' : 'Hugli AI'}:</b> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Message send karne ka function
async function sendMessage() {
    const userInputField = document.getElementById('user-input');
    const userInput = userInputField.value.trim();

    if (!userInput) return;

    displayMessage(userInput, 'user');
    userInputField.value = '';

    try {
        // AGAR NOT FOUND AA RAHA HAI: Toh yahan '/api/chat' ya sirf '/chat' check karo
        const response = await fetch('https://ai-backend-8h5f.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        if (response.status === 404) {
            displayMessage("Error: Backend route nahi mila (404). URL check karein.", 'bot');
            return;
        }

        const data = await response.json();
        if (data.reply) {
            displayMessage(data.reply, 'bot');
        }
    } catch (error) {
        console.error("Connection Error:", error);
        displayMessage("Server se connect nahi ho pa raha. Thodi der baad try karein.", 'bot');
    }
}
