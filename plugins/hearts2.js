import axios from 'axios';

let handler = async (m, { conn, command, args }) => {
    let chat = global.db.data.chats[m.chat];
    chat.inGame = chat.inGame || false; // To check if the game is in progress
    chat.players = chat.players || {}; // To store player data
    chat.currentQuestion = chat.currentQuestion || null; // To store the current question
    chat.currentAnswer = chat.currentAnswer || null; // To store the current answer
    chat.currentImg = chat.currentImg || null; // To store the current image

    async function fetchData() {
        try {
            let response = await axios.get('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
            console.log("Data fetched:", response.data); // Log fetched data
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
        chat.players = {}; // Reset player data

        await conn.reply(m.chat, "The game has started! Type 'join' to participate. Type 'start' to begin the round.", m);
    }

    // Function to handle player joining
    async function joinGame(user) {
        if (!chat.inGame) {
            await conn.reply(m.chat, "No game in progress. Start a game first using the 'hearts' command.", m);
            return; // If no game is in progress, ignore the join command
        }

        if (!chat.players[user]) {
            chat.players[user] = { points: 0 };
            await conn.reply(m.chat, `${user} has joined the game.`, m);
        }
    }

    // Function to start the round
    async function startRound() {
        if (!chat.inGame) {
            await conn.reply(m.chat, "No game in progress. Start a game first using the 'hearts' command.", m);
            return; // If no game is in progress, ignore the start command
        }

        let data = await fetchData();
        if (data.length === 0) {
            await conn.reply(m.chat, "Failed to fetch questions. Please try again later.", m);
            return;
        }

        let shuffledData = shuffleArray(data);
        chat.currentQuestion = shuffledData[0];
        chat.currentAnswer = chat.currentQuestion.name.trim().toLowerCase().replace(/\s/g, '');
        chat.currentImg = chat.currentQuestion.img;

        console.log(`Sending image question: ${chat.currentImg} with answer: ${chat.currentAnswer}`); // Log the current question details

        await conn.sendMessage(m.chat, { image: { url: chat.currentImg }, caption: "Guess the anime!" });
    }

    // Function to handle player answer
    async function handleAnswer(user, message) {
        if (!chat.inGame || !chat.currentAnswer) return; // If no game or no current question, ignore the message

        let answer = message.trim().toLowerCase().replace(/\s/g, '');
        console.log(`User answer: ${answer}, Expected answer: ${chat.currentAnswer}`); // Log the answers for debugging

        if (answer === chat.currentAnswer) {
            chat.players[user].points++;
            await conn.reply(m.chat, `${user} got it right! They now have ${chat.players[user].points} points.`, m);
            chat.currentAnswer = null; // Reset the current answer to send the next question
            await startRound(); // Send the next question
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

    // Command handler
    if (/^hearts$/i.test(command)) {
        await startGame();
    } else if (/^join$/i.test(command)) {
        await joinGame(m.sender);
    } else if (/^start$/i.test(command)) {
        await startRound();
    } else if (/^end$/i.test(command)) {
        chat.inGame = false;
        await conn.reply(m.chat, "The game has been ended.", m);
    } else {
        await handleAnswer(m.sender, m.text);
    }
};

handler.command = /^(hearts|join|start|end)$/i;

export default handler;
