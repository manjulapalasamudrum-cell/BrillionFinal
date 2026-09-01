export const PACK_WEDDING = {
  id:'wedding', kicker:'Name one…', title:'Bollywood movie with a famous wedding', hint:'A film remembered for its shaadi — the sangeet, the mandap, the baraat.', icon:'💒',
  packDesc:'Name a big-wedding film. 5 rounds — no repeats.',
  shortTitle:'Bollywood wedding film',
  domainHint:['film','wedding','shaadi','marriage','bollywood'],
  /*
    Like `triangle`, this is a judgement rather than a lookup, so it errs wide.
    The test applied was whether the wedding is something the film is
    remembered FOR — a set piece the audience can picture — not merely whether
    a wedding happens, which would take in most of Hindi cinema.
  */
  answers:[
    {name:'Hum Aapke Hain Koun', aliases:['hahk','hum aapke hain kaun'], tier:0, year:1994},
    {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj','dilwale dulhania'], tier:0, year:1995},
    {name:'Kabhi Khushi Kabhie Gham', aliases:['k3g','kabhi khushi','kkkg'], tier:0, year:2001},
    {name:'Band Baaja Baaraat', aliases:['bbb','band baja baraat'], tier:0, year:2010},

    {name:'Yeh Jawaani Hai Deewani', aliases:['yjhd','ye jawani hai deewani'], tier:1, year:2013},
    {name:'2 States', aliases:['two states'], tier:1, year:2014},
    {name:'Monsoon Wedding', aliases:[], tier:1, year:2001},
    {name:'Vivah', aliases:[], tier:1, year:2006},

    {name:'Hum Saath Saath Hain', aliases:['hssh','hum saath saath'], tier:2, year:1999},
    {name:'Rab Ne Bana Di Jodi', aliases:['rnbdj','rab ne','rab ne bana di'], tier:2, year:2008},
    {name:'Tanu Weds Manu', aliases:['twm'], tier:2, year:2011},
    {name:'Mujhse Shaadi Karogi', aliases:['msk'], tier:2, year:2004},

    {name:'Namastey London', aliases:['namaste london'], tier:3, year:2007},
    {name:'Prem Ratan Dhan Payo', aliases:['prdp'], tier:3, year:2015},
    {name:'Badrinath Ki Dulhania', aliases:['bkd','badrinath'], tier:3, year:2017},
    {name:'Veere Di Wedding', aliases:['vdw'], tier:3, year:2018},

    {name:'Dolly Ki Doli', aliases:[], tier:4, year:2015},
    {name:'Shubh Mangal Saavdhan', aliases:['shubh mangal savdhan'], tier:4, year:2017},

    /*
      Also hand-added: "remembered for its wedding" is a judgement, not a
      field. The test stayed the same — the shaadi has to be a set piece the
      audience can picture, not merely an event in the plot — and the small
      wedding-comedy run of the 2010s is included because that is exactly what
      a player reaching for this prompt will think of.
    */
    {name:'Mere Yaar Ki Shaadi Hai', aliases:['myksh'], tier:3, year:2002},
    {name:'Jab We Met', aliases:['jwm'], tier:2, year:2007},
    {name:'Dum Laga Ke Haisha', aliases:['dlkh'], tier:3, year:2015},
    {name:'Shaandaar', aliases:['shandaar'], tier:4, year:2015},
    {name:'Tanu Weds Manu Returns', aliases:['twmr'], tier:3, year:2015},
    {name:'Mubarakan', aliases:[], tier:4, year:2017},
    {name:'Sonu Ke Titu Ki Sweety', aliases:['sktks'], tier:3, year:2018},
    {name:'Luka Chuppi', aliases:['lukka chuppi'], tier:3, year:2019},
    {name:'Shubh Mangal Zyada Saavdhan', aliases:['smzs'], tier:4, year:2020},
  ]
};
