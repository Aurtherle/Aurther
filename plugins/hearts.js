import { createRequire } from 'module';
import fetch from 'node-fetch';
const require = createRequire(import.meta.url);
import similarity from 'similarity';

const threshold = 0.72;
let currentItemIndex = 0;
let answered = false;
let currentItem;
let shuffledData = [];
let count = 3; // Number of questions

// تهيئة حالة اللعبة
let قلوب = {
  isActive: false,
  players: {},
  الاصابه: 5,
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎'],
  gameStarter: null,
  timer: null,
  playerPoints: {},
  questionsRemaining: count // Number of questions
};

// جلب البيانات من ملف JSON
const fetchData = async () => {
  const response = await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
  const data = await response.json();
  return data;
};

// إرسال سؤال جديد
const sendNewQuestion = async (conn, m) => {
  if (قلوب.questionsRemaining <= 0) {
    let leaderboardMsg = await generateLeaderboard();
    await conn.reply(m.chat, leaderboardMsg, m);
    قلوب.isActive = false;
    if (قلوب.timer) clearTimeout(قلوب.timer);
    return;
  }

  currentItem = shuffledData[currentItemIndex];
  let clue = currentItem.name; // Use the name as the clue (answer)
  currentItem.name = currentItem.name.replace(/\s/g, ''); // Remove white spaces from name
  let caption = `*${clue}*`; // Construct caption with the game clue
  await conn.reply(m.chat, caption, m); // Send the game clue

  answered = false;

  قلوب.timer = setTimeout(() => {
    if (!answered) {
      currentItemIndex++;
      قلوب.questionsRemaining--;
      sendNewQuestion(conn, m);
    }
  }, 30000);
};

const generateLeaderboard = async () => {
  let leaderboard = '*Leaderboard*\n\n';
  let sortedPlayers = Object.keys(قلوب.playerPoints).sort((a, b) => قلوب.playerPoints[b] - قلوب.playerPoints[a]);
  sortedPlayers.forEach(player => {
    leaderboard += `@${player}: ${قلوب.playerPoints[player]} points\n`;
  });
  return leaderboard;
};

const handler = async (m, { conn, command, text, isAdmin }) => {
  switch (command) {
    case 'قلوب':
      if (!قلوب.isActive) {
        قلوب.isActive = true;
        قلوب.players = {};
        قلوب.gameStarter = m.sender.split('@')[0];
        قلوب.questionsRemaining = count; // Number of questions

        let data = await fetchData();
        shuffledData = data.sort(() => 0.5 - Math.random()); // Shuffle the data

        m.reply(`𒄟 ❰لـقـد بـدأت اللعـبة❱\n> ١. قم بالرد على هذه الرسالة لبدء المشاركة في اللعبة والحصول على 5 قلوب.\n> ٢. استخدم (.انقاص) لتقليل قلوب أحد اللاعبين عند الرد على رسالته.\n> ٣. اكتب (.نتيجه) لعرض قائمة اللاعبين وحالة قلوبهم.\n> ٤. اكتب (.انتهاء) لإنهاء اللعبة.\n\n> سيتم طرح 3 أسئلة.`);
      } else {
        m.reply('> اللعبة شغالة حالياً');
      }
      break;
    case 'مشاركة':
      if (!قلوب.isActive) {
        m.reply('> لا توجد لعبة نشطة حالياً.');
        return;
      }
      let newPlayer = m.sender.split('@')[0];
      if (!قلوب.players[newPlayer]) {
        let playerCount = Object.keys(قلوب.players).length;
        قلوب.players[newPlayer] = { hearts: قلوب.الاصابه, icon: قلوب.hearts[playerCount % قلوب.hearts.length], points: 0 };
        قلوب.playerPoints[newPlayer] = 0;
        m.reply(`تمت إضافة ${قلوب.الاصابه} قلوب للاعب @${newPlayer} ${قلوب.players[newPlayer].icon}`);
      } else {
        m.reply(`@${newPlayer} مشارك بالفعل.`);
      }
      break;
    case 'بدأ':
      if (!قلوب.isActive) {
        m.reply('> لا توجد لعبة نشطة حالياً.');
        return;
      }
      if (!isAdmin) {
        m.reply('> فقط المشرف يمكنه بدء اللعبة.');
        return;
      }
      if (Object.keys(قلوب.players).length < 2) {
        m.reply('> تعذر بدء اللعبة، عدد اللاعبين أقل من 2.');
        return;
      }
      m.reply('> اللعبة بدأت الآن!');
      sendNewQuestion(conn, m);
      break;
    case 'انقاص':
      if (!قلوب.isActive) {
        m.reply('> لا توجد لعبة نشطة حالياً.');
        return;
      }
      let playerToInject = m.quoted ? m.quoted.sender.split('@')[0] : null;
      let requestingPlayer = m.sender.split('@')[0];
      if (requestingPlayer !== قلوب.gameStarter) {
        m.reply('> فقط الشخص الذي بدأ اللعبة يمكنه إنقاص قلوب اللاعبين.');
        return;
      }
      if (playerToInject && قلوب.players[playerToInject]) {
        قلوب.players[playerToInject].hearts--;
        if (قلوب.players[playerToInject].hearts <= 0) {
          delete قلوب.players[playerToInject];
          delete قلوب.playerPoints[playerToInject];
          m.reply(`خصر اللاعب @${playerToInject}`);
        } else {
          m.reply(`تم تقليل قلب واحد من @${playerToInject}. القلوب المتبقية: ${قلوب.players[playerToInject].icon.repeat(قلوب.players[playerToInject].hearts)}`);
        }
        if (Object.keys(قلوب.players).length === 1) {
          let remainingPlayer = Object.keys(قلوب.players)[0];
          m.reply(`اللعبة انتهت! الفائز هو @${remainingPlayer}`);
          قلوب.isActive = false;
          if (قلوب.timer) clearTimeout(قلوب.timer);
        }
      } else {
        m.reply('> منشن المستخدم أو رد على رسالته لتقليل قلبه.');
      }
      break;
    case 'نتيجه':
      if (!قلوب.isActive) {
        m.reply('> لا توجد لعبة نشطة حالياً.');
        return;
      }
      let resultMessage = '*نتائج اللعبة*\n\n*اللاعبين الذين خسروا:*\n';
      let playersWithHeart = '*اللاعبين الذين لا يزال لديهم قلوب:*\n';
      let lostPlayers = [];
      let pointsMessage = '\n*النقاط:*\n';
      for (let player in قلوب.players) {
        pointsMessage += `@${player} - نقاط: ${قلوب.players[player].points}\n`;
        if (قلوب.players[player].hearts > 0) {
          playersWithHeart += `@${player} - قلوب: ${قلوب.players[player].icon.repeat(قلوب.players[player].hearts)}\n`;
        } else {
          lostPlayers.push(`@${player}`);
        }
      }
      resultMessage += lostPlayers.length ? lostPlayers.join('\n') : 'لا يوجد';
      resultMessage += '\n\n' + (Object.keys(قلوب.players).length ? playersWithHeart : 'لا يوجد');
      resultMessage += pointsMessage;
      m.reply(resultMessage);
      break;
    case 'انتهاء':
      if (!قلوب.isActive) {
        m.reply('> لا توجد لعبة نشطة حالياً.');
        return;
      }
      قلوب.isActive = false;
      if (قلوب.timer) clearTimeout(قلوب.timer);
      m.reply('اللعبة انتهت. شكراً للمشاركة!');
      break;
    default:
      m.reply('أمر غير معروف.');
      break;
  }
};

const before = async (m, { conn }) => {
  let id = m.chat;

  if (!قلوب.isActive) return true;

  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text) return true;

  if (!(m.sender.split('@')[0] in قلوب.players)) return true;

  if (قلوب.currentQuestion && m.quoted.id === قلوب.currentQuestion.messageId) {
    let answeringPlayer = m.sender.split('@')[0];
    let correctAnswer = currentItem.name.toLowerCase().trim(); // Use 'name' as the correct answer field
    let playerAnswer = m.text.toLowerCase().trim();

    if (similarity(playerAnswer, correctAnswer) >= threshold) {
      قلوب.players[answeringPlayer].points++;
      قلوب.playerPoints[answeringPlayer]++;
      answered = true;
      m.reply(`إجابة صحيحة! حصلت على نقطة @${answeringPlayer}`);
      currentItemIndex++;
      قلوب.questionsRemaining--;
      sendNewQuestion(conn, m);
    } else {
      if (قلوب.players[answeringPlayer]) {
        قلوب.players[answeringPlayer].hearts--;
        m.reply(`إجابة خاطئة! تم خصم قلب واحد @${answeringPlayer}. القلوب المتبقية: ${قلوب.players[answeringPlayer].icon.repeat(قلوب.players[answeringPlayer].hearts)}`);
        if (قلوب.players[answeringPlayer].hearts <= 0) {
          delete قلوب.players[answeringPlayer];
          delete قلوب.playerPoints[answeringPlayer];
          m.reply(`خصر اللاعب @${answeringPlayer}`);
        }
      }
    }

    if (Object.keys(قلوب.players).length === 1) {
      let remainingPlayer = Object.keys(قلوب.players)[0];
      m.reply(`اللعبة انتهت! الفائز هو @${remainingPlayer}`);
      قلوب.isActive = false;
      if (قلوب.timer) clearTimeout(قلوب.timer);
    }
  }

  return true;
};

handler.command = /^(قلوب|مشاركة|بدأ|انقاص|نتيجه|انتهاء)$/i;
handler.botAdmin = true;

export default handler;
export { before };
