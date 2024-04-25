let groupInfoHandler = async function (m, { conn }) {
  try {
    let groupInfo = await conn.groupMetadata(m.chat);

    if (!groupInfo) {
      return m.reply('حدث خطأ في الحصول على معلومات المجموعة.');
    }

    let groupId = m.chat; // Group ID is the same as the chat ID in WhatsApp
    let groupName = groupInfo.subject;
    let groupDescription = groupInfo.desc || 'لا يوجد وصف للمجموعة.';
    let groupMembersCount = groupInfo.participants.length;

    let groupInfoText = `*معلومات المجموعة:*\n\n`;
    groupInfoText += `◍ *أيدي المجموعة:* ${groupId}\n`;
    groupInfoText += `◍ *اسم المجموعة:* ${groupName}\n`;
    groupInfoText += `◍ *وصف المجموعة:* ${groupDescription}\n`;
    groupInfoText += `◍ *عدد الأعضاء:* ${groupMembersCount}\n`;

    conn.reply(m.chat, groupInfoText.trim(), m);
  } catch (error) {
    console.error(error);
    m.reply('حدث خطأ أثناء جلب معلومات المجموعة.');
  }
};

groupInfoHandler.help = ['معلومات'];
groupInfoHandler.tags = ['معلومات', 'المجموعة'];
groupInfoHandler.command = ['معلومات', 'معلوماتي'];
groupInfoHandler.group = true;
groupInfoHandler.admin = false;
groupInfoHandler.botAdmin = false;
groupInfoHandler.fail = null;

export default groupInfoHandler;
