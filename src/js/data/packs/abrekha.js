/*
  Films with both Amitabh Bachchan and Rekha in the cast.

  The pair made ten films together between 1976 and 1981 and none after, which
  is why this pack is small and cannot grow: it is the complete list, not a
  selection. Silsila is the one everybody names, so it anchors tier 0; the
  late-seventies multi-starrers where they share the screen with half the
  industry are the deep cuts.
*/
export const PACK_ABREKHA = {
  id:'abrekha', kicker:'Name one…', title:'Bollywood movie starring Amitabh Bachchan and Rekha',
  shortTitle:'Amitabh-and-Rekha film',
  hint:'Both of them in the cast — all ten are from 1976 to 1981.', icon:'🎭',
  packDesc:'Name a film they made together. 5 rounds — no repeats.',
  domainHint:['film','bollywood','amitabh bachchan','rekha','hindi'],
  answers:[
    {name:'Silsila', aliases:[], tier:0, year:1981},
    {name:'Muqaddar Ka Sikandar', aliases:['muqaddar','mukaddar ka sikandar'], tier:0, year:1978},

    {name:'Do Anjaane', aliases:['do anjane'], tier:1, year:1976},
    {name:'Ram Balram', aliases:['ram-balram','ram aur balram'], tier:1, year:1980},

    {name:'Khoon Pasina', aliases:['khun pasina'], tier:2, year:1977},
    {name:'Alaap', aliases:['alap'], tier:2, year:1977},

    {name:'Mr Natwarlal', aliases:['mr. natwarlal','natwarlal'], tier:3, year:1979},
    {name:'Suhaag', aliases:['suhag'], tier:3, year:1979},

    {name:'Imaan Dharam', aliases:['iman dharam','imaan-dharam'], tier:4, year:1977},
    {name:'Ganga Ki Saugandh', aliases:['ganga ki saugand'], tier:4, year:1978},
  ],
};
