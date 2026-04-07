function chatApp() {
    return {
        messages: [],
        userInput: '',
        isLoading: false,

        async sendMessage() {
            const input = this.userInput.trim();
            if (!input || this.isLoading) return;

            // User message ko add karo
            this.messages.push({ role: 'user', content: input });
            this.userInput = '';
            this.isLoading = true;
            this.scrollToBottom();

            try {
                // Link check: Isko confirm kar lena ki render link yahi hai
                const backendUrl = "https://ai-backend-8h5f.onrender.com/api/chat";

                const response = await fetch(backendUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: this.messages.map(m => ({
                            role: m.role === 'assistant' ? 'model' : 'user',
                            parts: [{ text: m.content }]
                        }))
                    })
                });

                const data = await response.json();
                
                // Reply check
                if (data && data.candidates) {
                    const text = data.candidates[0].content.parts[0].text;
                    this.messages.push({ role: 'assistant', content: text });
                } else {
                    this.messages.push({ role: 'assistant', content: "Backend se error aaya hai." });
                }

            } catch (error) {
                this.messages.push({ role: 'assistant', content: "⚠️ Server response nahi de raha. 10 second baad try karein." });
            } finally {
                this.isLoading = false;
                this.scrollToBottom();
            }
        },

        // Markdown Fix: Sabse safe function
        renderMarkdown(text) {
            if (!text) return "";
            let html = text
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
                .replace(/\n/g, '<br>') // Line break
                .replace(/```([\s\S]*?)```/g, '<pre class="bg-black p-2 rounded"><code>$1</code></pre>'); // Code
            return html;
        },

        scrollToBottom() {
            setTimeout(() => {
                const win = document.getElementById('chat-window');
                if (win) win.scrollTop = win.scrollHeight;
            }, 50);
        }
    }
}
