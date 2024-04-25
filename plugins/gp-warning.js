
let war = global.maxwarn
let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        if (!who) throw `منشن يوزر`
        if (!(who in global.db.data.users)) throw `المستخدم غير موجود ف قاعدة بياناتي`
        let name = conn.getName(m.sender)
        let warn = global.db.data.users[who].warn
        if (warn < war) {
            global.db.data.users[who].warn += 1
            m.reply(`
*❃ ──────⊰ ❀ ⊱────── ❃*
        ⚠️ *بطاقة انذار* ⚠️
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *المشرف :* ${name}
◍ *اليوزر :* @${who.split`@`[0]}
◍ *الأنذارات :* ${warn + 1}/${war}
◍ *السبب :* ${text}
*❃ ──────⊰ ❀ ⊱────── ❃*`, null, { mentions: [who] }) 
            m.reply(`
⚠️ *تنبيه* ⚠️
لقد تلقيت انذار من مشرف

◍ *الأنذارات :* ${warn + 1}/${war} 
اذا تلقيت *${war}* إنذارات ف سوف تنطرد تلقائيا`, who)
        } else if (warn == war) {
            global.db.data.users[who].warn = 0
            m.reply(`⛔ المستخدم بلغ *${war}* أي العدد الأقصى المسموح به سوف يتم ازالته`)
            await time(3000)
            await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
            m.reply(`♻️ تم طردك من *${groupMetadata.subject}* بسبب تلقيك العدد الأقصى من الانذارات*${war}* انذارات`, who)
        }
}
handler.help = ['warn @user']
handler.tags = ['group']
handler.command = ['انذار'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }