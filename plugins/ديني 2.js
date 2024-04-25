import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/ثقافة.*دينية/i.test(m.quoted.text) || /.*hhint/i.test(m.text))
        return !0
    this.tokati = this.tokati ? this.tokati : {}
    if (!(id in this.tokati))
        return this.reply(m.chat, '*خلص السؤال*', m)
    if (m.quoted.id == this.tokati[id][0].id) {
        let isSurrender = /^(انسحب|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.tokati[id][3])
            delete this.tokati[id]
            return this.reply(m.chat, '*ماااش مافي مستوى*', m)
        }
        let json = JSON.parse(JSON.stringify(this.tokati[id][1]))

        if (m.text.toLowerCase() == json.response.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.tokati[id][2]
            this.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*❀ شوكولولو ❀*\n\n*◍ الجائزة :* *${this.tokati[id][2]}* *بيلي*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, m)
            clearTimeout(this.tokati[id][3])
            delete this.tokati[id]
        } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold)
            m.reply(`*اوخخ قربتت*`)
        else
            this.reply(m.chat, `*نااه*`, m)
    }
    return !0
}
export const exp = 0