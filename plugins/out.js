const handler = async (message, { conn, text, command }) => {
  const id = text ? text : message.chat;
  await conn.reply(id, '*تست معسلامه*');
  await conn.groupLeave(id);
};
handler.command = /^(اطلع|برا|leave|exitgroup)$/i;
handler.group = true;
handler.rowner = true;
export default handler;
