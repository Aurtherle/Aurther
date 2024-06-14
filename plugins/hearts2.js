import axios from 'axios';

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

        await conn.reply(m.chat, "The game has started! Type 'join' to participate. Type 'start' to begin the round.", m);
    }

    async function joinGame(user) {
        if (!chat.allowJoining) {
            await conn.reply(m.chat, "Joining is not allowed at this moment.", m);
            return;
        }

        if (!chat.players[user]) {
            chat.players[user] = { hearts: 5 };
            await conn.reply(m.chat, `${user} has joined the game with 5 hearts.`, m);
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
                    await conn.reply(m.chat, `${winner} is the winner with ${chat.players[winner].hearts} hearts!`, m);
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

    if (/^hearts$/i.test(command)) {
        await startGame();
    } else if (/^join$/i.test(command)) {
        await joinGame(m.sender);
    } else if (/^start$/i.test(command)) {
        await startRound();
    } else if (/^takeheart$/i.test(command)) {
        let toUser = args[0]; // Assuming the command is 'takeheart @user'
        await takeHeart(m.sender, toUser);
    } else if (/^end$/i.test(command)) {
        await endGame();
    } else {
        await handleAnswer(m.sender, m.text);
    }
};

handler.command = /^(hearts|join|start|takeheart|end)$/i;

export default handler;
