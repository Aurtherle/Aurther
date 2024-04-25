import axios from 'axios'
import cheerio from 'cheerio'


let handler = async (m, { text }) => {
	if (!text) throw `*وش الي تبي تبحث عنه ؟؟*` 
	
    try {
	const link =  await axios.get(`https://ar.wikipedia.org/wiki/${text}`)
	const $ = cheerio.load(link.data)
	let wik = $('#firstHeading').text().trim()
	let resulw = $('#mw-content-text > div.mw-parser-output').find('p').text().trim()
	m.reply(`▢ *ويكيبيديا*

‣ العنوان : : ${wik}

${resulw}`)
} catch (e) {
  m.reply('⚠️ لا توجد نتيجه ')
}
}
handler.help = ['wikipedia']
handler.tags = ['tools']
handler.command = ['ويكي','ويكيبيديا'] 


export default handler
