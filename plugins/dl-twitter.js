
import fg from 'api-dylux'
let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) throw `*جيب رابط الفيد من تويتر*`
          m.react(rwait)    
          try {
          let { SD, HD, desc, thumb, audio } = await fg.twitter(args[0])
          let te = ` 
*❃ ──────⊰ ❀ ⊱────── ❃*
◍ *الوصف :* ${desc}
*❃ ──────⊰ ❀ ⊱────── ❃*`
conn.sendFile(m.chat, HD, 'twitter.mp4', te, m)
m.react(done)
} catch (e) {
  	m.reply(`ذا مو رابط تويتر`)
	} 
	
}
handler.help = ['twitter'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(تويتر)$/i
handler.diamond = true

export default handler
