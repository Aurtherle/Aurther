import axios from 'axios';

let handler = async (m, { conn, args }) => {
    let chat = global.db.data.chats[m.chat];
    let count = parseInt(args[0]) || 10; // Default to 10 rounds if count is not provided
    let data = await fetchData(); // Fetch data from GitHub raw
    let shuffledData = shuffleArray(data); // Shuffle the data array
    let currentItemIndex = 0; // Index of the current item being processed
    let currentItem; // Current item being processed
    let answered = false; // Flag to track if the question has been answered
    let points = {}; // Object to track points for each user
    let players = {}; // Object to track players and their hearts
    let roundInProgress = false; // Flag to track if a round is in progress

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

    // Function to generate leaderboard message
    async function generateLeaderboard() {
        let leaderboard = Object.entries(points).sort((a, b) => b[1] - a[1]);
        let leaderboardMsg = "*❃ ──────⊰ ❀ ⊱────── ❃*\n\n *المشاركين :*\n\n";
        leaderboard.forEach((entry, index) => {
            let [userId, points] = entry;
            let user = global.db.data.users[userId];
            if (!user) return;
            let { name } = user;
            let emoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
            leaderboardMsg += `◍ *${name} : ${points}* ${emoji}\n`;
        });
        leaderboardMsg += "\n*❃ ──────⊰ ❀ ⊱────── ❃*";
        return leaderboardMsg;
    }

    // Function to send the next question image
    async function sendNextQuestion() {
        if (currentItemIndex < shuffledData.length && count > 0) {
            currentItem = shuffledData[currentItemIndex];
            let img = currentItem.img;
            await conn.sendFile(m.chat, img, '', `Round ${currentItemIndex + 1}`, m);

            // Reset answered flag for the new question
            answered = false;

            // Set a timeout for the current question
            setTimeout(() => {
                if (!answered) {
                    currentItemIndex++;
                    sendNextQuestion();
                }
            }, 8000);
            count--; // Decrease the round count
        } else {
            // When all rounds are completed, generate and send leaderboard
            let leaderboardMsg = await generateLeaderboard();
            await conn.reply(m.chat, leaderboardMsg, m);
            resetGame(); // Reset the game state
        }
    }

    // Function to reset game state
    function resetGame() {
        roundInProgress = false;
        currentItemIndex = 0;
        shuffledData = shuffleArray(data);
        players = {};
        points = {};
    }

    // Function to handle messages
    handler.all = async function (m) {
        let user = m.sender;
        let message = m.text.trim();

        if (roundInProgress && !answered && currentItem && normalize(currentItem.name) === normalize(message)) {
            // If the user's message matches the name and it's not already answered, increase points
            points[user] = (points[user] || 0) + 1;
            answered = true; // Mark the question as answered
            await conn.reply(m.chat, ".", m);

            // Check if the player has hearts left
            if (players[user]) {
                players[user]--;
                if (players[user] === 0) {
                    delete players[user]; // Remove player if they have no hearts left
                }
            }

            currentItemIndex++;
            if (currentItemIndex < shuffledData.length && count > 0) {
                setTimeout(() => sendNextQuestion(), 2000); // Send the next question after a delay
            } else {
                // If all rounds are completed, generate and send leaderboard
                let leaderboardMsg = await generateLeaderboard();
                await conn.reply(m.chat, leaderboardMsg, m);
                resetGame(); // Reset the game state
            }
        }
    };

    // Function to start the game
    handler.command = /^(hearts|بداية)$/i;
    handler.command = async function (m) {
        if (!roundInProgress) {
            roundInProgress = true;
            sendNextQuestion(); // Start sending questions
            await conn.reply(m.chat, "Starting the game! Get ready!", m);
        }
    };

    // Function to join the game
    handler.command = /^(join|انضمام)$/i;
    handler.command = async function (m) {
        if (roundInProgress) {
            players[m.sender] = 5; // Give the player 5 hearts
            await conn.reply(m.chat, "You've joined the game with 5 hearts! Answer the questions to earn points.", m);
        }
    };

    // Function to take a heart from another player
    handler.command = /^(takeheart|اخذقلب) @(.*)$/i;
    handler.command = async function (m, { conn, text }) {
        if (roundInProgress && players[m.sender]) {
            let mentioned = m.mentionedIds[0];
            if (players[mentioned]) {
                players[mentioned]--;
                if (players[mentioned] === 0) {
                    delete players[mentioned]; // Remove player if they have no hearts left
                }
                players[m.sender]++;
                await conn.reply(m.chat, "You took a heart from the mentioned player!", m);
            } else {
                await conn.reply(m.chat, "The mentioned player is not in the game or has no hearts left.", m);
            }
        }
    };

    // Function to end the game
    handler.command = /^(end|انهاء)$/i;
    handler.command = async function (m) {
        if (roundInProgress) {
            let leaderboardMsg = await generateLeaderboard();
            await conn.reply(m.chat, "Ending the game...", m);
            await conn.reply(m.chat, leaderboardMsg, m);
            resetGame(); // Reset the game state
        }
    };

    // Function to normalize a string (remove whitespace, convert to lowercase, etc.)
    function normalize(str) {
        return str.replace(/\s/g, '').toLowerCase(); // Remove whitespace and convert to lowercase
    }

    return true; // Message handled
};

export default handler;
