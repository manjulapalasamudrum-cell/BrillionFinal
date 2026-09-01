export const PACK_TRIANGLE = {
  id:'triangle', kicker:'Name one…', title:'Bollywood love triangle', hint:'A film whose romance is built on three people, not two.', icon:'💔',
  packDesc:'Name a love triangle. 5 rounds — no repeats.',
  shortTitle:'love-triangle film',
  domainHint:['film','romance','love triangle','bollywood'],
  /*
    Membership here is a reading of a plot rather than a fact you can look up,
    so this pack errs wide on purpose: a player who names a film with a real
    third corner should never be told they are wrong. Anything where the
    triangle is a subplot rather than the engine has been left out instead —
    that is the line, and it is the only one available.
  */
  answers:[
    {name:'Kuch Kuch Hota Hai', aliases:['kkhh','kuch kuch'], tier:0, year:1998},
    {name:'Sangam', aliases:[], tier:0, year:1964},
    {name:'Saajan', aliases:['sajan'], tier:0, year:1991},
    {name:'Devdas', aliases:[], tier:0, year:2002},

    {name:'Silsila', aliases:[], tier:1, year:1981},
    {name:'Hum Dil De Chuke Sanam', aliases:['hddcs','hum dil de chuke'], tier:1, year:1999},
    {name:'Kal Ho Naa Ho', aliases:['khnh','kal ho na ho'], tier:1, year:2003},
    {name:'Ae Dil Hai Mushkil', aliases:['adhm','ae dil','ae dil hai mushqil'], tier:1, year:2016},

    {name:'Dil To Pagal Hai', aliases:['dtph','dil to pagal'], tier:2, year:1997},
    {name:'Veer-Zaara', aliases:['veer zaara','veer zara'], tier:2, year:2004},
    {name:'Kabhi Alvida Naa Kehna', aliases:['kank','kabhi alvida','kabhi alvida na kehna'], tier:2, year:2006},
    {name:'Cocktail', aliases:[], tier:2, year:2012},
    {name:'Student of the Year', aliases:['soty'], tier:2, year:2012},

    {name:'Deewana', aliases:['diwana'], tier:3, year:1992},
    {name:'Jab Tak Hai Jaan', aliases:['jthj','jab tak jaan','jab tak','jab tak hai'], tier:3, year:2012},
    {name:'Raanjhanaa', aliases:['ranjhana','raanjhana'], tier:3, year:2013},
    {name:'Barfi', aliases:['barfi!'], tier:3, year:2012},

    {name:'Judaai', aliases:['judai'], tier:4, year:1997},
    {name:'Mujhse Dosti Karoge', aliases:['mdk'], tier:4, year:2002},

    /*
      Added by hand, because there is no category or query that returns "films
      with a love triangle" — it is a reading of a plot. Each of these turns
      on a third person rather than merely containing one, which is the only
      line available. Weight the pack toward the classics: the triangle is an
      older device, and a pack drawn only from recent films would misrepresent
      it as a modern one.
    */
    {name:'Kabhi Kabhie', aliases:['kabhi kabhi'], tier:1, year:1976},
    {name:'Muqaddar Ka Sikandar', aliases:['muqadar ka sikandar'], tier:2, year:1978},
    {name:'Sagar', aliases:[], tier:3, year:1985},
    {name:'Darr', aliases:['dar'], tier:2, year:1993},
    {name:'Aaina', aliases:['aina'], tier:4, year:1993},
    {name:'Pardes', aliases:[], tier:3, year:1997},
    {name:'Chori Chori Chupke Chupke', aliases:['cccc'], tier:3, year:2001},
    {name:'Hum Tumhare Hain Sanam', aliases:['htks'], tier:4, year:2002},
    {name:'Bewafaa', aliases:['bewafa'], tier:4, year:2005},
    {name:'Love Aaj Kal', aliases:['lak'], tier:3, year:2009},
    {name:'Hamari Adhuri Kahani', aliases:['hak'], tier:4, year:2015},
    {name:'Manmarziyaan', aliases:['manmarzian'], tier:4, year:2018},
    {name:'Tanu Weds Manu Returns', aliases:['twmr','tanu weds manu 2'], tier:4, year:2015},
    // Borderline: the film is a marriage under strain, and the third corner
    // (Priya's former fiance) is a subplot rather than the engine. Kept
    // because over-inclusion is the right error here — a player who reads it
    // as a triangle is not wrong enough to be told they are.
    {name:'Chalte Chalte', aliases:[], tier:4, year:2003},
  ]
};
