export const PACK_AWARD = {
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
    {name:'Dilwale Dulhania Le Jayenge', aliases:['ddlj','dilwale dulhania'], tier:0, year:1996},
    {name:'Lagaan', aliases:[], tier:0, year:2002},
    {name:'3 Idiots', aliases:['three idiots'], tier:0, year:2010},
    {name:'Black', aliases:[], tier:0, year:2006},
    {name:'Dangal', aliases:[], tier:0, year:2017},
    {name:'Kuch Kuch Hota Hai', aliases:['kkhh','kuch kuch'], tier:0, year:1999},
    {name:'Devdas', aliases:[], tier:0, year:2003},
    {name:'Mother India', aliases:[], tier:0, year:1958},

    {name:'Mughal-e-Azam', aliases:['mughal e azam','mughal azam'], tier:1, year:1961},
    {name:'Anand', aliases:[], tier:1, year:1972},
    {name:'Hum Aapke Hain Koun', aliases:['hahk','hum aapke hain kaun'], tier:1, year:1995},
    {name:'Rang De Basanti', aliases:['rdb'], tier:1, year:2007},
    {name:'Taare Zameen Par', aliases:['tzp','tare zameen par','taare zameen'], tier:1, year:2008},
    {name:'Maine Pyar Kiya', aliases:['mpk'], tier:1, year:1990},
    {name:'Qayamat Se Qayamat Tak', aliases:['qsqt','kayamat se kayamat tak'], tier:1, year:1989},
    {name:'Dil To Pagal Hai', aliases:['dtph','dil to pagal'], tier:1, year:1998},
    {name:'Hum Dil De Chuke Sanam', aliases:['hddcs','hum dil de chuke'], tier:1, year:2000},
    {name:'Dabangg', aliases:['dabang'], tier:1, year:2011},
    {name:'Laapataa Ladies', aliases:['laapata ladies','lapata ladies'], tier:1, year:2025},

    {name:'Jodhaa Akbar', aliases:['jodha akbar'], tier:2, year:2009},
    {name:'Queen', aliases:[], tier:2, year:2015},
    {name:'Deewaar', aliases:['deewar','diwaar'], tier:2, year:1976},
    {name:'Guide', aliases:[], tier:2, year:1967},
    {name:'Zindagi Na Milegi Dobara', aliases:['znmd'], tier:2, year:2012},
    {name:'Bajirao Mastani', aliases:['bajirao'], tier:2, year:2016},
    {name:'Gully Boy', aliases:[], tier:2, year:2020},
    {name:'Bhaag Milkha Bhaag', aliases:['bmb'], tier:2, year:2014},
    {name:'Kaho Naa Pyaar Hai', aliases:['knph','kaho na pyar hai'], tier:2, year:2001},
    {name:'Veer-Zaara', aliases:['veer zaara','veer zara'], tier:2, year:2005},
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
};
