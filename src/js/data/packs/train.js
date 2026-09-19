/*
  Films where a train is the setting, the set piece, or the thing the story
  turns on.

  The bar is that the train matters, not that one passes through shot: Jab We
  Met begins because she gets off one, Sholay's robbery happens on one, and
  Dil Se puts its most famous song on the roof of one. A film with a station
  scene and nothing else is not in the pack.

  Hindi cinema has used trains since before independence, so this is a
  selection rather than the complete list — it is deep enough to score, and
  every entry is a film where a player can say what the train was doing.
*/
export const PACK_TRAIN = {
  id:'train', kicker:'Name one…', title:'Bollywood movie featuring a train',
  shortTitle:'Bollywood train film',
  hint:'The train is the setting, the set piece, or the reason for the plot.', icon:'🚂',
  packDesc:'Name a film built around a train. 5 rounds — no repeats.',
  domainHint:['film','bollywood','train','railway','hindi'],
  answers:[
    {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj','dilwale dulhaniya le jayenge'], tier:0, year:1995},
    {name:'Chennai Express', aliases:['chennai xpress'], tier:0, year:2013},
    {name:'Jab We Met', aliases:['jab we met 2007'], tier:0, year:2007},
    {name:'Sholay', aliases:[], tier:0, year:1975},

    {name:'The Burning Train', aliases:['burning train'], tier:1, year:1980},
    {name:'Dil Se', aliases:['dil se..','dilse'], tier:1, year:1998},
    {name:'Gadar Ek Prem Katha', aliases:['gadar','gadar ek prem katha 2001'], tier:1, year:2001},
    {name:'Ghulam', aliases:['gulam'], tier:1, year:1998},

    {name:'Ra.One', aliases:['ra one','raone'], tier:2, year:2011},
    {name:'Bhaag Milkha Bhaag', aliases:['bhag milkha bhag','bmb'], tier:2, year:2013},
    {name:'Barfi', aliases:['barfi!','burfi'], tier:2, year:2012},
    {name:'Swades', aliases:['swadesh'], tier:2, year:2004},

    {name:'Pakeezah', aliases:['pakiza','pakeeza'], tier:3, year:1972},
    {name:'The Train', aliases:['train 1970'], tier:3, year:1970},
    {name:'Train to Pakistan', aliases:['train to pakistan 1998'], tier:3, year:1998},
    {name:'Aradhana', aliases:['aradhna'], tier:3, year:1969},

    {name:'Ijaazat', aliases:['ijazat'], tier:4, year:1987},
    {name:'27 Down', aliases:['twenty seven down'], tier:4, year:1974},
  ],
};
