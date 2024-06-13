import axios from 'axios';

let handler = async (m, { conn, command, args }) => {
    let chat = global.db.data.chats[m.chat];
    chat.players = chat.players || {}; // To store player data
    chat.inGame = chat.inGame || false; // To check if the game is in progress
    chat.allowJoining = chat.allowJoining || false; // To check if joining is allowed
    chat.currentQuestion = chat.currentQuestion || null; // To store the current question
    chat.currentAnswer = chat.currentAnswer || null; // To store the current answer
    chat.currentImg = chat.currentImg || null; // To store the current image

    async function fetchData() {
        try {
            let response = await axios.get('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return []; // Return an empty array if fetching fails
        }
    }

    // Function to start the game
    async function startGame() {
        if (chat.inGame) {
            await conn.reply(m.chat, "A game is already in progress.", m);
            return; // If a game is already in progress, ignore the start command
        }

        chat.inGame = true;
        chat.allowJoining = true;
        chat.players = {}; // Reset player data

        await conn.reply(m.chat, "The game has started! Type 'join' to participate. Type 'start' to begin the round.", m);
    }

    // Function to handle player joining
    async function joinGame(user) {
        if (!chat.allowJoining) {
            await conn.reply(m.chat, "Joining is not allowed at this moment.", m);
            return; // If joining is not allowed, ignore the join command
        }

        if (!chat.players[user]) {
            chat.players[user] = { hearts: 5 };
            await conn.reply(m.chat, `${user} has joined the game with 5 hearts.`, m);
        }
    }

    // Function to start the round
    async function startRound() {
        if (!chat.inGame) {
            await conn.reply(m.chat, "No game in progress. Start a game first using the 'hearts' command.", m);
            return; // If no game is in progress, ignore the start command
        }

        chat.allowJoining = false; // Stop allowing new players to join

        let data = await fetchData();
        if (data.length === 0) {
            await conn.reply(m.chat, "Failed to fetch questions. Please try again later.", m);
            return;
        }

        let shuffledData = shuffleArray(data);
        chat.currentQuestion = shuffledData[0];
        chat.currentAnswer = chat.currentQuestion.name.toLowerCase().replace(/\s/g, '');
        chat.currentImg = chat.currentQuestion.img;

        console.log(`Sending image question: ${chat.currentImg} with answer: ${chat.currentAnswer}`); // Log the current question details

        await conn.sendMessage(m.chat, { image: { url: chat.currentImg }, caption: "Guess the anime!" });
    }

    // Function to handle player answer
    async function handleAnswer(user, message) {
        if (!chat.inGame || !chat.currentAnswer) return; // If no game or no current question, ignore the message

        let answer = message.toLowerCase().replace(/\s/g, '');
        if (answer === chat.currentAnswer) {
            await conn.reply(m.chat, `${user} got it right! Type 'takeheart @user' to take a heart from another player.`, m);
            chat.currentAnswer = null; // Reset the current answer to wait for the 'takeheart' command
        }
    }

    // Function to take a heart from another player
    async function takeHeart(fromUser, toUser) {
        if (!chat.inGame) return; // If no game in progress, ignore the command

        if (chat.players[fromUser] && chat.players[toUser]) {
            if (chat.players[toUser].hearts > 0) {
                chat.players[toUser].hearts--;
                chat.players[fromUser].hearts++;

                if (chat.players[toUser].hearts === 0) {
                    await conn.reply(m.chat, `${toUser} has been eliminated!`, m);
                    delete chat.players[toUser];
                }

                await conn.reply(m.chat, `${fromUser} took a heart from ${toUser}.`, m);

                // Check if only one player is left
                if (Object.keys(chat.players).length === 1) {
                    let winner = Object.keys(chat.players)[0];
                    await conn.reply(m.chat, `${winner} is the winner with ${chat.players[winner].hearts} hearts!`, m);
                    chat.inGame = false; // End the game
                } else {
                    await startRound(); // Send the next question
                }
            } else {
                await conn.reply(m.chat, `${toUser} has no hearts left to take.`, m);
            }
        }
    }

    // Function to end the game
    async function endGame() {
        chat.inGame = false;
        chat.allowJoining = false;
        await conn.reply(m.chat, "The game has been ended.", m);
    }

    // Function to shuffle an array (Fisher-Yates shuffle algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Command handler
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
