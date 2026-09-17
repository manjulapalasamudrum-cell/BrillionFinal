/*
  Actresses who played opposite Aamir Khan in a 1990s film.

  Carries no `year`, and is listed in check-bank.py's UNDATED_PACKS for that
  reason: several of these women played opposite him more than once across the
  decade — Juhi Chawla in 1993 and 1997, Pooja Bhatt in 1991 and 1996 — so there
  is no one year the pack could honestly record. Picking a film's year to
  satisfy a validator would put a fact in the bank that is not true of the
  answer. Undated packs simply generate no era or decade rounds.

  The decade is the boundary: Qayamat Se Qayamat Tak is 1988 and Mela is 2000,
  so neither Juhi's debut nor Twinkle Khanna qualifies on its own. Juhi is here
  for Hum Hain Rahi Pyar Ke and Ishq, which are inside it.
*/
export const PACK_AAMIRHEROINE = {
  id:'aamirheroine', kicker:'Name one…',
  title:'actress who played opposite Aamir Khan in the 1990s',
  shortTitle:'90s Aamir Khan heroine', noun:'name',
  hint:'Opposite him in a film released between 1990 and 1999.', icon:'💃',
  packDesc:'Name one of his 90s heroines. 5 rounds — no repeats.',
  domainHint:['bollywood','actress','aamir khan','1990s','hindi'],
  answers:[
    {name:'Juhi Chawla', aliases:['juhi'], tier:0},
    {name:'Karisma Kapoor', aliases:['karishma kapoor','karisma'], tier:0},

    {name:'Madhuri Dixit', aliases:['madhuri'], tier:1},
    {name:'Manisha Koirala', aliases:['manisha'], tier:1},
    {name:'Kajol', aliases:[], tier:1},

    {name:'Raveena Tandon', aliases:['raveena'], tier:2},
    {name:'Rani Mukerji', aliases:['rani mukherjee','rani'], tier:2},
    {name:'Pooja Bhatt', aliases:['puja bhatt'], tier:2},

    {name:'Mamta Kulkarni', aliases:['mamata kulkarni'], tier:3},
    {name:'Sonali Bendre', aliases:['sonali'], tier:3},
    {name:'Ayesha Jhulka', aliases:['aisha jhulka'], tier:3},

    {name:'Pooja Bedi', aliases:['puja bedi'], tier:4},
    {name:'Farheen', aliases:['farheen khan'], tier:4},
    {name:'Ramya Krishnan', aliases:['ramya krishna'], tier:4},
  ],
};
