let handler = async (m, { conn }) => {
  conn.bikolati = conn.bikolati ? conn.bikolati : {}
  let id = m.chat
  if (!(id in conn.bikolati)) throw false
  let json = conn.bikolati[id][1]
  conn.reply(m.chat, '```' + json.response.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /اجابه$/i



export default handler