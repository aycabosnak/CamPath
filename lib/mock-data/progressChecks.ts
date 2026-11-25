/**
 * lib/mock-data/progressChecks.ts
 *
 * The "Progress Check" concept (approved rename from "Level Check") —
 * an honest, non-blocking exit diagnostic per level, distinct from
 * Mixed Tests (rehearsal, retakeable) and from Mock Exams (full,
 * timed simulation, still Coming Soon everywhere).
 *
 * Reuses the exact PlacementQuestion shape and scoring logic
 * (services/placementTestService.isAnswerCorrect) — no new question
 * schema, no new scoring function.
 */
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";

export interface ProgressCheckContent {
  level: string;
  title: string;
  questions: PlacementQuestion[];
}

const A1_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "a1pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the correct sentence.",
    options: ["I is a doctor.", "I am a doctor.", "I are a doctor.", "I be a doctor."],
    correct_answer: "I am a doctor.",
  },
  {
    id: "a1pc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the correct sentence.",
    options: ["They is happy.", "They am happy.", "They are happy.", "They be happy."],
    correct_answer: "They are happy.",
  },
  {
    id: "a1pc_grammar_3",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "A1",
    prompt: "She ___ (walk) to school every day.",
    correct_answer: "walks",
  },
  {
    id: "a1pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the correct word: 'My sister's son is my ___.'",
    options: ["nephew", "cousin", "uncle", "brother"],
    correct_answer: "nephew",
  },
  {
    id: "a1pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Which word means a place where you buy food?",
    options: ["library", "supermarket", "hospital", "airport"],
    correct_answer: "supermarket",
  },
  {
    id: "a1pc_vocab_3",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Choose the odd one out.",
    options: ["apple", "banana", "carrot", "orange"],
    correct_answer: "carrot",
  },
  {
    id: "a1pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "\"Please switch off your phone during the film.\" — What should you do?",
    options: ["Turn your phone off", "Turn your phone on", "Call someone", "Take a photo"],
    correct_answer: "Turn your phone off",
  },
  {
    id: "a1pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "\"Bus 12 leaves every 15 minutes from Gate 3.\" — Where does Bus 12 leave from?",
    options: ["Gate 3", "Gate 12", "Gate 15", "Gate 1"],
    correct_answer: "Gate 3",
  },
];

const A2_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "a2pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the correct sentence.",
    options: ["I didn't went home.", "I didn't go home.", "I not went home.", "I don't went home."],
    correct_answer: "I didn't go home.",
  },
  {
    id: "a2pc_grammar_2",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "A2",
    prompt: "They ___ (have) a great holiday last summer.",
    correct_answer: "had",
  },
  {
    id: "a2pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the correct word: 'After I wake up, I ___ before breakfast.'",
    options: ["get dressed", "commute", "go to bed", "have dinner"],
    correct_answer: "get dressed",
  },
  {
    id: "a2pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Choose the correct word: 'I usually ___ at around 11pm.'",
    options: ["go to bed", "wake up", "commute", "have breakfast"],
    correct_answer: "go to bed",
  },
  {
    id: "a2pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt:
      "\"Yesterday, Elena woke up, had a quick breakfast, and got dressed for work. On her way to the office, she realised she had forgotten her keys, so she went back home. By the time she arrived at work, she was very late.\" — What did Elena do after getting dressed?",
    options: ["She had breakfast", "She left for the office", "She woke up", "She arrived at work"],
    correct_answer: "She left for the office",
  },
  {
    id: "a2pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "In the same story, why was Elena late for work?",
    options: [
      "She missed the bus",
      "She forgot her keys and went back home",
      "She had a long breakfast",
      "She got dressed slowly",
    ],
    correct_answer: "She forgot her keys and went back home",
  },
  {
    id: "a2pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Which is an appropriate way to end a message to a friend?",
    options: ["Best regards,", "See you soon!", "Yours sincerely,", "Respectfully,"],
    correct_answer: "See you soon!",
  },
  {
    id: "a2pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A2",
    prompt: "Which sentence is written in an informal style?",
    options: [
      "I am writing to request information.",
      "What time works for you?",
      "Please find attached.",
      "I would appreciate your response.",
    ],
    correct_answer: "What time works for you?",
  },
];

const B1_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "b1pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct sentence.",
    options: [
      "If she finds a good job, she will move to the city.",
      "If she will find a good job, she will move to the city.",
      "If she found a good job, she will move to the city.",
      "If she finds a good job, she would move to the city.",
    ],
    correct_answer: "If she finds a good job, she will move to the city.",
  },
  {
    id: "b1pc_grammar_2",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "B1",
    prompt: "If they ___ (arrive) early, they will get good seats.",
    correct_answer: "arrive",
  },
  {
    id: "b1pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct phrase: 'He ___ to save enough money to travel next summer.'",
    options: ["aims", "look forward", "planning", "intended"],
    correct_answer: "aims",
  },
  {
    id: "b1pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct phrase: 'They ___ to open a new office next year.'",
    options: ["intend", "look forward to", "aiming", "intends"],
    correct_answer: "intend",
  },
  {
    id: "b1pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "\"Although the new policy was introduced to reduce costs, several departments reported that spending had actually increased in the first quarter.\" — What is suggested about the policy's effect?",
    options: [
      "It worked exactly as planned.",
      "It may have had the opposite effect to what was intended.",
      "It had no effect on spending.",
      "It was cancelled immediately.",
    ],
    correct_answer: "It may have had the opposite effect to what was intended.",
  },
  {
    id: "b1pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "\"The workshop has been rescheduled to Friday. Please note that registration closes 24 hours before the new date.\" — When does registration close?",
    options: ["Friday", "Thursday", "Saturday", "It is already closed"],
    correct_answer: "Thursday",
  },
  {
    id: "b1pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which phrase is most appropriate for opening a formal opinion piece?",
    options: ["I personally think that", "If you ask me", "Everyone agrees that", "It's obvious that"],
    correct_answer: "I personally think that",
  },
  {
    id: "b1pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which sentence keeps a consistent formal register throughout?",
    options: [
      "In my opinion, the plan needs more funding, but whatever, it's not my call.",
      "In my opinion, the plan needs more funding to succeed.",
      "I reckon the plan needs more funding, in my opinion.",
      "The plan needs more funding, if you know what I mean.",
    ],
    correct_answer: "In my opinion, the plan needs more funding to succeed.",
  },
];

const B1PLUS_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "b1pluspc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct sentence.",
    options: [
      "They have been travelling since three months.",
      "They have been travelling for three months.",
      "They have travelling been for three months.",
      "They has been travelling for three months.",
    ],
    correct_answer: "They have been travelling for three months.",
  },
  {
    id: "b1pluspc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct question.",
    options: [
      "How long has she been studying medicine?",
      "How long she has been studying medicine?",
      "How long has she being studying medicine?",
      "How long have she been studying medicine?",
    ],
    correct_answer: "How long has she been studying medicine?",
  },
  {
    id: "b1pluspc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct word: 'The factory was fined for causing serious ___ to the river.'",
    options: ["pollution", "recycling", "upgrade", "device"],
    correct_answer: "pollution",
  },
  {
    id: "b1pluspc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Choose the correct word: 'Smartphones are just one example of a modern ___.'",
    options: ["device", "pollution", "renewable", "recycling"],
    correct_answer: "device",
  },
  {
    id: "b1pluspc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "\"Some universities now allow students to take exams online from home. Supporters highlight the flexibility and reduced stress, while critics raise concerns about how fairly the process can be monitored.\" — What do supporters of online exams highlight?",
    options: ["Increased costs", "Flexibility and reduced stress", "Stricter monitoring", "Longer exam times"],
    correct_answer: "Flexibility and reduced stress",
  },
  {
    id: "b1pluspc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "In the same text, what concern do critics raise?",
    options: [
      "Exams are too easy",
      "How fairly the process can be monitored",
      "Students prefer paper exams",
      "Universities lose money",
    ],
    correct_answer: "How fairly the process can be monitored",
  },
  {
    id: "b1pluspc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which phrase introduces a contrasting viewpoint?",
    options: ["On the other hand,", "Firstly,", "For example,", "Similarly,"],
    correct_answer: "On the other hand,",
  },
  {
    id: "b1pluspc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "Which sentence is a suitable essay conclusion?",
    options: [
      "Overall, I believe the drawbacks are outweighed by the benefits.",
      "On the one hand, this matters.",
      "For example, this happens often.",
      "On the other hand, people disagree.",
    ],
    correct_answer: "Overall, I believe the drawbacks are outweighed by the benefits.",
  },
];

/**
 * B2 Progress Check — distinct from the Mixed Test; slightly harder
 * framing of the same taught content (present perfect / future
 * passive, vocabulary from context, an IMPLIED attitude that needs
 * one inference step, and despite/moreover in context). Reading
 * passage is a new scenario (a banking app) and wording.
 */
const B2_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "b2pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Choose the correct passive sentence.",
    options: [
      "The road has been closed because of the flood.",
      "The road has closed because of the flood by someone.",
      "The road have been closed because of the flood.",
      "The road has been close because of the flood.",
    ],
    correct_answer: "The road has been closed because of the flood.",
  },
  {
    id: "b2pc_grammar_2",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "B2",
    prompt: "The new hospital ___ (open) by the mayor next spring. (Use the future passive.)",
    correct_answer: "will be opened",
  },
  {
    id: "b2pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Choose the correct word: 'After ten years at the company, she finally got a ___ to senior manager.'",
    options: ["promotion", "deadline", "colleague", "salary"],
    correct_answer: "promotion",
  },
  {
    id: "b2pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Choose the correct word: 'He decided to ___ from his job so that he could start his own business.'",
    options: ["resign", "colleague", "deadline", "salary"],
    correct_answer: "resign",
  },
  {
    id: "b2pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt:
      "\"Everyone describes the bank's new app as 'easy to use'. After forty minutes trying to reset my password, I would describe it rather differently.\" — What is the writer's attitude to the app?",
    options: [
      "Critical — they do not find it easy to use",
      "Enthusiastic — they agree it is easy to use",
      "Neutral — they have not used it",
      "Grateful — it saved them time",
    ],
    correct_answer: "Critical — they do not find it easy to use",
  },
  {
    id: "b2pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "In the same text, how does the writer show their opinion?",
    options: [
      "By contrasting what others say with their own experience",
      "By listing the app's best features",
      "By recommending a different bank",
      "By saying they have never used the app",
    ],
    correct_answer: "By contrasting what others say with their own experience",
  },
  {
    id: "b2pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Complete the sentence: '___ the heavy rain, the match went ahead as planned.'",
    options: ["Despite", "Although", "However,", "Moreover,"],
    correct_answer: "Despite",
  },
  {
    id: "b2pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Complete the text: 'The flat is close to the station. ___, it has a large garden.'",
    options: ["Moreover,", "However,", "Although", "Despite"],
    correct_answer: "Moreover,",
  },
];

/**
 * C1 Progress Check — harder framing of C1 content: inversion as a
 * gap fill, idioms that must be chosen from a situation, and a
 * concession that is NOT flagged by a taught marker word (the learner
 * must recognise "This is undoubtedly true" as the writer accepting a
 * point). Reading topic (school phone bans) is new.
 */
const C1_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "c1pc_grammar_1",
    skill: "grammar",
    task_type: "gap_fill",
    cefr_weight: "C1",
    prompt: "Never ___ I heard such a convincing speech. (Write one word.)",
    correct_answer: "have",
  },
  {
    id: "c1pc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Choose the correct sentence.",
    options: [
      "Not only did the company lose money, but it also lost its best staff.",
      "Not only the company lost money, but it also lost its best staff.",
      "Not only did the company lost money, but it also lost its best staff.",
      "Not only lost the company money, but it also lost its best staff.",
    ],
    correct_answer: "Not only did the company lose money, but it also lost its best staff.",
  },
  {
    id: "c1pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Choose the correct expression: 'Losing that job turned out to be ___ — it pushed me to start my own company.'",
    options: ["a blessing in disguise", "the tip of the iceberg", "on the fence", "cutting corners"],
    correct_answer: "a blessing in disguise",
  },
  {
    id: "c1pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Choose the correct expression: 'Half the committee supports the plan and half opposes it; the chair is still ___.'",
    options: ["on the fence", "a blessing in disguise", "cutting corners", "getting the ball rolling"],
    correct_answer: "on the fence",
  },
  {
    id: "c1pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt:
      "\"Critics of school phone bans often point out that teenagers will simply use their phones after school instead. This is undoubtedly true. It does not follow, however, that the ban is pointless: the aim was never to remove phones from teenagers' lives, only from the hours in which they are meant to be learning.\" — What is the writer's position?",
    options: [
      "They support school phone bans.",
      "They think phone bans are pointless.",
      "They want phones banned outside school too.",
      "They have no clear opinion.",
    ],
    correct_answer: "They support school phone bans.",
  },
  {
    id: "c1pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "In the same text, which point does the writer accept from the critics?",
    options: [
      "Teenagers will use their phones after school.",
      "The ban is pointless.",
      "Phones should be removed from teenagers' lives.",
      "Teenagers learn better with phones.",
    ],
    correct_answer: "Teenagers will use their phones after school.",
  },
  {
    id: "c1pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Which sentence would be LEAST appropriate in an academic essay?",
    options: [
      "Loads of people reckon cities are way too crowded.",
      "It could be argued that cities are becoming overcrowded.",
      "This suggests that urban populations are rising.",
      "Cities appear to be growing faster than their infrastructure.",
    ],
    correct_answer: "Loads of people reckon cities are way too crowded.",
  },
  {
    id: "c1pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "A survey found that 70% of students study better in the morning. Which conclusion is best for an academic report?",
    options: [
      "This suggests that many students tend to study more effectively in the morning.",
      "This proves that all students must study in the morning.",
      "So basically everyone should study in the morning.",
      "I think morning is obviously the best time to study.",
    ],
    correct_answer: "This suggests that many students tend to study more effectively in the morning.",
  },
];

/** Listening items — new scripts, same sub-skill as each level's Listening lesson. */
const A1_PC_LISTENING: PlacementQuestion[] = [
  {
    id: "a1pc_listening_1",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "A1",
    prompt: "Listen. How old is Mehmet?",
    options: ["Nine", "Nineteen", "Ninety", "Twenty-nine"],
    correct_answer: "Nineteen",
    audio_script: [
      { text: "My name is Mehmet. I'm nineteen. I'm from Turkey. I have two brothers, but I don't have any sisters." },
    ],
  },
  {
    id: "a1pc_listening_2",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "A1",
    prompt: "How many sisters does Mehmet have?",
    options: ["None", "One", "Two", "Three"],
    correct_answer: "None",
    audio_script: [
      { text: "My name is Mehmet. I'm nineteen. I'm from Turkey. I have two brothers, but I don't have any sisters." },
    ],
  },
];

const A2_PC_LISTENING: PlacementQuestion[] = [
  {
    id: "a2pc_listening_1",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "A2",
    prompt: "Listen carefully \u2014 the events are not told in order. What did the speaker do first this morning?",
    options: ["Fed the cat", "Made a sandwich", "Went to work", "Went to bed"],
    correct_answer: "Fed the cat",
    audio_script: [
      { text: "Before I went to work this morning, I made a sandwich. But first, I fed the cat \u2014 she always wakes me up! After work, I went straight to bed." },
    ],
  },
  {
    id: "a2pc_listening_2",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "A2",
    prompt: "What did the speaker do after work?",
    options: ["Went straight to bed", "Made a sandwich", "Fed the cat", "Met a friend"],
    correct_answer: "Went straight to bed",
    audio_script: [
      { text: "Before I went to work this morning, I made a sandwich. But first, I fed the cat \u2014 she always wakes me up! After work, I went straight to bed." },
    ],
  },
];

const B1_PC_LISTENING: PlacementQuestion[] = [
  {
    id: "b1pc_listening_1",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "B1",
    prompt: "Listen to the message. Why can't Nadia come to football practice?",
    options: ["She's starting a new job.", "She's ill.", "She's going on holiday.", "She doesn't like football."],
    correct_answer: "She's starting a new job.",
    audio_script: [
      { speaker: "Nadia", text: "Hi Sam, it's Nadia. I'm going to start my new job on Monday, so I can't come to football practice this week. I intend to come back the week after. If the coach asks, can you tell him?" },
    ],
  },
  {
    id: "b1pc_listening_2",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "B1",
    prompt: "What does Nadia intend to do?",
    options: ["Come back the week after", "Leave the team", "Talk to the coach herself", "Change her job"],
    correct_answer: "Come back the week after",
    audio_script: [
      { speaker: "Nadia", text: "Hi Sam, it's Nadia. I'm going to start my new job on Monday, so I can't come to football practice this week. I intend to come back the week after. If the coach asks, can you tell him?" },
    ],
  },
];

const B1PLUS_PC_LISTENING: PlacementQuestion[] = [
  {
    id: "b1pluspc_listening_1",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "B1",
    prompt: "Listen to the conversation. What is Ana's overall opinion of the gym?",
    options: ["Positive, even though it's expensive", "Negative, because it's expensive", "She hasn't tried it yet", "She thinks it's cheap"],
    correct_answer: "Positive, even though it's expensive",
    audio_script: [
      { speaker: "Ana", text: "The new gym in our building is expensive, but honestly, I've been going every day." },
      { speaker: "Kemal", text: "Every day? I went once and half the machines were broken. Never again." },
    ],
  },
  {
    id: "b1pluspc_listening_2",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "B1",
    prompt: "What does Kemal mean by 'Never again'?",
    options: ["He won't go back to the gym.", "He'll go again tomorrow.", "He wants to fix the machines.", "He agrees with Ana."],
    correct_answer: "He won't go back to the gym.",
    audio_script: [
      { speaker: "Ana", text: "The new gym in our building is expensive, but honestly, I've been going every day." },
      { speaker: "Kemal", text: "Every day? I went once and half the machines were broken. Never again." },
    ],
  },
];

const B2_PC_LISTENING: PlacementQuestion[] = [
  {
    id: "b2pc_listening_1",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "B2",
    prompt: "Listen to the message. Why is Jess calling?",
    options: ["To say she'll be late for dinner", "To invite someone to a meeting", "To cancel dinner completely", "To ask for help with work"],
    correct_answer: "To say she'll be late for dinner",
    audio_script: [
      { speaker: "Jess", text: "Hi, it's Jess. So, that 'quick' meeting I mentioned? It's now in its third hour. Anyway, I'll be late for dinner \u2014 start without me." },
    ],
  },
  {
    id: "b2pc_listening_2",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "B2",
    prompt: "How does Jess feel about the meeting?",
    options: ["Frustrated \u2014 it's much longer than promised", "Pleased \u2014 it's going well", "Nervous \u2014 she has to present", "Relaxed \u2014 it's very short"],
    correct_answer: "Frustrated \u2014 it's much longer than promised",
    audio_script: [
      { speaker: "Jess", text: "Hi, it's Jess. So, that 'quick' meeting I mentioned? It's now in its third hour. Anyway, I'll be late for dinner \u2014 start without me." },
    ],
  },
];

const C1_PC_LISTENING: PlacementQuestion[] = [
  {
    id: "c1pc_listening_1",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "C1",
    prompt: "Listen to the talk. What is the speaker's position?",
    options: ["Library funding should not be cut.", "Libraries are outdated.", "Libraries should only lend books.", "Everyone can afford the internet."],
    correct_answer: "Library funding should not be cut.",
    audio_script: [
      { speaker: "Speaker", text: "Critics say libraries are outdated now that everything is online. They have a point \u2014 far fewer people borrow books than twenty years ago. But that misses what libraries now offer: free internet, a quiet place to work, and help for people who can't afford either. Cutting their funding would hit those people hardest." },
    ],
  },
  {
    id: "c1pc_listening_2",
    skill: "listening",
    task_type: "audio_multiple_choice",
    cefr_weight: "C1",
    prompt: "Which point does the speaker accept from the critics?",
    options: ["Far fewer people borrow books than before.", "Libraries offer free internet.", "Cutting funding helps people.", "Libraries are quiet places."],
    correct_answer: "Far fewer people borrow books than before.",
    audio_script: [
      { speaker: "Speaker", text: "Critics say libraries are outdated now that everything is online. They have a point \u2014 far fewer people borrow books than twenty years ago. But that misses what libraries now offer: free internet, a quiet place to work, and help for people who can't afford either. Cutting their funding would hit those people hardest." },
    ],
  },
];

const PROGRESS_CHECKS: Record<string, ProgressCheckContent> = {
  "a1-elementary": {
    level: "a1-elementary",
    title: "A1 Elementary — Progress Check",
    questions: [...A1_PROGRESS_CHECK_QUESTIONS, ...A1_PC_LISTENING],
  },
  "a2-pre-intermediate": {
    level: "a2-pre-intermediate",
    title: "A2 Pre-Intermediate — Progress Check",
    questions: [...A2_PROGRESS_CHECK_QUESTIONS, ...A2_PC_LISTENING],
  },
  "b1-intermediate": {
    level: "b1-intermediate",
    title: "B1 Intermediate — Progress Check",
    questions: [...B1_PROGRESS_CHECK_QUESTIONS, ...B1_PC_LISTENING],
  },
  "b1-plus-upper-intermediate": {
    level: "b1-plus-upper-intermediate",
    title: "Bridge to B2 — Bridge Check",
    questions: [...B1PLUS_PROGRESS_CHECK_QUESTIONS, ...B1PLUS_PC_LISTENING],
  },
  "b2-pre-advanced": {
    level: "b2-pre-advanced",
    title: "B2 Pre-Advanced — Progress Check",
    questions: [...B2_PROGRESS_CHECK_QUESTIONS, ...B2_PC_LISTENING],
  },
  "c1-advanced": {
    level: "c1-advanced",
    title: "C1 Advanced — Progress Check",
    questions: [...C1_PROGRESS_CHECK_QUESTIONS, ...C1_PC_LISTENING],
  },
};

export function getProgressCheck(levelSlug: string): ProgressCheckContent | null {
  return PROGRESS_CHECKS[levelSlug] ?? null;
}
