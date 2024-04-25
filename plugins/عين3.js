let handler = async (m, { conn }) => {
  conn.tokitoki = conn.tokitoki ? conn.tokitoki : {}
  let id = m.chat
  if (!(id in conn.tokitoki)) throw false
  let json = conn.tokitoki[id][1]
  conn.reply(m.chat, '```' + json.name.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /اجابه$/i



export default handler