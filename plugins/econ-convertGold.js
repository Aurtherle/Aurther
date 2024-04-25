
const xppercredit = 350 
let handler = async (m, { conn, command, args }) => {
  let count = command.replace(/^buy/i, '')
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xppercredit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (global.db.data.users[m.sender].exp >= xppercredit * count) {
    global.db.data.users[m.sender].exp -= xppercredit * count
    global.db.data.users[m.sender].credit += count
    conn.reply(m.chat, `
*❃ ──────⊰ ❀ ⊱────── ❃*
‣ *العملات الي تم شرائها* : + ${count} 
‣ *التكلفة* : -${xppercredit * count} خبرة
*❃ ──────⊰ ❀ ⊱────── ❃*`, m)
  } else conn.reply(m.chat, `ليس لديك *خبرة* كافية لتشتري*${count}* بيلي\n\n تستطيع الحصول على  *الخبرة* عن طريق استخدام *الأوامر والألعاب والسوالف ف الجروب*`, m)
}
handler.help = ['buy', 'buyall']
handler.tags = ['economy']
handler.command = ['شراء', 'buyall'] 

handler.disabled = false

export default handler
