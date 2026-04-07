const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 1. Apne Render Backend ka sahi URL yahan dalo
const BACKEND_URL = "https://ai-backend-8h5f.onrender.com/api/chat";

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // User ka message screen par dikhao
    appendMessage("You", message);
    userInput.value = "";

    try {
        // 2. Backend ko message bhejo (Bina kisi API Key ke)
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.reply) {
            // AI ka jawab screen par dikhao
            appendMessage("Hugli AI", data.reply);
        } else {
            appendMessage("Error", "Backend se sahi jawab nahi aaya.");
        }

    } catch (error) {
        console.error("Error:", error);
        appendMessage("Error", "Connection nahi ho pa raha. Check karo Render Live hai ya nahi.");
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    msgDiv.style.margin = "10px 0";
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Enter key dabane par message jaye
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

sendBtn.addEventListener('click', sendMessage);
