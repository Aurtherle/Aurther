// Import necessary modules and setup
import axios from 'axios';

// Define handlePlayerAnswer globally
async function handlePlayerAnswer(user, message, conn, m, chat) {
    if (!chat.roundStarted) return;

    let answer = message.trim().toLowerCase().replace(/\s/g, ''); // Normalize the answer
    console.log(`User answer: ${answer}, Expected answer: ${chat.currentAnswer}`);

    if (answer === chat.currentAnswer) {
        chat.roundStarted = false;
        if (chat.players[user]) {
            chat.players[user].hearts--;
            await conn.reply(m.chat, `${user} got it right!`, m);
            await conn.reply(m.chat, `Remaining ${chat.players[user].heartShape}: ${chat.players[user].hearts}`, m);
            if (chat.players[user].hearts === 0) {
                await conn.reply(m.chat, `${user} has been eliminated!`, m);
                delete chat.players[user];
            }
            if (Object.keys(chat.players).length === 1 || Object.values(chat.players).every(player => player.hearts === 0)) {
                // Check if only one player is left or all other players are eliminated
                let winner = Object.keys(chat.players)[0];
                await conn.reply(m.chat, `${winner} is the winner with ${chat.players[winner].hearts} ${chat.players[winner].heartShape}!`, m);
                chat.inGame = false;
            } else {
                console.log('Starting new round after correct answer...');
                await startRound(conn, m, chat); // Ensure startRound is called properly
            }
        }
    }
}

// Command handler
let handler = async (m, { conn, command, args }) => {
    try {
        let chat = global.db.data.chats[m.chat] || {};
        chat.players = chat.players || {}; // To store player data
        chat.inGame = chat.inGame || false; // To check if the game is in progress
        chat.allowJoining = chat.allowJoining || false; // To check if joining is allowed
        chat.currentImg = null; // To store the current image URL
        chat.currentAnswer = null; // To store the current answer
        chat.roundStarted = false; // To track if a round has started

        // Define heart shapes
        const heartShapes = ['❤️', '💛', '💚', '💙', '💜', '🧡', '🖤', '💔', '💖', '💗', '💘', '💝', '💞', '💟', '❣️'];

        async function fetchData() {
            try {
                let response = await axios.get('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
                console.log("Data fetched:", response.data); // Log fetched data
                return response.data;
            } catch (error) {
                console.error("Failed to fetch data:", error);
                return [];
            }
        }

        // Function to start the game
        async function startGame() {
            if (chat.inGame) {
                await conn.reply(m.chat, "A game is already in progress.", m);
                return;
            }

            chat.inGame = true;
            chat.allowJoining = true;
            chat.players = {};

            await conn.reply(m.chat, "The game has started! Type 'join' to participate. Type 'start' to begin the round.", m);
        }

        // Function to handle player joining
        async function joinGame(user) {
            if (!chat.allowJoining) {
                await conn.reply(m.chat, "Joining is not allowed at this moment.", m);
                return;
            }

            if (!chat.players[user]) {
                chat.players[user] = {
                    hearts: 5,
                    heartShape: heartShapes[Object.keys(chat.players).length % heartShapes.length] // Assign unique heart shape
                };
                await conn.reply(m.chat, `${user} has joined the game with 5 ${chat.players[user].heartShape}.`, m);
            }
        }

        // Function to start the round
        async function startRound(conn, m, chat) {
            if (!chat.inGame) {
                await conn.reply(m.chat, "No game in progress. Start a game first using the 'hearts' command.", m);
                return;
            }

            chat.allowJoining = false;
            chat.roundStarted = true;

            let data = await fetchData();
            if (data.length === 0) {
                await conn.reply(m.chat, "Failed to fetch questions. Please try again later.", m);
                return;
            }

            let randomIndex = Math.floor(Math.random() * data.length);
            chat.currentImg = data[randomIndex].img;
            chat.currentAnswer = data[randomIndex].name.trim().toLowerCase().replace(/\s/g, '');

            console.log(`Sending image question: ${chat.currentImg} with answer: ${chat.currentAnswer}`);

            await conn.sendMessage(m.chat, { image: { url: chat.currentImg }, caption: "Guess the character!" });

            // Set timeout to check if no one answers in 10 seconds
            setTimeout(async () => {
                if (chat.roundStarted) {
                    chat.roundStarted = false;
                    await conn.reply(m.chat, `Time's up! The answer was ${chat.currentAnswer}.`, m);
                    await startRound(conn, m, chat); // Start a new round
                }
            }, 10000);
        }

        // Function to erase a heart from another player
        async function eraseHeart(fromUser, toUser) {
            if (!chat.inGame) return;

            if (chat.players[fromUser] && chat.players[toUser]) {
                if (chat.players[toUser].hearts > 0) {
                    chat.players[toUser].hearts--;

                    if (chat.players[toUser].hearts === 0) {
                        await conn.reply(m.chat, `${toUser} has been eliminated!`, m);
                        delete chat.players[toUser];
                    }

                    await conn.reply(m.chat, `${fromUser} erased a heart from ${toUser}.`, m);

                    if (Object.keys(chat.players).length === 1 || Object.values(chat.players).every(player => player.hearts === 0)) {
                        let winner = Object.keys(chat.players)[0];
                        await conn.reply(m.chat, `${winner} is the winner with ${chat.players[winner].hearts} ${chat.players[winner].heartShape}!`, m);
                        chat.inGame = false;
                    } else {
                        await startRound(conn, m, chat);
                    }
                } else {
                    await conn.reply(m.chat, `${toUser} has no hearts left to erase.`, m);
                }
            }
        }

        // Function to end the game
        async function endGame() {
            chat.inGame = false;
            chat.allowJoining = false;
            await conn.reply(m.chat, "The game has been ended.", m);
        }

        // Function to show current game status
        async function showStatus() {
            let statusMsg = "Current Game Status:\n";
            for (let user in chat.players) {
                statusMsg += `${user}: ${chat.players[user].hearts} ${chat.players[user].heartShape}\n`;
            }
            await conn.reply(m.chat, statusMsg.trim(), m);
        }

        // Command handler
        if (/^hearts$/i.test(command)) {
            await startGame();
        } else if (/^join$/i.test(command)) {
            let playerName = args[0];
            await joinGame(playerName);
        } else if (/^start$/i.test(command)) {
            await startRound(conn, m, chat); // Pass conn, m, and chat as arguments
        } else if (/^eraseheart$/i.test(command)) {
            let toUser = args[0]; // Assuming the command is 'eraseheart @user'
            await eraseHeart(m.sender, toUser);
        } else if (/^end$/i.test(command)) {
            await endGame();
        } else if (/^status$/i.test(command)) {
            await showStatus();
        }
    } catch (e) {
        console.error(e); // Log the error
        await conn.reply(m.chat, `An error occurred: ${e.message}`, m); // Send the error message
    }
};

// Handle all incoming messages
handler.all = async function (m, { conn }) { // Ensure conn is passed as argument
    try {
        let chat = global.db.data.chats[m.chat] || {};
        let user = m.sender;
        let message = m.text.trim();

        if (chat.roundStarted) {
            await handlePlayerAnswer(user, message, conn, m, chat); // Pass conn, m, and chat as arguments
        }
    } catch (e) {
        console.error(e); // Log the error
        await conn.reply(m.chat, `An error occurred: ${e.message}`, m); // Send the error message
    }
};

handler.command = /^(hearts|join|start|eraseheart|end|status)$/i;

export default handler;
