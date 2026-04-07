function chatApp() {
    return {
        messages: [],
        userInput: '',
        isLoading: false,

        createNewChat() {
            if (confirm("Nayi chat shuru karein?")) {
                this.messages = [];
                this.userInput = '';
            }
        },

        async sendMessage() {
            const text = this.userInput.trim();
            if (!text || this.isLoading) return;

            // 1. User ka message turant add karo
            this.messages.push({ role: 'user', content: text });
            this.userInput = '';
            this.isLoading = true;
            
            // Scroll niche karo
            this.$nextTick(() => this.scrollToBottom());

            try {
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
                
                if (data && data.candidates && data.candidates[0].content.parts[0].text) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    // 2. AI ka reply yahan add ho raha hai
                    this.messages.push({ role: 'assistant', content: aiResponse });
                } else {
                    throw new Error("Invalid response format");
                }

            } catch (error) {
                console.error("Error:", error);
                this.messages.push({ 
                    role: 'assistant', 
                    content: "⚠️ **System Error:** Reply fetch nahi ho paya. Ek baar phir try karein." 
                });
            } finally {
                this.isLoading = false;
                this.$nextTick(() => this.scrollToBottom());
            }
        },

        // Ye function text ko HTML mein badalta hai
        renderMarkdown(text) {
            if (!text) return "";
            return text
                .replace(/[<>]/g, m => ({'<':'&lt;','>':'&gt;'}[m]))
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code blocks
                .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded">$1</code>') // Inline code
                .split('\n').join('<br>'); // Line breaks
        },

        scrollToBottom() {
            const win = document.getElementById('chat-window');
            if (win) {
                win.scrollTo({ top: win.scrollHeight, behavior: 'smooth' });
            }
        }
    }
}
