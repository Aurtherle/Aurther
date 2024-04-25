//import db from '../lib/database.js'

let handler = async (m, { text, usedPrefix, command }) => {
    global.db.data.sticker = global.db.data.sticker || {}
    if (!m.quoted) throw `منشن رسالة بـ *${usedPrefix + command}*`
    if (!m.quoted.fileSha256) throw 'منشن ذي الرسالة'
    if (!text) throw `الأمر مفقود`
    let sticker = global.db.data.sticker
    let hash = m.quoted.fileSha256.toString('base64')
    if (sticker[hash] && sticker[hash].locked) throw 'ليست لديك الصلاحية'
    sticker[hash] = {
        text,
        mentionedJid: m.mentionedJid,
        creator: m.sender,
        at: + new Date,
        locked: false,
    }
    m.reply(`✅ تم حفظ الأمر`)
}


handler.help = ['cmd'].map(v => 'set' + v + ' <txt>')
handler.tags = ['cmd']
handler.command = ['أضافة_أمر']
handler.rowner = true

export default handler
