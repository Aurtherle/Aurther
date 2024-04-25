import similarity from 'similarity'
const threshold = 0.72
export async function before(m) {
    let id = m.chat
    if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/رتب.*الاسم/i.test(m.quoted.text) || /.*hhint/i.test(m.text))
        return !0
    this.koplart = this.koplart ? this.koplart : {}
    if (!(id in this.koplart))
        return this.reply(m.chat, '*خلص السؤال*', m)
    if (m.quoted.id == this.koplart[id][0].id) {
        let isSurrender = /^(انسحب|surr?ender)$/i.test(m.text)
        if (isSurrender) {
            clearTimeout(this.koplart[id][3])
            delete this.koplart[id]
            return this.reply(m.chat, '*ماااش مافي مستوى*', m)
        }
        let json = JSON.parse(JSON.stringify(this.koplart[id][1]))

        if (m.text.toLowerCase() == json.response.toLowerCase().trim()) {
            global.db.data.users[m.sender].exp += this.koplart[id][2]
            this.reply(m.chat, `*❃ ──────⊰ ❀ ⊱────── ❃*\n*❀ شوكولولو ❀*\n\n*◍ الجائزة :* *${this.koplart[id][2]}* *بيلي*\n*❃ ──────⊰ ❀ ⊱────── ❃*`, m)
            clearTimeout(this.koplart[id][3])
            delete this.koplart[id]
        } else if (similarity(m.text.toLowerCase(), json.response.toLowerCase().trim()) >= threshold)
            m.reply(`*اوخخ قربتت*`)
        else
            this.reply(m.chat, `*نااه*`, m)
    }
    return !0
}
export const exp = 0