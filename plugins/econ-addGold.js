let handler = async (m, { conn, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'منشن الشخص'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (!txt) throw 'اكتب الكمية'
    if (isNaN(txt)) throw '🔢 ارقام فقط'
    let dmt = parseInt(txt)
    let diamond = dmt
    
    if (diamond < 1) throw 'اقل شيء *1*'
    let users = global.db.data.users
   users[who].credit += dmt

    await m.reply(`≡ *تمت*
┌──────────────
▢ *الإجمالي:* ${dmt}
└──────────────`)
   conn.fakeReply(m.chat, `▢ لقد استلمت \n\n *+${dmt}* عمله`, who, m.text)
}

handler.help = ['addgold <@user>']
handler.tags = ['economy']
handler.command = ['منح'] 
handler.rowner = true

export default handler
