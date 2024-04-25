import fs from 'fs'

let timeout = 60000
let poin = 500

let handler = async (m, { conn, usedPrefix }) => {
    conn.tokati = conn.tokati ? conn.tokati : {}
    let id = m.chat
    if (id in conn.tokati) {
        conn.reply(m.chat, '*صبر ما تشوف فيه سؤال ؟*', conn.tokati[id][0])
        throw false
    }
  let src = await (await fetch('https://raw.githubusercontent.com/kimos71/AURTER-BOT/main/Games/deen.json')).json()
  let json = src[Math.floor(Math.random() * src.length)]
    let _clue = json.response
    let clue = _clue.replace(/[A-Za-z]/g, '_')
    let caption = `*❃ ──────⊰ ❀ ⊱────── ❃*\n*ثقافة دينية :*\n
ⷮ *${json.question}*

*الوقت :* *${(timeout / 1000).toFixed(2)}* *ثانية*
*الجائزة :* *${poin}* *بيلي*
*❃ ──────⊰ ❀ ⊱────── ❃*
`.trim()
    conn.tokati[id] = [
       await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(async () => {
            if (conn.tokati[id]) await conn.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*خلص الوقت*\n*الجواب :* *( ${json.response} )*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, conn.tokati[id][0])
            delete conn.tokati[id]
        }, timeout)
    ]
}

handler.help = ['acertijo']
handler.tags = ['game']
handler.command = /^(دين|ديني)$/i

export default handler