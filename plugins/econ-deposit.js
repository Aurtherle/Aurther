const xpperbank = 1
let handler = async (m, { conn, command, args }) => {
    let count = command.replace(/^(ايداع|إيداع)$/i, '')
    count = count ? /depall/i.test(count) ? Math.floor(global.db.data.users[m.sender].credit / xpperbank) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
    count = Math.max(1, count)
    if (global.db.data.users[m.sender].credit >= xpperbank * count) {
      global.db.data.users[m.sender].credit -= xpperbank * count
      global.db.data.users[m.sender].bank += count
      conn.reply(m.chat, `*تم إيداع* 🪙 ${count} *إلى حسابك*`, m)
    } else conn.reply(m.chat, `🟥 *رصيدك غير كافي*`, m)
  }
  handler.help = ['deposit']
  handler.tags = ['economy']
  handler.command = ['إيداع', 'ايداع', 'وديعه'] 
  
  handler.disabled = false
  
  export default handler
  