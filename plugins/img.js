import axios from 'axios';

let handler = async (m, { conn, args }) => {
    let gameData = {
        active: false, // Flag to track if the game is active
        players: {}, // Object to store players and their hearts
        currentRound: 0, // Current round of the game
        currentImage: null, // Current image being shown
        answered: false, // Flag to track if current image question is answered
        maxPlayers: 15, // Maximum number of players allowed
        minPlayers: 2, // Minimum number of players required to start the game
        timeout: 15000, // Timeout for answering each image question (15 seconds)
        images: [], // Array to store shuffled images data
        playersOrder: [], // Array to store player order for deduction round
        playersOrderIndex: 0, // Index to track current player for deduction round
    };

    // Function to fetch data from GitHub raw
    async function fetchData() {
        try {
            let response = await axios.get('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return [];
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

    // Function to send the game rules and how to join
    async function sendGameRules() {
        let rulesMsg = `*Welcome to the Guess the Anime Character game!*\n\n`;
        rulesMsg += `*Rules:*\n`;
        rulesMsg += `- Use the command *join* to join the game.\n`;
        rulesMsg += `- Each player starts with 5 hearts.\n`;
        rulesMsg += `- Answer the name of the character shown in the image correctly to earn 1 point (heart).\n`;
        rulesMsg += `- Use the command *deduct @player* to deduct 1 heart from another player once per round.\n`;
        rulesMsg += `- The game will proceed with each round showing a new anime character image.\n`;
        rulesMsg += `- The player who loses all their hearts gets eliminated each round until one player remains.\n\n`;
        rulesMsg += `*Maximum Players:* ${gameData.maxPlayers}\n`;
        rulesMsg += `*Minimum Players:* ${gameData.minPlayers}\n\n`;
        rulesMsg += `*Let the game begin!* Use *start* to start the game when everyone has joined.`;

        await conn.reply(m.chat, rulesMsg, m);
    }

    // Function to handle players joining the game
    async function handleJoin(playerId, playerName) {
        if (!gameData.players[playerId] && Object.keys(gameData.players).length < gameData.maxPlayers) {
            gameData.players[playerId] = {
                name: playerName,
                hearts: 5,
                points: 0,
            };
            await conn.reply(m.chat, `*${playerName}* has joined the game with 5 hearts!`, m);
        } else {
            await conn.reply(m.chat, `*${playerName}* has already joined the game or the game is full.`, m);
        }
    }

    // Function to start the game
    async function startGame() {
        if (Object.keys(gameData.players).length < gameData.minPlayers) {
            await conn.reply(m.chat, `Not enough players to start the game. Minimum players required: ${gameData.minPlayers}`, m);
            return;
        }

        gameData.active = true;
        gameData.currentRound = 1;
        gameData.images = shuffleArray(await fetchData());
        gameData.playersOrder = Object.keys(gameData.players);
        gameData.playersOrderIndex = 0;

        await sendNextImage();
    }

    // Function to send the next image and handle game flow
    async function sendNextImage() {
        if (gameData.currentRound > 1) {
            await conn.reply(m.chat, `*Round ${gameData.currentRound} - Next Image:*`, m);
        } else {
            await conn.reply(m.chat, `*Game Started!* Round ${gameData.currentRound} - First Image:`, m);
        }

        gameData.currentImage = gameData.images.pop();
        await conn.sendFile(m.chat, gameData.currentImage.img, 'image.jpg', `*Who is this anime character?*`, m);

        gameData.answered = false;
        setTimeout(() => {
            if (!gameData.answered) {
                handleTimeout();
            }
        }, gameData.timeout);
    }

    // Function to handle timeout for current image question
    async function handleTimeout() {
        await conn.reply(m.chat, `Time's up! The correct answer was *${gameData.currentImage.name}*`, m);
        gameData.currentRound++;

        if (Object.keys(gameData.players).length === 1) {
            endGame();
            return;
        }

        if (gameData.images.length > 0) {
            await sendNextImage();
        } else {
            calculateResult();
        }
    }

    // Function to handle player responses
    handler.all = async function (m) {
        let playerId = m.sender;
        let playerName = m.sender;

        if (!gameData.active) return;

        let message = m.text.trim();

        if (!gameData.answered && gameData.currentImage && normalize(gameData.currentImage.name) === normalize(message)) {
            gameData.players[playerId].points++;
            gameData.answered = true;

            await conn.reply(m.chat, `*Correct answer!* +1 heart for *${gameData.players[playerId].name}*`, m);

            if (gameData.images.length > 0) {
                setTimeout(() => sendNextImage(), 2000);
            } else {
                calculateResult();
            }
        }
    };

    // Function to handle deduction of hearts from another player
    handler.command = /^deduct$/i;
    handler.deduct = async function (m, { args }) {
        if (!gameData.active) return;

        let playerId = m.sender;
        let playerName = m.sender;
        let targetPlayer = args[0].replace('@', '');

        if (!gameData.players[targetPlayer]) {
            await conn.reply(m.chat, `Player not found or cannot be deducted from.`, m);
            return;
        }

        if (gameData.players[playerId].hearts <= 0) {
            await conn.reply(m.chat, `You don't have enough hearts to deduct from another player.`, m);
            return;
        }

        gameData.players[playerId].hearts--;
        gameData.players[targetPlayer].hearts++;

        await conn.reply(m.chat, `*${gameData.players[playerId].name}* has deducted 1 heart from *${gameData.players[targetPlayer].name}*`, m);

        calculateResult();
    };

    // Function to calculate and send the current game result
    async function calculateResult() {
        let resultMsg = `*Current Round ${gameData.currentRound} Result:*\n\n`;
        let players = Object.keys(gameData.players);

        players.forEach(playerId => {
            let player = gameData.players[playerId];
            resultMsg += `*${player.name}* - Hearts: ${player.hearts} | Points: ${player.points}\n`;
        });

        await conn.reply(m.chat, resultMsg, m);

        // Check for elimination
        let remainingPlayers = players.filter(playerId => gameData.players[playerId].hearts > 0);

        if (remainingPlayers.length === 1) {
            await conn.reply(m.chat, `Congratulations! *${gameData.players[remainingPlayers[0]].name}* has won the game!`, m);
            endGame();
        } else {
            if (gameData.images.length > 0) {
                setTimeout(() => sendNextImage(), 2000);
            } else {
                calculateResult();
            }
        }
    }

    // Function to end the game
    async function endGame() {
        gameData.active = false;
        gameData.players = {};
        gameData.currentRound = 0;
        gameData.currentImage = null;
        gameData.answered = false;
        gameData.images = [];
        gameData.playersOrder = [];
        gameData.playersOrderIndex = 0;

        await conn.reply(m.chat, `The game has ended. Use *start* to begin a new game.`, m);
    }

    // Function to normalize a string (remove whitespace, convert to lowercase, etc.)
    function normalize(str) {
        return str.replace(/\s/g, '').toLowerCase();
    }

    // Command handlers
    handler.command = /^(start|join|end)$/i;
    handler.start = startGame;

    handler.join = async (m) => {
        let playerId = m.sender;
        let playerName = m.sender;

        if (!gameData.active && Object.keys(gameData.players).length < gameData.maxPlayers) {
            await handleJoin(playerId, playerName);
        } else {
            await conn.reply(m.chat, `The game is currently active or has reached the maximum number of players.`, m);
        }
    };

        handler.end = async (m) => {
        if (gameData.active) {
            endGame();
        } else {
            await conn.reply(m.chat, `No game is currently active.`, m);
        }
    };

    // Function to handle deduction command
    handler.command = /^deduct$/i;
    handler.deduct = async function (m, { args }) {
        if (!gameData.active) {
            await conn.reply(m.chat, `No active game to deduct hearts.`, m);
            return;
        }

        let playerId = m.sender;
        let playerName = m.sender;

        if (!gameData.players[playerId]) {
            await conn.reply(m.chat, `You are not a participant in the game.`, m);
            return;
        }

        if (gameData.players[playerId].hearts <= 0) {
            await conn.reply(m.chat, `You don't have enough hearts to deduct from another player.`, m);
            return;
        }

        let targetPlayerId = args[0].replace('@', '');
        if (!gameData.players[targetPlayerId]) {
            await conn.reply(m.chat, `Player not found or cannot be deducted from.`, m);
            return;
        }

        gameData.players[playerId].hearts--;
        gameData.players[targetPlayerId].hearts++;

        await conn.reply(m.chat, `*${gameData.players[playerId].name}* has deducted 1 heart from *${gameData.players[targetPlayerId].name}*`, m);

        calculateResult();
    };

    // Send game rules when the game is started for the first time
    if (!gameData.active) {
        await sendGameRules();
    }

    return true; // Message handled
};

export default handler;
