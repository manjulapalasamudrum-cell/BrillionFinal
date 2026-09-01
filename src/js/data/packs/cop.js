export const PACK_COP = {
  id:'cop', kicker:'Name one…', title:'Bollywood actor who has played a police officer', hint:'Any actor who has worn the khaki on screen.', icon:'👮',
  packDesc:'Name an on-screen cop. 5 rounds — no repeats.',
  shortTitle:'actor who played a cop',
  // People, and no useful year: an actor who played a cop in 1973 played
  // another in 2015. Dating them would invent a fact the pack does not have,
  // so this carries none — like `villain`, which is undated for the same
  // reason. That also means no era or decade round can be built here, which
  // is correct: there is nothing for one to cut on.
  noun:'name',
  domainHint:['actor','police','cop','inspector','bollywood'],
  answers:[
    {name:'Ajay Devgn', aliases:['ajay devgan','ajay'], tier:0},
    {name:'Salman Khan', aliases:['salman','bhaijaan'], tier:0},
    {name:'Amitabh Bachchan', aliases:['amitabh','big b','bachchan'], tier:0},
    {name:'Akshay Kumar', aliases:['akshay','akki'], tier:0},

    {name:'Ranveer Singh', aliases:['ranveer'], tier:1},
    {name:'Aamir Khan', aliases:['aamir','amir khan'], tier:1},
    {name:'Abhishek Bachchan', aliases:['abhishek'], tier:1},

    {name:'Sanjay Dutt', aliases:['sanjay','sanju'], tier:2},
    {name:'Nawazuddin Siddiqui', aliases:['nawazuddin','nawaz'], tier:2},
    {name:'John Abraham', aliases:['john'], tier:2},
    {name:'Ayushmann Khurrana', aliases:['ayushmann'], tier:2},

    {name:'Nana Patekar', aliases:['nana'], tier:3},
    {name:'Sunny Deol', aliases:['sunny'], tier:3},
    {name:'Vivek Oberoi', aliases:['vivek'], tier:3},
    {name:'Manoj Bajpayee', aliases:['manoj','bajpai'], tier:3},

    {name:'Om Puri', aliases:['om'], tier:4},
    {name:'Naseeruddin Shah', aliases:['naseeruddin','naseer'], tier:4},
    {name:'Anil Kapoor', aliases:['anil'], tier:4},
    // Qualifies on One 2 Ka 4 (2001), where he plays Inspector Arun Verma —
    // a real police role but nobody's first thought, hence the tier. Worth
    // checking against a source: it is the thinnest claim in this pack.
    {name:'Shah Rukh Khan', aliases:['srk','shahrukh','shah rukh'], tier:4},

    /*
      Hand-added, with the qualifying role named so each claim can be checked.
      There is no query for this: Wikidata does not record what job a
      character has, so a pack of actors-who-played-police cannot be swept out
      of anything. The older names carry the lower tiers because the khaki
      role is a staple of the 70s and 80s, not a modern invention.
    */
    {name:'Vinod Khanna', aliases:['vinod'], tier:2},          // Amar Akbar Anthony
    {name:'Jackie Shroff', aliases:['jackie'], tier:3},        // Aan: Men at Work
    {name:'Suniel Shetty', aliases:['sunil shetty','suniel'], tier:3},  // Dhadkan-era cop roles
    {name:'Irrfan Khan', aliases:['irrfan','irfan khan'], tier:3},      // Talvar
    {name:'Randeep Hooda', aliases:['randeep'], tier:4},       // Kick
    {name:'Emraan Hashmi', aliases:['emraan'], tier:4},        // Mumbai Saga
    {name:'Akshaye Khanna', aliases:['akshaye'], tier:4},      // Ittefaq
    {name:'Farhan Akhtar', aliases:['farhan'], tier:4},        // Wazir
    {name:'Vicky Kaushal', aliases:['vicky'], tier:4},         // Raman Raghav 2.0
  ]
};
