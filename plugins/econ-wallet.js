let handler = async (m, {conn, usedPrefix}) => {

	let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[who]

    let username = conn.getName(who)
    if (!(who in global.db.data.users)) throw `🟨 هذا المستخدم غير موجود ف قاعدة بياناتي`
    conn.reply(m.chat, `👛 *محفظة | ${username}*

🪙 *الرصيد :*  ${user.credit} *بيلي*
`, m, { mentions: [who] })
}
handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['محفظة', 'محفظه'] 

export default handler
