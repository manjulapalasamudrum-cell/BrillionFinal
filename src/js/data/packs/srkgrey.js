/*
  Films where Shah Rukh Khan plays the villain or an openly grey lead.

  The line drawn here is the character, not the ending: Darr's obsessive
  stalker and Baazigar's killer are the roles that made his name, and the
  grey leads who carry a crime for the length of the film — Don, Raees —
  belong with them. A hero who merely does one wrong thing does not, which is
  why the romantic leads stay out however much they suffer.
*/
export const PACK_SRKGREY = {
  id:'srkgrey', kicker:'Name one…', title:'movie where Shah Rukh Khan played a negative or grey role',
  shortTitle:'Shah Rukh Khan grey role',
  hint:'The villain, the stalker, the outlaw — not the romantic lead.', icon:'🖤',
  packDesc:'Name a film where he is the bad guy. 5 rounds — no repeats.',
  domainHint:['film','bollywood','shah rukh khan','villain','hindi'],
  answers:[
    {name:'Baazigar', aliases:['bazigar'], tier:0, year:1993},
    {name:'Darr', aliases:['dar'], tier:0, year:1993},

    {name:'Don', aliases:['don 2006'], tier:1, year:2006},
    {name:'Jawan', aliases:[], tier:1, year:2023},

    {name:'Don 2', aliases:['don two'], tier:2, year:2011},
    {name:'Fan', aliases:[], tier:2, year:2016},
    {name:'Raees', aliases:['rais'], tier:2, year:2017},

    {name:'Anjaam', aliases:['anjam'], tier:3, year:1994},
    {name:'Duplicate', aliases:[], tier:3, year:1998},

    {name:'Ram Jaane', aliases:['ram jane'], tier:4, year:1995},
  ],
};
