const xppercredit = 1
let handler = async (m, { conn, command, args }) => {
    let count = command.replace(/^(سحب|withdraw)/i, '')
    count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].bank / xppercredit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
    count = Math.max(1, count)
    if (global.db.data.users[m.sender].bank >= xppercredit * count) {
      global.db.data.users[m.sender].bank -= xppercredit * count
      global.db.data.users[m.sender].credit += count
      conn.reply(m.chat, `*تم سحب 🪙* *${count}* *بيلي الى محفظتك*`, m)
    } else conn.reply(m.chat, `*ليس لديك بيلي كافي ف البنك لإجراء هذه المعاملة*`, m)
  }
  handler.help = ['withdraw']
  handler.tags = ['economy']
  handler.command = ['سحب'] 
  
  handler.disabled = false
  
  export default handler
