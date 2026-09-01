export const PACK_ACTRESS = {
  id:'actress', kicker:'Name one…', title:'Bollywood actress who debuted in the 2000s', hint:'Her first Hindi film released between 2000 and 2009.', icon:'🌟',
  packDesc:'Name a 2000s debutante. 5 rounds — no repeats.',
  shortTitle:'2000s debut actress',
  // People, and `year` is her first Hindi release — not a film's release date.
  noun:'name', yearIs:'debut',
  domainHint:['actress','bollywood','debut','hindi'],
  /*
    `year` is the HINDI debut throughout, which is the only reading that makes
    the pack self-consistent: several of these worked in Tamil, Telugu or
    Bengali first, and mixing the two would put the same person in two
    different decades depending on which career you counted.
  */
  answers:[
    {name:'Priyanka Chopra', aliases:['priyanka'], tier:0, year:2003},
    {name:'Kareena Kapoor', aliases:['kareena'], tier:0, year:2000},
    {name:'Deepika Padukone', aliases:['deepika'], tier:0, year:2007},
    /*
      Swept out by the roster query, which filtered on Indian citizenship to
      keep Hollywood names off the list. Katrina Kaif holds a British passport
      and Jacqueline Fernandez a Sri Lankan one — facts about their paperwork,
      not their careers, and both are plainly Bollywood actresses who debuted
      in this decade. Restored by hand. The lesson is that citizenship is the
      wrong proxy for "works in Hindi cinema".
    */
    {name:'Katrina Kaif', aliases:['katrina'], tier:0, year:2003},
    {name:'Jacqueline Fernandez', aliases:['jacqueline'], tier:1, year:2009},
    {name:'Freida Pinto', aliases:['freida'], tier:0, year:2008},
    {name:'Anushka Sharma', aliases:['anushka'], tier:0, year:2008},
    {name:'Bipasha Basu', aliases:['bipasha'], tier:0, year:2001},
    {name:'Lara Dutta', aliases:['lara'], tier:0, year:2003},
    {name:'Mallika Sherawat', aliases:['mallika'], tier:0, year:2003},
    {name:'Vidya Balan', aliases:['vidya'], tier:0, year:2005},
    {name:'Shruti Haasan', aliases:['shruti'], tier:0, year:2009},
    {name:'Tamannaah Bhatia', aliases:['tamannaah'], tier:0, year:2005},

    {name:'Kangana Ranaut', aliases:['kangana'], tier:1, year:2006},
    {name:'Sonam Kapoor', aliases:['sonam'], tier:1, year:2007},
    {name:'Dia Mirza', aliases:['dia'], tier:1, year:2001},
    {name:'Esha Deol', aliases:['esha'], tier:1, year:2002},
    {name:'Ameesha Patel', aliases:['ameesha'], tier:1, year:2000},
    {name:'Amrita Rao', aliases:['amrita'], tier:1, year:2002},
    {name:'Asin', aliases:[], tier:1, year:2008},
    {name:'Genelia D\'Souza', aliases:['genelia'], tier:1, year:2003},
    {name:'Malaika Arora', aliases:['malaika'], tier:1, year:2000},
    {name:'Shriya Saran', aliases:['shriya'], tier:1, year:2003},
    {name:'Ayesha Takia', aliases:['ayesha'], tier:1, year:2004},

    {name:'Celina Jaitly', aliases:['celina'], tier:2, year:2003},
    {name:'Jiah Khan', aliases:['jiah'], tier:2, year:2008},
    {name:'Trisha Krishnan', aliases:['trisha'], tier:2, year:2008},
    {name:'Bhumika Chawla', aliases:['bhumika'], tier:2, year:2003},
    {name:'Neha Dhupia', aliases:['neha'], tier:2, year:2004},
    {name:'Hansika Motwani', aliases:['hansika'], tier:2, year:2003},
    {name:'Shamita Shetty', aliases:['shamita'], tier:2, year:2000},
    {name:'Konkona Sen Sharma', aliases:['konkona'], tier:2, year:2005},
    {name:'Soha Ali Khan', aliases:['soha'], tier:2, year:2004},
    {name:'Tanishaa', aliases:[], tier:2, year:2003},
    {name:'Amrita Arora', aliases:[], tier:2, year:2002},

    {name:'Raima Sen', aliases:['raima'], tier:3, year:2001},
    {name:'Isha Koppikar', aliases:['isha'], tier:3, year:2003},
    {name:'Gauri Khan', aliases:['gauri'], tier:3, year:2007},
    {name:'Yukta Mookhey', aliases:['yukta'], tier:3, year:2002},
    {name:'Prachi Desai', aliases:['prachi'], tier:3, year:2008},
    {name:'Aarthi Agarwal', aliases:['aarthi'], tier:3, year:2001},
    {name:'Riya Sen', aliases:['riya'], tier:3, year:2001},
    {name:'Sameera Reddy', aliases:['sameera'], tier:3, year:2002},
    {name:'Rimi Sen', aliases:['rimi'], tier:3, year:2003},
    {name:'Chitrangada Singh', aliases:['chitrangada'], tier:3, year:2003},
    {name:'Gul Panag', aliases:['gul'], tier:3, year:2003},

    {name:'Saroj Khan', aliases:['saroj'], tier:4, year:2006},
    {name:'Adah Sharma', aliases:['adah'], tier:4, year:2008},
    {name:'Kim Sharma', aliases:['kim'], tier:4, year:2000},
    {name:'Sneha Ullal', aliases:['sneha'], tier:4, year:2005},
    {name:'Anita Hassanandani', aliases:['anita'], tier:4, year:2003},
    {name:'Sherlyn Chopra', aliases:['sherlyn'], tier:4, year:2007},
    {name:'Antara Biswas', aliases:['antara'], tier:4, year:2007},
    {name:'Shefali Shah', aliases:['shefali'], tier:4, year:2000},
    {name:'Reema Sen', aliases:['reema'], tier:4, year:2006},
    {name:'Tanushree Dutta', aliases:['tanushree'], tier:4, year:2005},
    {name:'Shahana Goswami', aliases:['shahana'], tier:4, year:2008},
  ]
};
