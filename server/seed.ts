import { MongoClient } from 'mongodb';

const MONGODB_URI =
  'mongodb+srv://bolatan_db_user:28A0Oh00Ib4c3qrU@cluster0.ub5jkhi.mongodb.net/?appName=Cluster0';

const DB_NAME = 'igbe_news';

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000);

const articles = [
  {
    title: 'Ikorodu Road Expansion Project Reaches Milestone as Construction Enters Final Phase',
    slug: 'ikorodu-road-expansion-milestone',
    summary: 'The long-awaited expansion of the Ikorodu-Itoikin-Owutu-Agric road has reached 80% completion, bringing relief to commuters who have endured years of gridlock on the critical corridor.',
    body: `The long-awaited expansion of the Ikorodu-Itoikin-Owutu-Agric road has reached 80% completion, bringing relief to commuters who have endured years of gridlock on the critical corridor.

Lagos State Governor Babajide Sanwo-Olu, during an inspection tour on Tuesday, confirmed that the dualisation project is on track for completion by the end of the year.

"This road is a lifeline for the people of Ikorodu and the entire eastern axis of Lagos," the governor said. "We are committed to delivering it on schedule."

The 32-kilometre road serves as the primary link between Ikorodu and other parts of Lagos, carrying tens of thousands of commuters daily. Residents have long complained about the traffic congestion that defines the corridor, particularly during peak hours.

Local transport operator Wasiu Adeyemi, who has driven the route for over a decade, said the difference is already noticeable. "Before, you could spend three hours just trying to get to Ketu. Now, with the new lanes open in some sections, it is much better," he said.

The project includes the construction of new drainage channels, pedestrian bridges, and bus shelters along the route. Engineers on site said work on the remaining sections around the Baiyeku and Ijede junctions is progressing steadily.

Community leader Chief Tajudeen Oduyemi urged residents to be patient as the final stretch of construction continues. "We have waited this long. A few more months will not kill us. What matters is that the work is done properly," he said.

The road expansion is part of the Lagos State government's broader infrastructure push across the eastern axis, which also includes the planned Ikorodu ferry terminal upgrade.`,
    category: 'Politics',
    imageUrl: 'https://images.pexels.com/photos/5409303/pexels-photo-5409303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Richard Badejo',
    author: 'Adebola Okunade',
    location: 'Ikorodu Town',
    community: 'Igbe Laara',
    isFeatured: true,
    isBreaking: false,
    readTimeMinutes: 5,
    publishedAt: hoursAgo(2),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Traders at Ikorodu Main Market Count Losses After Midnight Fire Outbreak',
    slug: 'ikorodu-market-fire-losses',
    summary: 'A midnight fire has razed dozens of shops at the Ikorodu Main Market, destroying goods worth millions of naira and leaving traders counting heavy losses.',
    body: `A midnight fire has razed dozens of shops at the Ikorodu Main Market, destroying goods worth millions of naira and leaving traders counting heavy losses.

The inferno, which reportedly started around 1am on Monday, swept through the textile and provisions section of the market before firefighters from the Lagos State Fire and Rescue Service arrived on the scene.

Eyewitnesses said the fire spread rapidly due to the dense clustering of wooden stalls and the presence of highly flammable materials such as fabric, plastic containers, and cooking gas cylinders stored in some shops.

Madam Bola Ogunleye, a fabric trader who has operated in the market for over twenty years, broke down in tears as she surveyed the charred remains of her shop. "Everything is gone. My whole stock, my savings, everything I have worked for. I do not know where to start from," she said.

The cause of the fire is yet to be officially determined, though some traders suspect an electrical fault in one of the shops may have triggered the blaze. Officials from the Lagos State Emergency Management Agency (LASEMA) have begun an investigation.

The Iyaloja General of Ikorodu, Alhaja Risikat Ogunwenyokan, called on the state government to come to the aid of affected traders. "Many of these people lost everything. They need support to rebuild their businesses and feed their families," she said.

This is the third market fire in Ikorodu in the past two years, raising fresh concerns about fire safety standards and the need for modernised market infrastructure across the division.`,
    category: 'Business',
    imageUrl: 'https://images.pexels.com/photos/16155217/pexels-photo-16155217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'David Iloba',
    author: 'Funmilayo Adebayo',
    location: 'Ikorodu Town',
    community: 'Igbe Laara',
    isFeatured: true,
    isBreaking: true,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(4),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ikorodu City FC Clinches Promotion to Lagos Premier League After Dramatic Win',
    slug: 'ikorodu-city-fc-promotion',
    summary: "A last-minute goal from captain Saheed Okikiolu secured a 2-1 victory over Epe United, confirming Ikorodu City FC's promotion to the Lagos Premier League for the first time in the club's history.",
    body: `A last-minute goal from captain Saheed Okikiolu secured a 2-1 victory over Epe United, confirming Ikorodu City FC's promotion to the Lagos Premier League for the first time in the club's history.

The match, played at the Ikorodu Town Stadium on Sunday, drew a capacity crowd of over 5,000 supporters who erupted in celebration when Okikiolu headed home a corner kick in the fourth minute of added time.

"This means everything to us, to the club, and to the people of Ikorodu," an emotional Okikiolu said after the match. "We have worked so hard for this moment. To do it in front of our home fans is a dream come true."

The club, founded in 2018, has steadily climbed the ranks of grassroots football in Lagos. Head coach Femi Adesanya credited the achievement to discipline and community support. "These boys have trained hard every single day. The fans never gave up on us, even when results were not going our way," he said.

The promotion marks a significant milestone for sports development in Ikorodu, an area often overshadowed by mainland Lagos in terms of football infrastructure and investment.

Local government chairman Hon. Oluwaseun Adebiri promised the council would support the club with improved facilities. "Ikorodu City FC is our pride. We will upgrade the stadium and ensure the team has what it needs to compete at the premier level," he said.

The club will begin its Lagos Premier League campaign next season.`,
    category: 'Sports',
    imageUrl: 'https://images.pexels.com/photos/31533073/pexels-photo-31533073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'PraiseToby Praise',
    author: 'Ganiu Olawale',
    location: 'Ikorodu Town',
    community: 'Igbe Laara',
    isFeatured: true,
    isBreaking: false,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(6),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Imota Rice Mill to Double Production Capacity as Second Phase Launches',
    slug: 'imota-rice-mill-capacity-doubling',
    summary: "The Imota Rice Mill, already the largest in sub-Saharan Africa, is set to double its production capacity following the commissioning of its second phase by the Lagos State Government.",
    body: `The Imota Rice Mill, already the largest in sub-Saharan Africa, is set to double its production capacity following the commissioning of its second phase by the Lagos State Government.

The facility, located in Imota, a community in the Ikorodu division, currently processes 2.5 million 50kg bags of rice annually. With the second phase operational, that figure is expected to rise to over 5 million bags.

Commissioner for Agriculture Ms. Abisola Olusanya said the expansion would significantly reduce Lagos State's reliance on imported rice and create over 1,500 direct and indirect jobs for residents of the Ikorodu axis.

"Imota is now a cornerstone of Nigeria's food security strategy," Olusanya said during the commissioning ceremony. "This mill is proof that we can produce what we eat and eat what we produce."

Local farmers in the Ikorodu and Epe axes have been linked to the mill as out-growers, supplying paddy rice to the facility. Many said the relationship has transformed their livelihoods.

"Before now, we had nowhere to sell our paddy at a good price. The middlemen cheated us. Now, the mill buys directly from us and pays promptly," said farmer Musibau Lawal from Igbogbo.

Community leaders in Imota have however called for more investment in access roads and power supply to the area, noting that the mill's full potential cannot be realised without adequate infrastructure.`,
    category: 'Business',
    imageUrl: 'https://images.pexels.com/photos/36790085/pexels-photo-36790085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Ademola Adeola',
    author: 'Yetunde Bakare',
    location: 'Imota',
    community: 'Igbogbo',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(8),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Igbogbo Baiyeku Students Excel in WAEC as Pass Rate Hits Record High',
    slug: 'igbogbo-baiyeku-waec-excellence',
    summary: "Students across secondary schools in the Igbogbo Baiyeku area recorded the best WAEC results in the division's history, with over 78% achieving five credits including English and Mathematics.",
    body: `Students across secondary schools in the Igbogbo Baiyeku area recorded the best WAEC results in the division's history, with over 78% achieving five credits including English and Mathematics.

The results, released by the West African Examinations Council last week, showed a marked improvement from the previous year's 61% pass rate, a jump educators have attributed to a community-driven tutoring initiative launched in 2023.

The initiative, spearheaded by the Igbogbo Baiyeku Ikorodu Community Development Association, brought together volunteer teachers, retired educators, and university students to provide free after-school coaching for SS3 students across six public secondary schools.

"We realised we could not wait for government alone," said coordinator Mr. Babatunde Oshodi. "The community came together, contributed funds, and committed time. This result is the fruit of that collective effort."

Odunayo Adekoya, a student of Igbogbo College who scored A1 in six subjects, including Further Mathematics, said the coaching sessions made the difference. "The volunteer teachers broke down difficult topics in ways our regular teachers did not always have time to do. They believed in us," she said.

Education secretary for the Ikorodu division Mrs. Folashade Ogunwolu praised the community effort and said the state government would study the model for possible replication in other divisions.

"This is what happens when communities take ownership of their children's education," she said.`,
    category: 'Education',
    imageUrl: 'https://images.pexels.com/photos/34162709/pexels-photo-34162709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Tosin Olowoleni',
    author: 'Kemi Adesanya',
    location: 'Igbogbo',
    community: 'Igbogbo',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(10),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ikorodu General Hospital Gets New Maternity Ward as Maternal Mortality Drops',
    slug: 'ikorodu-hospital-maternity-ward',
    summary: 'A newly built 60-bed maternity ward has been commissioned at the Ikorodu General Hospital, part of efforts to reduce maternal mortality in the densely populated division.',
    body: `A newly built 60-bed maternity ward has been commissioned at the Ikorodu General Hospital, part of efforts to reduce maternal mortality in the densely populated division.

The facility, funded through the Lagos State Health Fund and supported by a coalition of local NGOs, includes a modern labour ward, neonatal care unit, and dedicated operating theatre for emergency caesarean sections.

Medical Director Dr. Oluwaseun Odukoya said the new ward would ease the severe overcrowding that previously forced some expectant mothers to share beds. "We were delivering over 200 babies a month in a space designed for half that number. This expansion changes everything," he said.

Before the new ward, pregnant women in critical condition were sometimes referred to the Lagos Island Maternity Hospital, a journey that could take over two hours through Ikorodu Road traffic.

Community health worker Mrs. Titilope Ojo, who has served in Ikorodu for fifteen years, said the impact is already visible. "In the past three months since the ward opened, we have not had to refer a single emergency case out of Ikorodu. That is a big deal," she said.

The hospital has also recruited four new obstetricians and six midwives to staff the facility. Local traditional rulers, led by the Ayangburen of Ikorodu, Oba Kabiru Shotobi, attended the commissioning and commended the collaborative effort.`,
    category: 'Health',
    imageUrl: 'https://images.pexels.com/photos/30688589/pexels-photo-30688589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Ninthgrid',
    author: 'Sade Williams',
    location: 'Ikorodu Town',
    community: 'Igbe Laara',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(12),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ikorodu Oga Day Celebration Draws Thousands as Ayangburen Calls for Unity',
    slug: 'ikorodu-oga-day-celebration',
    summary: 'The annual Ikorodu Oga Day celebration brought thousands of residents and diaspora members together, with the Ayangburen of Ikorodu using the occasion to call for peace and unity.',
    body: `The annual Ikorodu Oga Day celebration brought thousands of residents and diaspora members together, with the Ayangburen of Ikorodu using the occasion to call for peace and unity.

The colourful festival, held at the Ikorodu Town Hall grounds, featured traditional drumming, the iconic Aga dance, and a showcase of local cuisine including ofada rice, asaro, and the famous Ikorodu panla fish pepper soup.

Oba Kabiru Shotobi, the Ayangburen of Ikorodu, in his address, emphasised the importance of unity among the various communities that make up the Ikorodu division. "Ikorodu is one. Whether you are from Ijede, Igbogbo, Imota, or the town itself, we are all one people with one destiny," he said.

The celebration also served as a homecoming event for members of the Ikorodu diaspora, many of whom travelled from the United Kingdom, the United States, and Canada to attend.

Chief Mrs. Modupe Oluwo, a diaspora returnee who has lived in London for thirty years, said the event reconnects her with her roots. "Every year I look forward to this. It reminds me of who I am and where I come from. No matter how long I stay abroad, Ikorodu is home," she said.

The festival included a cultural pageant, a youth football tournament, and an awards ceremony honouring distinguished sons and daughters of Ikorodu for their contributions to the community.`,
    category: 'Culture',
    imageUrl: 'https://images.pexels.com/photos/38096582/pexels-photo-38096582.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Sani Maikatanga',
    author: 'Biodun Oloyede',
    location: 'Ikorodu Town',
    community: 'Igbe Laara',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(24),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Residents Cry Out Over Erosion Threatening Homes in Ijede Community',
    slug: 'ijede-erosion-threat',
    summary: 'Residents of Ijede, a fast-growing community in the Ikorodu division, have raised the alarm over severe gully erosion that is threatening to swallow homes and cut off access roads.',
    body: `Residents of Ijede, a fast-growing community in the Ikorodu division, have raised the alarm over severe gully erosion that is threatening to swallow homes and cut off access roads.

The erosion, worsened by heavy rainfall in recent weeks, has already claimed portions of several compounds along Okeletu Road, with some families forced to abandon their homes.

"We have been reporting this for over two years. Nothing has been done. Now the gully is at our doorstep. If the rains continue, we will lose everything," said Mr. Samuel Ogunrinde, a resident whose compound wall collapsed into the gully last week.

Community development chairman Mr. Olalekan Osho said the association has written multiple letters to the Lagos State Ministry of the Environment and the Ikorodu local government without a concrete response.

A geotechnical engineer who visited the site, Dr. Adeyinka Adewale, warned that the situation could worsen rapidly without immediate intervention. "The soil here is highly erodible. Without proper channeling of storm water and slope stabilisation, the gully will keep expanding," he said.

Residents have called on the state government to deploy emergency intervention before the next rainy season peak, warning that the erosion could eventually threaten the main Ijede-Ikorodu road.`,
    category: 'Community',
    imageUrl: 'https://images.pexels.com/photos/36883970/pexels-photo-36883970.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Yomi Owobo',
    author: 'Adewale Johnson',
    location: 'Ijede',
    community: 'Ijede',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(27),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ikorodu Youth Empowerment Scheme Graduates 500 Trainees in Tech Skills',
    slug: 'ikorodu-youth-tech-graduation',
    summary: 'Five hundred young people from across the Ikorodu division have graduated from a youth empowerment scheme focused on digital and technology skills, with many already securing jobs.',
    body: `Five hundred young people from across the Ikorodu division have graduated from a youth empowerment scheme focused on digital and technology skills, with many already securing jobs.

The programme, a partnership between the Ikorodu local government and a consortium of tech companies, trained participants in web development, data analysis, digital marketing, and graphic design over a six-month period.

Chairman of the Ikorodu local government area, Hon. Oluwaseun Adebiri, said the initiative was designed to tackle youth unemployment by equipping young people with skills that are in demand in the digital economy.

"We cannot give everyone a government job, but we can give them skills that will make them employable or enable them to create their own opportunities," he said at the graduation ceremony.

One of the graduates, 24-year-old Kehinde Balogun from Igbogbo, said she has already secured a remote role with a Lagos-based tech startup. "Before this programme, I was selling provisions in my mother's shop. Now I am a junior web developer earning more than I ever imagined at this age," she said.

The scheme is the second cohort of the programme, with plans to train 1,000 more young people in the next phase. Organisers said applications for the next cohort would open next month.`,
    category: 'Community',
    imageUrl: 'https://images.pexels.com/photos/33918218/pexels-photo-33918218.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Olarotimi Awolaja',
    author: 'Tunde Okafor',
    location: 'Ikorodu Town',
    community: 'Igbogbo',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(30),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Traditional Rulers in Ikorodu Back State Government on Land Reform',
    slug: 'ikorodu-rulers-land-reform',
    summary: "Traditional rulers across the Ikorodu division have thrown their weight behind the Lagos State Government's land reform initiative aimed at curbing land grabbing and illegal sales.",
    body: `Traditional rulers across the Ikorodu division have thrown their weight behind the Lagos State Government's land reform initiative aimed at curbing land grabbing and illegal sales.

The initiative, announced last month, seeks to digitise land records and strengthen the enforcement of the Lagos State Land Administration Law, which prescribes stiff penalties for land grabbers popularly known as "omo onile."

The Ayangburen of Ikorodu, Oba Kabiru Shotobi, speaking at a stakeholders' forum, said traditional rulers have a critical role to play in ensuring the success of the reform. "We are the custodians of our land. We must work with government to ensure that land transactions are transparent and lawful," he said.

The forum, held at the Ikorodu Town Hall, brought together baales, community leaders, real estate developers, and officials of the Lagos State Lands Bureau.

Several residents shared harrowing experiences of losing money to fraudulent land sales. Mr. Gbenga Oluwatobi, a civil servant, narrated how he lost his life savings to a syndicate that sold him land belonging to another family. "I paid N8 million for a plot only to discover three other people had been sold the same land. This reform is long overdue," he said.

The Lagos State Lands Bureau said a new digital portal would be launched to allow residents verify land titles before purchase.`,
    category: 'Politics',
    imageUrl: 'https://images.pexels.com/photos/11390779/pexels-photo-11390779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Daniel Sikpi',
    author: 'Rasaq Olowolagba',
    location: 'Ikorodu Town',
    community: 'Igbe Laara',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 4,
    publishedAt: hoursAgo(33),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Epe Road Crash Leaves Three Dead as Frantic Efforts Continue to Improve Safety',
    slug: 'ikorodu-epe-road-crash',
    summary: 'A fatal accident on the Ikorodu-Epe expressway has claimed three lives, renewing calls for improved road safety measures on the busy corridor.',
    body: `A fatal accident on the Ikorodu-Epe expressway has claimed three lives, renewing calls for improved road safety measures on the busy corridor.

The crash, which occurred in the early hours of Saturday, involved a commercial bus and a truck near the Imota junction. Officials from the Federal Road Safety Corps (FRSC) said the bus driver lost control while attempting to overtake the truck at high speed.

Three passengers died at the scene while seven others were taken to the Ikorodu General Hospital for treatment. Two are said to be in critical condition.

FRSC sector commander for the Ikorodu axis, Mr. Akin Fashola, blamed the crash on speeding and reckless driving, which he said are rampant on the expressway. "We have been conducting regular patrols, but drivers continue to ignore safety regulations. This is the result," he said.

Residents of communities along the expressway have repeatedly called for the installation of speed bumps, better lighting, and increased police presence, particularly at known black spots.

"We have buried too many young people on this road. Something must be done before more lives are lost," said Chief Muritala Osho, a community leader in Imota.`,
    category: 'Community',
    imageUrl: 'https://images.pexels.com/photos/37567064/pexels-photo-37567064.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'EDRIS IBRAHEEM',
    author: 'Femi Adekoya',
    location: 'Imota',
    community: 'Ijede',
    isFeatured: false,
    isBreaking: true,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(36),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ikorodu Boat Terminal Upgrade to Ease Road Pressure as Ferry Commuters Increase',
    slug: 'ikorodu-boat-terminal-upgrade',
    summary: "The Lagos State Waterways Authority has announced a major upgrade of the Ikorodu ferry terminal, aiming to triple passenger capacity and reduce pressure on the congested Ikorodu road corridor.",
    body: `The Lagos State Waterways Authority has announced a major upgrade of the Ikorodu ferry terminal, aiming to triple passenger capacity and reduce pressure on the congested Ikorodu road corridor.

The project, which is expected to be completed within eighteen months, will include the construction of a new jetty, expanded waiting halls, improved parking facilities, and the deployment of larger ferries.

General Manager of the Lagos State Waterways Authority (LASWA), Mr. Oluwadamilola Emmanuel, said the upgrade is part of the state government's strategy to develop water transportation as a viable alternative to road travel.

"The Ikorodu to Lagos Island route is our busiest water route. Demand has grown beyond what the current terminal can handle. This upgrade will transform the experience for commuters," he said.

Regular ferry commuter Mrs. Folake Adesanya welcomed the news. "The boat is the only way I can get to my office on the Island in under an hour. But the terminal is always crowded and uncomfortable. An upgrade is exactly what we need," she said.

Currently, over 15,000 passengers use the Ikorodu ferry terminal weekly, with numbers growing as road traffic worsens. The upgraded facility is expected to handle up to 50,000 passengers weekly.`,
    category: 'Business',
    imageUrl: 'https://images.pexels.com/photos/16114746/pexels-photo-16114746.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'David Iloba',
    author: 'Lola Ogunyemi',
    location: 'Ikorodu Town',
    community: 'Ebute',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(48),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ikorodu-born Actress Nominated for Africa Movie Academy Award',
    slug: 'ikorodu-actress-amaa-nomination',
    summary: 'Rising Nollywood star and Ikorodu native Titilope Bakare has been nominated for Best Actress in a Leading Role at the Africa Movie Academy Awards for her performance in "Omo Ikorodu".',
    body: `Rising Nollywood star and Ikorodu native Titilope Bakare has been nominated for Best Actress in a Leading Role at the Africa Movie Academy Awards for her performance in "Omo Ikorodu".

The film, which tells the story of a young woman navigating life and ambition in the bustling Ikorodu community, has received critical acclaim since its release earlier this year.

Bakare, 28, who grew up in the Ebute area of Ikorodu, said the nomination is a validation of her decision to pursue acting against the wishes of her family. "My parents wanted me to be a lawyer. I chose the stage. This nomination tells me I made the right choice," she said.

The actress trained at the Pefti Film Institute in Lagos and has appeared in several Yoruba films before her breakout role in "Omo Ikorodu."

Director of the film, Kunle Afolayan, praised Bakare's talent and dedication. "Titilope is one of the most natural actors I have worked with. She brought authenticity to the role because she lived the experience. She is Ikorodu through and through," he said.

The Africa Movie Academy Awards ceremony will take place in Lagos next month.`,
    category: 'Culture',
    imageUrl: 'https://images.pexels.com/photos/29333519/pexels-photo-29333519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'alameen .ng',
    author: 'Seyi Olanrewaju',
    location: 'Ikorodu Town',
    community: 'Ebute',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(52),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Cholera Outbreak Contained in Ijede as Health Officials Intensify Surveillance',
    slug: 'ijede-cholera-outbreak-contained',
    summary: 'A cholera outbreak that affected over forty residents of the Ijede community has been contained following a rapid response from the Lagos State Ministry of Health.',
    body: `A cholera outbreak that affected over forty residents of the Ijede community has been contained following a rapid response from the Lagos State Ministry of Health.

The outbreak, traced to contaminated water from a local stream used by some residents for domestic purposes, was first reported two weeks ago. No deaths have been recorded.

Dr. Eniola Okafor, the state epidemiologist who led the response team, said the situation was brought under control through a combination of medical intervention, water chlorination, and community sensitisation.

"We treated all affected persons, chlorinated the water sources, and educated residents on the importance of boiling water before use and maintaining proper hygiene," she said.

The outbreak highlights the persistent challenge of access to clean water in some communities within the Ikorodu division. Many residents in Ijede and surrounding areas rely on streams and wells as the public water supply remains unreliable.

Community leader Alhaji Lateef Ogunbambi called for urgent investment in water infrastructure. "We have been asking for pipe-borne water for years. If our people had clean water, this outbreak would not have happened," he said.`,
    category: 'Health',
    imageUrl: 'https://images.pexels.com/photos/30677597/pexels-photo-30677597.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Ninthgrid',
    author: 'Adaeze Obi',
    location: 'Ijede',
    community: 'Ijede',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(56),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ikorodu Youths Launch Clean-Up Initiative to Tackle Waste Crisis',
    slug: 'ikorodu-youths-clean-up-initiative',
    summary: 'A group of young volunteers in Ikorodu has launched a community clean-up initiative aimed at tackling the growing waste management crisis in the division.',
    body: `A group of young volunteers in Ikorodu has launched a community clean-up initiative aimed at tackling the growing waste management crisis in the division.

The initiative, tagged "Clean Ikorodu," brings together over 200 young people who spend their weekends clearing drainages, collecting refuse, and sensitising residents on proper waste disposal.

Founder of the initiative, 26-year-old Ademola Oshinowo, said he was moved to act after noticing the mounting refuse heaps and blocked drainages that contribute to flooding during the rainy season.

"We cannot keep waiting for government to do everything. This is our community. If we do not take care of it, who will?" he said during a clean-up exercise along Tunga Road.

The volunteers, equipped with gloves, shovels, and waste bags provided through personal contributions and donations from local businesses, have so far cleared refuse from major markets, bus stops, and drainage channels across Ikorodu Town, Igbogbo, and Ijede.

The Lagos State Waste Management Authority (LAWMA) has commended the initiative and pledged to support it with waste collection trucks and protective gear for the volunteers.`,
    category: 'Community',
    imageUrl: 'https://images.pexels.com/photos/36703363/pexels-photo-36703363.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Ademola Adeola',
    author: 'Bola Adekoya',
    location: 'Ikorodu Town',
    community: 'Igbe Laara',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(72),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Elepe Community Gets New Primary School as Parents Rejoice',
    slug: 'elepe-gets-new-primary-school',
    summary: 'The Elepe community in Ijede, Ikorodu, has welcomed a newly built primary school that will serve over 300 children who previously had to walk miles to the nearest school.',
    body: `The Elepe community in Ijede, Ikorodu, has welcomed a newly built primary school that will serve over 300 children who previously had to walk miles to the nearest school.

The six-classroom block, built through a partnership between the Lagos State Universal Basic Education Board (SUBEB) and a local education foundation, was commissioned on Wednesday.

Before the school was built, children in Elepe had to walk over three kilometres to the nearest primary school in Ijede, a journey many parents said was unsafe, especially during the rainy season.

"We are so happy. Our children can now go to school close to home. Before, some parents just kept their children at home because the journey was too far and dangerous," said Mrs. Kudirat Adekoya, a mother of three.

The school includes a library, a staff room, and toilet facilities. Head teacher Mrs. Folake Ogunleye said the community's involvement in the project was key to its success.

"The parents themselves helped to clear the land and mould blocks. This is their school and they know it," she said.

The Lagos State Commissioner for Education, who commissioned the project, promised that more schools would be built in underserved communities across the Ikorodu division.`,
    category: 'Education',
    imageUrl: 'https://images.pexels.com/photos/6346833/pexels-photo-6346833.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Erique Erufu Onojoserio',
    author: 'Biodun Oloyede',
    location: 'Elepe',
    community: 'Elepe',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(80),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Ginti Market Traders Appeal for Modern Stall Construction',
    slug: 'ginti-market-traders-appeal',
    summary: 'Traders at the Ginti market in Ijede, Ikorodu, have appealed to the local government for the construction of modern stalls to replace the dilapidated wooden structures that currently serve as their marketplace.',
    body: `Traders at the Ginti market in Ijede, Ikorodu, have appealed to the local government for the construction of modern stalls to replace the dilapidated wooden structures that currently serve as their marketplace.

The market, which serves the Ginti and surrounding communities, has not seen any significant renovation in over fifteen years, according to traders.

"We are selling our goods in stalls that leak when it rains. Some of the wooden structures are so old they could collapse at any time. We need help," said Mr. Saheed Ogunbambi, the Babaloja of Ginti market.

The traders, numbering over 200, said they have contributed funds multiple times to carry out minor repairs but lack the resources for a full-scale renovation.

A representative of the Ikorodu local government who visited the market, Mrs. Bisi Odukoya, promised that the council would include the Ginti market renovation in its next budget cycle.

"We understand the challenges the traders are facing. The Ginti market is an important economic hub for that part of Ikorodu and we will not neglect it," she said.`,
    category: 'Business',
    imageUrl: 'https://images.pexels.com/photos/10671275/pexels-photo-10671275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Adedire Abiodun',
    author: 'Funmilayo Adebayo',
    location: 'Ginti',
    community: 'Ginti',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(84),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Oreyo Residents Celebrate as New Transformer Ends Years of Darkness',
    slug: 'oreyo-new-transformer',
    summary: 'Residents of Oreyo, a community in the Ikorodu division, are celebrating after a new transformer was installed, ending years of erratic power supply that had crippled businesses and made life difficult for residents.',
    body: `Residents of Oreyo, a community in the Ikorodu division, are celebrating after a new transformer was installed, ending years of erratic power supply that had crippled businesses and made life difficult for residents.

The 500KVA transformer, donated through a partnership between the Ikeja Electric Distribution Company and the local government, was commissioned on Monday.

Before the installation, residents of Oreyo had endured over three years of near-total blackout after the community's only transformer broke down and was vandalised while awaiting repairs.

"We have suffered. I run a barbing salon and I had to buy a generator that I could barely afford to fuel. Now, with electricity restored, I can work properly again," said Mr. Ganiyu Oshodi, a resident.

Community chairman Alhaji Musibau Ogunbiyi said the restoration of power would transform the local economy. "Many businesses had shut down because of the darkness. We expect them to reopen now. This is a new beginning for Oreyo," he said.

The community has however been urged to protect the new transformer from vandalism, with the local government promising to support the installation of a protective fence around the facility.`,
    category: 'Community',
    imageUrl: 'https://images.pexels.com/photos/33918218/pexels-photo-33918218.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Olarotimi Awolaja',
    author: 'Adewale Johnson',
    location: 'Oreyo',
    community: 'Oreyo',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(90),
    source: 'IGBE News',
    isAggregated: false,
  },
  {
    title: 'Igboke Community Youths Organise Free Health Screening for Residents',
    slug: 'igboke-free-health-screening',
    summary: 'Youths in the Igboke community of Ikorodu have organised a free health screening programme that saw over 200 residents tested for hypertension, diabetes, and other common conditions.',
    body: `Youths in the Igboke community of Ikorodu have organised a free health screening programme that saw over 200 residents tested for hypertension, diabetes, and other common conditions.

The programme, held at the Igboke town hall, was put together by the Igboke Youth Development Association in partnership with a team of volunteer medical doctors and nurses from the Ikorodu General Hospital.

"We noticed that many of our elderly parents were living with conditions they did not know about. Some had dangerously high blood pressure and did not realise it. We decided to act," said coordinator Mr. Wasiu Balogun.

Over 200 residents were screened during the one-day programme. Twelve people were referred to the Ikorodu General Hospital for further treatment after the screening revealed conditions requiring medical attention.

Dr. Oluwafunmilayo Okafor, who led the medical team, commended the initiative. "This is exactly the kind of community-driven healthcare intervention we need. Early detection saves lives," she said.

The youth association said it plans to make the health screening a quarterly event and is seeking partnerships with pharmaceutical companies to provide free medication for those diagnosed with chronic conditions.`,
    category: 'Health',
    imageUrl: 'https://images.pexels.com/photos/34185202/pexels-photo-34185202.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageCredit: 'Speak Media Uganda',
    author: 'Sade Williams',
    location: 'Igboke',
    community: 'Igboke',
    isFeatured: false,
    isBreaking: false,
    readTimeMinutes: 3,
    publishedAt: hoursAgo(96),
    source: 'IGBE News',
    isAggregated: false,
  },
];

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  await db.collection('articles').drop().catch(() => {});
  const result = await db.collection('articles').insertMany(articles);
  await db.collection('articles').createIndex({ slug: 1 }, { unique: true });
  await db.collection('articles').createIndex({ category: 1 });
  await db.collection('articles').createIndex({ community: 1 });
  await db.collection('articles').createIndex({ publishedAt: -1 });

  console.log(`Inserted ${result.insertedCount} articles into ${DB_NAME}`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
