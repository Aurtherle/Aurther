import axios from 'axios';

let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat];
    let players = {}; // Object to track players and their hearts
    let photos = [
        {
            url: 'https://example.com/photo1.jpg',
            answer: 'Anime 1'
        },
        {
            url: 'https://example.com/photo2.jpg',
            answer: 'Anime 2'
        },
        // Add more photos with their answers here
    ];

    // Function to start the game
    async function startGame() {
        await conn.reply(m.chat, 'لعبة تخمين الأنمي ستبدأ قريبًا! انتظر قليلاً للانضمام.', m);
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
        if (chat.gameStatus !== 'ongoing') {
            await conn.reply(m.chat, 'اللعبة لم تبدأ بعد.', m);
            return;
        }
        
        let user = m.sender;
        if (!players[user]) {
            players[user] = 5; // Give the player 5 hearts
            await conn.reply(m.chat, 'أنت الآن في اللعبة! لديك 5 قلوب.', m);
        } else {
            await conn.reply(m.chat, 'أنت بالفعل في اللعبة.', m);
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

    // Start the game upon command trigger
    handler.command = /^(قلوب|العب|ابدأ)$/i;
    handler.all = async function (m) {
        if (m.text.match(handler.command)) {
            if (chat.gameStatus === 'ongoing') {
                await conn.reply(m.chat, 'اللعبة بالفعل قيد التشغيل.', m);
            } else {
                chat.gameStatus = 'ongoing';
                await conn.reply(m.chat, 'اللعبة قد بدأت!', m);
                startGame(); // Start the game
            }
        }
    };

    return true; // Message handled
};

export default handler;
