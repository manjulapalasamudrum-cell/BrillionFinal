export const PACK_DILTITLE = {
  id:'diltitle', kicker:'Name one…', title:'Bollywood movie with "Dil" in the title', hint:'"Dil" means "heart" in Hindi/Urdu.', icon:'❤️',
  packDesc:'Name a "Dil" movie. 5 rounds — no repeats.',
  shortTitle:'“Dil” movie',
  domainHint:['film','bollywood','hindi'],
  answers:[
    {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj','dilwale dulhania'], tier:0, year:1995},
    {name:'Dil Chahta Hai', aliases:['dch'], tier:0, year:2001},
    {name:'Dil Se', aliases:['dil se..'], tier:0, year:1998},
    {name:'Ae Dil Hai Mushkil', aliases:['adhm','ae dil hai mushqil','ae dil'], tier:0, year:2016},
    {name:'Dil To Pagal Hai', aliases:['dtph','dil to pagal'], tier:0, year:1997},
    {name:'Dilwale', aliases:['dilwale 2015'], tier:0, year:2015},

    {name:'Dil', aliases:['dil 1990'], tier:1, year:1990},
    {name:'Dil Dhadakne Do', aliases:['ddd'], tier:1, year:2015},
    {name:'Dil Bechara', aliases:[], tier:1, year:2020},
    {name:'Dil Hai Ke Manta Nahin', aliases:['dhkmn'], tier:1, year:1991},
    /* "Dillagi" carries dil the way "Dilwale" does — a real word built on it,
       unlike "Dilli", which is the city. Three separate films, kept apart by
       year: Yeh Dillagi 1994, Dillagi 1999. */
    {name:'Yeh Dillagi', aliases:['ye dillagi'], tier:1, year:1994},

    {name:'Dil Ka Rishta', aliases:[], tier:2, year:2003},
    {name:'Dil Hi To Hai', aliases:[], tier:2, year:1963},
    {name:'Yeh Dil Aashiqana', aliases:['ye dil aashiqana'], tier:2, year:2002},
    {name:'Dil Toh Baccha Hai Ji', aliases:['dil to baccha hai ji'], tier:2, year:2011},
    {name:'Dil Juunglee', aliases:['dil junglee'], tier:2, year:2018},
    {name:'Dil Hai Tumhaara', aliases:['dil hai tumhara'], tier:2, year:2002},
    {name:'Dil Tera Aashiq', aliases:['dil tera ashiq'], tier:2, year:1993},
    {name:'Dil Maange More', aliases:[], tier:2, year:2004},

    {name:'Dil Ka Kya Kasoor', aliases:[], tier:3, year:1992},
    {name:'Dil Kya Kare', aliases:[], tier:3, year:1999},
    {name:'Dil Pe Mat Le Yaar', aliases:['dil pe mat le yar'], tier:3, year:2000},
    {name:'Dil Dosti Etc', aliases:['dil dosti etc.','dil dosti'], tier:3, year:2007},
    {name:'Dil Hai Betaab', aliases:['dil hai betab'], tier:3, year:1993},
    {name:'Dillagi', aliases:['dillagi 1999'], tier:3, year:1999},
    {name:'Pal Pal Dil Ke Paas', aliases:['ppdkp','pal pal dil ke pass'], tier:3, year:2019},
    {name:'Dil Ek Mandir', aliases:[], tier:3, year:1963},
    {name:'Dil Vil Pyar Vyar', aliases:['dil vil pyaar vyaar'], tier:3, year:2002},
    {name:'Dil Ne Jise Apna Kaha', aliases:[], tier:3, year:2004},
    {name:'Dil Apna Aur Preet Parai', aliases:['dil apna preet parai'], tier:3, year:1960},
    {name:'Dil Deke Dekho', aliases:[], tier:3, year:1959},
    {name:'Dil Aashna Hai', aliases:['dil ashna hai'], tier:3, year:1992},
    {name:'Dil Kaa Heera', aliases:['dil ka heera','dil ka hira'], tier:3, year:1979},
    {name:'Dil-E-Nadaan', aliases:['dil e nadaan','dile nadaan'], tier:3, year:1982},
    {name:'Dilwaala', aliases:['dilwala'], tier:3, year:1986},

    {name:'Do Dil', aliases:[], tier:4, year:1965},
    {name:'Dil Tera Diwana', aliases:['dil tera deewana'], tier:4, year:1962},
    {name:'Dil Aur Deewaar', aliases:['dil aur deewar'], tier:4, year:1978},
    {name:'Dil Tujhko Diya', aliases:['dil tujhko diya 1987'], tier:4, year:1987},
    {name:'Dil Farosh', aliases:[], tier:4, year:1927},
    {name:'Dil Daulat Duniya', aliases:['dil daulat aur duniya'], tier:4, year:1972},
    {name:'Dil Ka Raja', aliases:[], tier:4, year:1972},
    {name:'Dil Ki Rahen', aliases:['dil ki raahen'], tier:4, year:1973},
    {name:'Dil Diwana', aliases:['dil deewana'], tier:4, year:1974},
    {name:'Dil Se Mile Dil', aliases:[], tier:4, year:1978},
    {name:'Dil Ke Jharokhe Mein', aliases:['dil ke jharoke main'], tier:4, year:1997},
    {name:'Hum Aapke Dil Mein Rehte Hain', aliases:['hum aapke dil mein'], tier:4, year:1999},
    {name:'Dil Kabaddi', aliases:[], tier:4, year:2008},
    {name:'Dil Ne Phir Yaad Kiya', aliases:[], tier:4, year:1966},
    {name:'Dil Diya Dard Liya', aliases:[], tier:4, year:1966},
    {name:'Dil Pardesi Ho Gayaa', aliases:['dil pardesi ho gaya'], tier:4, year:2003},
    {name:'Dil Bole Hadippa', aliases:['dil bole hadipa'], tier:4, year:2009},
    {name:'Dil Jo Bhi Kahey', aliases:['dil jo bhi kahe'], tier:4, year:2005},

    /*
      These three were in other packs but missing here, so the game knew the
      films and still rejected them for the one prompt they most obviously
      answer. Found by scanning every pack for the diltitle name rule rather
      than by reading — which is how the next three will be found too.
    */
    {name:'Hum Dil De Chuke Sanam', aliases:['hddcs','hum dil de chuke'], tier:1, year:1999},
    {name:'Phir Bhi Dil Hai Hindustani', aliases:['pbdhh','phir bhi dil hai'], tier:2, year:2000},
    {name:'Lekar Hum Deewana Dil', aliases:['lhdd','lekar hum deewana'], tier:4, year:2014},
  ]
};
