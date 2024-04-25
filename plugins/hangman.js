import { hangmanWords } from './hangmanWords.js'; // Import a list of hangman words

let activeGames = {};

const TIME_LIMIT = 5 * 60 * 1000; // 5 minutes in milliseconds

const handler = async (m, { conn }) => {
    let user = m.sender.split("@")[0];
    
    // Check if there's an active game for this user
    if (activeGames[user]) {
        return await conn.reply(m.chat, "You already have an active Hangman game. Finish that one first!", m);
    }

    // Select a random word for the game
    let word = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    
    // Initialize game state
    let gameState = {
        word: word.toUpperCase(),
        guessedLetters: [],
        incorrectGuesses: 0,
        hangmanStatus: ""
    };

    // Generate hangman status
    gameState.hangmanStatus = generateHangmanStatus(gameState.word, gameState.guessedLetters);

    // Send initial message with hangman status
    let msg = await conn.reply(m.chat, `🪓 Hangman Game 🪓\n\n${gameState.hangmanStatus}`, m);

    // Set up game expiration timer
    let expirationTimer = setTimeout(async () => {
        delete activeGames[user];
        await conn.reply(m.chat, "⏰ Time's up! The Hangman game has ended.", m);
    }, TIME_LIMIT);

    // Store active game
    activeGames[user] = { gameState, msg, expirationTimer };

    // Listen for user guesses
    conn.on('chat-update', async (chat) => {
        if (!chat.messages || !chat.messages.all()) return;
        
        // Filter messages to get the most recent one from the user
        let userMessages = chat.messages.all().filter(m => m.key.fromMe && m.key.id === msg.id);
        if (userMessages.length === 0) return;

        // Get the most recent message from the user
        let lastMessage = userMessages[userMessages.length - 1];
        let guess = lastMessage.message.text.trim().toUpperCase();

        // Validate the guess
        if (guess.length !== 1 || !guess.match(/[A-Z]/)) {
            return await conn.reply(m.chat, "Please enter a single letter as your guess.", m);
        }

        // Check if the letter has already been guessed
        if (gameState.guessedLetters.includes(guess)) {
            return await conn.reply(m.chat, "You've already guessed that letter.", m);
        }

        // Add the guess to the list of guessed letters
        gameState.guessedLetters.push(guess);

        // Check if the guess is correct
        if (gameState.word.includes(guess)) {
            gameState.hangmanStatus = generateHangmanStatus(gameState.word, gameState.guessedLetters);
            await conn.reply(m.chat, `🎉 Correct guess! 🎉\n\n${gameState.hangmanStatus}`, m);
        } else {
            gameState.incorrectGuesses++;
            gameState.hangmanStatus = generateHangmanStatus(gameState.word, gameState.guessedLetters);
            await conn.reply(m.chat, `❌ Incorrect guess! ❌\n\n${gameState.hangmanStatus}`, m);
        }

        // Check if the game is won or lost
        if (!gameState.hangmanStatus.includes("_")) {
            clearTimeout(expirationTimer);
            delete activeGames[user];
            await conn.reply(m.chat, "🎉 Congratulations! You've won the Hangman game! 🎉", m);
            // Reward the player with virtual currency
            // Add your reward logic here
        } else if (gameState.incorrectGuesses >= 6) {
            clearTimeout(expirationTimer);
            delete activeGames[user];
            await conn.reply(m.chat, "😢 Oh no! You've lost the Hangman game. The word was: " + gameState.word, m);
        }
    });
};

// Function to generate the hangman status string
function generateHangmanStatus(word, guessedLetters) {
    let hangmanStatus = "";
    for (let char of word) {
        if (guessedLetters.includes(char)) {
            hangmanStatus += char + " ";
        } else {
            hangmanStatus += "_ ";
        }
    }
    return hangmanStatus.trim();
}

handler.help = ['hangman'];
handler.tags = ['games'];
handler.command = /^(hangman)$/i;

export default handler;
