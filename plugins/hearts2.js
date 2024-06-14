import axios from 'axios';

let handler = async (m, { conn, args }) => {
    let chat = global.db.data.chats[m.chat];
    let heartsGame = {
        players: {},
        heartsCount: 5,
        gameStarted: false,
        joinable: true,
        currentItemIndex: 0,
        shuffledData: [],
        currentItem: null,
        answered: false
    };

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

    // Function to send the next question (image)
    async function sendNextQuestion() {
        if (heartsGame.currentItemIndex < heartsGame.shuffledData.length && heartsGame.heartsCount > 1) {
            heartsGame.currentItem = heartsGame.shuffledData[heartsGame.currentItemIndex];
            let imgUrl = heartsGame.currentItem.img;
            await conn.sendFile(m.chat, imgUrl, 'image.jpg', '', m); // Send the image question
            heartsGame.answered = false; // Reset answered flag for the new question
        } else {
            // Game ends when there is only one player left with hearts
            let winnerId = Object.keys(heartsGame.players)[0]; // Get the winner's ID
            let winner = global.db.data.users[winnerId];
            await conn.reply(m.chat, `الفائز هو ${winner.name}! 🎉`, m);
            heartsGame = {
                players: {},
                heartsCount: 5,
                gameStarted: false,
                joinable: true,
                currentItemIndex: 0,
                shuffledData: [],
                currentItem: null,
                answered: false
            }; // Reset game data
        }
    }

    // Function to handle messages
    handler.all = async function (m) {
        let user = m.sender;
        let message = m.text.trim();

        if (heartsGame.gameStarted && !heartsGame.answered && heartsGame.currentItem && normalize(heartsGame.currentItem.name) === normalize(message)) {
            // If user's message matches the name (answer) and it's not already answered
            let playersArr = Object.keys(heartsGame.players);
            if (playersArr.length > 1) {
                let randomPlayerId = playersArr[Math.floor(Math.random() * playersArr.length)];
                heartsGame.players[randomPlayerId]--;
                if (heartsGame.players[randomPlayerId] <= 0) {
                    delete heartsGame.players[randomPlayerId];
                    await conn.reply(m.chat, `${global.db.data.users[randomPlayerId].name} خسر قلبه! 💔`, m);
                }
            }
            heartsGame.answered = true; // Mark the question as answered
            heartsGame.currentItemIndex++; // Move to the next question
            sendNextQuestion();
        }
    };

    // Function to normalize a string (remove whitespace, convert to lowercase, etc.)
    function normalize(str) {
        return str.replace(/\s/g, '').toLowerCase(); // Remove whitespace and convert to lowercase
    }

    // Join command to join the game
    handler.command = /^(join)$/i;
    handler.join = async function (m, { conn }) {
        if (heartsGame.joinable && !heartsGame.players[m.sender]) {
            heartsGame.players[m.sender] = heartsGame.heartsCount; // Give the player 5 hearts
            await conn.reply(m.chat, `انضم ${global.db.data.users[m.sender].name} إلى اللعبة! 🎮`, m);
        }
    };

    // Start command to start the game
    handler.command = /^(start)$/i;
    handler.start = async function (m, { conn }) {
        if (!heartsGame.gameStarted && heartsGame.joinable && Object.keys(heartsGame.players).length > 1) {
            heartsGame.shuffledData = shuffleArray(await fetchData()); // Shuffle the data array
            heartsGame.gameStarted = true;
            heartsGame.currentItemIndex = 0;
            sendNextQuestion();
        }
    };

    // End command to end the game
    handler.command = /^(end)$/i;
    handler.end = async function (m, { conn }) {
        if (heartsGame.gameStarted) {
            heartsGame = {
                players: {},
                heartsCount: 5,
                gameStarted: false,
                joinable: true,
                currentItemIndex: 0,
                shuffledData: [],
                currentItem: null,
                answered: false
            }; // Reset game data
            await conn.reply(m.chat, "تم إنهاء اللعبة.", m);
        }
    };

    return true; // Message handled
};

export default handler;
