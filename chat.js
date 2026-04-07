const BACKEND_URL = "https://ai-backend-8h5f.onrender.com/api/chat";

async function sendMessage() {
    const input = document.getElementById('user-input');
    const box = document.getElementById('chat-box');
    const msg = input.value.trim();

    if (!msg) return;

    // Display User Message
    const uDiv = document.createElement('div');
    uDiv.className = 'user-msg';
    uDiv.innerHTML = `<b>You:</b> ${msg}`;
    box.appendChild(uDiv);
    input.value = "";
    box.scrollTop = box.scrollHeight;

    try {
        const res = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });

        const data = await res.json();
        
        // Display AI Message
        const aDiv = document.createElement('div');
        aDiv.className = 'ai-msg';
        aDiv.innerHTML = `<b>Hugli AI:</b> ${data.reply || "Error: No Response"}`;
        box.appendChild(aDiv);

    } catch (e) {
        const eDiv = document.createElement('div');
        eDiv.className = 'ai-msg';
        eDiv.style.color = 'red';
        eDiv.innerHTML = `<b>Error:</b> Server offline lag raha hai!`;
        box.appendChild(eDiv);
    }
    box.scrollTop = box.scrollHeight;
}

// Event Listeners
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Sidebar Controls
function openNav() { document.getElementById("sidebar").style.width = "250px"; }
function closeNav() { document.getElementById("sidebar").style.width = "0"; }
function exitChat() { if(confirm("Close Hugli AI?")) window.location.reload(); }
