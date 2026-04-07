// 1. Backend URL (Check karlo sahi hai na?)
const BACKEND_URL = "https://ai-backend-8h5f.onrender.com/api/chat";

// Function jo message bhejega
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    
    const message = userInput.value.trim();
    if (!message) return;

    console.log("Sending message:", message); // Debugging line

    // User ka message screen par dikhao
    const userDiv = document.createElement('div');
    userDiv.innerHTML = `<strong>You:</strong> ${message}`;
    chatBox.appendChild(userDiv);
    
    userInput.value = "";

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        console.log("Response from server:", data); // Debugging line

        if (data.reply) {
            const aiDiv = document.createElement('div');
            aiDiv.innerHTML = `<strong>Hugli AI:</strong> ${data.reply}`;
            aiDiv.style.color = "#00ffcc"; // Thoda alag color taaki dikhe
            chatBox.appendChild(aiDiv);
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        const errDiv = document.createElement('div');
        errDiv.innerHTML = `<b style="color:red;">Error: Backend connect nahi hua!</b>`;
        chatBox.appendChild(errDiv);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 2. Button par click event lagane ka sabse pakka tarika
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    if(sendBtn) {
        sendBtn.onclick = sendMessage;
        console.log("Send button ready!");
    } else {
        console.error("Button with ID 'send-btn' not found!");
    }

    // Enter key support
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
