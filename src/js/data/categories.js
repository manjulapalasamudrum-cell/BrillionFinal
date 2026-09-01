/**
 * The answer bank: 10 themed packs of Bollywood trivia.
 *
 * Every answer carries a `tier` (0 = everyone says it … 4 = legendary rare)
 * which is the whole scoring model — rarer answers are worth more. `year`
 * powers both the era-bucketed themed rounds and the final "how deep did you
 * dive" result, so keep it accurate. `aliases` are extra spellings players
 * actually type; fuzzy matching handles typos on top of these.
 *
 * On coverage: the packs aim to be broad enough that a player naming a real,
 * obvious answer is never told they are wrong. That is a correctness property,
 * not a nice-to-have — a rejected valid answer is the worst bug this game can
 * have. The actor packs cover the full lead filmography rather than the hits.
 *
 * Three optional pack-level fields exist for the sake of how rounds are
 * phrased, all defaulted so only the odd pack out has to declare them:
 *   `noun`       — what an answer in this pack IS, for prompts that talk about
 *                  the answer itself ("whose title begins with D"). Defaults
 *                  to 'title'; director and villain set it to 'name'.
 *   `yearIs`     — what `year` MEANS here. Defaults to 'release'; the director
 *                  pack sets 'debut', because a director is not released.
 *   `shortTitle` — the pack's name with a clause hung off it. `title` is
 *                  written to stand alone, so the long descriptive ones read
 *                  badly mid-sentence: 'Bollywood movie with "Dil" in the
 *                  title' + ' whose title begins with…'. Defaults to `title`.
 *
 * On aliases: fuzzy matching forgives roughly two edits on a mid-length title,
 * which is not enough for a dropped word. People habitually shorten long
 * titles ("jab tak jaan", "kabhi alvida"), so every multi-word title carries
 * the short forms people actually type. Initialisms (ddlj, k3g, znmd) go here
 * too — they are not typos and fuzzy matching will never reach them.
 */
export const CATEGORIES = [
  {
    id:'srk', kicker:'Name one…', title:'Shah Rukh Khan movie', hint:'Any film where he\'s a lead or major role.', icon:'👑',
    packDesc:'Name a King Khan film. 5 rounds — no repeats.',
    domainHint:['film','bollywood','shah rukh khan','hindi'],
    answers:[
      {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj','dilwale dulhania'], tier:0, year:1995},
      {name:'Kuch Kuch Hota Hai', aliases:['kkhh','kuch kuch'], tier:0, year:1998},
      {name:'Om Shanti Om', aliases:['oso'], tier:0, year:2007},
      {name:'Chennai Express', aliases:[], tier:0, year:2013},
      {name:'Pathaan', aliases:['pathan'], tier:0, year:2023},
      {name:'Jawan', aliases:[], tier:0, year:2023},
      {name:'Kabhi Khushi Kabhie Gham', aliases:['k3g','kabhi khushi','kkkg'], tier:0, year:2001},
      {name:'Devdas', aliases:[], tier:0, year:2002},
      {name:'Kal Ho Naa Ho', aliases:['khnh','kal ho na ho'], tier:0, year:2003},
      {name:'My Name Is Khan', aliases:['mnik'], tier:0, year:2010},
      {name:'Dil To Pagal Hai', aliases:['dtph','dil to pagal'], tier:0, year:1997},
      {name:'Chak De India', aliases:['chak de! india','chak de'], tier:0, year:2007},

      {name:'Veer-Zaara', aliases:['veer zaara','veer zara'], tier:1, year:2004},
      {name:'Baazigar', aliases:['bazigar'], tier:1, year:1993},
      {name:'Darr', aliases:['dar'], tier:1, year:1993},
      {name:'Mohabbatein', aliases:['mohabatein'], tier:1, year:2000},
      {name:'Main Hoon Na', aliases:['mhn'], tier:1, year:2004},
      {name:'Don', aliases:['don 2006'], tier:1, year:2006},
      {name:'Swades', aliases:['swadesh'], tier:1, year:2004},
      {name:'Dil Se', aliases:['dil se..'], tier:1, year:1998},
      {name:'Dilwale', aliases:[], tier:1, year:2015},
      {name:'Rab Ne Bana Di Jodi', aliases:['rnbdj','rab ne','rab ne bana di'], tier:1, year:2008},
      {name:'Jab Tak Hai Jaan', aliases:['jthj','jab tak jaan','jab tak hai','jab tak'], tier:1, year:2012},
      {name:'Happy New Year', aliases:['hny'], tier:1, year:2014},
      {name:'Raees', aliases:['rais'], tier:1, year:2017},
      {name:'Karan Arjun', aliases:[], tier:1, year:1995},
      {name:'Kabhi Alvida Naa Kehna', aliases:['kank','kabhi alvida','kabhi alvida na kehna'], tier:1, year:2006},
      {name:'Ra One', aliases:['ra.one','raone','ra 1'], tier:1, year:2011},
      {name:'Don 2', aliases:['don two'], tier:1, year:2011},
      {name:'Dunki', aliases:['dunky'], tier:1, year:2023},

      {name:'Dear Zindagi', aliases:[], tier:2, year:2016},
      {name:'Fan', aliases:[], tier:2, year:2016},
      {name:'Zero', aliases:[], tier:2, year:2018},
      {name:'Jab Harry Met Sejal', aliases:['jhms','harry met sejal'], tier:2, year:2017},
      {name:'Pardes', aliases:[], tier:2, year:1997},
      {name:'Yes Boss', aliases:[], tier:2, year:1997},
      {name:'Chalte Chalte', aliases:[], tier:2, year:2003},
      {name:'Koyla', aliases:['coyla'], tier:2, year:1997},
      {name:'Asoka', aliases:['ashoka'], tier:2, year:2001},
      {name:'Paheli', aliases:[], tier:2, year:2005},
      {name:'Billu', aliases:['billu barber'], tier:2, year:2009},
      {name:'Phir Bhi Dil Hai Hindustani', aliases:['pbdhh','phir bhi dil hai'], tier:2, year:2000},
      {name:'Baadshah', aliases:['badshah'], tier:2, year:1999},
      {name:'Josh', aliases:[], tier:2, year:2000},
      {name:'Duplicate', aliases:[], tier:2, year:1998},
      {name:'Anjaam', aliases:['anjam'], tier:2, year:1994},
      {name:'Kabhi Haan Kabhi Naa', aliases:['khkn','kabhi haan kabhi na'], tier:2, year:1994},
      {name:'Deewana', aliases:['diwana'], tier:2, year:1992},

      {name:'Hey Ram', aliases:[], tier:3, year:2000},
      {name:'Ram Jaane', aliases:['ram jane'], tier:3, year:1995},
      {name:'Trimurti', aliases:[], tier:3, year:1995},
      {name:'One 2 Ka 4', aliases:['one two ka four','1 2 ka 4'], tier:3, year:2001},
      {name:'English Babu Desi Mem', aliases:['ebdm','english babu'], tier:3, year:1996},
      {name:'Raju Ban Gaya Gentleman', aliases:['rbgg','raju ban gaya'], tier:3, year:1992},
      {name:'King Uncle', aliases:[], tier:3, year:1993},
      {name:'Guddu', aliases:[], tier:3, year:1995},
      {name:'Chamatkar', aliases:['chamatkaar'], tier:3, year:1992},
      {name:'Hum Tumhare Hain Sanam', aliases:['hths','hum tumhare hain'], tier:3, year:2002},

      {name:'Oh Darling Yeh Hai India', aliases:['oh darling','yeh hai india'], tier:4, year:1995},
      {name:'Dil Aashna Hai', aliases:['dil ashna hai'], tier:4, year:1992},
      {name:'Maya Memsaab', aliases:['maya memsahab'], tier:4, year:1993},
      {name:'Zamaana Deewana', aliases:['zamana deewana'], tier:4, year:1995},
      {name:'Chaahat', aliases:['chahat'], tier:4, year:1996},
      {name:'Army', aliases:[], tier:4, year:1996},
      {name:'Dushman Duniya Ka', aliases:['dushman duniya'], tier:4, year:1996},
      {name:'Idiot', aliases:['idiot 1992'], tier:4, year:1992},
    ]
  },
  {
    id:'ab', kicker:'Name one…', title:'Amitabh Bachchan movie', hint:'From any decade of his career.', icon:'🎩',
    packDesc:'Name a Big B film. 5 rounds — no repeats.',
    domainHint:['film','bollywood','amitabh bachchan','hindi'],
    answers:[
      {name:'Sholay', aliases:[], tier:0, year:1975},
      {name:'Deewaar', aliases:['deewar','diwaar'], tier:0, year:1975},
      {name:'Zanjeer', aliases:['zanjir'], tier:0, year:1973},
      {name:'Don', aliases:['don 1978'], tier:0, year:1978},
      {name:'Amar Akbar Anthony', aliases:['aaa'], tier:0, year:1977},
      {name:'Kabhi Khushi Kabhie Gham', aliases:['k3g','kabhi khushi'], tier:0, year:2001},
      {name:'Agneepath', aliases:['agnipath'], tier:0, year:1990},
      {name:'Anand', aliases:[], tier:0, year:1971},
      {name:'Black', aliases:[], tier:0, year:2005},
      {name:'Piku', aliases:[], tier:0, year:2015},

      {name:'Silsila', aliases:[], tier:1, year:1981},
      {name:'Muqaddar Ka Sikandar', aliases:['muqaddar','mukaddar ka sikandar'], tier:1, year:1978},
      {name:'Coolie', aliases:['kuli'], tier:1, year:1983},
      {name:'Shahenshah', aliases:['shehenshah'], tier:1, year:1988},
      {name:'Namak Halaal', aliases:['namak halal'], tier:1, year:1982},
      {name:'Sharaabi', aliases:['sharabi'], tier:1, year:1984},
      {name:'Trishul', aliases:[], tier:1, year:1978},
      {name:'Shakti', aliases:[], tier:1, year:1982},
      {name:'Mohabbatein', aliases:[], tier:1, year:2000},
      {name:'Paa', aliases:[], tier:1, year:2009},
      {name:'Baghban', aliases:['bagban'], tier:1, year:2003},
      {name:'Laawaris', aliases:['lawaris'], tier:1, year:1981},
      {name:'Kaalia', aliases:['kalia'], tier:1, year:1981},
      {name:'Mard', aliases:[], tier:1, year:1985},
      {name:'Hum', aliases:[], tier:1, year:1991},
      {name:'Pink', aliases:[], tier:1, year:2016},
      {name:'Chupke Chupke', aliases:[], tier:1, year:1975},
      {name:'Abhimaan', aliases:['abhiman'], tier:1, year:1973},
      {name:'Thugs of Hindostan', aliases:['thugs of hindustan','toh'], tier:1, year:2018},
      {name:'Kalki 2898 AD', aliases:['kalki','kalki 2898'], tier:1, year:2024},

      {name:'Kabhi Kabhie', aliases:['kabhi kabhi'], tier:2, year:1976},
      {name:'Namak Haraam', aliases:['namak haram'], tier:2, year:1973},
      {name:'Satte Pe Satta', aliases:['satte pe sata'], tier:2, year:1982},
      {name:'Yaarana', aliases:['yarana'], tier:2, year:1981},
      {name:'Suhaag', aliases:['suhag'], tier:2, year:1979},
      {name:'Naseeb', aliases:['nasib'], tier:2, year:1981},
      {name:'Dostana', aliases:['dostana 1980'], tier:2, year:1980},
      {name:'Kaala Patthar', aliases:['kala patthar','kala pathar'], tier:2, year:1979},
      {name:'Mr Natwarlal', aliases:['mr. natwarlal','natwarlal'], tier:2, year:1979},
      {name:'Do Aur Do Paanch', aliases:['do aur do paach','do aur do 5'], tier:2, year:1980},
      {name:'Aakhree Raasta', aliases:['aakhri raasta','akhri rasta'], tier:2, year:1986},
      {name:'Sarkar', aliases:[], tier:2, year:2005},
      {name:'Bunty Aur Babli', aliases:['bunty aur bubly','bunty babli'], tier:2, year:2005},
      {name:'Cheeni Kum', aliases:['chini kum'], tier:2, year:2007},
      {name:'Badla', aliases:[], tier:2, year:2019},
      {name:'102 Not Out', aliases:['102 notout'], tier:2, year:2018},
      {name:'Khuda Gawah', aliases:['khuda gawaah'], tier:2, year:1992},
      {name:'Mili', aliases:[], tier:2, year:1975},
      {name:'Khakee', aliases:['khaki'], tier:2, year:2004},
      {name:'Brahmastra', aliases:['brahmastra part one','bramhastra'], tier:2, year:2022},

      {name:'Parvarish', aliases:['parwarish'], tier:3, year:1977},
      {name:'Majboor', aliases:['majbur'], tier:3, year:1974},
      {name:'Roti Kapda Aur Makaan', aliases:['roti kapda makaan','roti kapda'], tier:3, year:1974},
      {name:'Kasme Vaade', aliases:['kasme vade'], tier:3, year:1978},
      {name:'Adalat', aliases:[], tier:3, year:1976},
      {name:'Inquilaab', aliases:['inqilaab'], tier:3, year:1984},
      {name:'Toofan', aliases:['tufan'], tier:3, year:1989},
      {name:'Jadugar', aliases:['jaadugar'], tier:3, year:1989},
      {name:'Aankhen', aliases:['aankhein'], tier:3, year:2002},
      {name:'Dev', aliases:[], tier:3, year:2004},
      {name:'Nishabd', aliases:['nishabdh'], tier:3, year:2007},
      {name:'Sarkar Raj', aliases:[], tier:3, year:2008},
      {name:'Bhoothnath', aliases:['bhootnath'], tier:3, year:2008},
      {name:'Aarakshan', aliases:['aarakshan 2011'], tier:3, year:2011},
      {name:'Shamitabh', aliases:[], tier:3, year:2015},
      {name:'Wazir', aliases:['vazir'], tier:3, year:2016},
      {name:'Te3n', aliases:['teen'], tier:3, year:2016},
      {name:'Gulabo Sitabo', aliases:[], tier:3, year:2020},
      {name:'Jhund', aliases:[], tier:3, year:2022},
      {name:'Goodbye', aliases:[], tier:3, year:2022},
      {name:'Uunchai', aliases:['unchai'], tier:3, year:2022},
      {name:'Bade Miyan Chote Miyan', aliases:['bmcm','bade miyan'], tier:3, year:1998},
      {name:'Sooryavansham', aliases:['suryavansham'], tier:3, year:1999},
      {name:'Satyagraha', aliases:[], tier:3, year:2013},
      {name:'Sarkar 3', aliases:['sarkar three'], tier:3, year:2017},
      {name:'Bhoothnath Returns', aliases:['bhootnath returns'], tier:3, year:2014},
      {name:'Kaante', aliases:['kante'], tier:3, year:2002},
      {name:'Chehre', aliases:['chehere'], tier:3, year:2021},
      {name:'Ek Ajnabee', aliases:['ek ajnabi'], tier:3, year:2005},

      {name:'Bombay to Goa', aliases:['bombay 2 goa'], tier:4, year:1972},
      {name:'Saudagar', aliases:['saudagar 1973'], tier:4, year:1973},
      {name:'Benaam', aliases:['benam'], tier:4, year:1974},
      {name:'Do Anjaane', aliases:['do anjane'], tier:4, year:1976},
      {name:'Alaap', aliases:['alap'], tier:4, year:1977},
      {name:'Jurmana', aliases:['jurmaana'], tier:4, year:1979},
      {name:'The Great Gambler', aliases:['great gambler'], tier:4, year:1979},
      {name:'Barsaat Ki Ek Raat', aliases:['barsat ki ek raat'], tier:4, year:1981},
      {name:'Bemisal', aliases:['bemisaal'], tier:4, year:1982},
      {name:'Andha Kanoon', aliases:['andha kanun'], tier:4, year:1983},
      {name:'Mahaan', aliases:['mahan'], tier:4, year:1983},
      {name:'Pukar', aliases:['pukar 1983'], tier:4, year:1983},
      {name:'Geraftaar', aliases:['giraftaar'], tier:4, year:1985},
      {name:'Ganga Jamuna Saraswati', aliases:['ganga jamna saraswati'], tier:4, year:1988},
      {name:'Aaj Ka Arjun', aliases:['aaj ka arjoon'], tier:4, year:1990},
      {name:'Akayla', aliases:['akela'], tier:4, year:1991},
      {name:'Insaniyat', aliases:['insaaniyat'], tier:4, year:1994},
      {name:'Mrityudaata', aliases:['mrityudata'], tier:4, year:1997},
      {name:'Major Saab', aliases:['major sahab'], tier:4, year:1998},
      {name:'Kohram', aliases:['kohraam'], tier:4, year:1999},
      {name:'Lal Baadshah', aliases:['lal badshah'], tier:4, year:1999},
      {name:'Aks', aliases:[], tier:4, year:2001},
      {name:'Ek Rishtaa', aliases:['ek rishta'], tier:4, year:2001},
      {name:'Baabul', aliases:['babul'], tier:4, year:2006},
      {name:'Eklavya', aliases:['eklavya the royal guard'], tier:4, year:2007},
      {name:'Rann', aliases:[], tier:4, year:2010},
      {name:'Bbuddah Hoga Terra Baap', aliases:['buddah hoga tera baap','buddha hoga tera baap'], tier:4, year:2011},
      {name:'Delhi 6', aliases:['delhi-6','delhi six','dilli 6'], tier:4, year:2009},
      {name:'Aladin', aliases:['aladdin'], tier:4, year:2009},
    ]
  },
  {
    id:'director', kicker:'Name one…', title:'Bollywood film director', hint:'Any well-known Hindi film director, classic or modern.', icon:'🎬',
    packDesc:'Name a Bollywood director. 5 rounds — no repeats.',
    // People, not films: they have names, and `year` is the year each one
    // broke through rather than a release date.
    noun:'name', yearIs:'debut', shortTitle:'Bollywood director',
    domainHint:['film','director','bollywood','filmmaker'],
    answers:[
      {name:'Karan Johar', aliases:['kjo'], tier:0, year:1998},
      {name:'Yash Chopra', aliases:[], tier:0, year:1975},
      {name:'Rajkumar Hirani', aliases:['raj kumar hirani'], tier:0, year:2009},
      {name:'Sanjay Leela Bhansali', aliases:['sanjay bhansali','slb'], tier:0, year:2002},
      {name:'Rohit Shetty', aliases:[], tier:0, year:2006},
      {name:'Aditya Chopra', aliases:[], tier:0, year:1995},
      {name:'Farah Khan', aliases:[], tier:0, year:2004},

      {name:'Zoya Akhtar', aliases:[], tier:1, year:2011},
      {name:'Farhan Akhtar', aliases:[], tier:1, year:2001},
      {name:'Imtiaz Ali', aliases:[], tier:1, year:2007},
      {name:'Anurag Kashyap', aliases:[], tier:1, year:2012},
      {name:'Ashutosh Gowariker', aliases:['ashutosh gowarikar'], tier:1, year:2001},
      {name:'Vishal Bhardwaj', aliases:['vishal bharadwaj'], tier:1, year:2006},
      {name:'Kabir Khan', aliases:[], tier:1, year:2015},
      {name:'Anurag Basu', aliases:[], tier:1, year:2012},
      {name:'Mani Ratnam', aliases:['maniratnam'], tier:1, year:1998},
      {name:'Ram Gopal Varma', aliases:['rgv','ramgopal varma'], tier:1, year:1998},
      {name:'David Dhawan', aliases:[], tier:1, year:1997},
      {name:'Subhash Ghai', aliases:[], tier:1, year:1993},
      {name:'Rakesh Roshan', aliases:[], tier:1, year:2000},
      {name:'Sooraj Barjatya', aliases:['suraj barjatya'], tier:1, year:1994},
      {name:'Mahesh Bhatt', aliases:[], tier:1, year:1990},

      {name:'Raj Kapoor', aliases:[], tier:2, year:1955},
      {name:'Hrishikesh Mukherjee', aliases:['hrishikesh mukherji'], tier:2, year:1971},
      {name:'Ramesh Sippy', aliases:[], tier:2, year:1975},
      {name:'Manmohan Desai', aliases:[], tier:2, year:1977},
      {name:'Vidhu Vinod Chopra', aliases:['vvc'], tier:2, year:1994},
      {name:'Priyadarshan', aliases:[], tier:2, year:2000},
      {name:'Raj Kumar Santoshi', aliases:['rajkumar santoshi'], tier:2, year:1994},
      {name:'Nitesh Tiwari', aliases:[], tier:2, year:2016},
      {name:'Meghna Gulzar', aliases:[], tier:2, year:2018},
      {name:'Neeraj Pandey', aliases:[], tier:2, year:2013},
      {name:'Shoojit Sircar', aliases:['sujit sircar'], tier:2, year:2015},
      {name:'Rakeysh Omprakash Mehra', aliases:['rakesh omprakash mehra'], tier:2, year:2006},
      {name:'Ali Abbas Zafar', aliases:[], tier:2, year:2017},
      {name:'Siddharth Anand', aliases:[], tier:2, year:2023},
      {name:'Atlee', aliases:['atlee kumar'], tier:2, year:2023},
      {name:'Abbas-Mustan', aliases:['abbas mustan'], tier:2, year:2004},
      {name:'Anees Bazmee', aliases:[], tier:2, year:2007},
      {name:'Madhur Bhandarkar', aliases:[], tier:2, year:2004},
      {name:'Aanand L Rai', aliases:['anand l rai','aanand rai'], tier:2, year:2013},
      {name:'R Balki', aliases:['balki','r. balki'], tier:2, year:2009},
      {name:'Hansal Mehta', aliases:['hansal'], tier:2, year:2013},
      {name:'Ayan Mukerji', aliases:['ayan mukherji'], tier:2, year:2013},
      {name:'Anubhav Sinha', aliases:['anubhav'], tier:2, year:2019},
      {name:'Nikkhil Advani', aliases:['nikhil advani'], tier:2, year:2003},

      {name:'Guru Dutt', aliases:[], tier:3, year:1957},
      {name:'Bimal Roy', aliases:[], tier:3, year:1958},
      {name:'Mehboob Khan', aliases:[], tier:3, year:1957},
      {name:'Shyam Benegal', aliases:[], tier:3, year:1976},
      {name:'Govind Nihalani', aliases:[], tier:3, year:1983},
      {name:'Basu Chatterjee', aliases:['basu chatterji'], tier:3, year:1976},
      {name:'Gulzar', aliases:[], tier:3, year:1975},
      {name:'B R Chopra', aliases:['br chopra','b.r. chopra'], tier:3, year:1957},
      {name:'Prakash Mehra', aliases:[], tier:3, year:1978},
      {name:'Sriram Raghavan', aliases:[], tier:3, year:2018},
      {name:'Vikramaditya Motwane', aliases:[], tier:3, year:2010},
      {name:'Dibakar Banerjee', aliases:[], tier:3, year:2010},
      {name:'Tigmanshu Dhulia', aliases:[], tier:3, year:2012},
      {name:'Sudhir Mishra', aliases:[], tier:3, year:2005},
      {name:'Gauri Shinde', aliases:[], tier:3, year:2012},
      {name:'Reema Kagti', aliases:[], tier:3, year:2012},
      {name:'Ashwiny Iyer Tiwari', aliases:[], tier:3, year:2016},
      {name:'Amar Kaushik', aliases:[], tier:3, year:2018},
      {name:'Laxman Utekar', aliases:[], tier:3, year:2023},
      {name:'Sandeep Reddy Vanga', aliases:[], tier:3, year:2019},
      {name:'Luv Ranjan', aliases:[], tier:3, year:2018},
      {name:'Abhishek Kapoor', aliases:[], tier:3, year:2013},

      {name:'K Asif', aliases:['k. asif','karimuddin asif'], tier:4, year:1960},
      {name:'Kamal Amrohi', aliases:[], tier:4, year:1972},
      {name:'Chetan Anand', aliases:[], tier:4, year:1964},
      {name:'Vijay Anand', aliases:['goldie anand'], tier:4, year:1965},
      {name:'Kidar Sharma', aliases:[], tier:4, year:1953},
      {name:'Nandita Das', aliases:[], tier:4, year:2018},
      {name:'Konkona Sen Sharma', aliases:[], tier:4, year:2016},
      {name:'Vasan Bala', aliases:[], tier:4, year:2018},
      {name:'Onir', aliases:[], tier:4, year:2010},
      {name:'Kiran Rao', aliases:[], tier:4, year:2010},
    ]
  },
  {
    id:'award', kicker:'Name one…', title:'Filmfare Best Film winner', hint:'A movie that won the Filmfare Award for Best Film.', icon:'🏆',
    packDesc:'Name a Filmfare Best Film winner. 5 rounds — no repeats.',
    domainHint:['film','award','filmfare','bollywood','best film'],
    /*
      A finite factual list, not a judgement call, and the only pack where a
      wrong entry teaches the player something false rather than just mis-rating
      a rarity. Two rules:

        - `year` is the CEREMONY year, which is the year AFTER the film's
          release. Guide (1965) sits at 1967, its 14th Filmfare ceremony.
        - Winners only. A Best Film NOMINEE does not belong here. This has gone
          wrong twice: Kabhi Kabhie (13 nominations, four wins, none of them
          Best Film — 1977 went to Mausam) and Chhoti Bahen (nominated, lost;
          1960 went to Sujata, which also took Director, Actress and Story).

      Verify against the PER-CEREMONY pages ("7th Filmfare Awards"), not the
      single summary list article. That list article states Chhoti Bahen for
      1960 and is contradicted by the ceremony page and by both films' own
      articles. One summarised fetch of a long table is not a source.

      Status: audited 2026-08 against 55 per-ceremony pages, covering every
      ceremony from 1954 to 1996 plus a spread of spot-checks to 2025. Zero
      discrepancies. This is the only pack in the bank verified that way.

      Complete as of the 2025 ceremony. There were no awards in 1987 or 1988,
      which is why the run skips those years.
    */
    answers:[
      {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj'], tier:0, year:1996},
      {name:'Lagaan', aliases:[], tier:0, year:2002},
      {name:'3 Idiots', aliases:['three idiots'], tier:0, year:2010},
      {name:'Black', aliases:[], tier:0, year:2006},
      {name:'Dangal', aliases:[], tier:0, year:2017},
      {name:'Kuch Kuch Hota Hai', aliases:['kkhh'], tier:0, year:1999},
      {name:'Devdas', aliases:[], tier:0, year:2003},
      {name:'Mother India', aliases:[], tier:0, year:1958},

      {name:'Mughal-e-Azam', aliases:['mughal e azam','mughal azam'], tier:1, year:1961},
      {name:'Anand', aliases:[], tier:1, year:1972},
      {name:'Hum Aapke Hain Koun', aliases:['hahk','hum aapke hain kaun'], tier:1, year:1995},
      {name:'Rang De Basanti', aliases:['rdb'], tier:1, year:2007},
      {name:'Taare Zameen Par', aliases:['tzp','tare zameen par'], tier:1, year:2008},
      {name:'Maine Pyar Kiya', aliases:['mpk'], tier:1, year:1990},
      {name:'Qayamat Se Qayamat Tak', aliases:['qsqt','kayamat se kayamat tak'], tier:1, year:1989},
      {name:'Dil To Pagal Hai', aliases:['dtph'], tier:1, year:1998},
      {name:'Hum Dil De Chuke Sanam', aliases:['hddcs','hum dil de chuke'], tier:1, year:2000},
      {name:'Dabangg', aliases:['dabang'], tier:1, year:2011},
      {name:'Laapataa Ladies', aliases:['laapata ladies','lapata ladies'], tier:1, year:2025},

      {name:'Jodhaa Akbar', aliases:['jodha akbar'], tier:2, year:2009},
      {name:'Queen', aliases:[], tier:2, year:2015},
      {name:'Deewaar', aliases:['deewar'], tier:2, year:1976},
      {name:'Guide', aliases:[], tier:2, year:1967},
      {name:'Zindagi Na Milegi Dobara', aliases:['znmd'], tier:2, year:2012},
      {name:'Bajirao Mastani', aliases:[], tier:2, year:2016},
      {name:'Gully Boy', aliases:[], tier:2, year:2020},
      {name:'Bhaag Milkha Bhaag', aliases:['bmb'], tier:2, year:2014},
      {name:'Kaho Naa Pyaar Hai', aliases:['knph','kaho na pyar hai'], tier:2, year:2001},
      {name:'Veer-Zaara', aliases:['veer zaara'], tier:2, year:2005},
      {name:'Koi Mil Gaya', aliases:['koi mil gya'], tier:2, year:2004},
      {name:'Aradhana', aliases:[], tier:2, year:1970},
      {name:'Shakti', aliases:[], tier:2, year:1983},
      {name:'Ghayal', aliases:['ghaayal'], tier:2, year:1991},
      {name:'Jo Jeeta Wohi Sikandar', aliases:['jjws'], tier:2, year:1993},

      {name:'Raja Hindustani', aliases:[], tier:3, year:1997},
      {name:'Lamhe', aliases:['lamhey'], tier:3, year:1992},
      {name:'Barfi', aliases:['barfi!'], tier:3, year:2013},
      {name:'Shershaah', aliases:['shershah'], tier:3, year:2022},
      {name:'Gangubai Kathiawadi', aliases:['gangubai'], tier:3, year:2023},
      {name:'12th Fail', aliases:['twelfth fail','12 fail'], tier:3, year:2024},
      {name:'Raazi', aliases:['razi'], tier:3, year:2019},
      {name:'Bandini', aliases:[], tier:3, year:1964},
      {name:'Dosti', aliases:[], tier:3, year:1965},
      {name:'Upkar', aliases:['upkaar'], tier:3, year:1968},
      {name:'Brahmachari', aliases:[], tier:3, year:1969},
      {name:'Khubsoorat', aliases:['khoobsurat'], tier:3, year:1981},
      {name:'Ardh Satya', aliases:['ardhsatya'], tier:3, year:1984},
      {name:'Ram Teri Ganga Maili', aliases:[], tier:3, year:1986},
      {name:'Hum Hain Rahi Pyar Ke', aliases:['hhrpk'], tier:3, year:1994},

      {name:'Do Bigha Zamin', aliases:['do bigha zameen'], tier:4, year:1954},
      {name:'Madhumati', aliases:[], tier:4, year:1959},
      {name:'Sahib Bibi Aur Ghulam', aliases:['sahib biwi aur ghulam'], tier:4, year:1963},
      {name:'Hindi Medium', aliases:[], tier:4, year:2018},
      {name:'Thappad', aliases:[], tier:4, year:2021},
      {name:'Boot Polish', aliases:[], tier:4, year:1955},
      {name:'Jagriti', aliases:['jagrati'], tier:4, year:1956},
      {name:'Jhanak Jhanak Payal Baaje', aliases:['jhanak jhanak payal baje'], tier:4, year:1957},
      {name:'Sujata', aliases:['sujata 1959'], tier:4, year:1960},
      {name:'Jis Desh Men Ganga Behti Hai', aliases:['jis desh mein ganga behti hai'], tier:4, year:1962},
      {name:'Himalaya Ki God Mein', aliases:['himalay ki god mein'], tier:4, year:1966},
      {name:'Khilona', aliases:['khilauna'], tier:4, year:1971},
      {name:'Be-Imaan', aliases:['beimaan','be imaan'], tier:4, year:1973},
      {name:'Anuraag', aliases:['anurag'], tier:4, year:1974},
      {name:'Rajnigandha', aliases:['rajni gandha'], tier:4, year:1975},
      {name:'Mausam', aliases:['mausum'], tier:4, year:1977},
      {name:'Bhumika', aliases:['bhoomika'], tier:4, year:1978},
      {name:'Main Tulsi Tere Aangan Ki', aliases:['main tulsi tere angan ki'], tier:4, year:1979},
      {name:'Junoon', aliases:[], tier:4, year:1980},
      {name:'Kalyug', aliases:['kaliyug'], tier:4, year:1982},
      {name:'Sparsh', aliases:['sparsha'], tier:4, year:1985},
    ]
  },
  {
    /*
      Every year here must fall in 1990-1999 — check-bank.py enforces it, after
      a first draft of this pack quietly contained a 1989 and a 2000 film. The
      two Mani Ratnam crossovers (Roja, Bombay) are Tamil originals that half
      the country met dubbed into Hindi, so they are carried at their original
      release year and the hint admits them rather than rejecting an answer
      every player expects to work.
    */
    id:'nineties', kicker:'Name one…', title:'Bollywood movie from the 1990s', hint:'Released between 1990 and 1999 — including the Tamil crossovers everyone saw in Hindi.', icon:'📼',
    packDesc:'Name a 90s hit. 5 rounds — no repeats.',
    shortTitle:'90s Bollywood movie',
    domainHint:['film','bollywood','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999'],
    answers:[
      {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj'], tier:0, year:1995},
      {name:'Hum Aapke Hain Koun', aliases:['hahk','hum aapke hain kaun'], tier:0, year:1994},
      {name:'Kuch Kuch Hota Hai', aliases:['kkhh'], tier:0, year:1998},
      {name:'Baazigar', aliases:['bazigar'], tier:0, year:1993},
      {name:'Raja Hindustani', aliases:[], tier:0, year:1996},
      {name:'Karan Arjun', aliases:[], tier:0, year:1995},
      {name:'Border', aliases:[], tier:0, year:1997},
      {name:'Aashiqui', aliases:['ashiqui'], tier:0, year:1990},
      {name:'Deewana', aliases:['diwana'], tier:0, year:1992},
      {name:'Khiladi', aliases:['khiladi 1992'], tier:0, year:1992},
      {name:'Raja Babu', aliases:[], tier:0, year:1994},
      {name:'Taal', aliases:['tal'], tier:0, year:1999},
      {name:'Biwi No 1', aliases:['biwi number 1','biwi no. 1'], tier:0, year:1999},
      {name:'Soldier', aliases:[], tier:0, year:1998},
      {name:'Pyaar Kiya To Darna Kya', aliases:['pktdk','pyar kiya to darna kya'], tier:0, year:1998},

      {name:'Darr', aliases:[], tier:1, year:1993},
      {name:'Rangeela', aliases:['rangila'], tier:1, year:1995},
      {name:'Dil To Pagal Hai', aliases:['dtph'], tier:1, year:1997},
      {name:'Hum Dil De Chuke Sanam', aliases:['hddcs'], tier:1, year:1999},
      {name:'Dil', aliases:['dil 1990'], tier:1, year:1990},
      {name:'Khalnayak', aliases:['khal nayak'], tier:1, year:1993},
      {name:'Hum Saath Saath Hain', aliases:['hssh'], tier:1, year:1999},
      {name:'Judwaa', aliases:['judwa'], tier:1, year:1997},
      {name:'Ishq', aliases:[], tier:1, year:1997},
      {name:'Dilwale', aliases:['dilwale 1994'], tier:1, year:1994},
      {name:'Gupt', aliases:[], tier:1, year:1997},
      {name:'Pardes', aliases:[], tier:1, year:1997},
      {name:'Sarfarosh', aliases:[], tier:1, year:1999},
      {name:'Andaz Apna Apna', aliases:['aaa','andaaz apna apna'], tier:1, year:1994},
      {name:'Sadak', aliases:[], tier:1, year:1991},
      {name:'Phool Aur Kaante', aliases:['phool aur kante'], tier:1, year:1991},
      {name:'Saudagar', aliases:['saudagar 1991'], tier:1, year:1991},
      {name:'Hum', aliases:['hum 1991'], tier:1, year:1991},
      {name:'Khuda Gawah', aliases:['khuda gawaah'], tier:1, year:1992},
      {name:'Agneepath', aliases:['agnipath'], tier:1, year:1990},
      {name:'Krantiveer', aliases:['kranti veer'], tier:1, year:1994},
      {name:'Vijaypath', aliases:['vijaypath 1994'], tier:1, year:1994},
      {name:'Main Khiladi Tu Anari', aliases:['mkta'], tier:1, year:1994},
      {name:'Yeh Dillagi', aliases:['ye dillagi'], tier:1, year:1994},
      {name:'Ghatak', aliases:['ghatak lethal'], tier:1, year:1996},
      {name:'Jeet', aliases:[], tier:1, year:1996},
      {name:'Khiladiyon Ka Khiladi', aliases:['kkk'], tier:1, year:1996},
      {name:'Bade Miyan Chote Miyan', aliases:['bmcm'], tier:1, year:1998},
      {name:'Haseena Maan Jaayegi', aliases:['haseena maan jayegi'], tier:1, year:1999},
      {name:'Jaanwar', aliases:['janwar'], tier:1, year:1999},
      {name:'Bol Radha Bol', aliases:[], tier:1, year:1992},

      {name:'1942 A Love Story', aliases:['1942 love story'], tier:2, year:1994},
      {name:'Bombay', aliases:[], tier:2, year:1995},
      {name:'Satya', aliases:[], tier:2, year:1998},
      {name:'Judaai', aliases:['judai'], tier:2, year:1997},
      {name:'Ghulam', aliases:['gulam'], tier:2, year:1998},
      {name:'Khamoshi The Musical', aliases:['khamoshi'], tier:2, year:1996},
      {name:'Beta', aliases:[], tier:2, year:1992},
      {name:'Saajan', aliases:['sajan'], tier:2, year:1991},
      {name:'Lamhe', aliases:[], tier:2, year:1991},
      {name:'Damini', aliases:[], tier:2, year:1993},
      {name:'Ghayal', aliases:['ghaayal'], tier:2, year:1990},
      {name:'Baaghi', aliases:['baghi'], tier:2, year:1990},
      {name:'Roja', aliases:[], tier:2, year:1992},
      {name:'Virasat', aliases:[], tier:2, year:1997},
      {name:'Duplicate', aliases:[], tier:2, year:1998},
      {name:'Kabhi Haan Kabhi Naa', aliases:['khkn'], tier:2, year:1994},
      {name:'Mohra', aliases:[], tier:2, year:1994},
      {name:'Raja', aliases:['raja 1995'], tier:2, year:1995},
      {name:'Coolie No 1', aliases:['coolie number 1','cooli no 1'], tier:2, year:1995},
      {name:'Barsaat', aliases:['barsat'], tier:2, year:1995},
      {name:'Akele Hum Akele Tum', aliases:['ahat'], tier:2, year:1995},
      {name:'Hero No 1', aliases:['hero number 1','hero no. 1'], tier:2, year:1997},
      {name:'Koyla', aliases:['coyla'], tier:2, year:1997},
      {name:'Gumrah', aliases:['gumraah'], tier:2, year:1993},
      {name:'Kishen Kanhaiya', aliases:['kishan kanhaiya'], tier:2, year:1990},
      {name:'Thanedaar', aliases:['thanedar'], tier:2, year:1990},
      {name:'Swarg', aliases:[], tier:2, year:1990},
      {name:'Aaj Ka Arjun', aliases:['aaj ka arjoon'], tier:2, year:1990},
      {name:'Narsimha', aliases:['narasimha'], tier:2, year:1991},
      {name:'Yodha', aliases:['yoddha'], tier:2, year:1991},
      {name:'Henna', aliases:['heena'], tier:2, year:1991},
      {name:'Shola Aur Shabnam', aliases:[], tier:2, year:1992},
      {name:'Vishwatma', aliases:['vishwaatma'], tier:2, year:1992},
      {name:'Jigar', aliases:[], tier:2, year:1992},
      {name:'Raju Ban Gaya Gentleman', aliases:['rbgg'], tier:2, year:1992},
      {name:'Aatish', aliases:['aatish feel the fire'], tier:2, year:1994},
      {name:'Saajan Chale Sasural', aliases:['sajan chale sasural'], tier:2, year:1996},
      {name:'Agni Sakshi', aliases:['agnisakshi'], tier:2, year:1996},
      {name:'Jaan', aliases:['jaan 1996'], tier:2, year:1996},
      {name:'Army', aliases:['army 1996'], tier:2, year:1996},
      {name:'Chaahat', aliases:['chahat'], tier:2, year:1996},
      {name:'English Babu Desi Mem', aliases:['ebdm'], tier:2, year:1996},
      {name:'Pyaar To Hona Hi Tha', aliases:['pyar to hona hi tha'], tier:2, year:1998},
      {name:'Major Saab', aliases:['major sahab'], tier:2, year:1998},
      {name:'Mann', aliases:['mann 1999'], tier:2, year:1999},
      {name:'Hello Brother', aliases:[], tier:2, year:1999},
      {name:'Baadshah', aliases:['badshah'], tier:2, year:1999},
      {name:'Hum Aapke Dil Mein Rehte Hain', aliases:['hum aapke dil mein'], tier:2, year:1999},

      {name:'Hu Tu Tu', aliases:['hutu tu'], tier:3, year:1999},
      {name:'Aankhen', aliases:['aankhen 1993'], tier:3, year:1993},
      {name:'Hum Hain Rahi Pyar Ke', aliases:['hhrpk'], tier:3, year:1993},
      {name:'Yes Boss', aliases:[], tier:3, year:1997},
      {name:'Jo Jeeta Wohi Sikandar', aliases:['jjws'], tier:3, year:1992},
      {name:'Dil Tera Aashiq', aliases:['dil tera ashiq'], tier:3, year:1993},
      {name:'Kshatriya', aliases:['kshtriya'], tier:3, year:1993},
      {name:'Roop Ki Rani Choron Ka Raja', aliases:['roop ki rani','rkrckr'], tier:3, year:1993},
      {name:'Sir', aliases:['sir 1993'], tier:3, year:1993},
      {name:'King Uncle', aliases:[], tier:3, year:1993},
      {name:'Sabse Bada Khiladi', aliases:['sabse bada khiladi'], tier:3, year:1995},
      {name:'Baazi', aliases:['bazi 1995'], tier:3, year:1995},
      {name:'Naajayaz', aliases:['najayaz'], tier:3, year:1995},
      {name:'Ram Jaane', aliases:['ram jane'], tier:3, year:1995},
      {name:'Dil Kya Kare', aliases:[], tier:3, year:1999},
      {name:'Dushman', aliases:[], tier:3, year:1998},
      {name:'Kareeb', aliases:['karib'], tier:3, year:1998},
      {name:'Vaastav', aliases:['vastav'], tier:3, year:1999},
      {name:'Ziddi', aliases:[], tier:3, year:1997},
      {name:'Gardish', aliases:[], tier:3, year:1993},
      {name:'Drohkaal', aliases:['drohkal'], tier:3, year:1994},

      {name:'Rudaali', aliases:['rudali'], tier:4, year:1993},
      {name:'Bandit Queen', aliases:[], tier:4, year:1994},
      {name:'1947 Earth', aliases:['earth 1947','earth'], tier:4, year:1998},
      {name:'Godmother', aliases:[], tier:4, year:1999},
      {name:'Zakhm', aliases:['zakham'], tier:4, year:1998},
      {name:'Maachis', aliases:['machis'], tier:4, year:1996},
      {name:'Sardari Begum', aliases:[], tier:4, year:1996},
      {name:'Train to Pakistan', aliases:[], tier:4, year:1998},
      {name:'Is Raat Ki Subah Nahin', aliases:['is raat ki subah'], tier:4, year:1996},
      {name:'Hyderabad Blues', aliases:[], tier:4, year:1998},
      {name:'Parampara', aliases:['paramparaa'], tier:4, year:1993},
      {name:'Sardar', aliases:['sardar 1993'], tier:4, year:1993},
      {name:'Dil Hai Betaab', aliases:['dil hai betab'], tier:4, year:1993},
      {name:'Andolan', aliases:[], tier:4, year:1995},
      {name:'Hathkadi', aliases:['hathkari'], tier:4, year:1995},
      {name:'Prem', aliases:['prem 1995'], tier:4, year:1995},
      {name:'Yaraana', aliases:['yarana 1995'], tier:4, year:1995},
      {name:'Guddu', aliases:[], tier:4, year:1995},
      {name:'Tamanna', aliases:['tamana'], tier:4, year:1997},
      {name:'Maha-Sangram', aliases:['maha sangram'], tier:4, year:1990},
      {name:'Jurm', aliases:['jurrm'], tier:4, year:1990},
      {name:'Banjaran', aliases:[], tier:4, year:1991},
      {name:'Prahaar', aliases:['prahar','prahaar the final attack'], tier:4, year:1991},
      {name:'Lekin', aliases:['lekin...'], tier:4, year:1991},
      {name:'Yalgaar', aliases:['yalgar'], tier:4, year:1992},
      {name:'Angaar', aliases:['angar'], tier:4, year:1992},
      {name:'Prem Granth', aliases:[], tier:4, year:1996},
      {name:'Tu Chor Main Sipahi', aliases:[], tier:4, year:1996},
      {name:'Loafer', aliases:['loafer 1996'], tier:4, year:1996},
      {name:'Fire', aliases:['fire 1996'], tier:4, year:1996},
      {name:'Wajood', aliases:['wajud'], tier:4, year:1998},
      {name:'Dil Ke Jharokhe Mein', aliases:['dil ke jharoke main'], tier:4, year:1997},
    ]
  },
  {
    id:'deepika', kicker:'Name one…', title:'Deepika Padukone movie', hint:'Any film starring Deepika Padukone.', icon:'💫',
    packDesc:'Name a Deepika Padukone film. 5 rounds — no repeats.',
    domainHint:['film','bollywood','deepika padukone','hindi'],
    answers:[
      {name:'Om Shanti Om', aliases:['oso'], tier:0, year:2007},
      {name:'Chennai Express', aliases:[], tier:0, year:2013},
      {name:'Padmaavat', aliases:['padmavat','padmavati'], tier:0, year:2018},
      {name:'Piku', aliases:[], tier:0, year:2015},
      {name:'Pathaan', aliases:['pathan'], tier:0, year:2023},
      {name:'Bajirao Mastani', aliases:[], tier:0, year:2015},
      {name:'Yeh Jawaani Hai Deewani', aliases:['yjhd','ye jawani hai deewani'], tier:0, year:2013},

      {name:'Goliyon Ki Raasleela Ram-Leela', aliases:['ram leela','ramleela','goliyon ki raasleela'], tier:1, year:2013},
      {name:'Cocktail', aliases:[], tier:1, year:2012},
      {name:'Tamasha', aliases:[], tier:1, year:2015},
      {name:'Happy New Year', aliases:['hny'], tier:1, year:2014},
      {name:'Love Aaj Kal', aliases:['love aj kal'], tier:1, year:2009},
      {name:'83', aliases:['eighty three'], tier:1, year:2021},
      {name:'Jawan', aliases:[], tier:1, year:2023},
      {name:'Fighter', aliases:[], tier:1, year:2024},

      {name:'Finding Fanny', aliases:[], tier:2, year:2014},
      {name:'Gehraiyaan', aliases:['gehraiyan'], tier:2, year:2022},
      {name:'Chhapaak', aliases:['chapaak'], tier:2, year:2020},
      {name:'Housefull', aliases:[], tier:2, year:2010},
      {name:'Race 2', aliases:['race two'], tier:2, year:2013},
      {name:'Bachna Ae Haseeno', aliases:['bachna ae haseno'], tier:2, year:2008},
      {name:'Singham Again', aliases:[], tier:2, year:2024},
      {name:'Kalki 2898 AD', aliases:['kalki','kalki 2898'], tier:2, year:2024},

      {name:'Karthik Calling Karthik', aliases:['kck','kartik calling kartik'], tier:3, year:2010},
      {name:'Break Ke Baad', aliases:[], tier:3, year:2010},
      {name:'Desi Boyz', aliases:['desi boys'], tier:3, year:2011},
      {name:'Billu', aliases:['billu barber'], tier:3, year:2009},
      {name:'Chandni Chowk to China', aliases:['chandni chowk 2 china','cc2c'], tier:3, year:2009},
      {name:'Aarakshan', aliases:[], tier:3, year:2011},

      {name:'Lafangey Parindey', aliases:['lafange parinde'], tier:4, year:2010},
      {name:'Khelein Hum Jee Jaan Sey', aliases:['khelein hum jee jaan se'], tier:4, year:2010},
      {name:'Dum Maaro Dum', aliases:['dum maro dum'], tier:4, year:2011},
      {name:'xXx Return of Xander Cage', aliases:['xxx','return of xander cage'], tier:4, year:2017},
      {name:'Kochadaiiyaan', aliases:['kochadaiyaan','kochadaiiyaan the legend'], tier:4, year:2014},
    ]
  },
  {
    /*
      Scope: a film built around a real person's life. Mostly Hindi cinema, but
      the big India-set biopics count too — Gandhi is a British production and
      rejecting it would be pedantry a player has no way to anticipate. Films
      about an event rather than a person (Uri, Airlift, Mission Mangal) are
      deliberately out; the line is whose life the film is about.
    */
    id:'biopic', kicker:'Name one…', title:'Bollywood biopic', hint:'A film about a real person\'s life — Hindi cinema, and the big India-set biopics too.', icon:'📖',
    packDesc:'Name a real-life story on screen. 5 rounds — no repeats.',
    domainHint:['film','biographical','biopic','bollywood'],
    answers:[
      {name:'Dangal', aliases:[], tier:0, year:2016},
      {name:'Sanju', aliases:[], tier:0, year:2018},
      {name:'Bhaag Milkha Bhaag', aliases:['bmb'], tier:0, year:2013},
      {name:'Mary Kom', aliases:['mary com'], tier:0, year:2014},
      {name:'MS Dhoni The Untold Story', aliases:['ms dhoni','m s dhoni'], tier:0, year:2016},
      {name:'Gangubai Kathiawadi', aliases:['gangubai'], tier:0, year:2022},
      {name:'Gandhi', aliases:['gandhi 1982'], tier:0, year:1982},
      {name:'83', aliases:['eighty three','83 the film'], tier:0, year:2021},

      {name:'Neerja', aliases:['nerja'], tier:1, year:2016},
      {name:'Shershaah', aliases:['shershah'], tier:1, year:2021},
      {name:'Super 30', aliases:['super thirty'], tier:1, year:2019},
      {name:'Padman', aliases:['pad man'], tier:1, year:2018},
      {name:'Tanhaji', aliases:['tanaji','tanhaji the unsung warrior'], tier:1, year:2020},
      {name:'12th Fail', aliases:['twelfth fail','12 fail'], tier:1, year:2023},
      {name:'Sam Bahadur', aliases:[], tier:1, year:2023},
      {name:'Soorma', aliases:['surma'], tier:1, year:2018},

      {name:'Paan Singh Tomar', aliases:['pan singh tomar'], tier:2, year:2012},
      {name:'The Dirty Picture', aliases:['dirty picture'], tier:2, year:2011},
      {name:'Manikarnika', aliases:['manikarnika the queen of jhansi'], tier:2, year:2019},
      {name:'Mangal Pandey The Rising', aliases:['mangal pandey','the rising'], tier:2, year:2005},
      {name:'Guru', aliases:[], tier:2, year:2007},
      {name:'Gunjan Saxena', aliases:['gunjan saxena the kargil girl'], tier:2, year:2020},
      {name:'Sardar Udham', aliases:['sardar udham singh'], tier:2, year:2021},
      {name:'Shakuntala Devi', aliases:[], tier:2, year:2020},
      {name:'Azhar', aliases:['azhar 2016'], tier:2, year:2016},
      {name:'Chandu Champion', aliases:[], tier:2, year:2024},
      {name:'Bajirao Mastani', aliases:[], tier:2, year:2015},
      {name:'No One Killed Jessica', aliases:['no one killed jesica'], tier:2, year:2011},
      {name:'Once Upon a Time in Mumbaai', aliases:['once upon a time in mumbai'], tier:2, year:2010},
      {name:'Amar Singh Chamkila', aliases:['chamkila'], tier:2, year:2024},

      {name:'Shahid', aliases:[], tier:3, year:2013},
      {name:'The Legend of Bhagat Singh', aliases:['legend of bhagat singh'], tier:3, year:2002},
      {name:'Manjhi The Mountain Man', aliases:['manjhi','mountain man'], tier:3, year:2015},
      {name:'Sarbjit', aliases:['sarabjit'], tier:3, year:2016},
      {name:'Thackeray', aliases:['thakre'], tier:3, year:2019},
      {name:'Sachin A Billion Dreams', aliases:['sachin','billion dreams'], tier:3, year:2017},
      {name:'Thalaivii', aliases:['thalaivi'], tier:3, year:2021},
      {name:'Maidaan', aliases:['maidan'], tier:3, year:2024},
      {name:'Haseena Parkar', aliases:['haseena'], tier:3, year:2017},
      {name:'Emergency', aliases:[], tier:3, year:2025},

      {name:'Gandhi My Father', aliases:['gandhi my father 2007'], tier:3, year:2007},
      {name:'Srikanth', aliases:['shrikanth'], tier:3, year:2024},
      {name:'Mrs Chatterjee vs Norway', aliases:['mrs chatterjee','chatterjee vs norway'], tier:3, year:2023},
      {name:'Swatantrya Veer Savarkar', aliases:['veer savarkar','savarkar'], tier:3, year:2024},
      {name:'Jhund', aliases:[], tier:3, year:2022},
      {name:'Hawaizaada', aliases:['hawaizada'], tier:3, year:2015},
      {name:'Sardar', aliases:['sardar 1993'], tier:3, year:1993},
      {name:'Dr Babasaheb Ambedkar', aliases:['babasaheb ambedkar','ambedkar'], tier:3, year:2000},
      {name:'Saina', aliases:[], tier:3, year:2021},

      {name:'Bandit Queen', aliases:[], tier:4, year:1994},
      {name:'Shabaash Mithu', aliases:['shabash mithu'], tier:4, year:2022},
      {name:'Rocketry The Nambi Effect', aliases:['rocketry','nambi effect'], tier:4, year:2022},
      {name:'Main Aur Charles', aliases:['main aur charless'], tier:4, year:2015},
      {name:'Aligarh', aliases:[], tier:4, year:2016},
      {name:'Bose The Forgotten Hero', aliases:['bose'], tier:4, year:2005},
      {name:'Jhansi Ki Rani', aliases:[], tier:4, year:1953},
      {name:'Bhumika', aliases:['bhoomika'], tier:4, year:1977},
      {name:'Budhia Singh Born to Run', aliases:['budhia singh','budhia'], tier:4, year:2016},
      {name:'Kaun Pravin Tambe', aliases:['pravin tambe'], tier:4, year:2022},
      {name:'Ek Doctor Ki Maut', aliases:['ek doctor ki maut 1990'], tier:4, year:1990},
      {name:'Godmother', aliases:[], tier:4, year:1999},
      {name:'Veerappan', aliases:['veerapan'], tier:4, year:2016},
      {name:'PM Narendra Modi', aliases:['narendra modi'], tier:4, year:2019},
      {name:'The Making of the Mahatma', aliases:['making of the mahatma'], tier:4, year:1996},
      {name:'Shaheed', aliases:['shahid 1965'], tier:4, year:1965},
      {name:'Nanak Shah Fakir', aliases:[], tier:4, year:2015},
      {name:'Malik Ek', aliases:[], tier:4, year:2010},
    ]
  },
  {
    id:'rahman', kicker:'Name one…', title:'A.R. Rahman soundtrack film', hint:'A Hindi or Hindi-dubbed film scored by A.R. Rahman.', icon:'🎼',
    packDesc:'Name a Rahman-scored film. 5 rounds — no repeats.',
    shortTitle:'Rahman-scored film',
    domainHint:['film','a. r. rahman','soundtrack','music','bollywood'],
    answers:[
      {name:'Rang De Basanti', aliases:['rdb'], tier:0, year:2006},
      {name:'Roja', aliases:[], tier:0, year:1992},
      {name:'Dil Se', aliases:[], tier:0, year:1998},
      {name:'Lagaan', aliases:[], tier:0, year:2001},
      {name:'Rangeela', aliases:['rangila'], tier:0, year:1995},
      {name:'Taal', aliases:['tal'], tier:0, year:1999},
      {name:'Slumdog Millionaire', aliases:['slumdog'], tier:0, year:2008},

      {name:'Jodhaa Akbar', aliases:['jodha akbar'], tier:1, year:2008},
      {name:'Swades', aliases:['swadesh'], tier:1, year:2004},
      {name:'Guru', aliases:[], tier:1, year:2007},
      {name:'Rockstar', aliases:['rock star'], tier:1, year:2011},
      {name:'Bombay', aliases:[], tier:1, year:1995},
      {name:'Ghajini', aliases:['gajini'], tier:1, year:2008},
      {name:'Delhi 6', aliases:['delhi six'], tier:1, year:2009},
      {name:'Raanjhanaa', aliases:['ranjhana','raanjhana'], tier:1, year:2013},
      {name:'Jab Tak Hai Jaan', aliases:['jthj','jab tak jaan','jab tak hai','jab tak'], tier:1, year:2012},
      {name:'Chhaava', aliases:['chhava','chaava'], tier:1, year:2025},

      {name:'Highway', aliases:[], tier:2, year:2014},
      {name:'Tamasha', aliases:[], tier:2, year:2015},
      {name:'Raavan', aliases:['raavan 2010','ravan'], tier:2, year:2010},
      {name:'Saathiya', aliases:['sathiya'], tier:2, year:2002},
      {name:'Yuva', aliases:[], tier:2, year:2004},
      {name:'Zubeidaa', aliases:['zubeida'], tier:2, year:2001},
      {name:'Mohenjo Daro', aliases:['mohenjodaro'], tier:2, year:2016},
      {name:'Atrangi Re', aliases:['atrangi'], tier:2, year:2021},
      {name:'Fiza', aliases:[], tier:2, year:2000},
      {name:'Jaane Tu Ya Jaane Na', aliases:['jtyjn','jaane tu'], tier:2, year:2008},
      {name:'Dil Bechara', aliases:[], tier:2, year:2020},
      {name:'Mangal Pandey The Rising', aliases:['mangal pandey','the rising'], tier:2, year:2005},
      {name:'Maidaan', aliases:['maidan'], tier:2, year:2024},

      {name:'The Legend of Bhagat Singh', aliases:['legend of bhagat singh'], tier:3, year:2002},
      {name:'Pukar', aliases:['pukar 2000'], tier:3, year:2000},
      {name:'One 2 Ka 4', aliases:['one two ka four'], tier:3, year:2001},
      {name:'Daud', aliases:['daud 1997'], tier:3, year:1997},
      {name:'OK Jaanu', aliases:['ok jaanu 2017','okay jaanu'], tier:3, year:2017},
      {name:'Thakshak', aliases:['takshak'], tier:3, year:1999},
      {name:'Yuvvraaj', aliases:['yuvraaj'], tier:3, year:2008},
      {name:'Mimi', aliases:[], tier:3, year:2021},
      {name:'Amar Singh Chamkila', aliases:['chamkila'], tier:3, year:2024},
      {name:'Tere Ishk Mein', aliases:['tere ishq mein'], tier:3, year:2025},
      {name:'Mom', aliases:[], tier:3, year:2017},
      {name:'Blue', aliases:['blue 2009'], tier:3, year:2009},
      {name:'Ekk Deewana Tha', aliases:['ek deewana tha'], tier:3, year:2012},

      {name:'Meenaxi', aliases:['meenaxi a tale of three cities'], tier:4, year:2004},
      {name:'Water', aliases:[], tier:4, year:2005},
      {name:'1947 Earth', aliases:['earth 1947'], tier:4, year:1998},
      {name:'Jhootha Hi Sahi', aliases:['jhoota hi sahi'], tier:4, year:2010},
      {name:'Lekar Hum Deewana Dil', aliases:['lekar hum deewana'], tier:4, year:2014},
      {name:'Tehzeeb', aliases:['tehzeb'], tier:4, year:2003},
      {name:'Beyond the Clouds', aliases:[], tier:4, year:2018},
      {name:'99 Songs', aliases:['ninety nine songs'], tier:4, year:2021},
    ]
  },
  {
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
  },
  {
    id:'diltitle', kicker:'Name one…', title:'Bollywood movie with "Dil" in the title', hint:'"Dil" means "heart" in Hindi/Urdu.', icon:'❤️',
    packDesc:'Name a "Dil" movie. 5 rounds — no repeats.',
    shortTitle:'“Dil” movie',
    domainHint:['film','bollywood','hindi'],
    answers:[
      {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj'], tier:0, year:1995},
      {name:'Dil Chahta Hai', aliases:['dch'], tier:0, year:2001},
      {name:'Dil Se', aliases:[], tier:0, year:1998},
      {name:'Ae Dil Hai Mushkil', aliases:['adhm','ae dil hai mushqil'], tier:0, year:2016},
      {name:'Dil To Pagal Hai', aliases:['dtph'], tier:0, year:1997},
      {name:'Dilwale', aliases:['dilwale 2015'], tier:0, year:2015},

      {name:'Dil', aliases:['dil 1990'], tier:1, year:1990},
      {name:'Dil Dhadakne Do', aliases:['ddd'], tier:1, year:2015},
      {name:'Dil Bechara', aliases:[], tier:1, year:2020},
      {name:'Dil Hai Ke Manta Nahin', aliases:['dhkmn'], tier:1, year:1991},
      /* "Dillagi" carries dil the way "Dilwale" does — a real word built on it,
         unlike "Dilli", which is the city. Three separate films, kept apart by
         year: Yeh Dillagi 1994, Dillagi 1999. */
      {name:'Yeh Dillagi', aliases:['ye dillagi'], tier:1, year:1994},

      {name:'Dil Ka Rishta', aliases:[], tier:2, year:2003},
      {name:'Dil Hi To Hai', aliases:[], tier:2, year:1963},
      {name:'Yeh Dil Aashiqana', aliases:['ye dil aashiqana'], tier:2, year:2002},
      {name:'Dil Toh Baccha Hai Ji', aliases:['dil to baccha hai ji'], tier:2, year:2011},
      {name:'Dil Juunglee', aliases:['dil junglee'], tier:2, year:2018},
      {name:'Dil Hai Tumhaara', aliases:['dil hai tumhara'], tier:2, year:2002},
      {name:'Dil Tera Aashiq', aliases:['dil tera ashiq'], tier:2, year:1993},
      {name:'Dil Maange More', aliases:[], tier:2, year:2004},

      {name:'Dil Ka Kya Kasoor', aliases:[], tier:3, year:1992},
      {name:'Dil Kya Kare', aliases:[], tier:3, year:1999},
      {name:'Dil Pe Mat Le Yaar', aliases:['dil pe mat le yar'], tier:3, year:2000},
      {name:'Dil Dosti Etc', aliases:['dil dosti etc.','dil dosti'], tier:3, year:2007},
      {name:'Dil Hai Betaab', aliases:['dil hai betab'], tier:3, year:1993},
      {name:'Dillagi', aliases:['dillagi 1999'], tier:3, year:1999},
      {name:'Pal Pal Dil Ke Paas', aliases:['ppdkp','pal pal dil ke pass'], tier:3, year:2019},
      {name:'Dil Ek Mandir', aliases:[], tier:3, year:1963},
      {name:'Dil Vil Pyar Vyar', aliases:['dil vil pyaar vyaar'], tier:3, year:2002},
      {name:'Dil Ne Jise Apna Kaha', aliases:[], tier:3, year:2004},
      {name:'Dil Apna Aur Preet Parai', aliases:['dil apna preet parai'], tier:3, year:1960},
      {name:'Dil Deke Dekho', aliases:[], tier:3, year:1959},
      {name:'Dil Aashna Hai', aliases:['dil ashna hai'], tier:3, year:1992},
      {name:'Dil Kaa Heera', aliases:['dil ka heera','dil ka hira'], tier:3, year:1979},
      {name:'Dil-E-Nadaan', aliases:['dil e nadaan','dile nadaan'], tier:3, year:1982},
      {name:'Dilwaala', aliases:['dilwala'], tier:3, year:1986},

      {name:'Do Dil', aliases:[], tier:4, year:1965},
      {name:'Dil Tera Diwana', aliases:['dil tera deewana'], tier:4, year:1962},
      {name:'Dil Aur Deewaar', aliases:['dil aur deewar'], tier:4, year:1978},
      {name:'Dil Tujhko Diya', aliases:['dil tujhko diya 1987'], tier:4, year:1987},
      {name:'Dil Farosh', aliases:[], tier:4, year:1927},
      {name:'Dil Daulat Duniya', aliases:['dil daulat aur duniya'], tier:4, year:1972},
      {name:'Dil Ka Raja', aliases:[], tier:4, year:1972},
      {name:'Dil Ki Rahen', aliases:['dil ki raahen'], tier:4, year:1973},
      {name:'Dil Diwana', aliases:['dil deewana'], tier:4, year:1974},
      {name:'Dil Se Mile Dil', aliases:[], tier:4, year:1978},
      {name:'Dil Ke Jharokhe Mein', aliases:['dil ke jharoke main'], tier:4, year:1997},
      {name:'Hum Aapke Dil Mein Rehte Hain', aliases:['hum aapke dil mein'], tier:4, year:1999},
      {name:'Dil Kabaddi', aliases:[], tier:4, year:2008},
      {name:'Dil Ne Phir Yaad Kiya', aliases:[], tier:4, year:1966},
      {name:'Dil Diya Dard Liya', aliases:[], tier:4, year:1966},
      {name:'Dil Pardesi Ho Gayaa', aliases:['dil pardesi ho gaya'], tier:4, year:2003},
      {name:'Dil Bole Hadippa', aliases:['dil bole hadipa'], tier:4, year:2009},
      {name:'Dil Jo Bhi Kahey', aliases:['dil jo bhi kahe'], tier:4, year:2005},

      /*
        These three were in other packs but missing here, so the game knew the
        films and still rejected them for the one prompt they most obviously
        answer. Found by scanning every pack for the diltitle name rule rather
        than by reading — which is how the next three will be found too.
      */
      {name:'Hum Dil De Chuke Sanam', aliases:['hddcs','hum dil de chuke'], tier:1, year:1999},
      {name:'Phir Bhi Dil Hai Hindustani', aliases:['pbdhh','phir bhi dil hai'], tier:2, year:2000},
      {name:'Lekar Hum Deewana Dil', aliases:['lhdd'], tier:4, year:2014},
    ]
  },
  {
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
  },
  {
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
      {name:'Deepika Padukone', aliases:['deepika'], tier:0, year:2007},
      {name:'Katrina Kaif', aliases:['katrina'], tier:0, year:2003},
      {name:'Anushka Sharma', aliases:['anushka'], tier:0, year:2008},

      {name:'Kareena Kapoor', aliases:['kareena','bebo'], tier:1, year:2000},
      {name:'Vidya Balan', aliases:['vidya'], tier:1, year:2005},
      {name:'Kangana Ranaut', aliases:['kangana'], tier:1, year:2006},
      {name:'Sonam Kapoor', aliases:['sonam'], tier:1, year:2007},

      {name:'Bipasha Basu', aliases:['bipasha'], tier:2, year:2001},
      {name:'Lara Dutta', aliases:['lara'], tier:2, year:2003},
      {name:'Asin', aliases:['asin thottumkal'], tier:2, year:2008},
      {name:'Dia Mirza', aliases:['diya mirza'], tier:2, year:2001},

      {name:'Amrita Rao', aliases:['amrita'], tier:3, year:2002},
      {name:'Esha Deol', aliases:['esha'], tier:3, year:2002},
      {name:'Ayesha Takia', aliases:['ayesha'], tier:3, year:2004},
      {name:'Shruti Haasan', aliases:['shruti'], tier:3, year:2009},

      {name:'Sameera Reddy', aliases:['sameera'], tier:4, year:2002},
      {name:'Celina Jaitly', aliases:['celina'], tier:4, year:2003},
      {name:'Minissha Lamba', aliases:['minissha'], tier:4, year:2005},
      {name:'Mugdha Godse', aliases:['mugdha'], tier:4, year:2008},
    ]
  },
  {
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
      {name:'Ae Dil Hai Mushkil', aliases:['adhm','ae dil'], tier:1, year:2016},

      {name:'Dil To Pagal Hai', aliases:['dtph','dil to pagal'], tier:2, year:1997},
      {name:'Veer-Zaara', aliases:['veer zaara','veer zara'], tier:2, year:2004},
      {name:'Kabhi Alvida Naa Kehna', aliases:['kank','kabhi alvida'], tier:2, year:2006},
      {name:'Cocktail', aliases:[], tier:2, year:2012},
      {name:'Student of the Year', aliases:['soty'], tier:2, year:2012},

      {name:'Deewana', aliases:[], tier:3, year:1992},
      {name:'Jab Tak Hai Jaan', aliases:['jthj','jab tak jaan'], tier:3, year:2012},
      {name:'Raanjhanaa', aliases:['ranjhana','raanjhana'], tier:3, year:2013},
      {name:'Barfi', aliases:['barfi!'], tier:3, year:2012},

      {name:'Judaai', aliases:['judai'], tier:4, year:1997},
      {name:'Mujhse Dosti Karoge', aliases:['mdk'], tier:4, year:2002},
      {name:'Tanu Weds Manu Returns', aliases:['twmr','tanu weds manu 2'], tier:4, year:2015},
      // Borderline: the film is a marriage under strain, and the third corner
      // (Priya's former fiance) is a subplot rather than the engine. Kept
      // because over-inclusion is the right error here — a player who reads it
      // as a triangle is not wrong enough to be told they are.
      {name:'Chalte Chalte', aliases:[], tier:4, year:2003},
    ]
  },
  {
    id:'noughties', kicker:'Name one…', title:'Bollywood movie from 2000–2010', hint:'Released in 2000 or later and 2010 or earlier.', icon:'📀',
    packDesc:'Name a 2000s film. 5 rounds — no repeats.',
    shortTitle:'2000s Bollywood movie',
    domainHint:['film','bollywood','2000','2005','2010'],
    /*
      The decade pack `nineties` never had a sequel, and the era rounds could
      not stand in for one: those cut a pack into thirds of its own answers, so
      they can say "the older third of Shah Rukh's films" but never "any Hindi
      film from the 2000s". The window is inclusive at both ends, matching how
      the prompt is worded and enforced by YEAR_WINDOWS in check-bank.py.
    */
    answers:[
      {name:'Lagaan', aliases:[], tier:0, year:2001},
      {name:'3 Idiots', aliases:['three idiots'], tier:0, year:2009},
      {name:'Kabhi Khushi Kabhie Gham', aliases:['k3g','kabhi khushi'], tier:0, year:2001},
      {name:'Om Shanti Om', aliases:['oso'], tier:0, year:2007},
      {name:'Dil Chahta Hai', aliases:['dch'], tier:0, year:2001},

      {name:'Rang De Basanti', aliases:['rdb'], tier:1, year:2006},
      {name:'Jab We Met', aliases:['jwm'], tier:1, year:2007},
      {name:'Taare Zameen Par', aliases:['tzp','taare zameen'], tier:1, year:2007},
      {name:'Dhoom', aliases:[], tier:1, year:2004},
      {name:'Munna Bhai MBBS', aliases:['munna bhai','munnabhai mbbs'], tier:1, year:2003},
      {name:'Chak De India', aliases:['chak de! india','chak de'], tier:1, year:2007},

      {name:'Swades', aliases:['swadesh'], tier:2, year:2004},
      {name:'Lage Raho Munna Bhai', aliases:['lrmb'], tier:2, year:2006},
      {name:'Jodhaa Akbar', aliases:['jodha akbar'], tier:2, year:2008},
      {name:'Bunty Aur Babli', aliases:['bunty babli'], tier:2, year:2005},
      {name:'Ghajini', aliases:['gajini'], tier:2, year:2008},

      {name:'Rock On', aliases:['rock on!!','rockon'], tier:3, year:2008},
      {name:'Wake Up Sid', aliases:['wakeup sid'], tier:3, year:2009},
      {name:'Jaane Tu Ya Jaane Na', aliases:['jtyjn','jaane tu'], tier:3, year:2008},
      {name:'Udaan', aliases:[], tier:3, year:2010},

      {name:'Dev D', aliases:['dev.d','devd'], tier:4, year:2009},
      {name:'Ishqiya', aliases:[], tier:4, year:2010},
      {name:'Peepli Live', aliases:['peepli'], tier:4, year:2010},
      {name:'Khosla Ka Ghosla', aliases:['khosla'], tier:4, year:2006},
    ]
  },
  {
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
      {name:'Kabhi Khushi Kabhie Gham', aliases:['k3g','kabhi khushi'], tier:0, year:2001},
      {name:'Band Baaja Baaraat', aliases:['bbb','band baja baraat'], tier:0, year:2010},

      {name:'Yeh Jawaani Hai Deewani', aliases:['yjhd'], tier:1, year:2013},
      {name:'2 States', aliases:['two states'], tier:1, year:2014},
      {name:'Monsoon Wedding', aliases:[], tier:1, year:2001},
      {name:'Vivah', aliases:[], tier:1, year:2006},

      {name:'Hum Saath Saath Hain', aliases:['hssh','hum saath saath'], tier:2, year:1999},
      {name:'Rab Ne Bana Di Jodi', aliases:['rnbdj','rab ne'], tier:2, year:2008},
      {name:'Tanu Weds Manu', aliases:['twm'], tier:2, year:2011},
      {name:'Mujhse Shaadi Karogi', aliases:['msk'], tier:2, year:2004},

      {name:'Namastey London', aliases:['namaste london'], tier:3, year:2007},
      {name:'Prem Ratan Dhan Payo', aliases:['prdp'], tier:3, year:2015},
      {name:'Badrinath Ki Dulhania', aliases:['bkd','badrinath'], tier:3, year:2017},
      {name:'Veere Di Wedding', aliases:['vdw'], tier:3, year:2018},

      {name:'Dolly Ki Doli', aliases:[], tier:4, year:2015},
      {name:'Shubh Mangal Saavdhan', aliases:['shubh mangal savdhan'], tier:4, year:2017},
    ]
  },
  {
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
    ]
  },
  {
    id:'remake', kicker:'Name one…', title:'Bollywood remake of another-language film', hint:'A Hindi film remade from a Tamil, Telugu, Malayalam or Kannada original.', icon:'🔁',
    packDesc:'Name a Hindi remake. 5 rounds — no repeats.',
    shortTitle:'Hindi remake',
    domainHint:['film','remake','tamil','telugu','malayalam','bollywood'],
    /*
      NOTE ON THE PROMPT. This pack answers "a Hindi film that IS a remake of a
      film in another language", which is the opposite direction from the
      question as originally worded ("a Bollywood movie that has been remade in
      another language"). The answers supplied were all of this kind — Ghajini,
      Drishyam, Kabir Singh and the rest are Hindi versions of southern
      originals, not Hindi films later remade elsewhere — so the prompt follows
      the answers rather than the other way round. The original direction is a
      perfectly good pack too; it is simply a different one, and would need
      different films.
    */
    answers:[
      {name:'Ghajini', aliases:['gajini'], tier:0, year:2008},
      {name:'Drishyam', aliases:[], tier:0, year:2015},
      {name:'Singham', aliases:[], tier:0, year:2011},
      {name:'Kabir Singh', aliases:[], tier:0, year:2019},

      {name:'Bhool Bhulaiyaa', aliases:['bhul bhulaiya','bhool bhulaiya'], tier:1, year:2007},
      {name:'Wanted', aliases:[], tier:1, year:2009},
      {name:'Bodyguard', aliases:[], tier:1, year:2011},
      {name:'Hera Pheri', aliases:[], tier:1, year:2000},

      {name:'Rowdy Rathore', aliases:['rowdy rathod'], tier:2, year:2012},
      {name:'Ready', aliases:[], tier:2, year:2011},
      {name:'Holiday', aliases:[], tier:2, year:2014},
      {name:'Vikram Vedha', aliases:[], tier:2, year:2022},

      {name:'Force', aliases:[], tier:3, year:2011},
      {name:'Gabbar Is Back', aliases:['gabbar is back'], tier:3, year:2015},
      {name:'Jersey', aliases:[], tier:3, year:2022},
      {name:'Saathiya', aliases:['sathiya'], tier:3, year:2002},

      {name:'Nayak', aliases:['nayak the real hero'], tier:4, year:2001},
      {name:'Billu', aliases:['billu barber'], tier:4, year:2009},
      {name:'Sadma', aliases:[], tier:4, year:1983},
      {name:'Chachi 420', aliases:['chachi420'], tier:4, year:1997},
    ]
  },
];
