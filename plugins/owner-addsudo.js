let handler = async (m, { conn, text }) => {
  let who;
  if (m.isGroup) {
      who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;
  } else {
      who = m.chat;
  }
  if (!who) throw '*منشن شخص*';
  if (global.owner.includes(who.split('@')[0])) throw 'لقد أصبح مشرفا ب الفعل !';
  global.owner.push([who.split('@')[0], m.name, true]);
  const caption = `*مبروك @${who.split('@')[0]} لقد أصبحت مشرفا*`;
  await conn.reply(m.chat, caption, m, {
      mentions: conn.parseMention(caption)
  });
}
handler.help = ['sudo @user']
handler.tags = ['owner']
handler.command = /^مشرف/i;
handler.admin = true
handler.group = true

export default handler;
