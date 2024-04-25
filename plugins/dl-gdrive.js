
import fg from 'api-dylux' 
let handler = async (m, { conn, args, usedPrefix, command }) => {

	if (!args[0]) throw `عطني رابط جوجل درايف`
	m.react(rwait) 
	try {
	let res = await fg.GDriveDl(args[0])
	 await m.reply(`
*❃ ──────⊰ ❀ ⊱────── ❃* 
≡ *تست*

◍ *اسم الملف :* ${res.fileName}
◍ *الحجم :* ${res.fileSize}
◍ *النوع :* ${res.mimetype}`)\n
*❃ ──────⊰ ❀ ⊱────── ❃* 
		
	conn.sendMessage(m.chat, { document: { url: res.downloadUrl }, fileName: res.fileName, mimetype: res.mimetype }, { quoted: m })
	m.react(done)
   } catch {
	m.reply('اللينك مو شغال') 
  }
}
handler.help = ['gdrive']
handler.tags = ['downloader', 'premium']
handler.command = ['درايف']
handler.credit = true
handler.premium = true

export default handler
