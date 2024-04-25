import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*وش تبي ارسم لك ؟*`;

  try {
    m.reply('*اصبر ثواني...*');

    const endpoint = `https://gurugpt.cyclic.app/dalle?prompt=${encodeURIComponent(text)}`;
    const response = await fetch(endpoint);
    
    if (response.ok) {
      const imageBuffer = await response.buffer();
      await conn.sendFile(m.chat, imageBuffer, 'image.png', null, m);
    } else {
      throw '*فشلت العملية*';
    }
  } catch {
    throw '*حدث خطأ حاول مجددا*';
  }
};

handler.help = ['dalle'];
handler.tags = ['AI'];
handler.command = ['ارسم'];
export default handler;
