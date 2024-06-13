import { createRequire } from 'module';
import fetch from 'node-fetch';
import similarity from 'similarity';

const require = createRequire(import.meta.url);
const fs = require('fs');

const threshold = 0.72;

// Initialize game state
let قلوب = {
  isActive: false,
  players: {},
  الاصابه: 5,
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎'],
  gameStarter: null,
  currentQuestion: null,
  timer: null,
  playerPoints: {},
  questionsRemaining: 3 // Number of questions
};

// Fetch data from JSON
const fetchData = async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/guessanime.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// Helper function to create a response
let توثيق = (m) => {
  return {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }
};

// Send new question
let sendNewQuestion = async (conn, m) => {
  if (قلوب.questionsRemaining <= 0) {
    m.reply('> انتهت اللعبة! شكراً للمشاركة.');
    قلوب.isActive = false;
    if (قلوب.timer) clearTimeout(قلوب.timer);
    return;
  }

  let acertijoData = await fetchData();
  قلوب.currentQuestion = acertijoData[Math.floor(Math.random() * acertijoData.length)];
  let message = await conn.sendMessage(m.chat, { image: { url: قلوب.currentQuestion.img }, caption: 'سؤال جديد!' });
  قلوب.questionsRemaining--;

  قلوب.currentQuestion.messageId = message.key.id; // Save message ID
  if (قلوب.timer) clearTimeout(قلوب.timer);
  قلوب.timer = setTimeout(() => sendNewQuestion(conn, m), 30000);
};

let handler = async (m, { conn, command, text, isAdmin }) => {
  switch (command) {
    case 'قلوب':
      if (!قلوب.isActive) {
        قلوب.isActive = true;
        قلوب.players = {};
        قلوب.gameStarter = m.sender.split('@')[0];
        قلوب.questionsRemaining = 3; // Number of questions
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

  // Check if the game is active
  if (!قلوب.isActive) return true;

  // Check if the quoted message is from the bot
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text) return true;

  // Check if the player is part of the game
  if (!(m.sender.split('@')[0] in قلوب.players)) return true;

  // Check if the quoted message is the correct one
  if (قلوب.currentQuestion && m.quoted.id === قلوب.currentQuestion.messageId) {
    let answeringPlayer = m.sender.split('@')[0];
    let correctAnswer = قلوب.currentQuestion.name.toLowerCase().trim(); // Use 'name' as the correct answer field
    let playerAnswer = m.text.toLowerCase().trim();

    // Check if the answer is correct
    if (similarity(playerAnswer, correctAnswer) >= threshold) {
      قلوب.players[answeringPlayer].points++;
      m.reply(`إجابة صحيحة! حصلت على نقطة @${answeringPlayer}`);
      sendNewQuestion(conn, m);
    } else {
      // Reduce heart if the answer is incorrect
      if (قلوب.players[answeringPlayer]) {
        قلوب.players[answeringPlayer].hearts--;
        if (قلوب.players[answeringPlayer].hearts <= 0) {
          delete قلوب.players[answeringPlayer];
          m.reply(`خصر اللاعب @${answeringPlayer}`);
        } else {
          m.reply(`إجابة خاطئة! تم تقليل قلب واحد من @${answeringPlayer}. القلوب المتبقية: ${قلوب.players[answeringPlayer].icon.repeat(قلوب.players[answeringPlayer].hearts)}`);
        }
      }
    }

    // Check if there is only one player left
    if (Object.keys(قلوب.players).length === 1) {
      let remainingPlayer = Object.keys(قلوب.players)[0];
      m.reply(`اللعبة انتهت! الفائز هو @${remainingPlayer}`);
      قلوب.isActive = false;
      if (قلوب.timer) clearTimeout(قلوب.timer);
    }
  }

  return true;
};

// Set commands
handler.command = /^(قلوب|مشاركة|بدأ|انقاص|نتيجه|انتهاء)$/i;

handler.botAdmin = true;

export default handler;
