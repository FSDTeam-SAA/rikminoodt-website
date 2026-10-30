import type { LanguageCode } from "@/components/providers/LanguageProvider";

export type ExploreStory = {
  id: string;
  title: string;
  theme: string;
  subject: string;
  specialMessage: string;
  characterCount: number;
  ageCategory: string;
  creatorName: string;
  illustrationStyle: string;
  description: string;
  finalText?: string;
  coverImageUrl: string;
  photos: ReadonlyArray<{ src: string; alt: string }>;
  storyPages: ReadonlyArray<{ image: string; text: string }>;
};

const visuals = {
  pirate: {
    coverImageUrl: "/images/explore-stories/pirate-cover-000.png",
    photos: [
      { src: "/images/explore-stories/tanvir.png", alt: "Tanvir" },
    ],
    storyImages: Array.from({ length: 13 }, (_, index) => `/images/explore-stories/pirate-page-${String(index).padStart(3, "0")}.png`),
  },
  dinosaur: {
    coverImageUrl: "/images/explore-stories/dinosaur-cover-000.png",
    photos: [
      { src: "/images/explore-stories/rafiul.jpeg", alt: "Rafiul" },
      { src: "/images/explore-stories/amint.png", alt: "Amit" },
    ],
    storyImages: Array.from({ length: 13 }, (_, index) => `/images/explore-stories/dinosaur-page-${String(index).padStart(3, "0")}.png`),
  },
  space: {
    coverImageUrl: "/images/explore-stories/space-cover-000.png",
    photos: [
      { src: "/images/explore-stories/jishad.jpeg", alt: "Jishad" },
    ],
    storyImages: Array.from({ length: 13 }, (_, index) => `/images/explore-stories/space-page-${String(index).padStart(3, "0")}.png`),
  },
} as const;

type ExploreStoryKey = keyof typeof visuals;

const storyTexts: Record<ExploreStoryKey, readonly string[]> = {
  pirate: [
    "On a bright, sunny afternoon, Tanvir Parkar sat eagerly in his backyard garden. An old, yellowed treasure map lay on the wooden table before him, and every faded line filled him with curiosity.\n\nBubbles, his small orange fish, twirled energetically in the bowl beside him. The garden smelled of flowers, while a salty breeze from the nearby sea whispered promises of adventure.\n\n\"Look, Bubbles,\" Tanvir said, pointing at a marked X. \"This could be my next big treasure adventure!\"",
    "That evening, Tanvir gathered with his parents in the warm living room. He placed Bubbles' little travel bowl on the table and explained that he wanted to go on a pirate-themed treasure hunt.\n\nStanding tall, he practised his polite pirate manners. \"Respect and honour always, mates!\" he said with a grin, and his parents smiled at his confidence.\n\nTanvir knew he could handle the adventure with kindness and respect, just like the brave pirates in the stories he loved.",
    "The next day, Tanvir arrived at a rocky beach cove as the sun painted the sky orange. Some local children were already digging near the waves, so he politely offered to share the clues on his treasure map.\n\nThe children pushed the map aside and laughed at his ideas. The salty air mixed with Tanvir's disappointment as he wondered how he could earn their respect.\n\nInstead of giving up, he stepped back, took a breath, and decided to find a kinder way to join the adventure.",
    "That night, Tanvir sat by the beach campfire and spoke quietly to Bubbles. He remembered Captain Mira's stories, which taught that respect and cleverness made a great pirate.\n\nHe decided not to compete with the other children. He would show kindness, share what he knew, and let his actions speak for him.\n\nAs the tide moved steadily toward the shore, Tanvir felt a calm courage rise inside him and dreamed of a better tomorrow.",
    "At dawn, Tanvir returned to the beach with a warm, friendly smile. He pointed to shells and marks on the rocks that he had carefully studied from his map.\n\n\"Let's combine our efforts,\" he said. \"I know some tricks that could help us find hidden spots.\" The children paused and listened with curiosity.\n\nTanvir felt hope growing again. His kindness was opening a door, and the salty breeze felt like a fresh start.",
    "By late morning, the shore buzzed with laughter and shared stories. Tanvir and the children dug carefully in the warm sand, listening respectfully to one another's discoveries.\n\nTanvir explained how certain shells could mark hidden treasure paths. Bubbles watched happily from his bowl, his scales sparkling in the sunlight.\n\nTanvir discovered that adventures are much better when they are shared with friends who care.",
    "Near the seaweed-covered rocks, the group uncovered an old wooden chest buried deep in the sand. Excitement quickly turned into a disagreement when some children wanted to keep it secret.\n\nTanvir's heart tightened with worry. \"We should respect each other,\" he said softly, while the sea air suddenly felt heavy around them.\n\nHe paused to think about what respect truly meant and gathered the courage to guide his new friends.",
    "Sitting in a circle on the warm sand, Tanvir reminded everyone of Captain Mira's lesson. \"Sharing treasure builds friendship and respect,\" he said calmly.\n\nThe children listened as Captain Mira nodded nearby. Slowly, their worried faces softened and they began to agree with one another.\n\nTanvir felt proud as trust grew between the group, strong like a rope made from many threads.",
    "Together, the children unlocked the old chest. Inside there was no gold—only letters, maps, and colourful drawings left by adventurers long ago.\n\nThey traced the faded ink and bright pictures with wonder. Tanvir held up a carefully drawn map and smiled at his friends.\n\n\"This is a treasure of stories and friendship, not gold coins,\" he said, feeling connected to everyone around him.",
    "Later that afternoon, Tanvir and his new friends spread art supplies across the sand. They added their own drawings and messages about respect and friendship to the chest's collection.\n\nBubbles floated nearby as paintbrushes dipped into bright blues and greens. Laughter and waves filled the air while the children worked together.\n\n\"This is our story now,\" Tanvir said. It was a story full of kindness, teamwork, and respect.",
    "As the sunset turned the sky orange and pink, Tanvir sat on a large rock beside the shore. He held the updated treasure chest close and remembered how respect had turned strangers into friends.\n\n\"I never thought respect could be such a treasure,\" he whispered to Bubbles. He knew the day had never been about finding gold.\n\nIt had been about kindness, understanding, and the friendships that grew when people listened to one another.",
    "Twilight settled over the beach as the children waved goodbye beneath the first stars. Tanvir packed his things carefully and promised to return with more adventures to share.\n\nBubbles flicked his fins happily in the bowl, a tiny symbol of friendship's lasting glow. The ocean hummed a quiet lullaby nearby.\n\nTanvir felt confident and kind, ready for every journey waiting ahead.",
    "Beneath a calm, starry sky, Tanvir shared one final message. \"Respect and kindness are the real treasures in any adventure,\" he said gently.\n\nBubbles glimmered like a tiny star beside him. Tanvir knew that every journey becomes richer when it is guided by care.\n\nHe hoped every reader would carry that treasure inside their heart, wherever their own adventure might lead.",
  ],
  dinosaur: [
    "It was Rishad's birthday morning, and light streamed into his cosy room. Wearing his favourite green animal shirt, he smiled and said, \"Today is my special day!\"\n\nDownstairs, pancakes sizzled in the kitchen while Grandpa Kumar waited with a gentle smile. The warm, sweet smell made Rishad feel proud and happy.\n\nHe could hardly wait to explore. \"Today is going to be an adventure!\" he cheered as birds sang outside.",
    "Rishad sat on the living-room floor, surrounded by dinosaur drawings and coloured pencils. \"Look, Grandpa, I am drawing the dinosaurs I want to meet!\" he said happily.\n\nGrandpa Kumar packed a small backpack and told him he was ready for a big adventure. Sunlight filled the room and made every colour shine.\n\nRishad whispered that he hoped to find friendly dinosaurs that day, and his excitement grew stronger.",
    "Near the garden, Rishad saw something strange in the soft earth: a huge footprint. He knelt down carefully while birds chirped around him.\n\nThe footprint was much bigger than his own little feet. Rishad felt curious and a little puzzled as he wondered who could have made it.\n\nHe decided to follow the clue, hopeful that it would lead to a wonderful new adventure.",
    "Rishad followed the footprints through tall grass, taking one careful step after another. The path sparkled under the sun, and the air smelled fresh like morning dew.\n\n\"I will find out who left these,\" he said with a grin. His heart beat faster as the prints wound deeper into the garden.\n\nHe hoped they would lead to a friendly dinosaur, and he felt brave enough to find out.",
    "Suddenly, Rishad saw a small blue triceratops peeking from behind a large tree. \"Hi there! I'm Rishad,\" he said with a kind smile.\n\nThe dinosaur blinked shyly but did not run away. Rishad remembered the dinosaurs in his drawings and guessed that her name might be Tara.\n\nIn the quiet clearing, their new friendship began with a gentle hello.",
    "Rishad and Tara sat together under a big shady tree. Tara looked sad and admitted that she sometimes felt lonely.\n\nRishad listened carefully and told her that he sometimes felt lonely too. The leaves rustled softly above them as they shared a quiet moment.\n\nThey smiled at each other, and Rishad felt hope grow because he knew he could help a new friend.",
    "Rishad took out his drawing book and coloured pencils. \"I will draw happy dinosaurs and friends,\" he said, and Tara watched with bright eyes.\n\nAs he sketched, they laughed together at the cheerful picture of Tara. The pencil made a soft sound across the paper.\n\n\"Kindness can be shown with pictures,\" Rishad said, proud to share his world with her.",
    "Walking down the path, Rishad carefully held a small cake box. He asked Tara if she would come to his birthday party.\n\nTara looked excited but nervous, and the late-afternoon sky glowed warmly around them. \"It will be fun with friends,\" Rishad assured her.\n\nSide by side, they continued toward home with new trust and a happy sense of adventure.",
    "At the garden, colourful decorations hung in the soft evening light. Grandpa Kumar welcomed Tara warmly and made sure she felt safe and included.\n\nRishad stood tall beside his new friend, proud that she had come. Fresh flowers, snacks, and laughter filled the garden.\n\nHe thought, \"Kindness makes everyone feel special,\" and his heart glowed with joy.",
    "The birthday party began with games, balloons, and sweet cake. Rishad, Tara, and Grandpa Kumar laughed together while the breeze danced through the garden.\n\n\"This is the best birthday ever,\" Rishad said as Tara's eyes sparkled with happiness. They played until the sun sank low.\n\nKindness had turned an ordinary birthday into a wonderful day of friendship and fun.",
    "Night fell, and stars twinkled above the garden. Rishad and Tara sat quietly together, watching the lights shine in the dark sky.\n\nA cool breeze ruffled their hair and scales. They both felt happy, calm, safe, and thankful for the day they had shared.\n\nTheir hearts were full of kindness and friendship, ready for tomorrow's new adventures.",
    "Back in his room, Rishad looked at the first dinosaur drawing he had made that morning. He thought about Tara and all the friends he had met.\n\nThe room felt warm and peaceful as he remembered his adventure. Rishad felt proud of his kindness and courage.\n\n\"Today showed me that being kind brings wonderful friends,\" he whispered happily before bed.",
    "Rishad learned that kindness is like a magic key. It opens doors to new friends and makes happy hearts feel even brighter.\n\nWhen people share care and smiles, the world becomes warmer. Small acts of kindness can make a very big difference.\n\nRemember: being kind is the greatest adventure of all. Let your kindness grow and watch friendships bloom.",
  ],
  space: [
    "Early on his birthday morning, Jishad stood by his bedroom window. The stars twinkled softly while the sky slowly turned light, and he held his favourite space book close.\n\n\"Today is my special day! I wish I could visit the Moon!\" he whispered. The pages were filled with rockets and moons, and his heart fluttered with excitement.\n\nJishad felt ready for an amazing day and hoped his birthday wish would come true.",
    "Downstairs in the bright living room, Jishad showed his family his special notebook. Its colourful drawings were full of stars, rockets, and plans for a journey to the Moon.\n\n\"I want to build my own rocket,\" he said eagerly. The sunlight warmed his face like a cosy hug as his family listened.\n\nJishad felt determined, dreaming about flying high and exploring the sky someday soon.",
    "Later, Jishad played in the backyard with his little toy rocket. It was bright and fun, but it was not a real rocket, and his hope began to wobble.\n\n\"Real rockets are so expensive,\" he mumbled, looking at his empty toolbox. He scratched his head and tried to think of another way.\n\nEven though he felt a little sad, Jishad took a deep breath. Maybe he could build his own rocket instead.",
    "At the kitchen table, Jishad gathered cardboard boxes, sticky tape, and plastic bottles. \"I'll build my own rocket with things we have!\" he said excitedly.\n\nHe spread out his notebook and drew careful plans while humming a happy tune. Every line made the dream feel more real.\n\nJishad imagined his rocket flying past the stars and all the way to the Moon.",
    "In the garage, Jishad started building the rocket. The pieces did not fit quite right, and some parts wobbled when he tried to make them stick.\n\nHe tried again and again, working slowly and carefully. \"I won't give up,\" he said firmly as the tools tapped around him.\n\nThough he felt tired, a little spark inside kept pushing him to make the rocket better with every try.",
    "Outside, the sun began to set when Jishad's parent came near. \"Keep going, Jishad,\" they said softly, and he felt proud and warm inside.\n\nHe wiped his forehead and carefully patched the rocket to make it stronger. The cool evening breeze brushed his face.\n\n\"I'll try again,\" he said, feeling braver and ready to use everything he had learned.",
    "In the driveway, Jishad placed his rocket on a launch pad made of sticks. \"Three, two, one, blast off!\" he counted loudly.\n\nThe rocket wobbled into the air and then fell with a soft thump. Jishad's smile dropped, but his curiosity did not disappear.\n\nHe looked at the rough sticks and thought, \"Maybe I can fix it and try again.\" He was ready to learn from his attempt.",
    "Back in the garage at dusk, Jishad studied his rocket under the lamp. He looked closely at the wings and nose cone and made notes about their shape and weight.\n\n\"If I change these parts, it might fly better,\" he said thoughtfully. The quiet hum of the lamp made the garage feel cosy.\n\nJishad felt calm and sure, ready to make small changes and try again to reach the stars.",
    "Under the sparkling night sky, Jishad stood in the backyard once more. He launched the rocket and watched it soar higher and steadier than before.\n\nIt shone like a silver kite as Jishad laughed with delight. His softly purring cat watched from beside him.\n\nJishad cheered, his heart warm with joy and pride after all his hard work.",
    "Back in his cosy bedroom, Jishad drew pictures of the Moon. He sketched a flag and little footsteps on the silver ground.\n\n\"One day, I will land there,\" he whispered. The soft lamp light made his drawings glow warmly, and his dreams felt bigger and closer.\n\nJishad smiled as he imagined being a true space explorer.",
    "The next morning, Jishad proudly held up his finished rocket in the bright living room. \"Look! I made it!\" he said with a big smile.\n\nHis family clapped and gathered around him. Jishad felt calm and confident because he had worked hard and learned from every try.\n\n\"Thanks for believing in me,\" he said softly, ready for new dreams to come true.",
    "In the sunny backyard, Jishad told his friend what he had learned. \"If you keep trying and practising, your dreams can come true,\" he said.\n\nHis friend listened happily, hearing how Jishad had not given up when the rocket was difficult to build. Birds sang nearby.\n\nThey both felt hopeful and excited for the future.",
    "Under the night sky, the stars shone bright and steady. The Moon seemed to remind everyone to keep dreaming and trying.\n\nTrying again and again helps us reach our biggest dreams. Every small step can bring us a little closer to the stars.\n\nWhenever something feels tricky, be brave and keep going. Dreams are waiting for you to chase and catch.",
  ],
};

const exploreStoryWelcomeTexts: Record<LanguageCode, string> = {
  en: "Welcome to this sample book, a glimpse of what is possible. This book serves as inspiration and a guide, showing what the structure and content of a personalised story can look like.\n\nEvery page is created from a child's interests, special memories, and imagination. The characters, adventure, and illustrations turn those details into a magical book to read again and again.\n\nOpen the pages, follow the adventure, and imagine the story that could be created especially for you.",
  nl: "Welkom in dit voorbeeldboek, een glimp van wat mogelijk is. Dit boek is een inspiratie en een gids die laat zien hoe een persoonlijk verhaal kan worden opgebouwd.\n\nIedere pagina is gemaakt vanuit de interesses, bijzondere herinneringen en verbeelding van een kind. De personages, het avontuur en de illustraties vormen samen een magisch boek.\n\nSla de pagina's om, volg het avontuur en stel je het verhaal voor dat speciaal voor jou kan worden gemaakt.",
  fr: "Bienvenue dans ce livre d'exemple, un aperçu de tout ce qui est possible. Il sert d'inspiration et de guide pour montrer comment une histoire personnalisée peut prendre forme.\n\nChaque page est créée à partir des centres d'intérêt, des souvenirs et de l'imagination d'un enfant. Les personnages, l'aventure et les illustrations forment un livre magique.\n\nTournez les pages, suivez l'aventure et imaginez l'histoire qui pourrait être créée spécialement pour vous.",
};

export const getExploreStoryWelcomeText = (language: LanguageCode) => exploreStoryWelcomeTexts[language];

const finalStoryTexts: Record<ExploreStoryKey, string> = {
  pirate: "Join Tanvir Parkar, an eleven-year-old with a passion for treasure hunting, as he begins a thrilling pirate adventure. Alongside his faithful pet fish and new friends, he follows clues across the shore.\n\nWhen challenges appear, Tanvir learns that respect and kindness can solve problems more powerfully than a chest full of gold. Every shared idea makes the adventure brighter.\n\nThis exciting story blends action and heart, inspiring readers to value understanding, friendship, and the treasures they can carry inside.",
  dinosaur: "On his birthday, Rishad, a curious five-year-old who loves nature and drawing, embarks on a prehistoric adventure. He follows giant footprints and meets a friendly dinosaur named Tara.\n\nTogether they discover that a listening ear, a kind picture, and an invitation can make someone feel welcome. Their celebration becomes much more special because it is shared.\n\nJoin Rishad as he discovers the true power of kindness among dinosaurs and celebrates a birthday filled with friendship.",
  space: "Join Jishad, a curious seven-year-old who loves stargazing and science experiments, on his thrilling birthday adventure. He builds a rocket to chase his dream of visiting the Moon.\n\nWhen his first attempts do not work, Jishad learns from each mistake and keeps trying. With patience, imagination, and support from his family, his dream begins to soar.\n\nThis heartwarming story celebrates perseverance, big dreams, and the joy of never giving up.",
};

const translatedStoryBeats: Record<"nl" | "fr", Record<ExploreStoryKey, readonly string[]>> = {
  nl: {
    pirate: [
      "Op een zonnige middag ontdekt Tanvir Parkar een oude schatkaart in zijn tuin. Zijn oranje vis Bubbles zwemt opgewonden rond terwijl Tanvir droomt van een piratenavontuur.",
      "Die avond vertelt Tanvir zijn ouders dat hij een piratenspeurtocht wil doen. Hij oefent zijn beleefde piratengroet en belooft altijd respectvol te zijn.",
      "Bij een rotsachtige baai biedt Tanvir zijn kaart aan andere kinderen aan, maar zij lachen hem uit. Hij voelt zich gekwetst, maar besluit niet op te geven.",
      "Bij het kampvuur denkt Tanvir aan de wijze lessen van kapitein Mira. Hij kiest ervoor om vriendelijk te zijn en zijn kennis te delen in plaats van te wedijveren.",
      "De volgende ochtend laat Tanvir de kinderen de schelpen en tekens zien die hij op zijn kaart heeft bestudeerd. Zijn rustige, respectvolle houding maakt hen nieuwsgierig.",
      "Samen graven de kinderen in het warme zand en delen ze hun vondsten. Tanvir ontdekt hoe fijn een avontuur voelt wanneer iedereen mee mag doen.",
      "Onder zeewierbedekte rotsen vinden ze een oude houten kist. Sommige kinderen willen de vondst geheimhouden, en er ontstaat een meningsverschil.",
      "Tanvir herinnert de groep eraan dat delen vriendschap en respect opbouwt. Langzaam luisteren de kinderen naar elkaar en groeit het vertrouwen.",
      "Wanneer de kist opengaat, zien ze geen goud maar brieven, kaarten en tekeningen. Tanvir begrijpt dat verhalen en vriendschap ook een kostbare schat zijn.",
      "Op het strand voegen Tanvir en zijn nieuwe vrienden hun eigen tekeningen en berichten aan de kist toe. Ze maken samen een nieuw hoofdstuk vol respect.",
      "Bij zonsondergang denkt Tanvir terug aan de dag. Hij beseft dat respect vreemden in vrienden heeft veranderd.",
      "Onder de eerste sterren nemen de kinderen afscheid en beloven ze elkaar opnieuw te ontmoeten. Tanvir en Bubbles vertrekken met hoop op nieuwe avonturen.",
      "Onder een rustige sterrenhemel deelt Tanvir zijn les met de lezers: vriendelijkheid en respect zijn de echte schatten van ieder avontuur.",
    ],
    dinosaur: [
      "Op Rishads verjaardag schijnt het ochtendlicht zijn kamer binnen. Hij draagt zijn favoriete groene shirt en kijkt vol verwachting uit naar een avontuur.",
      "Rishad tekent dinosaurussen op de vloer terwijl opa Kumar een kleine rugzak inpakt. Rishad hoopt vriendelijke dinosaurussen te ontmoeten.",
      "In de tuin ziet Rishad een enorme voetafdruk in de zachte aarde. Hij buigt zich nieuwsgierig voorover en besluit het spoor te volgen.",
      "Rishad volgt de voetafdrukken door het hoge gras. Elke stap maakt hem dapperder en nieuwsgieriger naar wie er voor hem uit loopt.",
      "Achter een grote boom ontmoet Rishad een kleine blauwe triceratops. Hij begroet haar vriendelijk en ontdekt dat haar naam Tara is.",
      "Onder een schaduwrijke boom vertelt Tara dat ze zich soms alleen voelt. Rishad luistert aandachtig en deelt dat hij dat gevoel ook kent.",
      "Rishad haalt zijn tekenboek tevoorschijn en maakt vrolijke tekeningen voor Tara. Samen lachen ze en voelen ze hun nieuwe vriendschap groeien.",
      "Rishad nodigt Tara uit voor zijn verjaardagsfeestje. Tara is eerst verlegen, maar hij verzekert haar dat vrienden samen plezier maken.",
      "In de tuin verwelkomt opa Kumar Tara warm. Door de versieringen, bloemen en vriendelijke woorden voelt Tara zich veilig en welkom.",
      "Het feest begint met spelletjes, ballonnen en taart. Rishad, Tara en opa Kumar lachen samen tot de zon laag staat.",
      "In de avond kijken Rishad en Tara naar de sterren. Ze voelen zich rustig, dankbaar en blij met hun bijzondere dag.",
      "Terug in zijn kamer kijkt Rishad naar zijn eerste dinosaurus-tekening. Hij begrijpt dat zijn vriendelijkheid hem een prachtige nieuwe vriend heeft gegeven.",
      "Rishad leert dat vriendelijkheid een magische sleutel is. Een glimlach en een zorgzaam gebaar kunnen de deur naar vriendschap openen.",
    ],
    space: [
      "Op zijn verjaardag kijkt Jishad vanuit zijn slaapkamerraam naar de sterren. Hij wenst dat hij ooit de maan kan bezoeken.",
      "Beneden laat Jishad zijn familie een notitieboek vol raketten en sterren zien. Hij vertelt dat hij zelf een raket wil bouwen.",
      "In de tuin speelt Jishad met zijn speelgoedraket en merkt hij dat echte raketten duur zijn. Toch zoekt hij moedig naar een andere oplossing.",
      "Aan de keukentafel verzamelt Jishad dozen, tape en plastic flessen. Hij tekent plannen en besluit een eigen raket te maken.",
      "In de garage passen de onderdelen niet meteen goed. Jishad probeert het opnieuw en zegt vastberaden dat hij niet zal opgeven.",
      "Als de zon ondergaat, moedigt een ouder Jishad aan om door te gaan. Hij verstevigt zijn raket en voelt zich opnieuw dapper.",
      "Op een lanceerplatform van stokjes telt Jishad af. Zijn raket valt neer, maar hij besluit van deze poging te leren.",
      "Bij het licht van een lamp bestudeert Jishad de vleugels en neuskegel. Kleine veranderingen geven hem weer vertrouwen.",
      "Onder de sterren lanceert Jishad zijn raket opnieuw. Deze keer vliegt hij hoger en stabieler, en Jishad juicht van trots.",
      "In zijn slaapkamer tekent Jishad de maan met een vlag en voetstappen. Zijn droom voelt nu groter én dichterbij.",
      "De volgende ochtend toont Jishad zijn voltooide raket aan zijn familie. Hij bedankt hen omdat zij in hem bleven geloven.",
      "Jishad vertelt een vriend dat oefenen en opnieuw proberen dromen mogelijk maakt. Samen kijken ze hoopvol naar de toekomst.",
      "Onder de nachtelijke hemel herinnert Jishad iedereen eraan om moedig te blijven. Elke nieuwe poging brengt een droom dichter bij de sterren.",
    ],
  },
  fr: {
    pirate: [
      "Par un après-midi ensoleillé, Tanvir Parkar découvre une vieille carte au trésor dans son jardin. Son poisson orange Bubbles tourne joyeusement pendant que Tanvir rêve d'une aventure de pirates.",
      "Le soir, Tanvir raconte à ses parents qu'il veut participer à une chasse au trésor sur le thème des pirates. Il promet de toujours rester poli et respectueux.",
      "Dans une crique rocheuse, Tanvir propose sa carte aux autres enfants, mais ils se moquent de lui. Blessé, il choisit pourtant de ne pas abandonner.",
      "Près du feu de camp, Tanvir se souvient des leçons de la capitaine Mira. Il décide de faire preuve de gentillesse et de partager ses connaissances.",
      "Le lendemain matin, Tanvir montre aux enfants les coquillages et les signes étudiés sur sa carte. Son attitude calme et respectueuse éveille leur curiosité.",
      "Les enfants creusent ensemble dans le sable chaud et partagent leurs découvertes. Tanvir comprend qu'une aventure est plus belle quand chacun y participe.",
      "Près des rochers couverts d'algues, le groupe trouve un vieux coffre en bois. Certains enfants veulent garder cette découverte secrète.",
      "Tanvir rappelle au groupe que le partage crée l'amitié et le respect. Peu à peu, les enfants s'écoutent et la confiance grandit.",
      "Quand le coffre s'ouvre, il ne contient pas d'or mais des lettres, des cartes et des dessins. Tanvir comprend que les histoires et l'amitié sont aussi des trésors.",
      "Sur la plage, Tanvir et ses nouveaux amis ajoutent leurs dessins et leurs messages au coffre. Ils créent ensemble un nouveau chapitre plein de respect.",
      "Au coucher du soleil, Tanvir repense à cette journée. Il comprend que le respect a transformé des inconnus en amis.",
      "Sous les premières étoiles, les enfants se disent au revoir et promettent de se retrouver. Tanvir et Bubbles repartent avec l'espoir de nouvelles aventures.",
      "Sous un ciel étoilé, Tanvir partage sa leçon : la gentillesse et le respect sont les véritables trésors de toute aventure.",
    ],
    dinosaur: [
      "Le matin de son anniversaire, la lumière entre dans la chambre de Rishad. Il porte son t-shirt vert préféré et attend son aventure avec impatience.",
      "Rishad dessine des dinosaures sur le sol pendant que grand-père Kumar prépare un petit sac à dos. Il espère rencontrer des dinosaures gentils.",
      "Dans le jardin, Rishad découvre une immense empreinte dans la terre douce. Curieux, il décide de suivre cette piste mystérieuse.",
      "Rishad suit les empreintes à travers les hautes herbes. À chaque pas, il se sent plus courageux et curieux.",
      "Derrière un grand arbre, Rishad rencontre une petite tricératops bleue. Il la salue gentiment et apprend qu'elle s'appelle Tara.",
      "Sous un arbre ombragé, Tara confie qu'elle se sent parfois seule. Rishad l'écoute avec attention et partage ce qu'il ressent lui aussi.",
      "Rishad sort son carnet de dessins et crée des images joyeuses pour Tara. Ils rient ensemble et leur amitié grandit.",
      "Rishad invite Tara à sa fête d'anniversaire. Elle est d'abord timide, mais il lui assure que les amis s'amusent toujours ensemble.",
      "Dans le jardin décoré, grand-père Kumar souhaite chaleureusement la bienvenue à Tara. Elle se sent en sécurité grâce aux paroles bienveillantes de chacun.",
      "La fête commence avec des jeux, des ballons et du gâteau. Rishad, Tara et grand-père Kumar rient ensemble jusqu'au coucher du soleil.",
      "Le soir, Rishad et Tara regardent les étoiles. Ils se sentent calmes, reconnaissants et heureux de leur journée spéciale.",
      "De retour dans sa chambre, Rishad regarde son premier dessin de dinosaure. Il comprend que sa gentillesse lui a offert une merveilleuse amie.",
      "Rishad apprend que la gentillesse est une clé magique. Un sourire et un geste attentionné peuvent ouvrir la porte à l'amitié.",
    ],
    space: [
      "Le matin de son anniversaire, Jishad regarde les étoiles depuis sa fenêtre. Il souhaite qu'un jour il puisse visiter la Lune.",
      "En bas, Jishad montre à sa famille un carnet rempli de fusées et d'étoiles. Il explique qu'il veut construire sa propre fusée.",
      "Dans le jardin, Jishad joue avec sa fusée-jouet et comprend que les vraies fusées coûtent cher. Il cherche pourtant courageusement une autre solution.",
      "À la table de la cuisine, Jishad rassemble des boîtes, du ruban adhésif et des bouteilles en plastique. Il dessine des plans et décide de fabriquer une fusée.",
      "Dans le garage, les pièces ne s'assemblent pas facilement. Jishad essaie encore et affirme qu'il ne renoncera pas.",
      "Quand le soleil se couche, un parent encourage Jishad à continuer. Il renforce sa fusée et se sent à nouveau courageux.",
      "Sur un pas de tir fait de bâtons, Jishad compte avant le décollage. Sa fusée tombe, mais il décide d'apprendre de cette tentative.",
      "À la lumière d'une lampe, Jishad étudie les ailes et le nez de sa fusée. De petits changements lui redonnent confiance.",
      "Sous les étoiles, Jishad lance de nouveau sa fusée. Cette fois, elle vole plus haut et plus droit, et il pousse un cri de joie.",
      "Dans sa chambre, Jishad dessine la Lune avec un drapeau et des empreintes. Son rêve lui semble maintenant plus grand et plus proche.",
      "Le lendemain, Jishad montre fièrement sa fusée terminée à sa famille. Il les remercie d'avoir continué à croire en lui.",
      "Jishad explique à un ami que s'entraîner et réessayer permet de réaliser ses rêves. Ensemble, ils regardent l'avenir avec espoir.",
      "Sous le ciel nocturne, Jishad rappelle à chacun de rester courageux. Chaque nouvelle tentative rapproche un rêve des étoiles.",
    ],
  },
};

const localizedPageText = (language: "nl" | "fr", story: ExploreStoryKey, index: number) => {
  const beat = translatedStoryBeats[language][story][index];
  const middle = language === "nl"
    ? "De illustratie op deze pagina brengt dit moment uit het avontuur tot leven. De gevoelens, keuzes en kleine ontdekkingen helpen het verhaal stap voor stap verder."
    : "L'illustration de cette page donne vie à ce moment de l'aventure. Les émotions, les choix et les petites découvertes font avancer l'histoire pas à pas.";
  const ending = language === "nl"
    ? "Zo groeit het avontuur verder met moed, verbeelding en een les die de lezer kan meenemen naar zijn eigen wereld."
    : "L'aventure continue ainsi avec courage, imagination et une leçon que chaque lecteur peut emporter dans son propre monde.";
  return `${beat}\n\n${middle}\n\n${ending}`;
};

const finalStoryTranslations: Record<"nl" | "fr", Record<ExploreStoryKey, string>> = {
  nl: {
    pirate: "Ga mee met Tanvir Parkar op een spannende piratenreis vol schatkaarten, vriendschap en nieuwe ontdekkingen. Bubbles en zijn vrienden laten zien dat samen delen het avontuur rijker maakt.\n\nWanneer Tanvir voor moeilijke keuzes staat, kiest hij voor respect en vriendelijkheid. Zo wordt een gewone schattenjacht een verhaal met een warm hart.\n\nDit avontuur herinnert iedere lezer eraan dat begrip en vriendschap meer waard zijn dan goud.",
    dinosaur: "Ga mee met Rishad op zijn verjaardagsavontuur tussen de dinosaurussen. Met Tara ontdekt hij dat een vriendelijk gebaar een nieuwe vriendschap kan beginnen.\n\nVan een geheimzinnig spoor tot een vrolijk feest: iedere stap laat zien hoe zorg en aandacht iemand welkom kunnen laten voelen.\n\nDit verhaal viert vriendelijkheid, moed en de bijzondere magie van samen zijn.",
    space: "Ga mee met Jishad op zijn verjaardag terwijl hij droomt van een reis naar de maan. Met eenvoudige spullen en grote verbeelding bouwt hij zijn eigen raket.\n\nZijn eerste pogingen lukken niet meteen, maar iedere fout helpt hem om iets nieuws te leren. Hij blijft proberen tot zijn droom hoger vliegt.\n\nDit verhaal viert doorzettingsvermogen, moed en de vreugde van grote dromen.",
  },
  fr: {
    pirate: "Partez avec Tanvir Parkar pour une aventure de pirates remplie de cartes au trésor, d'amitié et de découvertes. Bubbles et ses nouveaux amis montrent que le partage rend chaque voyage plus riche.\n\nFace aux choix difficiles, Tanvir choisit le respect et la gentillesse. Une simple chasse au trésor devient alors une histoire pleine de cœur.\n\nCette aventure rappelle à chaque lecteur que la compréhension et l'amitié valent plus que l'or.",
    dinosaur: "Partez avec Rishad pour son aventure d'anniversaire parmi les dinosaures. Avec Tara, il découvre qu'un geste gentil peut faire naître une nouvelle amitié.\n\nD'une piste mystérieuse à une fête joyeuse, chaque étape montre que l'attention et la bienveillance font sentir chacun le bienvenu.\n\nCette histoire célèbre la gentillesse, le courage et la magie d'être ensemble.",
    space: "Partez avec Jishad le jour de son anniversaire, alors qu'il rêve d'un voyage vers la Lune. Avec des objets simples et une grande imagination, il construit sa propre fusée.\n\nSes premières tentatives ne réussissent pas tout de suite, mais chaque erreur lui apprend quelque chose. Il continue jusqu'à ce que son rêve vole plus haut.\n\nCette histoire célèbre la persévérance, le courage et la joie des grands rêves.",
  },
};

const fullStoryContent = (story: ExploreStoryKey, language: LanguageCode) => ({
  storyPages: (language === "en" ? storyTexts[story] : translatedStoryBeats[language][story].map((_, index) => localizedPageText(language, story, index))).map((text, index) => ({ image: visuals[story].storyImages[index], text })),
  finalText: language === "en" ? finalStoryTexts[story] : finalStoryTranslations[language][story],
});

export const exploreStoriesByLanguage: Record<LanguageCode, ExploreStory[]> = {
  en: [
    { id: "tanvir-pirate", title: "Tanvir Parkar's Pirate Adventure", theme: "Adventure & Careers", subject: "Pirates", specialMessage: "Respect", characterCount: 2, ageCategory: "9-12", creatorName: "Mom & Dad", illustrationStyle: "Water Colour", description: "Tanvir Parkar follows an old treasure map with Bubbles, his faithful fish. When a pirate hunt becomes difficult, he discovers that respect, kindness and teamwork are the greatest treasures.", storyPages: [{ image: visuals.pirate.storyImages[0], text: "Tanvir Parkar discovers an old treasure map in his sunny garden. With Bubbles twirling in his bowl, he imagines pirate ships, secret islands and a thrilling adventure." }, { image: visuals.pirate.storyImages[1], text: "At the beach, Tanvir chooses to share his clues instead of competing. His kindness helps the other children trust him, and together they uncover a mysterious treasure chest." }, { image: visuals.pirate.storyImages[2], text: "The chest holds maps, drawings and stories rather than gold. Tanvir learns that respect and friendship are treasures that shine brighter than jewels." }], ...visuals.pirate },
    { id: "rishad-dinosaur", title: "Rishad's Dinosaur Birthday Adventure", theme: "Holidays", subject: "Birthday", specialMessage: "Kindness", characterCount: 3, ageCategory: "5-7", creatorName: "Mom & Dad", illustrationStyle: "Water Colour", description: "On his birthday, Rishad follows giant footprints and meets Tara, a shy blue triceratops. Their adventure shows how small acts of kindness can create wonderful friendships.", storyPages: [{ image: visuals.dinosaur.storyImages[0], text: "It is Rishad's birthday, and he cannot wait for an adventure. With Grandpa Kumar beside him, he follows a set of enormous footprints through the garden." }, { image: visuals.dinosaur.storyImages[1], text: "Rishad meets Tara, a shy blue triceratops who feels lonely. He listens kindly, draws happy pictures with her and invites her to his birthday party." }, { image: visuals.dinosaur.storyImages[2], text: "As the celebration ends, Rishad sees that kindness is like a magic key. It opens the door to new friends and makes every birthday adventure more special." }], ...visuals.dinosaur },
    { id: "jishad-space", title: "Jishad's Space Rocket Adventure", theme: "Worlds & Fantasy", subject: "Space", specialMessage: "Perseverance", characterCount: 1, ageCategory: "7-9", creatorName: "Grandma & Grandpa", illustrationStyle: "Water Colour", description: "On his birthday, Jishad dreams of visiting the Moon. He builds a rocket from everyday materials and learns that trying again is how big dreams begin to fly.", storyPages: [{ image: visuals.space.storyImages[0], text: "On his birthday morning, Jishad looks at the stars and wishes he could visit the Moon. He opens his notebook and starts dreaming about building a rocket of his own." }, { image: visuals.space.storyImages[1], text: "The first rocket does not work as Jishad hoped. He studies every piece, makes careful changes and keeps going, even when he feels tired and disappointed." }, { image: visuals.space.storyImages[2], text: "Jishad's rocket finally soars higher. He proudly shares what he learned: with practice, courage and perseverance, every dream can move closer to the stars." }], ...visuals.space },
  ],
  nl: [
    { id: "tanvir-pirate", title: "Tanvir Parkars Piratenavontuur", theme: "Avontuur & Beroepen", subject: "Piraten", specialMessage: "Respect", characterCount: 2, ageCategory: "9-12", creatorName: "Mama & Papa", illustrationStyle: "Aquarel", description: "Tanvir Parkar volgt samen met zijn trouwe vis Bubbles een oude schatkaart. Tijdens de piratenjacht ontdekt hij dat respect, vriendelijkheid en teamwork de mooiste schatten zijn.", storyPages: [{ image: visuals.pirate.storyImages[0], text: "Tanvir Parkar vindt in zijn zonnige tuin een oude schatkaart. Met Bubbles naast zich droomt hij van piratenschepen, geheime eilanden en een spannend avontuur." }, { image: visuals.pirate.storyImages[1], text: "Op het strand kiest Tanvir ervoor zijn aanwijzingen te delen. Zijn vriendelijkheid helpt de andere kinderen hem te vertrouwen en samen vinden ze een geheimzinnige schatkist." }, { image: visuals.pirate.storyImages[2], text: "In de kist zitten kaarten, tekeningen en verhalen in plaats van goud. Tanvir leert dat respect en vriendschap helderder stralen dan juwelen." }], ...visuals.pirate },
    { id: "rishad-dinosaur", title: "Rishads Dinosaurussenverjaardagsavontuur", theme: "Feestdagen", subject: "Verjaardag", specialMessage: "Vriendelijkheid", characterCount: 3, ageCategory: "5-7", creatorName: "Mama & Papa", illustrationStyle: "Aquarel", description: "Op zijn verjaardag volgt Rishad reusachtige voetsporen en ontmoet hij Tara, een verlegen blauwe triceratops. Hun avontuur laat zien hoe kleine vriendelijke gebaren mooie vriendschappen kunnen maken.", storyPages: [{ image: visuals.dinosaur.storyImages[0], text: "Het is Rishads verjaardag en hij kan niet wachten op een avontuur. Samen met opa Kumar volgt hij enorme voetsporen door de tuin." }, { image: visuals.dinosaur.storyImages[1], text: "Rishad ontmoet Tara, een verlegen blauwe triceratops die zich alleen voelt. Hij luistert vriendelijk, tekent vrolijke plaatjes en nodigt haar uit voor zijn feestje." }, { image: visuals.dinosaur.storyImages[2], text: "Aan het einde van het feest begrijpt Rishad dat vriendelijkheid een magische sleutel is. Het opent de deur naar nieuwe vrienden en maakt elk avontuur bijzonder." }], ...visuals.dinosaur },
    { id: "jishad-space", title: "Jishads Ruimteraketavontuur", theme: "Werelden & Fantasie", subject: "Ruimte", specialMessage: "Doorzettingsvermogen", characterCount: 1, ageCategory: "7-9", creatorName: "Oma & Opa", illustrationStyle: "Aquarel", description: "Op zijn verjaardag droomt Jishad ervan de maan te bezoeken. Hij bouwt een raket van alledaagse spullen en leert dat opnieuw proberen grote dromen laat opstijgen.", storyPages: [{ image: visuals.space.storyImages[0], text: "Op zijn verjaardag kijkt Jishad naar de sterren en wenst hij dat hij de maan kan bezoeken. Hij opent zijn notitieboek en begint te dromen over zijn eigen raket." }, { image: visuals.space.storyImages[1], text: "De eerste raket werkt niet zoals Jishad hoopte. Hij bestudeert elk onderdeel, maakt zorgvuldige veranderingen en zet door, ook als hij moe of teleurgesteld is." }, { image: visuals.space.storyImages[2], text: "Jishads raket vliegt uiteindelijk hoger. Hij deelt wat hij heeft geleerd: met oefenen, moed en doorzettingsvermogen komt elke droom dichter bij de sterren." }], ...visuals.space },
  ],
  fr: [
    { id: "tanvir-pirate", title: "L'aventure pirate de Tanvir Parkar", theme: "Aventure et carrières", subject: "Pirates", specialMessage: "Respect", characterCount: 2, ageCategory: "9-12", creatorName: "Maman et Papa", illustrationStyle: "Aquarelle", description: "Tanvir Parkar suit une vieille carte au trésor avec Bubbles, son fidèle poisson. Pendant la chasse aux pirates, il découvre que le respect, la gentillesse et l'esprit d'équipe sont les plus beaux trésors.", storyPages: [{ image: visuals.pirate.storyImages[0], text: "Tanvir Parkar découvre une vieille carte au trésor dans son jardin ensoleillé. Avec Bubbles à ses côtés, il rêve de navires pirates, d'îles secrètes et d'une grande aventure." }, { image: visuals.pirate.storyImages[1], text: "Sur la plage, Tanvir choisit de partager ses indices au lieu de rivaliser. Sa gentillesse aide les autres enfants à lui faire confiance et ils trouvent ensemble un coffre mystérieux." }, { image: visuals.pirate.storyImages[2], text: "Le coffre contient des cartes, des dessins et des histoires plutôt que de l'or. Tanvir comprend que le respect et l'amitié brillent davantage que les bijoux." }], ...visuals.pirate },
    { id: "rishad-dinosaur", title: "L'aventure d'anniversaire avec les dinosaures de Rishad", theme: "Fêtes", subject: "Anniversaire", specialMessage: "Bienveillance", characterCount: 3, ageCategory: "5-7", creatorName: "Maman et Papa", illustrationStyle: "Aquarelle", description: "Le jour de son anniversaire, Rishad suit des empreintes géantes et rencontre Tara, une tricératops bleue et timide. Leur aventure montre que les petits gestes de gentillesse créent de belles amitiés.", storyPages: [{ image: visuals.dinosaur.storyImages[0], text: "C'est l'anniversaire de Rishad et il attend une aventure avec impatience. Avec grand-père Kumar, il suit d'immenses empreintes dans le jardin." }, { image: visuals.dinosaur.storyImages[1], text: "Rishad rencontre Tara, une tricératops bleue et timide qui se sent seule. Il l'écoute avec gentillesse, dessine avec elle et l'invite à sa fête." }, { image: visuals.dinosaur.storyImages[2], text: "À la fin de la fête, Rishad comprend que la gentillesse est une clé magique. Elle ouvre la porte à de nouveaux amis et rend chaque aventure spéciale." }], ...visuals.dinosaur },
    { id: "jishad-space", title: "L'aventure de la fusée spatiale de Jishad", theme: "Mondes et fantaisie", subject: "Espace", specialMessage: "Persévérance", characterCount: 1, ageCategory: "7-9", creatorName: "Grand-mère et Grand-père", illustrationStyle: "Aquarelle", description: "Le jour de son anniversaire, Jishad rêve de visiter la Lune. Il construit une fusée avec des objets du quotidien et apprend que recommencer permet aux grands rêves de prendre leur envol.", storyPages: [{ image: visuals.space.storyImages[0], text: "Le matin de son anniversaire, Jishad regarde les étoiles et souhaite visiter la Lune. Il ouvre son carnet et commence à rêver de sa propre fusée." }, { image: visuals.space.storyImages[1], text: "La première fusée ne fonctionne pas comme Jishad l'espérait. Il étudie chaque pièce, fait des changements et continue, même lorsqu'il est fatigué ou déçu." }, { image: visuals.space.storyImages[2], text: "La fusée de Jishad finit par monter plus haut. Il partage ce qu'il a appris : avec de la pratique, du courage et de la persévérance, chaque rêve se rapproche des étoiles." }], ...visuals.space },
  ],
};

const storyVisualKey: Record<string, ExploreStoryKey> = {
  "tanvir-pirate": "pirate",
  "rishad-dinosaur": "dinosaur",
  "jishad-space": "space",
};

export const getExploreStory = (id: string, language: LanguageCode) => {
  const story = exploreStoriesByLanguage[language].find((item) => item.id === id);
  const visualKey = storyVisualKey[id];
  return story && visualKey ? { ...story, ...fullStoryContent(visualKey, language) } : undefined;
};
