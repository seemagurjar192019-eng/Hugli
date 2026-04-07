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
            const input = this.userInput.trim();
            if (!input || this.isLoading) return;

            // 1. User ka message add karo
            this.messages.push({ role: 'user', content: input });
            this.userInput = '';
            this.isLoading = true;
            this.scrollToBottom();

            try {
                // Aapka live backend link
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
                    const aiReply = data.candidates[0].content.parts[0].text;
                    // 2. AI ka reply yahan push ho raha hai
                    this.messages.push({ role: 'assistant', content: aiReply });
                } else {
                    throw new Error("Invalid format");
                }

            } catch (error) {
                console.error("Fetch error:", error);
                this.messages.push({ 
                    role: 'assistant', 
                    content: "⚠️ **Server Busy:** Render ka free server 'Sleep' mode mein tha. Kripya 30 seconds baad phir se message bhejien, ab ye jaag chuka hai." 
                });
            } finally {
                this.isLoading = false;
                this.scrollToBottom();
            }
        },

        // Is function se text screen par dikhta hai
        renderMarkdown(text) {
            if (!text) return "";
            return text
                .replace(/[<>]/g, m => ({'<':'&lt;','>':'&gt;'}[m])) // Security
                .replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-bold">$1</b>') // Bold
                .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code blocks
                .replace(/`(.*?)`/g, '<code class="bg-[#424242] px-1 rounded text-blue-300">$1</code>') // Inline code
                .replace(/\n/g, '<br>'); // Line breaks ko HTML mein badalna
        },

        scrollToBottom() {
            setTimeout(() => {
                const win = document.getElementById('chat-window');
                if (win) win.scrollTop = win.scrollHeight;
            }, 50);
        }
    }
}
