let handler = async (m, { conn, isROwner, text }) => {
  const delay = time => new Promise(res => setTimeout(res, time));
  let targetGroups = ['120363210933523608@g.us']; // Add your specific group IDs here
  var pesan = m.quoted && m.quoted.text ? m.quoted.text : text;
  if (!pesan) throw '*اكتب الرسالة الي تبي تعلنها*';

  for (let groupId of targetGroups) {
      await delay(500);
      conn.sendMessage(groupId, {
          text: pesan
      }, 'conversation', { quoted: m });
  }

  m.reply(`*تم اعلانها*`);
}

handler.help = ['broadcastgroup', 'bcgc'].map(v => v + ' <text>');
handler.tags = ['owner'];
handler.command = /^(اعلان)$/i;
handler.group = true;
handler.owner = true;
handler.botAdmin = true;
export default handler;