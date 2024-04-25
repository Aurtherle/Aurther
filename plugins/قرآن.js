import fetch from 'node-fetch';
import { translate } from '@vitalets/google-translate-api';

let quranSurahHandler = async (m, { conn }) => {
  try {
    // Extract the surah number or name from the command text.
    let surahInput = m.text.split(' ')[1];

    if (!surahInput) {
      throw new (`*أسم او رقم السورة ؟*`)
    }

    let surahListRes = await fetch('https://quran-endpoint.vercel.app/quran');
    let surahList = await surahListRes.json();

    let surahData = surahList.data.find(surah => 
        surah.number === Number(surahInput) || 
        surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() || 
        surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    );

    if (!surahData) {
      throw new Error(`لم أجد هذه السورة "${surahInput}"`);
    }

    let res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
    
    if (!res.ok) {
      let error = await res.json(); 
      throw new خطأ(`حدث خطأ${res.status} رسالة الخطأ ${error.message}`);
    }

    let json = await res.json();

    // Translate tafsir from Bahasa Indonesia to arabic
    let translatedTafsirArabic = await translate(json.data.tafsir.id, { to: 'ar', autoCorrect: true });

    // Translate tafsir from Bahasa Indonesia to English
    let translatedTafsirEnglish = await translate(json.data.tafsir.id, { to: 'en', autoCorrect: true });

    let quranSurah = `
🕌 *القرآن الكريم*\n
📜 *السورة ${json.data.number}: ${json.data.asma.ar.long}*\n
*مكان النزول :* ${json.data.type.ar}\n
*عدد الآيات :* ${json.data.ayahCount}\n
🔮 *التفسير :*\n
${translatedTafsirArabic.text}\n`;

    m.reply(quranSurah);

    if (json.data.recitation.full) {
      conn.sendFile(m.chat, json.data.recitation.full, 'recitation.mp3', null, m, true, { type: 'audioMessage', ptt: true });
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

quranSurahHandler.help = ['quran [surah_number|surah_name]'];
quranSurahHandler.tags = ['quran', 'surah'];
quranSurahHandler.command = ['قران', 'سورة']

export default quranSurahHandler;

  
  
  
  
