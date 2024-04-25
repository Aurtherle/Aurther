let handler = async (m, { conn }) => {
  conn.tebaklaguo = conn.tebaklaguo ? conn.tebaklaguo : {}
  let id = m.chat
  if (!(id in conn.tebaklaguo)) throw false
  let json = conn.tebaklaguo[id][1]
  conn.reply(m.chat, '```' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /اجابه$/i



export default handler
