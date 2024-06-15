import axios from 'axios';

let players = {}; // Object to track players and their hearts
let currentItemIndex = 0; // Index of the current item being processed
let currentItem; // Current item being processed
let answered = false; // Flag to track if the question has been answered
let gameStarted = false; // Flag to track if the game has started
let shuffledData = []; // Shuffled data array

// Function to fetch data from GitHub raw
async function fetchData() {
    try {
        let response = await axios.get('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return []; // Return an empty array if fetching fails
    }
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to send the next question with an image and clue
async function sendNextQuestion(conn, m) {
    if (Object.keys(players).length < 2) {
        // End game if less than 2 players remain
        let winner = Object.keys(players)[0];
        let winnerName = global.db.data.users[winner].name;
        await conn.reply(m.chat, `*Game Over!*\n\n*Winner:* ${winnerName}`, m);
        gameStarted = false;
        return;
    }

    if (currentItemIndex < shuffledData.length) {
        currentItem = shuffledData[currentItemIndex];
        let caption = `*Hint:*`; // Caption for the image
        await conn.sendFile(m.chat, currentItem.img, 'image.jpg', caption, m); // Send the image with the caption

        // Reset answered flag for the new question
        answered = false;

        // Schedule timeout for the current item
        setTimeout(() => {
            // If no correct answer is provided within the timeout, send the next question
            if (!answered) {
                currentItemIndex++;
                sendNextQuestion(conn, m);
            }
        }, 8000);
    } else {
        await conn.reply(m.chat, `No more questions available.`, m);
        gameStarted = false;
    }
}

// Command to join the game
let joinHandler = async (m, { conn }) => {
    let user = m.sender;
    if (!gameStarted) {
        if (!players[user]) {
            players[user] = { hearts: 5 }; // Give player 5 hearts
            let userName = global.db.data.users[user].name;
            await conn.reply(m.chat, `${userName} has joined the game!`, m);
        } else {
            await conn.reply(m.chat, `You have already joined the game!`, m);
        }
    } else {
        await conn.reply(m.chat, `Game is already in progress!`, m);
    }
};

// Command to start the game
let startHandler = async (m, { conn }) => {
    if (!gameStarted) {
        gameStarted = true;
        currentItemIndex = 0;
        shuffledData = shuffleArray(await fetchData());
        await conn.reply(m.chat, `*Game has started!*`, m);
        sendNextQuestion(conn, m);
    } else {
        await conn.reply(m.chat, `Game is already in progress!`, m);
    }
};

// Command to end the game
let endHandler = async (m, { conn }) => {
    if (gameStarted) {
        gameStarted = false;
        players = {};
        await conn.reply(m.chat, `*Game has been ended by the admin.*`, m);
    } else {
        await conn.reply(m.chat, `No game is currently in progress!`, m);
    }
};

// Function to normalize a string (remove whitespace, convert to lowercase, etc.)
function normalize(str) {
    return str.replace(/\s/g, '').toLowerCase(); // Remove whitespace and convert to lowercase
}

// Function to handle answers and heart deduction
let answerHandler = async (m, { conn }) => {
    let user = m.sender;
    let message = m.text.trim();

    if (gameStarted && !answered && currentItem && normalize(currentItem.name) === normalize(message.split(" ")[0])) {
        let targetUser = m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo.mentionedJid[0];
        if (targetUser && players[targetUser]) {
            players[targetUser].hearts -= 1;
            if (players[targetUser].hearts <= 0) {
                delete players[targetUser]; // Eliminate player if hearts are 0
                let targetName = global.db.data.users[targetUser].name;
                await conn.reply(m.chat, `${targetName} has been eliminated!`, m);
            }
        }

        // If user's message matches the name (answer) associated with the current image
        answered = true; // Mark the question as answered
        await conn.reply(m.chat, ".", m); // Send a confirmation message
        currentItemIndex++; // Move to the next question
        setTimeout(() => sendNextQuestion(conn, m), 2000); // Send the next question with a 2-second delay
    }
};

// Main handler
let mainHandler = async (m, context) => {
    let { conn, args, command } = context;

    if (command === 'join') {
        await joinHandler(m, context);
    } else if (command === 'start') {
        await startHandler(m, context);
    } else if (command === 'end') {
        await endHandler(m, context);
    } else {
        await answerHandler(m, context);
    }
};

mainHandler.command = /^(heart|join|start|end)$/i;

export default mainHandler;
