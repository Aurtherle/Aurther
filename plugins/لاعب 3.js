let handler = async (m, { conn }) => {
  conn.lokaibo = conn.lokaibo ? conn.lokaibo : {}
  let id = m.chat
  if (!(id in conn.lokaibo)) throw false
  let json = conn.lokaibo[id][1]
  conn.reply(m.chat, '```' + json.name.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /اجابه$/i



export default handler