export type SubjectOption = {
  label: string;
  value: string;
  image: string;
  color: string;
};

const colors = ["#FFE5D6", "#DDEEFF", "#FFDDE4", "#D1ECD9"];

const makeSubjects = (
  items: Array<[label: string, value: string, image: string]>,
): SubjectOption[] =>
  items.map(([label, value, image], index) => ({
    label,
    value,
    image: image.startsWith("/") ? image : `/images/${image}`,
    color: colors[index % colors.length],
  }));

/** The visual order here deliberately matches the supplied theme-selection screens. */
export const SUBJECT_OPTIONS: Record<string, SubjectOption[]> = {
  "Fairy Tales": makeSubjects([
    ["Unicorns", "UNICORNS", "story_1.png"],
    ["Princess & Princesses", "PRINCES_AND_PRINCESSES", "story_2.png"],
    ["Knights and dragons", "KNIGHTS_AND_DRAGONS", "story_3.png"],
    ["Wizard School", "WIZARD_SCHOOL", "story_4.png"],
    ["The Magic Forest", "ENCHANTED_FOREST", "story_5.png"],
    ["Mermaids", "MERMAIDS", "story_6.png"],
    ["Gnomes", "GNOMES", "story_7.png"],
    ["Fairies and Elves", "FAIRIES_AND_ELVES", "story_8.png"],
    ["Witches and Spells", "WITCHES_AND_ENCHANTMENT", "story_9.png"],
    ["Giants", "GIANTS", "story_10.png"],
  ]),
  Adventure: makeSubjects([
    ["Bin Lorry", "GARBAGE_TRUCK", "ad_2_1.png"],
    ["Construction Machines", "CONSTRUCTION_VEHICLES", "ad_2_2.png"],
    ["Aeroplane", "AIRPLANE", "ad_2_3.png"],
    ["Racing", "RACING", "ad_2_4.png"],
    ["Fire Brigade", "FIREFIGHTER", "ad_2_5.png"],
    ["Police", "POLICE", "ad_2_6.png"],
    ["Dinosaurs", "DINOSAURS", "ad_2_7.png"],
    ["Pirates", "PIRATES", "ad_2_8.png"],
    ["Super Hero", "SUPERHERO", "ad_2_9.png"],
    ["Camping", "CAMPING", "ad_2_10.png"],
    ["Travel", "TRAVEL", "ad_2_11.png"],
    ["Treasure Hunts", "TREASURE_HUNTS", "ad_2_12.png"],
    ["Secret Missions", "SECRET_MISSIONS", "ad_2_13.png"],
    ["Haunted House", "HAUNTED_HOUSE", "ad_2_14.png"],
    ["Time Travel", "TIME_TRAVEL", "ad_2_15.png"],
  ]),
  Activities: makeSubjects([
    ["Outdoor Play", "OUTDOOR_PLAY", "act_1.png"],
    ["Dancing", "DANCING", "act_2.png"],
    ["Making Music", "MAKING_MUSIC", "act_3.png"],
    ["To the Farm", "GOING_TO_THE_FARM", "act_4.png"],
    ["To the Forest", "INTO_THE_FOREST", "act_5.png"],
    ["Go to Beach", "TO_THE_BEACH", "act_6.png"],
    ["Doing Crafts", "CRAFTING", "act_7.png"],
    ["Painting", "PAINTING", "act_8.png"],
    ["Cooking & Baking", "COOKING_AND_BAKING", "act_9.png"],
    ["Gardening", "GARDENING", "act_10.png"],
    ["Dressing Up", "DRESS_UP", "act_11.png"],
    ["To School", "GOING_TO_SCHOOL", "act_12.png"],
    ["To the Library", "GOING_TO_THE_LIBRARY", "act_13.png"],
    ["Visit the Doctor", "VISITING_THE_DOCTOR", "act_14.png"],
    ["Visit the Dentist", "VISITING_THE_DENTIST", "act_15.png"],
    ["Train Travel", "TRAIN_JOURNEYS", "act_16.png"],
    ["Visit the Zoo", "VISITING_THE_ZOO", "act_17.png"],
    ["To the Circus", "GOING_TO_THE_CIRCUS", "act_18.png"],
    ["Visiting Amusement Parks", "VISITING_AN_AMUSEMENT_PARK", "act_19.png"],
    ["Sports", "SPORTS", "act_20.png"],
    ["Caring for Animals", "CARING_FOR_ANIMALS", "act_21.png"],
    ["Building a Treehouse", "BUILDING_A_TREEHOUSE", "act_22.png"],
    ["Gaming", "GAMING", "act_23.png"],
  ]),
  Worlds: makeSubjects([
    ["In the Jungle", "JUNGLE", "wor_1.png"],
    ["The Savanna", "THE_SAVANA", "wor_2.png"],
    ["Deep in the Sea", "UNDERWATER", "wor_3.png"],
    ["At the North Pole", "AT_THE_NORTH_POLE", "wor_4.png"],
    ["Candyland", "CANDYLAND", "wor_5.png"],
    ["The Middle Ages", "THE_MIDDLE_AGES", "wor_6.png"],
    ["In Space", "SPACE", "wor_7.png"],
    ["In the Future", "IN_THE_FUTURE", "wor_8.png"],
    ["The Prehistoric Age", "PREHISTORIC_AGE", "wor_9.png"],
    ["The Wild West", "WILD_WEST", "wor_10.png"],
    ["The Vikings", "VIKINGS", "wor_11.png"],
    ["1001 Nights", "ARABIAN_NIGHTS", "wor_12.png"],
    ["Ancient Egypt", "ANCIENT_EGYPT", "wor_13.png"],
    ["Ancient Greece", "ANCIENT_GREECE", "wor_14.png"],
  ]),
  Holidays: makeSubjects([
    ["Birthday", "BIRTHDAY", "hol_1.png"],
    ["Christmas", "CHRISTMAS", "hol_2.png"],
    ["Mother's Day", "MOTHERS_DAY", "hol_3.png"],
    ["Father's Day", "FATHERS_DAY", "hol_4.png"],
    ["Grandparent's Day", "GRANDPARENTS_DAY", "hol_5.png"],
    ["Children's Day", "CHILDRENS_DAY", "hol_6.png"],
    ["Valentine's Day", "VALENTINES_DAY", "hol_7.png"],
    ["Easter", "EASTER", "hol_8.png"],
    ["Epiphany", "THREE_KINGS", "hol_9.png"],
    ["First Holy Communion", "FIRST_COMMUNION", "hol_10.png"],
    ["Eid al-Fitr", "EID_AL_FITR", "hol_11.png"],
    ["Eid al Adha", "EID_AL_ADHA", "hol_12.png"],
    ["Hanukkah", "HANUKKAH", "hol_13.png"],
    ["Carnival", "CARNIVAL", "hol_14.png"],
    ["Halloween", "HALLOWEEN", "hol_15.png"],
    ["St Patrick's Day", "ST_PATRICKS_DAY", "hol_16.png"],
    ["New Year's Eve", "NEW_YEARS", "hol_17.png"],
    ["World Animal Day", "WORLD_ANIMAL_DAY", "hol_18.png"],
  ]),
  Family: makeSubjects([
    ["New Baby", "NEW_BABY", "fam_1.png"],
    ["Gets a Little Sister", "GETTING_A_BABY_SISTER", "fam_2.png"],
    ["Gets a Little Brother", "GETTING_A_BABY_BROTHER", "fam_3.png"],
    ["A New Pet", "NEW_PET", "fam_4.png"],
    ["Moving", "MOVING", "fam_5.png"],
    ["Holiday", "HOLIDAY", "fam_6.png"],
    ["Sleepover", "SLEEPOVER", "fam_7.png"],
    ["Marriage", "WEDDING", "fam_8.png"],
    ["Parent's Separation", "PARENTAL_SEPARATION", "fam_9.png"],
    ["Blended Family", "BLENDED_FAMILY", "fam_10.png"],
    ["Saying Goodbye", "SAYING_GOODBYE", "fam_11.png"],
  ]),
  Educational: makeSubjects([
    ["Learning to Walk", "LEARNING_TO_WALK", "edu_1.png"],
    ["First Words", "FIRST_WORDS", "edu_2.png"],
    ["Body Parts", "BODY_PARTS", "edu_3.png"],
    ["Weaning Off the Dummy", "PACIFIER_WEANING", "edu_4.png"],
    ["Stopping Thumb Sucking", "STOPPING_THUMB_SUCKING", "edu_5.png"],
    ["Brushing Teeth", "TOOTHBRUSHING", "edu_6.png"],
    ["Potty Training", "POTTY_TRAINING", "edu_7.png"],
    ["Learning to Eat Better", "HEALTHY_EATING", "edu_8.png"],
    ["Tidying Up", "TIDYING_UP", "edu_9.png"],
    ["Shapes and Colours", "SHAPES_AND_COLORS", "edu_10.png"],
    ["Learning to Count", "LEARNING_TO_COUNT", "edu_11.png"],
    ["Seasons and Weather", "SEASONS_AND_WEATHER", "edu_12.png"],
    ["Learning to Ride a Bike", "LEARNING_TO_RIDE_A_BIKE", "edu_13.png"],
    ["Alphabet", "ALPHABET", "edu_14.png"],
    ["Tying Shoelaces", "TYING_SHOELACES", "edu_15.png"],
    ["Telling the Time", "TELLING_TIME", "edu_16.png"],
    ["Pocket Money and Saving", "POCKET_MONEY_AND_SAVING", "edu_17.png"],
  ]),
  Feelings: makeSubjects([
    ["Being Proud of Yourself", "BEING_PROUD_OF_YOURSELF", "/fee_1.png"],
    ["Finding Confidence", "FINDING_CONFIDENCE", "/fee_2.png"],
    ["Shame", "SHAME", "/fee_3.png"],
    ["Fear of the Dark", "FEAR_OF_THE_DARK", "/fee_4.png"],
    ["Insecurity", "INSECURITY", "/fee_5.png"],
    ["Homesickness", "HOMESICKNESS", "/fee_6.png"],
    ["Jealousy", "JEALOUSY", "/fee_7.png"],
    ["Tantrums", "TANTRUMS", "/fee_8.png"],
    ["Peer Pressure", "PEER_PRESSURE", "/fee_9.png"],
    ["Being Bullied", "BEING_BULLIED", "/fee_10.png"],
  ]),
};

export const ALL_SUBJECTS: SubjectOption[] = Object.values(SUBJECT_OPTIONS).flat();

type SubjectLocale = "en" | "nl" | "fr";

// Subject values are kept in English for the API; only the visible label changes with the site language.
const subjectTranslations: Record<Exclude<SubjectLocale, "en">, Partial<Record<string, string>>> = {
  nl: {
    UNICORNS: "Eenhoorns", PRINCES_AND_PRINCESSES: "Prinsen en prinsessen", KNIGHTS_AND_DRAGONS: "Ridders en draken", WIZARD_SCHOOL: "Toverschool", ENCHANTED_FOREST: "Het betoverde bos", MERMAIDS: "Zeemeerminnen", GNOMES: "Kabouters", FAIRIES_AND_ELVES: "Feeën en elfen", WITCHES_AND_ENCHANTMENT: "Heksen en spreuken", GIANTS: "Reuzen",
    GARBAGE_TRUCK: "Vuilniswagen", CONSTRUCTION_VEHICLES: "Bouwvoertuigen", AIRPLANE: "Vliegtuig", RACING: "Racen", FIREFIGHTER: "Brandweer", POLICE: "Politie", DINOSAURS: "Dinosaurussen", PIRATES: "Piraten", SUPERHERO: "Superheld", CAMPING: "Kamperen", TRAVEL: "Reizen", TREASURE_HUNTS: "Schattenjachten", SECRET_MISSIONS: "Geheime missies", HAUNTED_HOUSE: "Spookhuis", TIME_TRAVEL: "Tijdreizen",
    OUTDOOR_PLAY: "Buiten spelen", DANCING: "Dansen", MAKING_MUSIC: "Muziek maken", GOING_TO_THE_FARM: "Naar de boerderij", INTO_THE_FOREST: "Het bos in", TO_THE_BEACH: "Naar het strand", CRAFTING: "Knutselen", PAINTING: "Schilderen", COOKING_AND_BAKING: "Koken en bakken", GARDENING: "Tuinieren", DRESS_UP: "Verkleden", GOING_TO_SCHOOL: "Naar school", GOING_TO_THE_LIBRARY: "Naar de bibliotheek", VISITING_THE_DOCTOR: "Naar de dokter", VISITING_THE_DENTIST: "Naar de tandarts", TRAIN_JOURNEYS: "Treinreizen", VISITING_THE_ZOO: "Naar de dierentuin", GOING_TO_THE_CIRCUS: "Naar het circus", VISITING_AN_AMUSEMENT_PARK: "Pretparken bezoeken", SPORTS: "Sport", CARING_FOR_ANIMALS: "Voor dieren zorgen", BUILDING_A_TREEHOUSE: "Een boomhut bouwen", GAMING: "Gamen",
    JUNGLE: "In de jungle", THE_SAVANA: "De savanne", UNDERWATER: "Diep in zee", AT_THE_NORTH_POLE: "Op de Noordpool", CANDYLAND: "Snoepland", THE_MIDDLE_AGES: "De middeleeuwen", SPACE: "In de ruimte", IN_THE_FUTURE: "In de toekomst", PREHISTORIC_AGE: "De prehistorie", WILD_WEST: "Het Wilde Westen", VIKINGS: "De Vikingen", ARABIAN_NIGHTS: "1001 nachten", ANCIENT_EGYPT: "Het oude Egypte", ANCIENT_GREECE: "Het oude Griekenland",
    BIRTHDAY: "Verjaardag", CHRISTMAS: "Kerstmis", MOTHERS_DAY: "Moederdag", FATHERS_DAY: "Vaderdag", GRANDPARENTS_DAY: "Grootouderdag", CHILDRENS_DAY: "Kinderdag", VALENTINES_DAY: "Valentijnsdag", EASTER: "Pasen", THREE_KINGS: "Driekoningen", FIRST_COMMUNION: "Eerste heilige communie", EID_AL_FITR: "Eid al-Fitr", EID_AL_ADHA: "Eid al-Adha", HANUKKAH: "Chanoeka", CARNIVAL: "Carnaval", HALLOWEEN: "Halloween", ST_PATRICKS_DAY: "Sint-Patrickdag", NEW_YEARS: "Oudejaarsavond", WORLD_ANIMAL_DAY: "Werelddierendag",
    NEW_BABY: "Nieuwe baby", GETTING_A_BABY_SISTER: "Een zusje krijgen", GETTING_A_BABY_BROTHER: "Een broertje krijgen", NEW_PET: "Een nieuw huisdier", MOVING: "Verhuizen", HOLIDAY: "Vakantie", SLEEPOVER: "Logeerpartijtje", WEDDING: "Trouwen", PARENTAL_SEPARATION: "Scheiding van ouders", BLENDED_FAMILY: "Samengesteld gezin", SAYING_GOODBYE: "Afscheid nemen",
    LEARNING_TO_WALK: "Leren lopen", FIRST_WORDS: "Eerste woordjes", BODY_PARTS: "Lichaamsdelen", PACIFIER_WEANING: "Stoppen met de speen", STOPPING_THUMB_SUCKING: "Stoppen met duimzuigen", TOOTHBRUSHING: "Tanden poetsen", POTTY_TRAINING: "Zindelijk worden", HEALTHY_EATING: "Gezonder eten", TIDYING_UP: "Opruimen", SHAPES_AND_COLORS: "Vormen en kleuren", LEARNING_TO_COUNT: "Leren tellen", SEASONS_AND_WEATHER: "Seizoenen en weer", LEARNING_TO_RIDE_A_BIKE: "Leren fietsen", ALPHABET: "Alfabet", TYING_SHOELACES: "Veters strikken", TELLING_TIME: "Klokkijken", POCKET_MONEY_AND_SAVING: "Zakgeld en sparen",
    BEING_PROUD_OF_YOURSELF: "Trots zijn op jezelf", FINDING_CONFIDENCE: "Zelfvertrouwen vinden", SHAME: "Schaamte", FEAR_OF_THE_DARK: "Bang in het donker", INSECURITY: "Onzekerheid", HOMESICKNESS: "Heimwee", JEALOUSY: "Jaloezie", TANTRUMS: "Driftbuien", PEER_PRESSURE: "Groepsdruk", BEING_BULLIED: "Gepest worden",
  },
  fr: {
    UNICORNS: "Licornes", PRINCES_AND_PRINCESSES: "Princes et princesses", KNIGHTS_AND_DRAGONS: "Chevaliers et dragons", WIZARD_SCHOOL: "École de magie", ENCHANTED_FOREST: "La forêt enchantée", MERMAIDS: "Sirènes", GNOMES: "Gnomes", FAIRIES_AND_ELVES: "Fées et elfes", WITCHES_AND_ENCHANTMENT: "Sorcières et sortilèges", GIANTS: "Géants",
    GARBAGE_TRUCK: "Camion-poubelle", CONSTRUCTION_VEHICLES: "Engins de chantier", AIRPLANE: "Avion", RACING: "Course", FIREFIGHTER: "Pompiers", POLICE: "Police", DINOSAURS: "Dinosaures", PIRATES: "Pirates", SUPERHERO: "Super-héros", CAMPING: "Camping", TRAVEL: "Voyage", TREASURE_HUNTS: "Chasses au trésor", SECRET_MISSIONS: "Missions secrètes", HAUNTED_HOUSE: "Maison hantée", TIME_TRAVEL: "Voyage dans le temps",
    OUTDOOR_PLAY: "Jeux en plein air", DANCING: "Danse", MAKING_MUSIC: "Faire de la musique", GOING_TO_THE_FARM: "À la ferme", INTO_THE_FOREST: "Dans la forêt", TO_THE_BEACH: "À la plage", CRAFTING: "Loisirs créatifs", PAINTING: "Peinture", COOKING_AND_BAKING: "Cuisine et pâtisserie", GARDENING: "Jardinage", DRESS_UP: "Déguisements", GOING_TO_SCHOOL: "À l'école", GOING_TO_THE_LIBRARY: "À la bibliothèque", VISITING_THE_DOCTOR: "Chez le médecin", VISITING_THE_DENTIST: "Chez le dentiste", TRAIN_JOURNEYS: "Voyages en train", VISITING_THE_ZOO: "Au zoo", GOING_TO_THE_CIRCUS: "Au cirque", VISITING_AN_AMUSEMENT_PARK: "Parcs d'attractions", SPORTS: "Sports", CARING_FOR_ANIMALS: "S'occuper des animaux", BUILDING_A_TREEHOUSE: "Construire une cabane", GAMING: "Jeux vidéo",
    JUNGLE: "Dans la jungle", THE_SAVANA: "La savane", UNDERWATER: "Au fond de la mer", AT_THE_NORTH_POLE: "Au pôle Nord", CANDYLAND: "Le pays des bonbons", THE_MIDDLE_AGES: "Le Moyen Âge", SPACE: "Dans l'espace", IN_THE_FUTURE: "Dans le futur", PREHISTORIC_AGE: "La préhistoire", WILD_WEST: "Le Far West", VIKINGS: "Les Vikings", ARABIAN_NIGHTS: "Les Mille et Une Nuits", ANCIENT_EGYPT: "L'Égypte ancienne", ANCIENT_GREECE: "La Grèce antique",
    BIRTHDAY: "Anniversaire", CHRISTMAS: "Noël", MOTHERS_DAY: "Fête des Mères", FATHERS_DAY: "Fête des Pères", GRANDPARENTS_DAY: "Fête des grands-parents", CHILDRENS_DAY: "Fête des enfants", VALENTINES_DAY: "Saint-Valentin", EASTER: "Pâques", THREE_KINGS: "Épiphanie", FIRST_COMMUNION: "Première communion", EID_AL_FITR: "Aïd el-Fitr", EID_AL_ADHA: "Aïd al-Adha", HANUKKAH: "Hanoucca", CARNIVAL: "Carnaval", HALLOWEEN: "Halloween", ST_PATRICKS_DAY: "Saint-Patrick", NEW_YEARS: "Réveillon du Nouvel An", WORLD_ANIMAL_DAY: "Journée mondiale des animaux",
    NEW_BABY: "Nouveau bébé", GETTING_A_BABY_SISTER: "Avoir une petite sœur", GETTING_A_BABY_BROTHER: "Avoir un petit frère", NEW_PET: "Un nouvel animal", MOVING: "Déménagement", HOLIDAY: "Vacances", SLEEPOVER: "Soirée pyjama", WEDDING: "Mariage", PARENTAL_SEPARATION: "Séparation des parents", BLENDED_FAMILY: "Famille recomposée", SAYING_GOODBYE: "Dire au revoir",
    LEARNING_TO_WALK: "Apprendre à marcher", FIRST_WORDS: "Premiers mots", BODY_PARTS: "Parties du corps", PACIFIER_WEANING: "Arrêter la tétine", STOPPING_THUMB_SUCKING: "Arrêter de sucer son pouce", TOOTHBRUSHING: "Se brosser les dents", POTTY_TRAINING: "Apprendre la propreté", HEALTHY_EATING: "Manger mieux", TIDYING_UP: "Ranger", SHAPES_AND_COLORS: "Formes et couleurs", LEARNING_TO_COUNT: "Apprendre à compter", SEASONS_AND_WEATHER: "Saisons et météo", LEARNING_TO_RIDE_A_BIKE: "Apprendre à faire du vélo", ALPHABET: "Alphabet", TYING_SHOELACES: "Faire ses lacets", TELLING_TIME: "Lire l'heure", POCKET_MONEY_AND_SAVING: "Argent de poche et épargne",
    BEING_PROUD_OF_YOURSELF: "Être fier de soi", FINDING_CONFIDENCE: "Trouver confiance en soi", SHAME: "Honte", FEAR_OF_THE_DARK: "Peur du noir", INSECURITY: "Insécurité", HOMESICKNESS: "Mal du pays", JEALOUSY: "Jalousie", TANTRUMS: "Colères", PEER_PRESSURE: "Pression des pairs", BEING_BULLIED: "Être harcelé",
  },
};

export function getLocalizedSubjectLabel(subject: SubjectOption, language: SubjectLocale): string {
  return subjectTranslations[language as Exclude<SubjectLocale, "en">]?.[subject.value] ?? subject.label;
}

export function getStoryChoice(
  selectedStory?: string | null,
  selectedTheme?: string | null,
): { label: string; value: string; image: string; color: string } | undefined {
  if (!selectedStory) return undefined;

  const normalized = selectedStory.trim().toLowerCase();

  // 1. Try finding in the specific theme if selected
  if (selectedTheme && SUBJECT_OPTIONS[selectedTheme]) {
    const foundInTheme = SUBJECT_OPTIONS[selectedTheme].find(
      (s) =>
        s.value.toLowerCase() === normalized ||
        s.label.toLowerCase() === normalized
    );
    if (foundInTheme) {
      return {
        label: foundInTheme.label,
        value: foundInTheme.value,
        image: foundInTheme.image,
        color: foundInTheme.color,
      };
    }
  }

  // 2. Try finding across all subjects in all themes
  const found = ALL_SUBJECTS.find(
    (s) =>
      s.value.toLowerCase() === normalized ||
      s.label.toLowerCase() === normalized
  );
  if (found) {
    return {
      label: found.label,
      value: found.value,
      image: found.image,
      color: found.color,
    };
  }

  // 3. Fallback: nicely format the value
  const formattedLabel = selectedStory
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    label: formattedLabel,
    value: selectedStory,
    image: "/images/story_1.png",
    color: "#FFE5D6",
  };
}
