let handler = async (m, { conn, command, text }) => {
let love = `
نسبة حب ${text} لك هي ${Math.floor(Math.random() * 100)}%
اطلب منه ان يصبح صديقك
`.trim()
m.reply(love, null, { mentions: conn.parseMention(love) })}
handler.help = ['love']
handler.tags = ['fun']
handler.command = /^(نسبه|نسبة)$/i
export default handler
