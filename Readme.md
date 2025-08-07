# DSA Instructor Bot

A specialized AI teaching assistant for Data Structures and Algorithms, built with Google's Gemini AI and a modern web interface.

## 🚀 Features

- **Interactive Chat Interface**: Clean, responsive UI for seamless interaction
- **Code Block Support**: Beautiful VS Code-like code blocks with syntax highlighting
  - Line numbers
  - Language detection
  - Copy-to-clipboard functionality
  - Responsive design
- **Persistent System Instructions**: Maintains teaching context throughout conversations
- **Markdown Support**: For rich text formatting in responses

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **AI**: Google Gemini API
- **Styling**: Custom CSS with VS Code-inspired theming
- **Icons**: Font Awesome
- **Fonts**: Fira Code (for code) and Inter (for UI)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd DSA_Intructor_bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the server:
   ```bash
   node index.js
   ```

5. Open `client/index.html` in your browser or use a local server (e.g., Live Server in VS Code)

## 🎨 Customization

### System Instruction
Modify the system instruction in `index.js` to change the bot's behavior:

```javascript
const systemInstruction = `You are a strict yet highly effective Data Structures Instructor. 
You explain concepts from the ground up, starting with basic intuition and then gradually 
moving into technical depth...`;
```

### Styling
Customize the appearance by editing `client/styles.css`. The color scheme is based on VS Code's dark theme.

## 🤖 Usage

1. Type your DSA-related questions in the chat input
2. Use triple backticks for code blocks:
   ````
   ```javascript
   function example() {
       console.log("Hello, World!");
   }
   ```
   ````
3. Click the copy button to copy code snippets
4. Type "exit" to end the session

## 📝 Code Block Features

- **Syntax Highlighting**: Automatic language detection
- **Line Numbers**: For easy reference
- **Copy Button**: One-click code copying
- **Responsive**: Works on all screen sizes
- **VS Code Theme**: Familiar color scheme for developers

## 🌐 API Endpoints

- `POST /api/chat`: Main chat endpoint
  - Request body: `{ "message": "your question" }`
  - Response: `{ "response": "AI response" }`

## 🔧 Troubleshooting

- **CORS Issues**: Ensure your frontend is being served from a web server (not `file://`)
- **API Key Errors**: Verify your `.env` file has the correct API key
- **Code Formatting**: Make sure to properly format code blocks with triple backticks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for the AI capabilities
- VS Code for the color scheme inspiration
- All open-source libraries used in this project