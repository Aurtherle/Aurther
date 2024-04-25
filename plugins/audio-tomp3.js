import { toAudio } from '../lib/converter.js' 
let handler = async (m, { conn, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
if (!/video|audio/.test(mime)) throw `*سوي ريبلاي للفيد*`
await conn.sendPresenceUpdate('recording', m.chat)
let media = await q.download?.()
if (!media && !/video/.test(mime)) throw `*حدث خطأ*`
if (!media && !/audio/.test(mime)) throw `*حدث خطأ*`
let audio = await toAudio(media, 'mp4')
if (!audio.data && !/audio/.test(mime)) throw `حدث خطأ`
if (!audio.data && !/video/.test(mime)) throw `حدث خطأ`
conn.sendFile(m.chat, audio.data, 'error.mp3', '', m, null, { mimetype: 'audio/mp4' })
}
handler.help = ['tomp3 (reply)']
handler.tags = ['audio']
//handler.command = ['لصوت', 'mp3']
export default handler
