async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    // Frontend par user ka message dikhao
    displayMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    try {
        // TERA NAYA RENDER URL YAHAN HAI
        const response = await fetch('https://ai-backend-8h5f.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        const data = await response.json();
        
        if (data.reply) {
            displayMessage(data.reply, 'bot');
        } else {
            displayMessage("Error: AI ne jawab nahi diya.", 'bot');
        }
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Backend se connect nahi ho pa raha. 1 minute ruko aur fir try karo.", 'bot');
    }
}
