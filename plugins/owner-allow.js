let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        let user = global.db.data.users[who]
        if (!who) throw `منشن يوزر`
    if (global.allowed.includes(who.split`@`[0])) throw 'تم السماح له ب الفعل'
    global.allowed.push(`${who.split`@`[0]}`)
    
    conn.reply(m.chat, ` @${who.split`@`[0]} تم السماح لك ب إستخدام البوت ف الخاص`, m, { mentions: [who] })
    
    }
    handler.help = ['allow <@tag>']
    handler.tags = ['owner']
    handler.command = ['سماح', 'makeallow', 'al'] 
    
    handler.group = true
    handler.rowner = true
    
    export default handler
