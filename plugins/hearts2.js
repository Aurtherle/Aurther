import axios from 'axios';

// Define different heart shapes
const heartShapes = ['❤️', '💛', '💚', '💙', '💜', '🧡', '🖤', '💔', '💖', '💗', '💘', '💝', '💞', '💟', '❣️'];

let handler = async (m, { conn, command, args }) => {
    let chat = global.db.data.chats[m.chat];
    chat.players = chat.players || {};
    chat.inGame = chat.inGame || false;
    chat.allowJoining = chat.allowJoining || false;
    chat.currentImg = null;
    chat.currentAnswer = null;
    chat.roundStarted = false;

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

    async function startGame() {
        if (chat.inGame) {
            await conn.reply(m.chat, "A game is already in progress.", m);
            return;
        }

        chat.inGame = true;
        chat.allowJoining = true;
        chat.players = {};

        await conn.reply(m.chat, "The game has started! Type 'join <your name>' to participate. Type 'start' to begin the round.", m);
    }

    async function joinGame(user, playerName) {
        if (!chat.allowJoining) {
            await conn.reply(m.chat, "Joining is not allowed at this moment.", m);
            return;
        }

        if (Object.keys(chat.players).length >= 15) {
            await conn.reply(m.chat, "Maximum player count reached. Cannot join.", m);
            return;
        }

        if (!chat.players[playerName]) {
            // Assign 5 hearts to the new player with a unique heart shape
            let uniqueHeart = heartShapes[Object.keys(chat.players).length % heartShapes.length];
            chat.players[playerName] = { hearts: 5, heartShape: uniqueHeart };
            await conn.reply(m.chat, `${playerName} has joined the game with 5 ${uniqueHeart}.`, m);
        } else {
            await conn.reply(m.chat, `${playerName} is already in the game.`, m);
        }
    }

    async function startRound() {
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

        // Set a timeout to send another image if no one answers in 10 seconds
        setTimeout(async () => {
            if (chat.roundStarted) {
                await startRound();
            }
        }, 10000);
    }

    async function handleAnswer(user, message) {
        if (!chat.roundStarted) return;

        let answer = message.trim().toLowerCase().replace(/\s/g, '');
        console.log(`User answer: ${answer}, Expected answer: ${chat.currentAnswer}`);

        if (answer === chat.currentAnswer) {
            chat.roundStarted = false;
            if (chat.players[user]) {
                chat.players[user].points = (chat.players[user].points || 0) + 1;
                await conn.reply(m.chat, `${user} got it right!`, m);
                await conn.reply(m.chat, `Points: ${chat.players[user].points}`, m);
                await startRound();
            }
        }
    }

    async function takeHeart(fromUser, toUser) {
        if (!chat.inGame) return;

        if (chat.players[fromUser] && chat.players[toUser]) {
            if (chat.players[toUser].hearts > 0) {
                chat.players[toUser].hearts--;
                chat.players[fromUser].hearts++;

                if (chat.players[toUser].hearts === 0) {
                    await conn.reply(m.chat, `${toUser} has been eliminated!`, m);
                    delete chat.players[toUser];
                }

                await conn.reply(m.chat, `${fromUser} took a heart from ${toUser}.`, m);

                if (Object.keys(chat.players).length === 1) {
                    let winner = Object.keys(chat.players)[0];
                    await conn.reply(m.chat, `${winner} is the winner with ${chat.players[winner].hearts} ${chat.players[winner].heartShape}!`, m);
                    chat.inGame = false;
                } else {
                    await startRound();
                }
            } else {
                await conn.reply(m.chat, `${toUser} has no hearts left to take.`, m);
            }
        }
    }

    async function endGame() {
        chat.inGame = false;
        chat.allowJoining = false;
        await conn.reply(m.chat, "The game has been ended.", m);
    }

    async function showPlayers() {
        if (!chat.inGame) {
            await conn.reply(m.chat, "No game in progress.", m);
            return;
        }

        let playerList = "Players:\n";
        for (let player in chat.players) {
            playerList += `${player}: ${chat.players[player].hearts} ${chat.players[player].heartShape}\n`;
        }
        await conn.reply(m.chat, playerList, m);
    }

    if (/^hearts$/i.test(command)) {
        await startGame();
    } else if (/^join$/i.test(command)) {
        if (args.length < 1) {
            await conn.reply(m.chat, "Please specify your name after 'join'.", m);
            return;
        }
        let playerName = args[0].trim();
        await joinGame(m.sender, playerName);
    } else if (/^start$/i.test(command)) {
        await startRound();
    } else if (/^takeheart$/i.test(command)) {
        if (args.length < 1) {
            await conn.reply(m.chat, "Please specify a player to take a heart from.", m);
            return;
        }
        let toUser = args[0].trim(); // Assuming the command is 'takeheart @user'
        await takeHeart(m.sender, toUser);
    } else if (/^end$/i.test(command)) {
        await endGame();
    } else if (/^result$/i.test(command)) {
        await showPlayers();
    } else {
        await handleAnswer(m.sender, m.text);
    }
};

handler.command = /^(hearts|join|start|takeheart|end|result)$/i;

export default handler;
