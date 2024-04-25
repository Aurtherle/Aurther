import fetch from 'node-fetch';
import { translate } from '@vitalets/google-translate-api';

const handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://some-random-api.com/animu/quote');
    if (!res.ok) throw await res.text();
    const json = await res.json();
    const { sentence, character, anime } = json;

    // Translate fetched data to Arabic
    const translatedSentence = await translate(sentence, { to: 'ar' });

    const message = `
    *❃ ──────⊰ ❀ ⊱────── ❃*\n
    ◍ *المقولة :*\n${translatedSentence.text}\n
    ◍ *الشخصية :* \`\`\`${character}\`\`\`\n
    ◍ *الأنمي :* \`\`\`${anime}\`\`\`\n
    *❃ ──────⊰ ❀ ⊱────── ❃*
    `;
    conn.sendMessage(m.chat, { text: message }, 'extendedTextMessage', { quoted: m });
  } catch (error) {
    console.error(error);
  }
};

handler.help = ['animequote'];
handler.tags = ['group'];
handler.command = /^(مقولة)$/i;

export default handler;
