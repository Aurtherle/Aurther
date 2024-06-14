import axios from 'axios';

let handler = async (m, { conn, args }) => {
    let players = {}; // Object to store players and their hearts
    let currentRoundPlayers = []; // Array to track players in the current round
    let gameStarted = false; // Flag to track if the game has started
    let joinable = true; // Flag to allow players to join

    // Fetch data from GitHub raw
    async function fetchData() {
        try {
            let response = await axios.get('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return []; // Return an empty array if fetching fails
        }
    }

    // Shuffle an array (Fisher-Yates shuffle algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to send the next question (image)
    async function sendNextQuestion() {
        if (currentRoundPlayers.length === 1) {
            let winner = currentRoundPlayers[0];
            await conn.reply(m.chat, `🎉 الفائز هو ${winner}! 🎉`, m);
            gameStarted = false;
            return;
        }

        let data = await fetchData();
        if (data.length === 0) {
            await conn.reply(m.chat, "❌ لم يتم العثور على بيانات الصور. حاول مرة أخرى لاحقًا.", m);
            gameStarted = false;
            return;
        }

        let shuffledData = shuffleArray(data);
        let currentItem = shuffledData[0];
        let imgUrl = currentItem.img;
        let correctAnswer = currentItem.name;

        await conn.sendFile(m.chat, imgUrl, 'image.jpg', `من هو هذا الشخص؟`, m);

        // Schedule timeout for current question
        setTimeout(async () => {
            if (currentRoundPlayers.length > 1) {
                await conn.reply(m.chat, `😔 لم يتم الإجابة بشكل صحيح. الجواب الصحيح هو: ${correctAnswer}`, m);
                sendNextQuestion();
            }
        }, 10000); // 10 seconds timeout
    }

    // Function to handle messages
    handler.all = async function (m) {
        let user = m.sender;
        let message = m.text.trim();

        if (gameStarted && currentRoundPlayers.includes(user)) {
            let data = await fetchData();
            if (data.length === 0) return;

            let currentItem = data[0];
            let correctAnswer = currentItem.name;

            if (message === correctAnswer) {
                let playersExceptCurrent = currentRoundPlayers.filter(p => p !== user);
                if (playersExceptCurrent.length > 0) {
                    await conn.reply(m.chat, `👍 إجابة صحيحة! اختر لاعبًا ليمحو قلبه: ${playersExceptCurrent.join(', ')}`, m);
                    return;
                } else {
                    await conn.reply(m.chat, `🎉 الفائز هو ${user}! 🎉`, m);
                    gameStarted = false;
                    return;
                }
            }
        }
    };

    // Command to join the game
    handler.command = /^(join|الانضمام)$/i;
    handler.join = async function (m, { conn }) {
        if (!gameStarted && joinable) {
            let user = m.sender;
            if (!(user in players)) {
                players[user] = 5; // Give the player 5 hearts initially
                currentRoundPlayers.push(user);
                await conn.reply(m.chat, `✅ تم الانضمام إلى اللعبة!`, m);
            } else {
                await conn.reply(m.chat, `ℹ️ أنت بالفعل مشترك في اللعبة.`, m);
            }
        }
    };

    // Command to start the game
    handler.command = /^(start|بداية)$/i;
    handler.start = async function (m, { conn }) {
        if (!gameStarted && joinable && currentRoundPlayers.length > 1) {
            gameStarted = true;
            await conn.reply(m.chat, `🎮 تم بدأ اللعبة! انتظر حتى يتم إرسال صورة...`, m);
            sendNextQuestion();
        } else {
            await conn.reply(m.chat, `❌ لا يمكن بدأ اللعبة الآن. تأكد من أن هناك مشاركين كافيين وأن اللعبة غير مبدأة بالفعل.`, m);
        }
    };

    // Command to end the game
    handler.command = /^(end|نهاية)$/i;
    handler.end = async function (m, { conn }) {
        if (gameStarted) {
            await conn.reply(m.chat, `❌ تم إنهاء اللعبة بواسطة الإداري.`, m);
            gameStarted = false;
        } else {
            await conn.reply(m.chat, `ℹ️ لا يمكن إنهاء اللعبة في الوقت الحالي.`, m);
        }
    };

    // Command to take a heart from another player
    handler.command = /^(takeheart|أخذ_قلب) (.*)$/i;
    handler.takeheart = async function (m, { conn, args }) {
        let targetPlayer = args[1];
        let user = m.sender;

        if (!gameStarted || !currentRoundPlayers.includes(user)) {
            await conn.reply(m.chat, `❌ لا يمكنك استخدام هذا الأمر الآن.`, m);
            return;
        }

        if (!(targetPlayer in players)) {
            await conn.reply(m.chat, `❌ لا يمكن العثور على اللاعب المستهدف.`, m);
            return;
        }

        if (targetPlayer === user) {
            await conn.reply(m.chat, `❌ لا يمكنك إزالة قلب من نفسك.`, m);
            return;
        }

        if (players[user] <= 0) {
            await conn.reply(m.chat, `❌ ليس لديك قلوب للإزالة.`, m);
            return;
        }

        players[targetPlayer] = Math.max(players[targetPlayer] - 1, 0);
        await conn.reply(m.chat, `✅ تم حذف قلب واحد من ${targetPlayer}.`, m);
    };

    // Command to start the joining process
    handler.command = /^(hearts|قلوب)$/i;
    handler.hearts = async function (m, { conn }) {
        if (!gameStarted && joinable) {
            let user = m.sender;
            if (!(user in players)) {
                players[user] = 5; // Give the player 5 hearts initially
                currentRoundPlayers.push(user);
                await conn.reply(m.chat, `✅ تم الانضمام إلى اللعبة!`, m);
            } else {
                await conn.reply(m.chat, `ℹ️ أنت بالفعل مشترك في اللعبة.`, m);
            }
        }
    };

    return true; // Message handled
};

export default handler;
