const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `*عندك شكوى او اقتراح ؟!*`;
  if (text.length < 10) throw `*وضح اكثر*`;
  if (text.length > 1000) throw `*شكوى هي مب رواية*`;

  const userNumber = `wa.me/${m.sender.split`@`[0]}`;
  const userMessage = `*شكوى مجهولة :*\n\n *${text}*`;

  // Constructing message for the developer
  const developerMessage = `*❃ ──────⊰ ❀ ⊱────── ❃*\n ${userNumber} \n${userMessage}\n\n *❃ ──────⊰ ❀ ⊱────── ❃*`;

  // Constructing message for the specified group
  const groupMessage = `*❃ ──────⊰ ❀ ⊱────── ❃*\n\n${userMessage}\n\n *❃ ──────⊰ ❀ ⊱────── ❃*`;

  // Send to the developer
  conn.reply('212684151146@s.whatsapp.net', developerMessage, null, {contextInfo: {mentionedJid: [m.sender]}});

  // Send to the specified group
  conn.reply('120363210655334340@g.us', groupMessage, null, {contextInfo: {mentionedJid: [m.sender]}});

  m.reply(`*تم ارسالها وتأكد اذا كانت استهبال بتتبند من البوت*`);
};
handler.help = ['reporte', 'request'].map((v) => v + ' <teks>');
handler.tags = ['info'];
handler.command = /^(شكوى|اقتراح|شكوه|تقييم)$/i;
export default handler;
