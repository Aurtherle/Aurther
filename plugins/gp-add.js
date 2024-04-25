let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let specificGroupId1 = "120363190165247248@g.us"; // Replace "SPECIFIC_GROUP_ID_1" with the ID of the first group
  let specificGroupId2 = "120363210933523608@g.us"; // Replace "SPECIFIC_GROUP_ID_2" with the ID of the second group

  if (!m.chat.endsWith('@g.us')) { // Checking if the message is not from a group
      m.reply('This command can only be used in groups.');
      return;
  }

  let add = `*منشن الشخص*`

  if (!m.mentionedJid[0] && !m.quoted) {
      m.reply(add, m.chat, { mentions: conn.parseMention(add)});
      return; // Added return here to terminate the function if no users are mentioned
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  try {
      await conn.groupParticipantsUpdate(specificGroupId1, [user], "add"); // Adding mentioned users to the first specific group
      await conn.groupParticipantsUpdate(specificGroupId2, [user], "add"); // Adding mentioned users to the second specific group
      m.reply('تمت اضافته الى الاعلانات والجروب الأساسي');

      // Send welcome message to the first specified group
      conn.sendMessage(specificGroupId1, "Welcome to the group!"); // You can customize the welcome message here

      // Send welcome message to the second specified group
      conn.sendMessage(specificGroupId2, "Welcome to the group!"); // You can customize the welcome message here
  } catch (error) {
      console.error(error);
      m.reply('فشل قم ب اضافته بنفسك');
  }
}

handler.command = ['اضافه' ,'اضافة'];
handler.group = true;

export default handler;
