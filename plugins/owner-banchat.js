//import db from '../lib/database.js'

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return dfail('owner', m, conn)
    global.db.data.chats[m.chat].isBanned = true
    m.reply('*تم*')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = ['ايقاف', 'chatoff'] 

export default handler
