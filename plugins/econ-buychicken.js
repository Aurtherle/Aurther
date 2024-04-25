let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]


   
    
    if (user.chicken > 0) return m.reply('تمتلك هذه الكمية ب الفعل')
    if (user.credit < 500) return m.reply(`🟥 *ليس لديك المبلغ الكافي في محفظتك*`)

    user.credit -= 1000
    user.chicken += 1
    m.reply(`🎉 لقد اشتريت الدجاج بنجاح اكتب .قتال ثم الكمية لتقاتل`)
}

handler.help = ['buych']
handler.tags = ['economy']
handler.command = ['دجاج'] 

handler.group = true

export default handler
