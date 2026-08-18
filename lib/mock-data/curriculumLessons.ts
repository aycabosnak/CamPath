/**
 * lib/mock-data/curriculumLessons.ts
 *
 * The Level Curriculum content model — distinct from
 * lib/mock-data/unitLessons.ts (which powers the CamPath-Stage-based
 * Study Path unit-1/2/3 pages and is NOT touched by this sprint).
 *
 * UX review follow-up: every lesson now has 3 guided questions
 * (was 1) — enough to give an honest signal of understanding without
 * turning a short lesson into a long one. All new questions reinforce
 * the SAME single objective already taught; none introduce new
 * content, per the "guided practice reinforces the objective" rule.
 */
import type { UnitQuestion } from "@/lib/mock-data/unitLessons";
import type { Skill } from "@/components/types";

export interface CurriculumLesson {
  id: string;
  level: string;
  skill: Skill;
  title: string;
  introLabel: string;
  introText?: string;
  introList?: string[];
  passage?: string;
  examples?: string[];
  questions: UnitQuestion[];
  completionMessage: string;
}

export const CURRICULUM_LESSONS: Record<string, CurriculumLesson[]> = {
  "a1-elementary": [
    {
      id: "a1-grammar-1",
      level: "a1-elementary",
      skill: "grammar",
      title: "Verb 'to be'",
      introLabel: "Explanation",
      introText:
        "We use the verb 'to be' (am / is / are) to talk about who we are, where we are, and what things are like.",
      examples: ["I am a student.", "She is from Turkey.", "They are happy."],
      questions: [
        {
          prompt: "Choose the correct sentence.",
          options: ["She am a teacher.", "She is a teacher.", "She are a teacher.", "She be a teacher."],
          correctAnswer: "She is a teacher.",
          reviewFeedback: "Review this concept — use 'is' with he/she/it.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct sentence.",
          options: ["We is students.", "We are students.", "We am students.", "We be students."],
          correctAnswer: "We are students.",
          reviewFeedback: "Review this concept — use 'are' with we/you/they.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct sentence.",
          options: ["I is happy.", "I are happy.", "I am happy.", "I be happy."],
          correctAnswer: "I am happy.",
          reviewFeedback: "Review this concept — use 'am' with I.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now introduce yourself and describe people using the verb 'to be'.",
    },
    {
      id: "a1-vocabulary-1",
      level: "a1-elementary",
      skill: "vocabulary",
      title: "Family & People",
      introLabel: "Useful Vocabulary",
      introList: ["mother", "father", "brother", "sister", "grandmother", "niece"],
      examples: ["This is my mother.", "I have one brother and one sister.", "She is my best friend."],
      questions: [
        {
          prompt: "Choose the correct word: 'My father's mother is my ___.'",
          options: ["grandmother", "aunt", "sister", "cousin"],
          correctAnswer: "grandmother",
          reviewFeedback: "Review this concept — your father's mother is your grandmother.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'My mother's husband is my ___.'",
          options: ["father", "uncle", "brother", "cousin"],
          correctAnswer: "father",
          reviewFeedback: "Review this concept — your mother's husband is your father.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'My brother's daughter is my ___.'",
          options: ["niece", "nephew", "cousin", "sister"],
          correctAnswer: "niece",
          reviewFeedback: "Review this concept — a brother's or sister's daughter is your niece.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now talk about your family members using simple vocabulary.",
    },
    {
      id: "a1-reading-1",
      level: "a1-elementary",
      skill: "reading",
      title: "Signs & Short Notices",
      introLabel: "Reading Text",
      passage:
        "\"CITY MUSEUM — Open Tuesday to Sunday, 9am–5pm. Closed on Mondays. Entrance: $5. Children under 12: free. No photos in the main hall.\"",
      questions: [
        {
          prompt: "According to the sign, when is the museum closed?",
          options: ["Sunday", "Monday", "Saturday", "Tuesday"],
          correctAnswer: "Monday",
          reviewFeedback: "Review this concept — the sign says 'Closed on Mondays'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "How much does an 8-year-old child pay to enter?",
          options: ["$5", "Nothing", "$12", "$2"],
          correctAnswer: "Nothing",
          reviewFeedback: "Review this concept — children under 12 enter for free.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Where can you not take photos?",
          options: ["Outside the museum", "The main hall", "The gift shop", "The entrance"],
          correctAnswer: "The main hall",
          reviewFeedback: "Review this concept — the sign says 'No photos in the main hall'.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now understand simple signs and notices.",
    },
    {
      id: "a1-writing-1",
      level: "a1-elementary",
      skill: "writing",
      title: "Filling in Forms",
      introLabel: "Writing Focus",
      introText:
        "Forms usually ask for your name, age, and address. Use capital letters correctly for names and countries.",
      examples: ["Name: JOHN SMITH", "Country: TURKEY", "Age: 25"],
      questions: [
        {
          prompt: "Which is written correctly on a form?",
          options: ["name: john smith", "Name: John Smith", "NAME john SMITH", "Name; John, Smith"],
          correctAnswer: "Name: John Smith",
          reviewFeedback: "Review this concept — capitalize the label and each name.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which is the correct way to write a country name on a form?",
          options: ["turkey", "Turkey", "TURKEY.", "Turkey,"],
          correctAnswer: "Turkey",
          reviewFeedback: "Review this concept — country names start with a capital letter, with no extra punctuation.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which is the correct way to write an age on a form?",
          options: ["Age: twenty-five", "Age: 25", "Age - 25 years", "25(age)"],
          correctAnswer: "Age: 25",
          reviewFeedback: "Review this concept — forms expect a number after the label and a colon.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now fill in a simple form with your personal details correctly.",
    },
  ],

  "a2-pre-intermediate": [
    {
      id: "a2-grammar-1",
      level: "a2-pre-intermediate",
      skill: "grammar",
      title: "Past Simple",
      introLabel: "Explanation",
      introText:
        "We use the past simple to talk about finished actions and events in the past. Regular verbs add -ed (played, watched). Many common verbs are irregular (go → went, have → had, see → saw).",
      examples: [
        "I visited my grandparents last weekend.",
        "She went to the cinema yesterday.",
        "They didn't have time to finish.",
      ],
      questions: [
        {
          prompt: "Choose the correct sentence.",
          options: [
            "I visit my friend yesterday.",
            "I visited my friend yesterday.",
            "I visiting my friend yesterday.",
            "I have visit my friend yesterday.",
          ],
          correctAnswer: "I visited my friend yesterday.",
          reviewFeedback: "Review this concept — regular past simple verbs add -ed.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct past form of 'go'.",
          options: ["goed", "went", "gone", "going"],
          correctAnswer: "went",
          reviewFeedback: "Review this concept — 'go' is irregular: go → went.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct negative sentence.",
          options: [
            "She didn't went to work.",
            "She didn't go to work.",
            "She not went to work.",
            "She doesn't went to work.",
          ],
          correctAnswer: "She didn't go to work.",
          reviewFeedback: "Review this concept — after 'didn't', use the base form of the verb.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now talk about finished past events using the past simple.",
    },
    {
      id: "a2-vocabulary-1",
      level: "a2-pre-intermediate",
      skill: "vocabulary",
      title: "Daily Routines",
      introLabel: "Useful Vocabulary",
      introList: ["wake up", "get dressed", "have breakfast", "commute", "go to bed"],
      examples: [
        "I wake up at 7am every day.",
        "She commutes to work by bus.",
        "We have breakfast together before school.",
      ],
      questions: [
        {
          prompt: "Choose the correct word: 'I always ___ at 7am.'",
          options: ["wake up", "go to bed", "have lunch", "get dressed"],
          correctAnswer: "wake up",
          reviewFeedback: "Review this concept — 'wake up' describes the start of the day.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'He ___ to work by train every morning.'",
          options: ["commutes", "wakes", "dresses", "sleeps"],
          correctAnswer: "commutes",
          reviewFeedback: "Review this concept — 'commute' means to travel to work or school regularly.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'Before I leave the house, I ___.'",
          options: ["get dressed", "go to bed", "commute", "have dinner"],
          correctAnswer: "get dressed",
          reviewFeedback: "Review this concept — you get dressed before leaving the house.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now describe your daily routine using common everyday verbs.",
    },
    {
      id: "a2-reading-1",
      level: "a2-pre-intermediate",
      skill: "reading",
      title: "Short Narratives",
      introLabel: "Reading Text",
      passage:
        "Last Saturday, Maria woke up early and went for a run in the park. Afterwards, she met her friend Tom for breakfast at a small café. They talked for an hour before Maria went home to study for her exam.",
      questions: [
        {
          prompt: "What did Maria do first?",
          options: ["Studied for her exam", "Went for a run", "Met Tom", "Had breakfast"],
          correctAnswer: "Went for a run",
          reviewFeedback: "Review this concept — the text says she went for a run right after waking up.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Where did Maria and Tom meet?",
          options: ["At the park", "At Maria's house", "At a café", "At school"],
          correctAnswer: "At a café",
          reviewFeedback: "Review this concept — the text says they had breakfast at a small café.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "What did Maria do after meeting Tom?",
          options: ["Went for another run", "Went home to study", "Went to work", "Went to sleep"],
          correctAnswer: "Went home to study",
          reviewFeedback: "Review this concept — the text says she went home to study for her exam.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now understand the sequence of events in a short narrative.",
    },
    {
      id: "a2-writing-1",
      level: "a2-pre-intermediate",
      skill: "writing",
      title: "Informal Messages",
      introLabel: "Writing Focus",
      introText:
        "Informal messages to friends use casual greetings and short sentences. Start with 'Hi' or 'Hey', and end with a friendly closing like 'See you soon!'",
      examples: [
        "Hi Sarah, are you free this weekend?",
        "Hey! Thanks for the invite, see you Friday!",
        "Hope you're doing well!",
      ],
      questions: [
        {
          prompt: "Which is the best informal greeting to a friend?",
          options: ["Dear Sir,", "Hi Tom,", "To whom it may concern,", "Respected Sir,"],
          correctAnswer: "Hi Tom,",
          reviewFeedback: "Review this concept — informal messages use casual greetings like 'Hi'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which is the best informal closing?",
          options: ["Yours faithfully,", "See you soon!", "Sincerely,", "Best regards, Management"],
          correctAnswer: "See you soon!",
          reviewFeedback: "Review this concept — informal messages close casually, not formally.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which sentence fits an informal message?",
          options: [
            "I would be grateful if you could confirm your attendance.",
            "Are you coming to the party on Saturday?",
            "Please find attached the requested document.",
            "I am writing to inform you.",
          ],
          correctAnswer: "Are you coming to the party on Saturday?",
          reviewFeedback: "Review this concept — informal messages use simple, direct questions.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now write a short, informal message to a friend.",
    },
  ],

  "b1-intermediate": [
    {
      id: "b1-grammar-1",
      level: "b1-intermediate",
      skill: "grammar",
      title: "First Conditional",
      introLabel: "Explanation",
      introText:
        "We use the first conditional to talk about real possibilities in the future. The structure is: If + present simple, ... will + base verb.",
      examples: [
        "If it rains tomorrow, we will stay at home.",
        "If she studies tonight, she will pass the exam.",
        "You'll feel better if you get some rest.",
      ],
      questions: [
        {
          prompt:
            "The outdoor concert will move indoors if the weather changes. Which sentence correctly describes that plan?",
          options: [
            "If it rains, the concert will move indoors.",
            "If it will rain, the concert moves indoors.",
            "If it rained, the concert will move indoors.",
            "If it rains, the concert would have moved indoors.",
          ],
          correctAnswer: "If it rains, the concert will move indoors.",
          reviewFeedback:
            "Review this concept — a real future possibility uses present simple after 'if' and 'will' in the result.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "Emma must catch the 8:45 bus to reach an interview on time. Which sentence describes the likely result if she misses it?",
          options: [
            "If she misses the bus, she will be late for the interview.",
            "If she will miss the bus, she is late for the interview.",
            "If she missed the bus, she will be late for the interview.",
            "If she misses the bus, she would have been late for the interview.",
          ],
          correctAnswer: "If she misses the bus, she will be late for the interview.",
          reviewFeedback:
            "Review this concept — a likely future result uses present simple in the if-clause and 'will' in the result.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "Your team can submit the proposal today, but only if the final figures arrive. Which sentence expresses that condition correctly?",
          options: [
            "We will submit the proposal if the figures arrive today.",
            "We submit the proposal if the figures will arrive today.",
            "We would submit the proposal if the figures arrived yesterday.",
            "We will have submitted the proposal if the figures arrived today.",
          ],
          correctAnswer: "We will submit the proposal if the figures arrive today.",
          reviewFeedback:
            "Review this concept — the result clause can come first, but a likely future condition still uses 'will' + present simple.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now describe real future possibilities and their likely results.",
    },
    {
      id: "b1-vocabulary-1",
      level: "b1-intermediate",
      skill: "vocabulary",
      title: "Future Plans",
      introLabel: "Useful Vocabulary",
      introList: ["intend to", "plan to", "be going to", "look forward to", "aim to"],
      examples: [
        "I intend to finish the course by June.",
        "She is planning to move abroad next year.",
        "We're looking forward to the summer holidays.",
      ],
      questions: [
        {
          prompt:
            "The team has drafted a schedule and requested funding. Complete its announcement: 'We ___ launch the new course in September, subject to final approval.'",
          options: ["plan to", "look forward to", "intends to", "planning"],
          correctAnswer: "plan to",
          reviewFeedback:
            "Review this concept — 'plan to' + base verb describes an intended action; the approval condition shows it is not certain yet.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct phrase: 'We ___ visiting my parents this weekend.'",
          options: ["look forward to", "intend to", "aim to", "plan to"],
          correctAnswer: "look forward to",
          reviewFeedback: "Review this concept — 'look forward to' is followed by a gerund (-ing form).",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "Mina has bought her ticket and arranged accommodation. Which phrase best completes the sentence: 'She ___ study in Dublin next term.'",
          options: ["is going to", "looks forward to", "intends", "aim"],
          correctAnswer: "is going to",
          reviewFeedback:
            "Review this concept — 'be going to' expresses an intention supported by plans already made.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now talk about future plans and intentions using common vocabulary.",
    },
    {
      id: "b1-reading-1",
      level: "b1-intermediate",
      skill: "reading",
      title: "Gist and Detail Practice",
      introLabel: "Reading Text",
      passage:
        "\"The library will be closed for renovation from July 10th to August 1st. All borrowed books are due back by July 9th. Although the closure was announced with plenty of notice, several regular visitors said they were disappointed, since the library is normally open throughout the summer.\"",
      questions: [
        {
          prompt: "By when must borrowed books be returned?",
          options: ["July 1st", "July 9th", "July 10th", "August 1st"],
          correctAnswer: "July 9th",
          reviewFeedback: "Review this concept — the text states books are due back by July 9th, the day before closure.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "What does the text suggest about how visitors feel?",
          options: [
            "They were not told in advance.",
            "They are disappointed, despite the advance notice.",
            "They are happy about the renovation.",
            "They did not notice the closure.",
          ],
          correctAnswer: "They are disappointed, despite the advance notice.",
          reviewFeedback: "Review this concept — 'although... plenty of notice... disappointed' signals disappointment despite fair warning.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "What is unusual about this closure, according to the text?",
          options: [
            "It happens every summer.",
            "The library is normally open all summer.",
            "The library is always closed in July.",
            "No reason was given for the closure.",
          ],
          correctAnswer: "The library is normally open all summer.",
          reviewFeedback: "Review this concept — the text says the library is 'normally open throughout the summer', making this closure the exception.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now identify both the explicit detail and the implied meaning in a short text.",
    },
    {
      id: "b1-writing-1",
      level: "b1-intermediate",
      skill: "writing",
      title: "Giving Opinions",
      introLabel: "Useful Phrases",
      introList: ["In my opinion, ...", "I personally think that ...", "From my point of view, ..."],
      examples: [
        "In my opinion, learning English online is very effective.",
        "I personally think that group study helps motivation.",
        "From my point of view, speaking practice is the most important skill.",
      ],
      questions: [
        {
          prompt:
            "You are opening a formal essay about remote learning. Which sentence presents a measured personal position?",
          options: [
            "In my opinion, remote learning can be effective when it is well structured.",
            "Remote learning is obviously the only effective approach.",
            "Everyone agrees that remote learning always works.",
            "I guess remote learning is sort of fine.",
          ],
          correctAnswer:
            "In my opinion, remote learning can be effective when it is well structured.",
          reviewFeedback:
            "Review this concept — 'In my opinion' marks a personal view, while 'can' and the condition avoid an unsupported absolute claim.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "A report has presented mixed evidence about longer school days. Which sentence introduces your own view appropriately?",
          options: [
            "From my point of view, the evidence does not yet justify a permanent change.",
            "The evidence definitely proves the change is a bad idea.",
            "If you ask me, the whole plan is pretty pointless.",
            "Everyone knows longer days can never work.",
          ],
          correctAnswer:
            "From my point of view, the evidence does not yet justify a permanent change.",
          reviewFeedback:
            "Review this concept — the selected sentence marks a personal view and responds to the evidence without using casual or absolute language.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which sentence best introduces a personal opinion in formal writing?",
          options: [
            "I personally think that public transport should be free.",
            "Everyone knows public transport should be free.",
            "Public transport should obviously be free.",
            "Public transport being free is a no-brainer.",
          ],
          correctAnswer: "I personally think that public transport should be free.",
          reviewFeedback: "Review this concept — 'I personally think that' clearly signals a personal opinion; the others assert it as fact or use casual phrasing.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now introduce your opinions clearly in formal speaking or writing.",
    },
  ],

  "b1-plus-upper-intermediate": [
    {
      id: "b1plus-grammar-1",
      level: "b1-plus-upper-intermediate",
      skill: "grammar",
      title: "Present Perfect Continuous",
      introLabel: "Explanation",
      introText:
        "We use the present perfect continuous (have/has been + verb-ing) to emphasise the duration of an action that started in the past and is still happening now. It's often used with 'for' and 'since'.",
      examples: [
        "I've been learning English for three years.",
        "She's been working on this project since Monday.",
        "They've been waiting for an hour.",
      ],
      questions: [
        {
          prompt:
            "The path is still wet and the maintenance team has not finished. Which sentence best emphasises the ongoing activity?",
          options: [
            "They have repaired the path.",
            "They have been repairing the path since early morning.",
            "They repaired the path every morning.",
            "They had repaired the path before early morning.",
          ],
          correctAnswer: "They have been repairing the path since early morning.",
          reviewFeedback:
            "Review this concept — present perfect continuous emphasises an activity continuing over time and supported by present evidence.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "Lena started working here in 2021 and still works here. Which sentence uses the time expression correctly?",
          options: [
            "Lena has been working here since 2021.",
            "Lena has been working here for 2021.",
            "Lena worked here since 2021.",
            "Lena is working here for 2021.",
          ],
          correctAnswer: "Lena has been working here since 2021.",
          reviewFeedback:
            "Review this concept — use 'since' with a starting point such as 2021; use 'for' with a duration.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "A colleague says she began learning English in 2022 and still studies every week. Which question asks about the duration?",
          options: [
            "How long have you been learning English?",
            "How long you have been learning English?",
            "How long are you been learning English?",
            "How long have you being learning English?",
          ],
          correctAnswer: "How long have you been learning English?",
          reviewFeedback: "Review this concept — questions invert to 'have + subject + been + verb-ing'.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now describe how long an ongoing action has been happening.",
    },
    {
      id: "b1plus-vocabulary-1",
      level: "b1-plus-upper-intermediate",
      skill: "vocabulary",
      title: "Environment & Technology",
      introLabel: "Useful Vocabulary",
      introList: ["renewable energy", "pollution", "recycle", "device", "upgrade"],
      examples: [
        "Solar power is a good example of renewable energy.",
        "Air pollution is a serious problem in big cities.",
        "We should recycle more plastic and paper.",
      ],
      questions: [
        {
          prompt:
            "The town wants to reduce its dependence on coal, so it plans to invest in ___ energy from wind and sunlight.",
          options: ["renewable", "disposable", "artificial", "recycled"],
          correctAnswer: "renewable",
          reviewFeedback:
            "Review this concept — wind and sunlight are naturally replenished, so the established collocation is 'renewable energy'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "The river is unsafe because waste from nearby factories has caused serious ___.",
          options: ["pollution", "renewal", "recycling", "technology"],
          correctAnswer: "pollution",
          reviewFeedback:
            "Review this concept — 'pollution' is environmental harm caused by waste or other harmful substances.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "These glass bottles are clean and reusable, so please ___ them instead of putting them in general waste.",
          options: ["recycle", "upgrade", "pollute", "replace"],
          correctAnswer: "recycle",
          reviewFeedback:
            "Review this concept — to 'recycle' an item is to process its material so it can be used again.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now discuss environmental and technology topics using accurate vocabulary.",
    },
    {
      id: "b1plus-reading-1",
      level: "b1-plus-upper-intermediate",
      skill: "reading",
      title: "Reading for Inference",
      introLabel: "Reading Text",
      passage:
        "A growing number of city councils are introducing charges for plastic bags in supermarkets. Supporters argue that the policy has already reduced plastic waste significantly, while some shoppers complain that it simply shifts the cost onto customers without solving the bigger problem of packaging waste overall.",
      questions: [
        {
          prompt: "What is the main reasoning used by supporters of the charge?",
          options: [
            "Charging for bags appears to discourage some plastic use.",
            "The charge removes every kind of packaging waste.",
            "Customers prefer paying more for their shopping.",
            "Supermarkets no longer sell packaged products.",
          ],
          correctAnswer: "Charging for bags appears to discourage some plastic use.",
          reviewFeedback:
            "Review this concept — supporters connect the charge with a significant reduction in plastic waste, implying changed behaviour.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which assumption is behind the shoppers' criticism?",
          options: [
            "A useful policy should address packaging waste more broadly, not only bag use.",
            "Plastic bags are the only source of packaging waste.",
            "Customers should pay more whenever waste falls.",
            "Supermarkets have already removed all packaging.",
          ],
          correctAnswer: "A useful policy should address packaging waste more broadly, not only bag use.",
          reviewFeedback:
            "Review this concept — their complaint assumes success should be judged against the wider packaging problem, not bag use alone.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "How does the writer organise the paragraph?",
          options: [
            "By reporting a claimed benefit and then a limitation raised by critics",
            "By proving that one side is dishonest",
            "By listing instructions for shoppers",
            "By describing events in chronological order",
          ],
          correctAnswer: "By reporting a claimed benefit and then a limitation raised by critics",
          reviewFeedback:
            "Review this concept — the paragraph first gives supporters' evidence, then contrasts it with a broader criticism.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now infer opinions and implied meaning from a longer text, not just explicit detail.",
    },
    {
      id: "b1plus-writing-1",
      level: "b1-plus-upper-intermediate",
      skill: "writing",
      title: "For-and-Against Essays",
      introLabel: "Explanation",
      introText:
        "A for-and-against essay presents both sides of an issue before giving your own opinion. Use linking phrases like 'On the one hand... on the other hand...' and finish with a clear conclusion.",
      examples: [
        "On the one hand, technology makes learning more accessible. On the other hand, it can be a distraction in the classroom.",
        "Some people believe cars should be banned from city centres, while others argue this would harm local businesses.",
        "In conclusion, I believe the advantages outweigh the disadvantages.",
      ],
      questions: [
        {
          prompt:
            "Complete the opening of a balanced paragraph: '___, working from home can reduce commuting time. On the other hand, some employees feel isolated.'",
          options: ["On the one hand", "As a result", "In conclusion", "For example"],
          correctAnswer: "On the one hand",
          reviewFeedback:
            "Review this concept — 'On the one hand' introduces the first viewpoint before 'On the other hand' presents the contrast.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "Which phrase best completes the contrast? 'Online courses are flexible. ___, learners may receive less immediate support.'",
          options: ["On the other hand,", "For this reason,", "For example,", "Similarly,"],
          correctAnswer: "On the other hand,",
          reviewFeedback:
            "Review this concept — the second sentence introduces a drawback that contrasts with the stated benefit.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "An essay has considered both the convenience of online services and the risk of excluding some users. Which sentence concludes it most effectively?",
          options: [
            "In conclusion, the benefits appear to outweigh the drawbacks, provided offline support remains available.",
            "In conclusion, convenience is the only issue that matters.",
            "On the other hand, some users need support.",
            "For example, many people use online services.",
          ],
          correctAnswer:
            "In conclusion, the benefits appear to outweigh the drawbacks, provided offline support remains available.",
          reviewFeedback:
            "Review this concept — an effective conclusion weighs both sides and gives a qualified overall judgement.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now structure a basic for-and-against essay with a clear conclusion.",
    },
  ],

  "b2-pre-advanced": [
    {
      id: "b2-grammar-1",
      level: "b2-pre-advanced",
      skill: "grammar",
      title: "Advanced Tense Review",
      introLabel: "Explanation",
      introText:
        "At B2, tense choice depends on meaning, not a single 'correct' timeline. Use the present perfect for a past action with a present result, and the present perfect continuous when you want to emphasise duration or an activity still in progress. Use the past perfect to show that one past event happened before another. In narrative, mix these tenses so the reader can follow what happened first, what was already true, and what is still relevant now.",
      examples: [
        "I've written the report. (It's finished — here's the result.)",
        "I've been writing the report all morning. (The activity, and how long it lasted, is the point.)",
        "By the time the meeting started, she had already left.",
      ],
      questions: [
        {
          prompt: "Choose the best sentence. The speaker wants to emphasise how long the activity has continued.",
          options: [
            "I've read this book.",
            "I've been reading this book for weeks.",
            "I had read this book.",
            "I was reading this book last year.",
          ],
          correctAnswer: "I've been reading this book for weeks.",
          reviewFeedback: "Review this concept — present perfect continuous highlights duration of an activity that may still be going on.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Two past events: first the guests left, then we arrived. Which sentence makes that order clear?",
          options: [
            "When we arrived, the guests left.",
            "When we arrived, the guests have left.",
            "When we arrived, the guests had already left.",
            "When we arrived, the guests were left.",
          ],
          correctAnswer: "When we arrived, the guests had already left.",
          reviewFeedback: "Review this concept — past perfect marks the earlier of two past events.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which sentence treats the past action mainly as a present result?",
          options: [
            "I've lost my keys, so I can't get in.",
            "I've been losing my keys all week, which is annoying.",
            "I had lost my keys before I moved house.",
            "I was losing my keys when you called.",
          ],
          correctAnswer: "I've lost my keys, so I can't get in.",
          reviewFeedback: "Review this concept — present perfect simple often presents a finished action through its present consequence.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now choose between perfect simple, perfect continuous, and past perfect according to meaning.",
    },
    {
      id: "b2-grammar-2",
      level: "b2-pre-advanced",
      skill: "grammar",
      title: "Modals and Degrees of Certainty",
      introLabel: "Explanation",
      introText:
        "Modal verbs show how sure we are, not only what is possible. Must expresses a strong conclusion from evidence. Might, may, and could express a real possibility. Can't (or couldn't) rejects an idea as very unlikely. For past deductions, add have + past participle: must have, might have, can't have. Choose the modal to match the strength of the evidence, not to sound dramatic.",
      examples: [
        "The lights are on — she must be at home.",
        "He isn't answering. He might be in a meeting.",
        "She can't have forgotten — she confirmed yesterday.",
      ],
      questions: [
        {
          prompt: "The restaurant is closed and the chairs are on the tables. Which is the strongest conclusion?",
          options: [
            "They might be closed for the evening.",
            "They must have already closed.",
            "They could close later.",
            "They can't be a restaurant.",
          ],
          correctAnswer: "They must have already closed.",
          reviewFeedback: "Review this concept — 'must have' is a confident deduction about the past based on clear evidence.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "You see a colleague's coat, but you are not sure they are in the building. Which modal fits?",
          options: [
            "They must be here — there is no other possibility.",
            "They can't be here — the coat proves nothing.",
            "They might be here — the coat is only a clue.",
            "They must have been here tomorrow.",
          ],
          correctAnswer: "They might be here — the coat is only a clue.",
          reviewFeedback: "Review this concept — 'might' is appropriate when the evidence is incomplete.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Tom is a strict vegetarian. Someone says he ordered a steak. Which response is most accurate?",
          options: [
            "He must have ordered it.",
            "He might have ordered it, so it is certain.",
            "He can't have ordered it.",
            "He must order it every day.",
          ],
          correctAnswer: "He can't have ordered it.",
          reviewFeedback: "Review this concept — 'can't have' rejects a past claim that conflicts with what we know.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now express present and past deductions with an appropriate degree of certainty.",
    },
    {
      id: "b2-grammar-3",
      level: "b2-pre-advanced",
      skill: "grammar",
      title: "Conditionals and Hypothetical Meaning",
      introLabel: "Explanation",
      introText:
        "Second conditionals imagine an unlikely or unreal present/future (If + past, would + infinitive). Third conditionals imagine a different past (If + past perfect, would have + past participle). Mixed conditionals combine the two: a past condition with a present result, or a present condition with a past result. Wish / if only follows the same unreal-past pattern. The past tense here does not mean the event is past; it signals that the situation is not real.",
      examples: [
        "If I had more time, I would learn Italian. (unreal now)",
        "If she had left earlier, she would have caught the train. (unreal past)",
        "If I had taken the job, I would be in Berlin now. (past cause, present result)",
      ],
      questions: [
        {
          prompt: "Which sentence imagines a different present, not a real plan?",
          options: [
            "If it rains tomorrow, we will stay in.",
            "If I were in charge, I would change the policy.",
            "If you heat ice, it melts.",
            "If she arrives first, she will call us.",
          ],
          correctAnswer: "If I were in charge, I would change the policy.",
          reviewFeedback:
            "Review this concept — second conditional (past + would) marks an unreal or unlikely present.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "The meeting already went badly. Which sentence comments on that past?",
          options: [
            "If we prepared more, it would go better.",
            "If we had prepared more, it would have gone better.",
            "If we prepare more, it will go better.",
            "If we were preparing more, it goes better.",
          ],
          correctAnswer: "If we had prepared more, it would have gone better.",
          reviewFeedback: "Review this concept — third conditional looks back at a past that cannot be changed.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "The deadline has passed and you did not submit the form. Which sentence expresses regret about that past action?",
          options: [
            "If only I had submitted the form on time.",
            "If only I submit the form on time.",
            "I wish I will submit the form yesterday.",
            "If only I would submit the form last week.",
          ],
          correctAnswer: "If only I had submitted the form on time.",
          reviewFeedback:
            "Review this concept — 'wish' or 'if only' about a past regret uses the past perfect: had + past participle.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage:
        "You can now describe unreal present situations, alternative pasts, and past regrets with conditionals and 'if only'.",
    },
    {
      id: "b2-grammar-4",
      level: "b2-pre-advanced",
      skill: "grammar",
      title: "Passive and Reporting Structures",
      introLabel: "Explanation",
      introText:
        "The passive (be + past participle) is useful when the action or the result matters more than who did it. Reporting verbs often appear in two impersonal patterns: It is believed that + clause, and Subject + is thought/said to + infinitive. These let you report an idea without naming the source. Have/get something done describes a service you arrange, not an action you do yourself.",
      examples: [
        "The results were published last night.",
        "It is widely believed that the policy will change.",
        "The minister is said to be considering a U-turn.",
        "We had the documents translated.",
      ],
      questions: [
        {
          prompt: "Which sentence reports the same idea impersonally?",
          options: [
            "People think the company is expanding.",
            "It is thought that the company is expanding.",
            "The company thinks it is expanding.",
            "Think the company is expanding.",
          ],
          correctAnswer: "It is thought that the company is expanding.",
          reviewFeedback: "Review this concept — 'It is thought that…' is the impersonal reporting pattern.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which sentence uses the 'be said to' pattern correctly?",
          options: [
            "She is said to have resigned yesterday.",
            "She is said that she resigned yesterday.",
            "She said to have resigned yesterday.",
            "She is saying to resign yesterday.",
          ],
          correctAnswer: "She is said to have resigned yesterday.",
          reviewFeedback: "Review this concept — after 'is said/thought', use to + infinitive (to have + past participle for a past event).",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which sentence means you arranged for someone else to repair the roof?",
          options: [
            "We repaired the roof ourselves all weekend.",
            "The roof was repairing.",
            "We had the roof repaired.",
            "We have been the roof repaired.",
          ],
          correctAnswer: "We had the roof repaired.",
          reviewFeedback: "Review this concept — 'have something done' means you arrange the service; you do not necessarily do the work.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now use passives and impersonal reporting structures to shift focus and report ideas.",
    },
    {
      id: "b2-vocabulary-1",
      level: "b2-pre-advanced",
      skill: "vocabulary",
      title: "Vocabulary in Context",
      introLabel: "Useful patterns",
      introText:
        "B2 vocabulary is less about rare words and more about natural combinations. Collocations (make a decision, raise a concern), phrasal verbs whose meaning depends on context (bring up, come up with), and word families (decide / decision / decisive) all help you sound precise. Guess meaning from the surrounding sentence before you reach for a dictionary.",
      introList: ["raise a concern", "come up with", "take into account", "widely regarded", "increasingly common"],
      examples: [
        "The report raises several concerns about air quality.",
        "We need to come up with a practical alternative.",
        "Cost has to be taken into account.",
      ],
      questions: [
        {
          prompt: "Choose the most natural collocation: 'The manager ___ a number of concerns at the meeting.'",
          options: ["did", "raised", "made", "put"],
          correctAnswer: "raised",
          reviewFeedback: "Review this concept — English typically 'raises' concerns, not 'makes' or 'does' them.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "In 'They came up with a new timetable', came up with means:",
          options: ["arrived physically", "invented or proposed", "cancelled", "complained about"],
          correctAnswer: "invented or proposed",
          reviewFeedback: "Review this concept — 'come up with' is a phrasal verb meaning produce an idea or solution.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word family: 'It was a ___ moment for the team.' (decide)",
          options: ["decide", "decision", "decisive", "decidedly"],
          correctAnswer: "decisive",
          reviewFeedback: "Review this concept — an adjective is needed before 'moment'; 'decisive' means important or determining the result.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now use common B2 collocations, phrasal verbs, and word families in context.",
    },
    {
      id: "b2-reading-1",
      level: "b2-pre-advanced",
      skill: "reading",
      title: "Reading and Argument",
      introLabel: "Reading Text",
      passage:
        "City councils often promote cycle lanes as a simple solution to congestion. The evidence, however, is mixed. In several European cities, dedicated lanes have increased cycling and slightly reduced short car trips — a genuine gain for public health. Critics point out that the same schemes sometimes push remaining traffic onto fewer roads, creating new bottlenecks. The writer of this commentary does not reject cycle lanes; rather, she argues that they work only as part of a wider plan that also limits through-traffic and improves buses. Treating them as a complete answer, she suggests, is politically convenient but incomplete.",
      questions: [
        {
          prompt: "What is the writer's main argument?",
          options: [
            "Cycle lanes always fail and should be abandoned.",
            "Cycle lanes help, but they are not a complete solution on their own.",
            "Buses are more important than cycling in every city.",
            "Congestion cannot be reduced by any transport policy.",
          ],
          correctAnswer: "Cycle lanes help, but they are not a complete solution on their own.",
          reviewFeedback: "Review this concept — she accepts some benefits, then argues that lanes only work as part of a wider plan.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which detail is used as supporting evidence, not just opinion?",
          options: [
            "Cycle lanes are politically convenient.",
            "In several European cities, lanes increased cycling and reduced some short car trips.",
            "Critics dislike all cycling schemes.",
            "Buses should replace cars completely.",
          ],
          correctAnswer: "In several European cities, lanes increased cycling and reduced some short car trips.",
          reviewFeedback: "Review this concept — a reported outcome in several cities is evidence; 'politically convenient' is an evaluation.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "How would you describe the writer's attitude to cycle lanes?",
          options: [
            "Unconditionally enthusiastic",
            "Hostile and dismissive",
            "Cautiously supportive, with a clear reservation",
            "Neutral and purely descriptive",
          ],
          correctAnswer: "Cautiously supportive, with a clear reservation",
          reviewFeedback: "Review this concept — she does not reject lanes, but she calls a lanes-only policy incomplete.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now identify a writer's main argument, evidence, and attitude in a B2 text.",
    },
    {
      id: "b2-writing-1",
      level: "b2-pre-advanced",
      skill: "writing",
      title: "Formal Reporting and Paraphrase",
      introLabel: "Writing Focus",
      introText:
        "Formal summaries report another source accurately without copying its wording or making the claim stronger. Use impersonal structures such as 'It is believed that...' and 'X is said to...' when the source is general or unnamed. When evidence is limited, verbs such as 'suggest' and modals such as 'may' preserve the original degree of certainty. A controlled paraphrase changes the wording and structure while keeping the people, time, cause, and strength of the claim unchanged.",
      examples: [
        "Experts believe the change will reduce delays. → It is believed that the change will reduce delays.",
        "Officials say the bridge was damaged in the storm. → The bridge is said to have been damaged in the storm.",
        "A small survey found a possible benefit. → The survey suggests that the change may be beneficial.",
      ],
      questions: [
        {
          prompt:
            "Source: 'Experts believe the rail extension will reduce journey times.' Which sentence reports the claim most appropriately in a formal summary?",
          options: [
            "It is believed that the rail extension will reduce journey times.",
            "The rail extension believes that journeys will reduce.",
            "Experts are saying the extension definitely fixes every journey.",
            "It believes the rail extension to reduce journey times.",
          ],
          correctAnswer: "It is believed that the rail extension will reduce journey times.",
          reviewFeedback:
            "Review this concept — 'It is believed that...' reports a general expert claim impersonally without changing its meaning.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "Source: 'Officials say the bridge was damaged during last night's storm.' Which controlled paraphrase keeps the original time and meaning?",
          options: [
            "The bridge is said to have been damaged during last night's storm.",
            "The bridge is said to be damaged every night.",
            "Officials are damaged by the bridge during the storm.",
            "The bridge says that last night's storm was damaged.",
          ],
          correctAnswer: "The bridge is said to have been damaged during last night's storm.",
          reviewFeedback:
            "Review this concept — 'is said to have been damaged' reports an earlier passive event and preserves the source's past-time meaning.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt:
            "Source: 'A small staff survey found that some employees preferred flexible hours.' Which paraphrase avoids overstating the evidence?",
          options: [
            "The survey suggests that flexible hours may be preferred by some employees.",
            "The survey proves that every employee needs flexible hours.",
            "Flexible hours are certainly preferred in all workplaces.",
            "Some employees proved that fixed hours never work.",
          ],
          correctAnswer: "The survey suggests that flexible hours may be preferred by some employees.",
          reviewFeedback:
            "Review this concept — 'suggests' and 'may' keep the cautious strength and limited scope of a small survey.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage:
        "You can now report source claims formally and paraphrase them without changing their meaning or certainty.",
    },
  ],

  "c1-advanced": [
    {
      id: "c1-grammar-1",
      level: "c1-advanced",
      skill: "grammar",
      title: "Advanced Grammar and Emphasis",
      introLabel: "Explanation",
      introText:
        "C1 writers often rearrange a sentence to control emphasis. Inversion after negative or limiting adverbials (Rarely had I…, Not only did…) puts the unexpected information first and sounds formal. Cleft sentences (What I find concerning is… / It was the delay that…) pick out one element as the focus. Fronting moves a phrase to the start for contrast. These patterns do not change the facts; they change what the reader notices first.",
      examples: [
        "Rarely had the committee seen such a detailed proposal.",
        "What the report fails to explain is the cost to smaller firms.",
        "Not only did the policy cut emissions, it also improved air quality.",
      ],
      questions: [
        {
          prompt: "Which sentence uses inversion after a negative adverbial?",
          options: [
            "I had rarely seen such confusion.",
            "Rarely I had seen such confusion.",
            "Rarely had I seen such confusion.",
            "I rarely had been seeing such confusion.",
          ],
          correctAnswer: "Rarely had I seen such confusion.",
          reviewFeedback: "Review this concept — after 'rarely/never/not only', invert auxiliary + subject: Rarely had I…",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which cleft sentence best emphasises the cause, not the people?",
          options: [
            "The researchers published the findings.",
            "It was the lack of funding that delayed the findings.",
            "The findings were delayed, unfortunately.",
            "What delayed? Funding maybe.",
          ],
          correctAnswer: "It was the lack of funding that delayed the findings.",
          reviewFeedback: "Review this concept — 'It was X that…' is a cleft that isolates X as the focused element.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the most natural C1 emphasis: the speaker wants to stress an additional unexpected result.",
          options: [
            "The scheme saved money. Also it created jobs.",
            "Not only did the scheme save money, it also created jobs.",
            "The scheme not only save money, it create jobs.",
            "Did not only the scheme save money.",
          ],
          correctAnswer: "Not only did the scheme save money, it also created jobs.",
          reviewFeedback: "Review this concept — 'Not only did…' inverts the first clause and sets up a second, often surprising, point.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now use inversion and cleft structures to control emphasis in formal English.",
    },
    {
      id: "c1-grammar-2",
      level: "c1-advanced",
      skill: "grammar",
      title: "Hedging and Nuance",
      introLabel: "Explanation",
      introText:
        "Advanced English often avoids absolute claims. Hedging (apparently, arguably, tends to, is likely to, appears to, to some extent, may well) lets you show how strong the evidence is. This is not weakness; it is accuracy. 'The data prove that X' is only appropriate when the proof is genuine. 'The data appear to suggest that X' is fairer when the picture is incomplete. Match the language to the certainty, and the reader will trust you more, not less.",
      examples: [
        "The policy appears to have reduced waiting times, though other factors may be involved.",
        "Younger voters tend to support the change, but the pattern is not uniform.",
        "The delay may well have been avoidable.",
      ],
      questions: [
        {
          prompt: "A study shows a possible link, not proof. Which sentence is most appropriately hedged?",
          options: [
            "The study proves that screens destroy sleep.",
            "The study appears to suggest a link between late-night screen use and poorer sleep.",
            "Screens never affect sleep.",
            "Everyone knows screens are the only cause.",
          ],
          correctAnswer: "The study appears to suggest a link between late-night screen use and poorer sleep.",
          reviewFeedback: "Review this concept — 'appears to suggest' matches limited evidence; 'proves' overstates it.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which hedge best means 'this is a reasonable view, but not the only one'?",
          options: ["definitely", "arguably", "absolutely", "undoubtedly"],
          correctAnswer: "arguably",
          reviewFeedback: "Review this concept — 'arguably' presents a defensible interpretation without shutting down alternatives.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the sentence that avoids an over-confident claim.",
          options: [
            "Remote work is always more productive.",
            "Remote work tends to raise productivity for some roles, to some extent.",
            "Remote work never works.",
            "Remote work will certainly replace offices.",
          ],
          correctAnswer: "Remote work tends to raise productivity for some roles, to some extent.",
          reviewFeedback: "Review this concept — 'tends to' and 'to some extent' limit the claim to what can reasonably be said.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now hedge claims so that certainty matches the evidence.",
    },
    {
      id: "c1-vocabulary-1",
      level: "c1-advanced",
      skill: "vocabulary",
      title: "Advanced Vocabulary and Collocation",
      introLabel: "Useful patterns",
      introText:
        "C1 lexical choice is about fit: collocation, connotation, and register. Address a problem is more formal than deal with a problem; a scheme may be ambitious (positive stretch) or unrealistic (criticism). Dependent prepositions (responsible for, consistent with, implications for) are part of the word, not decoration. Prefer a precise familiar word over a rare one used inaccurately.",
      introList: ["address a problem", "consistent with", "far-reaching implications", "a growing body of evidence", "in practical terms"],
      examples: [
        "The paper addresses a gap in previous research.",
        "The new figures are consistent with last year's trend.",
        "The decision could have far-reaching implications for part-time staff.",
      ],
      questions: [
        {
          prompt: "Choose the most appropriate formal collocation: 'The review ___ several weaknesses in the design.'",
          options: ["says", "addresses", "chats about", "mentions maybe"],
          correctAnswer: "addresses",
          reviewFeedback: "Review this concept — in academic/professional English we typically 'address' a problem, gap, or weakness.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which word carries a more critical connotation in 'an ___ plan to rebuild the station'?",
          options: ["ambitious", "unrealistic", "detailed", "practical"],
          correctAnswer: "unrealistic",
          reviewFeedback: "Review this concept — 'unrealistic' evaluates the plan as unlikely to succeed; 'ambitious' can still be admiring.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct dependent preposition: 'The findings are consistent ___ earlier studies.'",
          options: ["to", "with", "for", "on"],
          correctAnswer: "with",
          reviewFeedback: "Review this concept — the fixed pattern is 'consistent with'.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now choose C1 vocabulary for collocation, connotation, and register, not just rarity.",
    },
    {
      id: "c1-reading-1",
      level: "c1-advanced",
      skill: "reading",
      title: "Complex Reading and Inference",
      introLabel: "Reading Text",
      passage:
        "The museum's decision to introduce a modest evening ticket has been described, rather hastily, as 'pricing out ordinary visitors'. Attendance data tell a quieter story. Daytime entry remains free, and evening numbers have risen among people who work standard hours — a group previously underserved. What the critics are really objecting to, the director suggests, is not the fee itself but the implication that cultural institutions must never experiment with access. She does not claim the policy is beyond criticism; she asks only that the debate distinguish between a surcharge on a new time slot and a barrier to the core collection. Whether that distinction will persuade local residents is another matter.",
      questions: [
        {
          prompt: "What does the writer imply about the phrase 'pricing out ordinary visitors'?",
          options: [
            "It is a fair and complete description of the policy.",
            "It is overstated, given that daytime entry is still free.",
            "It is the director's own slogan.",
            "It refers only to tourists.",
          ],
          correctAnswer: "It is overstated, given that daytime entry is still free.",
          reviewFeedback: "Review this concept — 'rather hastily' plus the free daytime fact imply the criticism is too sweeping.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "According to the director, what are critics really reacting to?",
          options: [
            "The colour of the tickets.",
            "The idea that institutions should never experiment with access.",
            "A complete closure of the museum.",
            "A requirement to book months ahead.",
          ],
          correctAnswer: "The idea that institutions should never experiment with access.",
          reviewFeedback: "Review this concept — the text says the objection is to the implication that institutions must never experiment.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "The final sentence ('Whether that distinction will persuade…') mainly functions to:",
          options: [
            "Declare the policy a proven success.",
            "Leave the public-response question open.",
            "Attack local residents.",
            "Announce that the fee will be removed.",
          ],
          correctAnswer: "Leave the public-response question open.",
          reviewFeedback: "Review this concept — 'whether… is another matter' withholds a conclusion about persuasion.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now infer stance, implied criticism, and rhetorical purpose in a C1 text.",
    },
    {
      id: "c1-writing-1",
      level: "c1-advanced",
      skill: "writing",
      title: "Register and Style",
      introLabel: "Writing Focus",
      introText:
        "Register is the fit between language and situation. A complaint to a landlord, a note to a friend, and a report for a manager need different density and formality. C1 control means choosing a verb (request / ask / grab), a closer (Yours sincerely / Thanks / Cheers), and a level of compression. Wordiness is not automatically more advanced: cutting empty phrases often raises the register. This lesson uses short, scoreable rewrites — not essay marking.",
      examples: [
        "Informal: Can you send the files when you get a chance?",
        "Neutral professional: Please send the files by Friday.",
        "More formal: I would be grateful if you could forward the files by Friday.",
      ],
      questions: [
        {
          prompt: "Which opening is most appropriate for a formal email to an organisation you do not know?",
          options: ["Hey guys,", "Dear Sir or Madam,", "Yo,", "Hi mate,"],
          correctAnswer: "Dear Sir or Madam,",
          reviewFeedback: "Review this concept — when the recipient is unknown, a conventional formal greeting is still expected.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which rewrite is more concise without becoming rude?",
          options: [
            "I am writing in order to just basically see if you maybe could possibly help.",
            "Could you help with the attached query?",
            "HELP NOW.",
            "I was wondering, like, if you had a sec.",
          ],
          correctAnswer: "Could you help with the attached query?",
          reviewFeedback: "Review this concept — C1 style is often shorter and clearer, not padded with fillers.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "A manager's report should avoid slang. Which sentence fits?",
          options: [
            "The launch was a total disaster, if we're being honest.",
            "The launch did not meet the agreed targets.",
            "The launch was well extra.",
            "The launch kinda flopped, ngl.",
          ],
          correctAnswer: "The launch did not meet the agreed targets.",
          reviewFeedback: "Review this concept — professional register states the result plainly, without slang or dramatic overstatement.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now adjust greeting, concision, and tone to match a professional or informal context.",
    },
    {
      id: "c1-reading-2",
      level: "c1-advanced",
      skill: "reading",
      title: "Argument and Critical Interpretation",
      introLabel: "Reading Text",
      passage:
        "A frequently shared graph shows that countries with more ice cream sales also report more drowning incidents in summer. The correlation is real; the explanation is not that ice cream causes drowning. Both rise when the weather is hot. The example is trivial, but the habit is not: public debate often treats two things that move together as if one produced the other. A more responsible reading asks what has been left out — season, age group, access to water — and how strong the claimed mechanism is. Correlation can still be a useful clue. It is a poor substitute for a tested cause.",
      questions: [
        {
          prompt: "What assumption does the ice-cream example warn us against?",
          options: [
            "That summer weather exists.",
            "That a correlation is automatically a cause.",
            "That drowning never happens in winter.",
            "That graphs should never be used.",
          ],
          correctAnswer: "That a correlation is automatically a cause.",
          reviewFeedback: "Review this concept — the passage's point is the leap from 'they move together' to 'one caused the other'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which limitation does the writer want readers to look for in similar claims?",
          options: [
            "Whether the font on the graph is attractive.",
            "What variables have been left out of the explanation.",
            "Whether ice cream is expensive.",
            "Whether the author likes swimming.",
          ],
          correctAnswer: "What variables have been left out of the explanation.",
          reviewFeedback: "Review this concept — she lists omitted factors (season, age, access to water) as the responsible next question.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which statement best matches the writer's nuanced view of correlation?",
          options: [
            "Correlation is worthless and should be ignored.",
            "Correlation proves causation if the numbers are large.",
            "Correlation can be a clue, but it is not the same as a tested cause.",
            "Only laboratory experiments count as evidence of any kind.",
          ],
          correctAnswer: "Correlation can be a clue, but it is not the same as a tested cause.",
          reviewFeedback: "Review this concept — the last two sentences accept correlation as a clue while refusing to treat it as proof.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now distinguish correlation from cause and notice what an argument leaves out.",
    },
  ],
};

export function getCurriculumLessonsForLevel(levelSlug: string): CurriculumLesson[] {
  return CURRICULUM_LESSONS[levelSlug] ?? [];
}

export function getCurriculumLesson(levelSlug: string, lessonId: string): CurriculumLesson | null {
  return getCurriculumLessonsForLevel(levelSlug).find((l) => l.id === lessonId) ?? null;
}
