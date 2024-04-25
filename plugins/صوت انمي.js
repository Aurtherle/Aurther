import fetch from 'node-fetch';
import axios from 'axios';
const timeout = 60000;
const poin = 1000;
const handler = async (m, {conn, usedPrefix}) => {
  conn.tebaklaguo = conn.tebaklaguo ? conn.tebaklaguo : {};
  const id = m.chat;
  if (id in conn.tebaklaguo) {
    conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', conn.tebaklaguo[id][0]);
    throw false;
  } // 5LTV57azwaid7dXfz5fzJu
  const res = await fetchJson(`https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/CharSound.json`);
  const json = res[Math.floor(Math.random() * res.length)];
  const caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*صوت من ؟؟*\n
  *الوقت :* *${(timeout / 1000).toFixed(2)}* *ثانية*
   *الجائزة :* *${poin}* *بيلي*
   رد الجواب على ذي الرسالة
*❃ ──────⊰ ❀ ⊱────── ❃*`.trim();
  conn.tebaklaguo[id] = [
    await m.reply(caption),
    json, poin,
    setTimeout(() => {
      if (conn.tebaklaguo[id]) conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* *( ${json.jawaban} )*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, conn.tebaklaguo[id][0]);
      delete conn.tebaklaguo[id];
    }, timeout),
  ];
  const aa = await conn.sendMessage(m.chat, {audio: {url: json.link_song}, fileName: `error.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
  if (!aa) return conn.sendFile(m.chat, json.jawaban, 'coba-lagi.mp3', '', m);
};
handler.help = ['tebaklaguo'];
handler.tags = ['game'];
handler.command = /^صوت_ش|canción$/i;
export default handler;
async function fetchJson(url, options) {
  try {
options ? options : {};
const res = await axios({method: 'GET', url: url, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'}, ...options});
return res.data;
  } catch (err) {
    return err;
  }
}
