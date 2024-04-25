let handler = async (m, { conn }) => {
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {}
  let id = m.chat
  if (!(id in conn.tebaklagu)) throw false
  let json = conn.tebaklagu[id][1]
  conn.reply(m.chat, '```' + json.name.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /اجابه$/i



export default handler