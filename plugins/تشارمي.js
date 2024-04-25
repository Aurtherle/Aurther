let handler = m => m;

handler.all = async function (m, conn) {
    var vn = "https://dl.sndup.net/vz3j/Charmi%20oni%20chan.mp3";
    let triggerWord = "قروت","فيصل"; // Replace "your_trigger_word" with the actual keyword you want to use

    if (m.text && m.text.toLowerCase().includes(triggerWord)) {
        let doc = {
            audio: {
                url: vn
            },
            mimetype: 'audio/mpeg',
            ptt: true,
            fileName: "تشارمي اوني تشان"
        };

        return this.sendMessage(m.chat, doc, { quoted: m });
    }
}

export default handler;