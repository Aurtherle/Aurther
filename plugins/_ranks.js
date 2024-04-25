global.rpg = {
	
  role(level) {
    level = parseInt(level)
    if (isNaN(level)) return { name: '', level: '' }
    
    const role = [
      { name: "مواطن 👦🏻", level: 0 }, { name: "شونين⚔️", level: 3 }, 
      { name: "ساموراي 🗡", level: 4 }, { name: "شينوبي 🗡", level: 6 }, 
      { name: "تارتاروس 👹", level: 8 }, { name: "نينجا⚔️", level: 12 }, 
      { name: "ملك التنانين 🐉", level: 13 }, { name: "يونكو 🧛🏻", level: 14 }, 
      { name: "شينيغامي 💀", level: 16 }, { name: "ملك قراصنة👒", level: 20 }, 
      { name: "ملك👑🤴🏻", level: 24 }, { name: "الأسطورة الخالدة", level: 28 }, 
      { name: "هاشيرا🔥🗡️", level: 32 }, { name: "الفارس الأسود 🖤", level: 36 },
      { name: "حاكم الدمار👺", level: 48 }, { name: "شيطان🥀⚰️", level: 52 }, 
      { name: "القوت 🐐", level: 56 }, { name: "العم", level: 60 }, 
      { name: "العم آرثر", level: 100 }
    ];

    return role.reverse().find(role => level >= role.level)
  }
      }
