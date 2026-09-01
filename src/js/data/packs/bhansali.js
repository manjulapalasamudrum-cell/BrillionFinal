export const PACK_BHANSALI = {
  id:'bhansali', kicker:'Name one…', title:'Sanjay Leela Bhansali film', hint:'A film he directed — not one he only produced or scored.', icon:'🎭',
  packDesc:'Name a Bhansali film. 5 rounds — no repeats.',
  shortTitle:'Bhansali film',
  domainHint:['film','director','sanjay leela bhansali','bollywood'],
  /*
    His directorial features, all of them, in order. This pack is complete
    rather than curated, which is why it is small: ten films in thirty years
    is the whole body of work, and a pack that is exhaustive can never reject
    a valid answer — the failure mode this bank cares most about.

    The hint earns its place. He produced and scored films he did not direct
    (Mary Kom, Rowdy Rathore), and a player naming one of those is making a
    reasonable mistake the prompt should have headed off.
  */
  answers:[
    {name:'Devdas', aliases:[], tier:0, year:2002},
    {name:'Bajirao Mastani', aliases:['bajirao'], tier:0, year:2015},
    {name:'Padmaavat', aliases:['padmavat','padmavati'], tier:0, year:2018},

    {name:'Black', aliases:[], tier:1, year:2005},
    {name:'Hum Dil De Chuke Sanam', aliases:['hddcs','hum dil de chuke'], tier:1, year:1999},
    {name:'Gangubai Kathiawadi', aliases:['gangubai'], tier:1, year:2022},

    {name:'Goliyon Ki Raasleela Ram-Leela', aliases:['ram leela','ramleela','goliyon ki raasleela'], tier:2, year:2013},

    {name:'Saawariya', aliases:['sawariya'], tier:3, year:2007},
    {name:'Guzaarish', aliases:['guzarish'], tier:3, year:2010},

    {name:'Khamoshi The Musical', aliases:['khamoshi'], tier:4, year:1996},
  ]
};
