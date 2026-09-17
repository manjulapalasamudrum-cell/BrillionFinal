/*
  Films Yash Chopra directed himself.

  Directed, not produced, which is the whole difficulty of this pack: Yash Raj
  Films put his name on far more than he ever directed, so Dilwale Dulhania Le
  Jayenge and Chandni Chowk To China are not here and never should be. Twenty-two
  films across fifty-three years, from Dhool Ka Phool in 1959 to Jab Tak Hai Jaan
  in 2012, are the complete list.

  The tiers follow how he is remembered rather than how the films did: the
  romances are what his name means to most players, so the sixties social
  dramas he began with are the deep cuts.
*/
export const PACK_YASHCHOPRA = {
  id:'yashchopra', kicker:'Name one…', title:'Yash Chopra film',
  hint:'Directed by him — not merely produced by Yash Raj.', icon:'🎬',
  packDesc:'Name a film he directed. 5 rounds — no repeats.',
  domainHint:['film','bollywood','yash chopra','director','hindi'],
  answers:[
    {name:'Darr', aliases:['dar'], tier:0, year:1993},
    {name:'Veer-Zaara', aliases:['veer zaara','veerzaara'], tier:0, year:2004},

    {name:'Deewaar', aliases:['deewar','diwaar'], tier:1, year:1975},
    {name:'Chandni', aliases:[], tier:1, year:1989},
    {name:'Dil To Pagal Hai', aliases:['dil toh pagal hai','dtph'], tier:1, year:1997},
    {name:'Jab Tak Hai Jaan', aliases:['jab tak hai jan','jthj'], tier:1, year:2012},

    {name:'Kabhi Kabhie', aliases:['kabhi kabhi'], tier:2, year:1976},
    {name:'Trishul', aliases:[], tier:2, year:1978},
    {name:'Lamhe', aliases:['lamhen'], tier:2, year:1991},
    {name:'Waqt', aliases:['vaqt'], tier:2, year:1965},

    {name:'Silsila', aliases:[], tier:3, year:1981},
    {name:'Mashaal', aliases:['mashal'], tier:3, year:1984},
    {name:'Kaala Patthar', aliases:['kala patthar','kala pathar'], tier:3, year:1979},
    {name:'Daag', aliases:['dag','daag a poem of love'], tier:3, year:1973},
    {name:'Parampara', aliases:[], tier:3, year:1993},

    {name:'Ittefaq', aliases:['itefaq'], tier:4, year:1969},
    {name:'Faasle', aliases:['fasle'], tier:4, year:1985},
    {name:'Vijay', aliases:[], tier:4, year:1988},
    {name:'Joshila', aliases:['joshilaa'], tier:4, year:1973},
    {name:'Aadmi Aur Insaan', aliases:['admi aur insan'], tier:4, year:1969},
    {name:'Dharmputra', aliases:['dharam putra'], tier:4, year:1961},
    {name:'Dhool Ka Phool', aliases:['dhul ka phool'], tier:4, year:1959},
  ],
};
