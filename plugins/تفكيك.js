import fs from 'fs'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
    conn.bikolati = conn.bikolati ? conn.bikolati : {}
    let id = m.chat
    if (id in conn.bikolati) {
        conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', conn.bikolati[id][0])
        throw false
    }
  let src = await (await fetch('https://raw.githubusercontent.com/Aurtherle/Games/main/.github/workflows/tf.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let _clue = json.response
    let clue = _clue.replace(/[A-Za-z]/g, '_')
    let caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*فكك الاسم :*\n
ⷮ *${json.question}*

*الوقت :* *${(timeout / 1000).toFixed(2)}* *ثانية*
*الجائزة :* *${poin}* *بيلي*
*❃ ──────⊰ ❀ ⊱────── ❃*
`.trim()
    conn.bikolati[id] = [
       await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.bikolati[id]) await conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* *( ${json.response} )*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, conn.bikolati[id][0])
            delete conn.bikolati[id]
        }, timeout)
    ]
}

handler.help = ['acertijo']
handler.tags = ['game']
handler.command = /^تف$/i

export default handler
