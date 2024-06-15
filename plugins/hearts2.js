import axios from 'axios';

let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat];
    let players = {}; // Object to track players and their hearts
    let photos = [
        {
            url: 'https://telegra.ph/file/ae2912d507d8835e41e9a.jpg',
            answer: 'moz'
        },
        {
            url: 'https://telegra.ph/file/a0a5f819f872e3920adc6.jpg',
            answer: 'nez'
        },
        // Add more photos with their answers here
    ];

    // Function to start the game
    async function startGame() {
        chat.gameStatus = 'ongoing'; // Set game status to ongoing
        await conn.reply(m.chat, 'لعبة تخمين الأنمي ستبدأ الآن!', m);
        await conn.reply(m.chat, 'يمكن للأعضاء الانضمام بإرسال "انضم" في أي وقت.', m);
        setTimeout(sendPhoto, 3000); // Start sending photos after 3 seconds
    }

    // Function to send a random anime photo for guessing
    async function sendPhoto() {
        if (chat.gameStatus !== 'ongoing') return;

        let photoIndex = Math.floor(Math.random() * photos.length);
        let photo = photos[photoIndex];
        
        // Send the anime photo
        await conn.sendFile(m.chat, photo.url, 'anime-photo.jpg', `تخمين الأنمي: من هو الشخص في هذه الصورة؟`, m);

        // Set a timeout for answering
        setTimeout(() => {
            if (chat.gameStatus === 'ongoing') {
                conn.reply(m.chat, `الوقت انتهى! الإجابة الصحيحة هي: *${photo.answer}*`, m);
                sendPhoto(); // Send the next photo
            }
        }, 20000); // 20 seconds timeout for answering
    }

    // Command to join the game
    handler.join = async function (m) {
        let user = m.sender;
        if (players[user]) {
            await conn.reply(m.chat, 'أنت بالفعل في اللعبة.', m);
        } else {
            players[user] = 5; // Give the player 5 hearts
            await conn.reply(m.chat, 'أنت الآن في اللعبة! لديك 5 قلوب.', m);
        }
    };

    // Command to answer the photo
    handler.answer = async function (m) {
        let user = m.sender;
        let message = m.text.trim();
        let photo = photos.find(p => p.url === message);
        
        if (!photo) return; // If message is not a valid photo URL

        if (photo.answer.toLowerCase() === message.toLowerCase()) {
            // Correct answer logic
            let others = Object.keys(players).filter(p => p !== user); // Get other players
            if (others.length > 0) {
                let targetPlayer = others[Math.floor(Math.random() * others.length)];
                players[targetPlayer]--; // Decrease one heart from a random player
                await conn.reply(m.chat, `أجاب ${user} بشكل صحيح! ${targetPlayer} يفقد قلبًا.`, m);
            }
        } else {
            // Incorrect answer logic (for future enhancements if needed)
            // Currently not handling incorrect answers explicitly
        }
    };

    // Command to start the game
    handler.command = /^(ابدأ|بداية|قلوب)$/i;
    handler.all = async function (m) {
        if (m.text.match(handler.command)) {
            if (chat.gameStatus !== 'ongoing') {
                await startGame(); // Start the game if not ongoing
            } else {
                await conn.reply(m.chat, 'اللعبة بالفعل قيد التشغيل.', m);
            }
        }
    };

    return true; // Message handled
};

export default handler;
