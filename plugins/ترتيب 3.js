let handler = async (m, { conn }) => {
  conn.koplart = conn.koplart ? conn.koplart : {}
  let id = m.chat
  if (!(id in conn.koplart)) throw false
  let json = conn.koplart[id][1]
  conn.reply(m.chat, '```' + json.response.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /اجابه$/i



export default handler