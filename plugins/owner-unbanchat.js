//import db from '../lib/database.js'

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return dfail('owner', m, conn)
    global.db.data.chats[m.chat].isBanned = false
    m.reply('✅ تمت')   
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = ['تشغيل', 'unbanchat'] 

export default handler
