
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
if (!text) throw `*اكــتـب الـرقـم الـذي تـريـد ارســال لـه الـدعوه !*\n*مــثـال :*\n*${usedPrefix + command} *212684151146*`
if (text.includes('+')) throw  `*بدون ذي +*`
if (isNaN(text)) throw '*دخــل الـرقـم بـدـون مـسافـات !*'
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

      await conn.reply(text+'@s.whatsapp.net', `*تست خش*\n*الــرابـط :* ${link}`, m, {mentions: [m.sender]})
        m.reply(`*تــم ارســال رابــط الـدعـوه !*`) 

}
handler.help = ['invite <917xxx>']
handler.tags = ['group']
handler.command = ['دعوة','اضافة'] 
handler.group = true
handler.admin = false
handler.botAdmin = true

export default handler
