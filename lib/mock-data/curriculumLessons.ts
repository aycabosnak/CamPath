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
          prompt: "Choose the correct sentence.",
          options: [
            "If it will rain, we will stay home.",
            "If it rains, we will stay home.",
            "If it rain, we stay home.",
            "If it raining, we will stay home.",
          ],
          correctAnswer: "If it rains, we will stay home.",
          reviewFeedback: "Review this concept — the if-clause uses present simple, not 'will'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct sentence.",
          options: [
            "If she misses the bus, she will be late.",
            "If she will miss the bus, she will be late.",
            "If she missed the bus, she will be late.",
            "If she misses the bus, she would be late.",
          ],
          correctAnswer: "If she misses the bus, she will be late.",
          reviewFeedback: "Review this concept — keep present simple in the if-clause and 'will' only in the result clause.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct sentence.",
          options: [
            "We will go for a walk if it is sunny later.",
            "We go will for a walk if it is sunny later.",
            "We will go for a walk if it will be sunny later.",
            "We would go for a walk if it is sunny later.",
          ],
          correctAnswer: "We will go for a walk if it is sunny later.",
          reviewFeedback: "Review this concept — the result clause can come first, but the rule stays the same: present simple + will.",
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
          prompt: "Choose the word that best completes the sentence: \"I ___ study medicine next year.\"",
          options: ["intend to", "intending", "intends", "intended"],
          correctAnswer: "intend to",
          reviewFeedback: "Review this concept — 'intend to' is followed by the base verb after 'I'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct phrase: 'We ___ visiting my parents this weekend.'",
          options: ["look forward to", "intend", "aim", "plan"],
          correctAnswer: "look forward to",
          reviewFeedback: "Review this concept — 'look forward to' is followed by a gerund (-ing form).",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct phrase: 'She ___ to improve her English this year.'",
          options: ["aims", "aim", "aiming", "aimed"],
          correctAnswer: "aims",
          reviewFeedback: "Review this concept — with 'she', the verb needs an -s: 'aims to'.",
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
          prompt: "You're writing a formal opinion essay. Which phrase fits best?",
          options: ["In my opinion,", "I think,", "I guess,", "You know,"],
          correctAnswer: "In my opinion,",
          reviewFeedback: "Review this concept — 'I think', 'I guess', and 'You know' are all too conversational for formal writing; 'In my opinion' is the standard formal opener.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which phrase is most appropriate for a formal opinion piece?",
          options: ["From my point of view,", "If you ask me,", "Honestly,", "Whatever,"],
          correctAnswer: "From my point of view,",
          reviewFeedback: "Review this concept — 'If you ask me', 'Honestly', and 'Whatever' are casual spoken phrases, not formal writing openers.",
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
          prompt: "Choose the correct sentence.",
          options: [
            "I have been study English for three years.",
            "I have been studying English for three years.",
            "I has been studying English for three years.",
            "I am been studying English for three years.",
          ],
          correctAnswer: "I have been studying English for three years.",
          reviewFeedback: "Review this concept — the structure is have/has + been + verb-ing.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct sentence.",
          options: [
            "She's been working here since five years.",
            "She's been working here for five years.",
            "She's been work here for five years.",
            "She's working here since five years.",
          ],
          correctAnswer: "She's been working here for five years.",
          reviewFeedback: "Review this concept — use 'for' with a period of time (five years) and 'since' with a starting point (2019, Monday).",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct question.",
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
          prompt: "Choose the correct word: 'Wind and solar power are examples of ___ energy.'",
          options: ["renewable", "polluted", "recycled", "upgraded"],
          correctAnswer: "renewable",
          reviewFeedback: "Review this concept — 'renewable energy' comes from sources that don't run out, like wind and sun.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'Car exhaust is a major cause of air ___ in cities.'",
          options: ["pollution", "recycling", "upgrade", "device"],
          correctAnswer: "pollution",
          reviewFeedback: "Review this concept — 'pollution' describes harmful substances released into the air or environment.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Choose the correct word: 'I need to ___ my phone; the battery barely lasts a day.'",
          options: ["upgrade", "recycle", "pollute", "renew"],
          correctAnswer: "upgrade",
          reviewFeedback: "Review this concept — 'upgrade' means replacing something with a newer, better version.",
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
          prompt: "According to the text, what have supporters of the charge noticed?",
          options: [
            "Plastic waste has increased.",
            "Plastic waste has been significantly reduced.",
            "Shoppers are happy about the cost.",
            "Packaging waste has disappeared completely.",
          ],
          correctAnswer: "Plastic waste has been significantly reduced.",
          reviewFeedback: "Review this concept — the text states supporters say the policy 'has already reduced plastic waste significantly'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "What do the shoppers who complain seem to think about the policy?",
          options: [
            "It fully solves the packaging problem.",
            "It only shifts cost without solving the wider issue.",
            "It has no effect on cost at all.",
            "It should be more expensive.",
          ],
          correctAnswer: "It only shifts cost without solving the wider issue.",
          reviewFeedback: "Review this concept — the complaint is that it 'shifts the cost... without solving the bigger problem'.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "What can be concluded about opinions on this policy?",
          options: [
            "Everyone agrees it is a success.",
            "Opinions are divided between supporters and critics.",
            "No one has an opinion on it.",
            "The policy has been cancelled.",
          ],
          correctAnswer: "Opinions are divided between supporters and critics.",
          reviewFeedback: "Review this concept — the text presents two contrasting viewpoints, signalling a divided opinion, not consensus.",
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
          prompt: "Which phrase correctly introduces the first side of an argument?",
          options: ["On the one hand,", "In conclusion,", "Finally,", "As a result,"],
          correctAnswer: "On the one hand,",
          reviewFeedback: "Review this concept — 'On the one hand' opens the first viewpoint, before contrasting it later.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which phrase correctly introduces the opposing side?",
          options: ["On the other hand,", "Firstly,", "For example,", "In my opinion,"],
          correctAnswer: "On the other hand,",
          reviewFeedback: "Review this concept — 'On the other hand' signals a contrasting viewpoint to the one just given.",
          successFeedback: "Well done — that's correct.",
        },
        {
          prompt: "Which sentence is an appropriate essay conclusion?",
          options: [
            "In conclusion, I believe the benefits outweigh the drawbacks.",
            "On the one hand, this is a big issue.",
            "For example, many people use phones daily.",
            "On the other hand, some people disagree.",
          ],
          correctAnswer: "In conclusion, I believe the benefits outweigh the drawbacks.",
          reviewFeedback: "Review this concept — a conclusion should summarise your overall view after presenting both sides.",
          successFeedback: "Well done — that's correct.",
        },
      ],
      completionMessage: "You can now structure a basic for-and-against essay with a clear conclusion.",
    },
  ],
};

export function getCurriculumLessonsForLevel(levelSlug: string): CurriculumLesson[] {
  return CURRICULUM_LESSONS[levelSlug] ?? [];
}

export function getCurriculumLesson(levelSlug: string, lessonId: string): CurriculumLesson | null {
  return getCurriculumLessonsForLevel(levelSlug).find((l) => l.id === lessonId) ?? null;
}
