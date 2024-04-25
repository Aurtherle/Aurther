const free = 2000
const prem = 5000000

let handler = async (m, {conn, isPrems }) => {
  let time = global.db.data.users[m.sender].lastclaim + 86400000
  if (new Date - global.db.data.users[m.sender].lastclaim < 86400000) throw `*لقد أستلمت يوميتك ب الفعل*. *عد بعد* *${msToTime(time - new Date())}* `
  global.db.data.users[m.sender].credit += isPrems ? prem : free
  m.reply(`*لقد حصلت على* *${isPrems ? prem : free}* *تفقد محفظتك*`)
  global.db.data.users[m.sender].lastclaim = new Date * 1
}
handler.help = ['daily']
handler.tags = ['economy']
handler.command = ['يومي'] 

export default handler



function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + " Hours " + minutes + " Minutes"
}
