function chatApp() {
    return {
        sidebarOpen: false,
        showSettings: false,
        isLoading: false,
        userInput: '',
        messages: [],
        
        async sendMessage() {
            const input = this.userInput.trim();
            if (!input) return;

            this.userInput = '';
            this.messages.push({ role: 'user', content: input });
            this.isLoading = true;

            try {
                // Aapka Render Backend URL
                const backendUrl = "https://ai-backend-8h5f.onrender.com/api/chat";

                const resp = await fetch(backendUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: this.messages.map(m => ({
                            role: m.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: m.content }]
                        }))
                    })
                });

                const data = await resp.json();
                const aiText = data.candidates[0].content.parts[0].text;
                this.messages.push({ role: 'assistant', content: aiText });

            } catch (e) {
                this.messages.push({ role: 'assistant', content: "⚠️ Server jaag raha hai... 30 sec baad try karein." });
            } finally {
                this.isLoading = false;
            }
        }
    }
}
