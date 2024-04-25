import fg from 'api-dylux';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `*عطني لينك الفيد الي تبي تحمله*`;
  }

  const urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
  if (!urlRegex.test(args[0])) {
    throw '*اللينك مو شغال*';
  }

  m.react(rwait);

  try {
    const result = await fg.fbdl(args[0]);
    const tex = `
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *العنوان :* ${result.title}
*❃ ──────⊰ ❀ ⊱────── ❃*`
    const response = await fetch(result.videoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const videoBuffer = Buffer.from(arrayBuffer);

    conn.sendFile(m.chat, videoBuffer, 'fb.mp4', tex, m);
    m.react(done);
  } catch (error) {
    console.log(error);
    m.reply('*حدث خطأ*');
  }
};

handler.help = ['facebook <url>'];
handler.tags = ['downloader'];
handler.command = /^فيسبوك$/i;
handler.diamond = true;

export default handler;

