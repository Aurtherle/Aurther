const free = 100000
const prem = 5000000

let handler = async (m, {conn, isPrems }) => {
  if (global.db.data.users[m.sender].claimed) throw '*خذيت عيديتك خلاص*'
  global.db.data.users[m.sender].credit += isPrems ? prem : free
  m.reply(`*تم وصلتك العيدية للمحفظة`)
  global.db.data.users[m.sender].claimed = true
}
handler.help = ['daily']
handler.tags = ['economy']
handler.command = ['عيديتي'] 

export default handler
