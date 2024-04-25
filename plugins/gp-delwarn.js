
let handler = async (m, { conn, args, groupMetadata}) => {
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        if (!who) throw `منشن شخص`
        if (!(who in global.db.data.users)) throw `المستخدم غير موجود ف قاعدة البيانات`
       let warn = global.db.data.users[who].warn
       if (warn > 0) {
         global.db.data.users[who].warn -= 1
         m.reply(`
*❃ ──────⊰ ❀ ⊱────── ❃*
        ⚠️ *حذف إنذار* ⚠️
*❃ ──────⊰ ❀ ⊱────── ❃*         
◍ الأنذار : *-1*
◍ إجمالي الإنذارات: *${warn - 1}*`)
         m.reply(`لقد تم ازالة إنذار منك الإنذارات المتبقية *${warn - 1}*
*❃ ──────⊰ ❀ ⊱────── ❃*`, who)
         } else if (warn == 0) {
            m.reply('لا توجد عليه انذارات')
        }

}
handler.help = ['delwarn @user']
handler.tags = ['group']
handler.command = ['حذف_انذار', 'unwarn'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler