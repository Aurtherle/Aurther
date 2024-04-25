let handler = async (m, { conn }) => {
  conn.tokati = conn.tokati ? conn.tokati : {}
  let id = m.chat
  if (!(id in conn.tokati)) throw false
  let json = conn.tokati[id][1]
  conn.reply(m.chat, '```' + json.response.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /اجابه$/i



export default handler