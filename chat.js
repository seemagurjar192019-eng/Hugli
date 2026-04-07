async function sendMessage() {
    const userInputField = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userInput = userInputField.value.trim();

    if (!userInput) return;

    // 1. User ka message screen par dikhao
    const userDiv = document.createElement('div');
    userDiv.style.textAlign = "right";
    userDiv.style.margin = "10px";
    userDiv.innerHTML = `<span style="background: #0078ff; color: white; padding: 8px 12px; border-radius: 15px; display: inline-block;">${userInput}</span>`;
    chatBox.appendChild(userDiv);
    
    userInputField.value = ''; // Input box khali karo
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Loading Indicator (AI soch raha hai...)
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = `<i>Hugli AI soch raha hai...</i>`;
    chatBox.appendChild(loadingDiv);

    try {
        // 3. API Call to Render
        const response = await fetch('https://ai-backend-8h5f.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput }),
        });

        const data = await response.json();
        chatBox.removeChild(loadingDiv); // Loading hatao

        // 4. AI ka reply screen par dikhao
        const aiDiv = document.createElement('div');
        aiDiv.style.textAlign = "left";
        aiDiv.style.margin = "10px";
        aiDiv.innerHTML = `<span style="background: #e9e9eb; color: black; padding: 8px 12px; border-radius: 15px; display: inline-block;"><b>Hugli AI:</b> ${data.reply}</span>`;
        chatBox.appendChild(aiDiv);

    } catch (error) {
        chatBox.removeChild(loadingDiv);
        console.error("Error:", error);
        alert("Server se connection nahi ho paya. Ek baar Render dashboard check karein.");
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}
