function chatApp() {
    return {
        messages: [],
        userInput: '',
        isLoading: false,

        createNewChat() {
            if (confirm("Nayi chat shuru karein? Purani chat clear ho jayegi.")) {
                this.messages = [];
                this.userInput = '';
            }
        },

        async sendMessage() {
            const text = this.userInput.trim();
            if (!text || this.isLoading) return;

            // User ka message screen par dikhao
            this.messages.push({ role: 'user', content: text });
            this.userInput = '';
            this.isLoading = true;
            this.scrollToBottom();

            try {
                // AAPKA LIVE RENDER BACKEND
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
                
                if (data.error) throw new Error(data.error);

                // AI ka jawab screen par dikhao
                const aiResponse = data.candidates[0].content.parts[0].text;
                this.messages.push({ role: 'assistant', content: aiResponse });

            } catch (error) {
                console.error("Error:", error);
                this.messages.push({ 
                    role: 'assistant', 
                    content: "⚠️ **System Error:** Backend connection mein dikkat hai. Shayad server jaag raha hai, kripya 30 seconds baad phir koshish karein." 
                });
            } finally {
                this.isLoading = false;
                this.scrollToBottom();
            }
        },

        // Markdown ko HTML mein badalne ke liye simple function
        renderMarkdown(text) {
            return text
                .replace(/[<>]/g, m => ({'<':'&lt;','>':'&gt;'}[m]))
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/`(.*?)`/g, '<code class="bg-[#424242] px-1 rounded">$1</code>');
        },

        scrollToBottom() {
            setTimeout(() => {
                const win = document.getElementById('chat-window');
                win.scrollTo({ top: win.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    }
}
