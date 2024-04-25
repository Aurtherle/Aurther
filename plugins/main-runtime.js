import displayLoadingScreen from '../lib/loading.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
let pp = 'https://i.pinimg.com/736x/eb/a7/25/eba725b9c8df5d9b199e950694f18aaf.jpg'
await displayLoadingScreen(conn, m.chat)
	let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let str = `*あ وقت التشغيل あ* \n\n${muptime}`
    conn.sendMessage(m.chat, {
      text: str,
      contextInfo: {
      
      mentionedJid: [m.sender],
      isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: 'AURTHER',
                newsletterName: global.author,
                serverMessageId: -1
            },
      forwardingScore: 999,
      externalAdReply: {
      title: "ᴬᵁᴿᵀᴴᴱᴿ ᴮᴼᵀ",
      body: "A U R T H E R",
      thumbnailUrl: pp,
      sourceUrl: 'https://chat.whatsapp.com/FJSHRpAWulk6lvTeXKiavZ',
      mediaType: 1,
      renderLargerThumbnail: false
      }}})
}
handler.help = ['runtime']
handler.tags = ['main']
handler.command = ['التشغيل']
export default handler

function clockString(ms) {
  let يوم = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let ساعة = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let دقيقة = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let ثانية = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [يوم, 'يوم ', ساعة, 'ساعة ', دقيقة, 'دقيقة ', ثانية, 'ثانية '].map(v => v.toString().padStart(2, 0)).join('')
}
