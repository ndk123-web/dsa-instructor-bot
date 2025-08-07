document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const themeToggle = document.getElementById('theme-toggle');
    const clearChatBtn = document.getElementById('clear-chat');
    const exportChatBtn = document.getElementById('export-chat');

    // Theme management
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Add welcome message
    addBotMessage('👋 **Hello! I\'m your DSA Instructor Bot.** \n\nAsk me anything about Data Structures and Algorithms! \n\n*I can help you with:*\n- Algorithm explanations\n- Code implementations\n- Time & Space complexity analysis\n- Problem-solving techniques');

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    themeToggle.addEventListener('click', toggleTheme);
    clearChatBtn.addEventListener('click', clearChat);
    exportChatBtn.addEventListener('click', exportChat);

    // Quick topic buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const topic = e.target.dataset.topic;
            const messages = {
                'arrays': 'Explain arrays data structure with examples',
                'linkedlist': 'Explain linked lists and their types',
                'trees': 'Explain tree data structures and traversals',
                'graphs': 'Explain graph data structures and algorithms',
                'sorting': 'Explain different sorting algorithms',
                'searching': 'Explain searching algorithms like binary search'
            };
            userInput.value = messages[topic] || '';
            sendMessage();
        });
    });

    // Enhanced keyboard shortcuts
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Allow new line with Shift+Enter
                return;
            } else {
                e.preventDefault();
                sendMessage();
            }
        }
    });

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    function clearChat() {
        chatMessages.innerHTML = '';
        addBotMessage('👋 **Chat cleared!** How can I help you with Data Structures and Algorithms?');
    }

    function exportChat() {
        const messages = Array.from(chatMessages.children).map(msg => {
            const isUser = msg.classList.contains('user-message');
            const content = msg.querySelector('.message-content').textContent;
            return `${isUser ? 'You' : 'DSA Bot'}: ${content}`;
        }).join('\n\n');
        
        const blob = new Blob([messages], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dsa-chat-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addUserMessage(message);
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        try {
            const chat_limit = Number(localStorage.getItem('limit'));

            if (!chat_limit) {
                localStorage.setItem('limit', 1);
            }

            if (chat_limit && chat_limit >= 10) {
                // Show a message indicating the chat limit has been reached
                addBotMessage(`⚠️ You have reached the chat limit of ${chat_limit} messages. All user default has 10 limit`);
                typingIndicator.remove();
                return;
            }

            const response = await fetch('https://dsa-instructor-bot-backend.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();


            localStorage.setItem('limit', chat_limit + 1);

            // Remove typing indicator
            typingIndicator.remove();
            
            // Add bot's response
            if (data.response) {
                addBotMessage(data.response);
            } else {
                addBotMessage('❌ I encountered an error. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            addBotMessage('🔌 Sorry, I\'m having trouble connecting to the server. Please try again later.');
        }
    }

    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <i class="fas fa-user"></i> You
                </div>
                <div class="message-content">${escapeHtml(message)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <i class="fas fa-robot"></i> DSA Instructor
                </div>
                <div class="message-content">${formatMessage(message)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator-message';
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-header">
                    <i class="fas fa-robot"></i> DSA Instructor
                </div>
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Enhanced message formatting with markdown-like support
    function formatMessage(text) {
        if (!text) return '';
        
        // First handle code blocks
        const parts = [];
        let lastIndex = 0;
        let match;
        const codeBlockRegex = /```(\w*)\n?([\s\S]*?)\n?```/g;
        
        // Process all code blocks
        while ((match = codeBlockRegex.exec(text)) !== null) {
            // Add text before the code block (with formatting)
            if (match.index > lastIndex) {
                let textBefore = text.substring(lastIndex, match.index);
                textBefore = formatTextContent(textBefore);
                parts.push(textBefore);
            }
            
            const language = match[1] || 'text';
            const code = match[2].trim();
            
            // Map common language aliases
            const languageMap = {
                'py': 'python',
                'js': 'javascript',
                'ts': 'typescript',
                'cpp': 'cpp',
                'c++': 'cpp',
                'cs': 'csharp',
                'rb': 'ruby',
                'sh': 'bash',
                'shell': 'bash'
            };
            
            const normalizedLang = languageMap[language.toLowerCase()] || language.toLowerCase();
            
            // Add the code block with proper structure for Prism
            parts.push(`
                <div class="code-block">
                    <div class="code-header">
                        <span class="language">${normalizedLang || 'text'}</span>
                        <button class="copy-button" title="Copy to clipboard">
                            <i class="far fa-copy"></i>
                        </button>
                    </div>
                    <pre class="line-numbers"><code class="language-${normalizedLang}">${escapeHtml(code)}</code></pre>
                </div>
            `);
            
            lastIndex = match.index + match[0].length;
        }
        
        // Add any remaining text after the last code block
        if (lastIndex < text.length) {
            let remainingText = text.substring(lastIndex);
            remainingText = formatTextContent(remainingText);
            parts.push(remainingText);
        }
        
        // Join all parts
        return parts.join('');
    }

    // Format text content with markdown-like syntax
    function formatTextContent(text) {
        // Handle inline code first (to avoid conflicts)
        text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Bold text **text**
        text = text.replace(/\*\*([^*]+)\*\*/g, '<span class="bold">$1</span>');
        
        // Italic text *text*
        text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<span class="italic">$1</span>');
        
        // Underlined text __text__
        text = text.replace(/__([^_]+)__/g, '<span class="underline">$1</span>');
        
        // Strikethrough text ~~text~~
        text = text.replace(/~~([^~]+)~~/g, '<span class="strikethrough">$1</span>');
        
        // Highlight text ==text==
        text = text.replace(/==([^=]+)==/g, '<span class="highlight">$1</span>');
        
        // Handle lists
        text = text.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul class="formatted-list">$1</ul>');
        
        // Handle numbered lists
        text = text.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ol class="formatted-list">$1</ol>');
        
        // Handle blockquotes
        text = text.replace(/^>\s*(.+)$/gm, '<div class="blockquote">$1</div>');
        
        // Convert newlines to <br> (but not inside HTML tags)
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    // Initialize clipboard functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.copy-button')) {
            const button = e.target.closest('.copy-button');
            const codeBlock = button.closest('.code-block');
            const codeElement = codeBlock ? codeBlock.querySelector('code') : null;
            const code = codeElement ? codeElement.textContent : '';
            
            // Copy to clipboard
            navigator.clipboard.writeText(code).then(() => {
                // Show copied feedback
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = '#4caf50';
                
                // Revert after 2 seconds
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                button.innerHTML = '<i class="fas fa-times"></i>';
                button.style.color = '#f44336';
                
                // Revert after 2 seconds
                setTimeout(() => {
                    button.innerHTML = '<i class="far fa-copy"></i>';
                    button.style.color = '';
                }, 2000);
            });
        }
    });

    // Function to highlight code blocks
    function highlightCodeBlocks() {
        document.querySelectorAll('pre code').forEach((block) => {
            // Add syntax highlighting if Prism is available
            if (window.Prism) {
                Prism.highlightElement(block);
            }
        });
    }

    // Create a MutationObserver to watch for new messages
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    highlightCodeBlocks();
                }, 10);
            }
        });
    });

    // Start observing the chat messages container
    if (chatMessages) {
        observer.observe(chatMessages, {
            childList: true,
            subtree: true
        });
    }

    // Initial highlighting for any existing code blocks
    highlightCodeBlocks();
});
