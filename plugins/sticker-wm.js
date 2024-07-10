import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  if (!m.quoted) throw 'وين الستيكر ؟'

  let stiker = false
  let name = text.trim()

  try {
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) throw 'يجب أن تكون صورة على شكل ملصق'

    let img = await m.quoted.download()
    if (!img) throw 'رد على الملصق!'

    // Call addExif function to add watermark with the provided name
    stiker = await addExif(img, name, name)
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) {
      // Send the modified sticker with watermark
      conn.sendFile(m.chat, stiker, 'wm.webp', '', m, null, null)
    } else {
      throw 'فشل التحويل'
    }
  }
}

handler.help = ['take <name>']
handler.tags = ['sticker']
handler.command = ['حقوق', 'wm']

export default handler