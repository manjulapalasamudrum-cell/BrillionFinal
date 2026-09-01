export const PACK_VILLAIN = {
  id:'villain', kicker:'Name one…', title:'Bollywood villain — actor or character', hint:'A memorable bad guy — the actor\'s name or the character\'s name both count.', icon:'😈',
  packDesc:'Name a villain actor or character. 5 rounds — no repeats.',
  // Every answer here is a person or a role, so they have names, not titles.
  // The full title spells out "actor or character", which a round's own
  // constraint line already says better — hence the short form.
  noun:'name', shortTitle:'Bollywood villain',
  domainHint:['film','villain','antagonist','bollywood','character','actor'],
  answers:[
    {name:'Pran', aliases:['pran sahab'], tier:0, role:'actor'},
    {name:'Gabbar Singh', aliases:['gabbar'], tier:0, role:'character'},
    {name:'Amrish Puri', aliases:['amrish','puri'], tier:0, role:'actor'},
    {name:'Mogambo', aliases:[], tier:0, role:'character'},
    {name:'Amjad Khan', aliases:['amjad'], tier:0, role:'actor'},

    {name:'Prem Chopra', aliases:['prem','chopra'], tier:1, role:'actor'},
    {name:'Ajit', aliases:['ajit khan'], tier:1, role:'actor'},
    {name:'Shakaal', aliases:['shakal'], tier:1, role:'character'},
    {name:'Gulshan Grover', aliases:['gulshan','grover','badman'], tier:1, role:'actor'},
    {name:'Danny Denzongpa', aliases:['danny','denzongpa'], tier:1, role:'actor'},
    {name:'Shakti Kapoor', aliases:['shakti'], tier:1, role:'actor'},
    {name:'Kancha Cheena', aliases:['kancha','cheena'], tier:1, role:'character'},
    {name:'Alauddin Khilji', aliases:['khilji','alauddin'], tier:1, role:'character'},

    {name:'Ranjeet', aliases:['ranjit'], tier:2, role:'actor'},
    {name:'Sadashiv Amrapurkar', aliases:['sadashiv','amrapurkar'], tier:2, role:'actor'},
    {name:'Paresh Rawal', aliases:['paresh'], tier:2, role:'actor'},
    {name:'Ashutosh Rana', aliases:['ashutosh'], tier:2, role:'actor'},
    {name:'Kulbhushan Kharbanda', aliases:['kulbhushan','kharbanda'], tier:2, role:'actor'},
    {name:'Dr Dang', aliases:['dr. dang','dang'], tier:2, role:'character'},
    {name:'Rauf Lala', aliases:['rauf','lala'], tier:2, role:'character'},
    {name:'Bhiku Mhatre', aliases:['bhiku','mhatre'], tier:2, role:'character'},
    {name:'Lajja Shankar Pandey', aliases:['lajja shankar'], tier:2, role:'character'},
    {name:'Ballu Balram', aliases:['ballu','balram'], tier:2, role:'character'},
    {name:'Chatur Ramalingam', aliases:['chatur','silencer'], tier:2, role:'character'},
    /* 'badman' is deliberately NOT an alias here — it is Gulshan Grover's own
       nickname and already belongs to his actor entry in this pack. */
    {name:'Kesariya Vilayati', aliases:['kesariya'], tier:2, role:'character'},
    {name:'Durva Ranade', aliases:['durva','ranade'], tier:2, role:'character'},
    /* No 'madan' or 'chopra' alias: those belong to Madan Puri and Prem
       Chopra, both actor entries here. The full name is typeable as it is. */
    {name:'Madan Chopra', aliases:[], tier:2, role:'character'},
    {name:'Prakash Raj', aliases:['prakash'], tier:2, role:'actor'},

    {name:'Kader Khan', aliases:['kadar khan'], tier:3, role:'actor'},
    {name:'Sudhir', aliases:[], tier:3, role:'actor'},
    {name:'Jeevan', aliases:[], tier:3, role:'actor'},
    {name:'Madan Puri', aliases:['madan'], tier:3, role:'actor'},
    {name:'Sonu Sood', aliases:['sonu'], tier:3, role:'actor'},
    {name:'Vivek Oberoi', aliases:['vivek'], tier:3, role:'actor'},
    {name:'Maya Dolas', aliases:['maya','dolas'], tier:3, role:'character'},
    {name:'Teja', aliases:[], tier:3, role:'character'},
    {name:'Crime Master Gogo', aliases:['gogo','crime master'], tier:3, role:'character'},
    {name:'Ramadhir Singh', aliases:['ramadhir'], tier:3, role:'character'},
    {name:'Sambha', aliases:[], tier:3, role:'character'},
    {name:'Kaalia', aliases:['kalia'], tier:3, role:'character'},
    {name:'Vishnu Nagre', aliases:['vishnu','nagre'], tier:3, role:'character'},
    {name:'Sultan Qureshi', aliases:['sultan'], tier:3, role:'character'},
    {name:'Puneet Issar', aliases:['puneet','issar'], tier:3, role:'actor'},
    {name:'Dalip Tahil', aliases:['dalip','tahil'], tier:3, role:'actor'},

    {name:'Anupam Kher', aliases:['anupam'], tier:4, role:'actor'},
    {name:'Raghuvaran', aliases:[], tier:4, role:'actor'},
    {name:'Mukesh Rishi', aliases:['mukesh'], tier:4, role:'actor'},
    {name:'Ashish Vidyarthi', aliases:['ashish'], tier:4, role:'actor'},
    {name:'Bulla', aliases:[], tier:4, role:'character'},
  ]
};
