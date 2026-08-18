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
    prompt: "She ___ (be) my sister. Write one word.",
    correct_answer: "is",
  },
  {
    id: "a1pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Nora and I have the same mother and father. Nora is my ___.",
    options: ["sister", "grandmother", "niece", "mother"],
    correct_answer: "sister",
  },
  {
    id: "a1pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Arda is my mother's son, but Arda is not me. Arda is my ___.",
    options: ["brother", "father", "grandmother", "niece"],
    correct_answer: "brother",
  },
  {
    id: "a1pc_vocab_3",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "Elif is my father's mother. Elif is my ___.",
    options: ["grandmother", "sister", "niece", "mother"],
    correct_answer: "grandmother",
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
  {
    id: "a1pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "A form asks for your full name. Which entry is written correctly?",
    options: ["Full name: Deniz Kaya", "full name: deniz kaya", "FULL NAME deniz Kaya", "Full name; Deniz, kaya"],
    correct_answer: "Full name: Deniz Kaya",
  },
  {
    id: "a1pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "A1",
    prompt: "A form asks for your age. Which entry is clear and correctly formatted?",
    options: ["Age: 24", "age twenty-four", "AGE; 24 years,", "Age is = twenty four."],
    correct_answer: "Age: 24",
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
    prompt:
      "The research team started collecting samples three months ago and has not finished. Which sentence emphasises the ongoing work?",
    options: [
      "They have been collecting samples for three months.",
      "They have collected samples since three months.",
      "They collected samples for three months and still do.",
      "They are collecting samples since three months.",
    ],
    correct_answer: "They have been collecting samples for three months.",
  },
  {
    id: "b1pluspc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "You want to ask about the duration of Maya's medical studies, which are still continuing. Which question is correct?",
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
    prompt:
      "Tests found harmful chemicals downstream from the factory. Investigators concluded that it was the main source of river ___.",
    options: ["pollution", "recycling", "renewal", "technology"],
    correct_answer: "pollution",
  },
  {
    id: "b1pluspc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "Jin's phone still works, but it cannot run the software required for his course. He has decided to ___ it.",
    options: ["upgrade", "recycle", "pollute", "renew"],
    correct_answer: "upgrade",
  },
  {
    id: "b1pluspc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "\"A café introduced a refundable deposit on reusable cups. After four months, the return rate had risen from 45% to 78%, although staff reported longer queues when customers returned several cups at once. The café has extended the trial and added a separate returns point.\" — What does extending the trial suggest?",
    options: [
      "The improved return rate was promising enough to continue despite an operational problem.",
      "The deposit failed because no cups were returned.",
      "The café considers queue length more important than reducing waste.",
      "The café has decided to stop accepting reusable cups.",
    ],
    correct_answer:
      "The improved return rate was promising enough to continue despite an operational problem.",
  },
  {
    id: "b1pluspc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt: "In the same text, why did the café add a separate returns point?",
    options: [
      "To reduce delays caused when several cups are returned together",
      "To lower the percentage of cups returned",
      "To remove the refundable deposit",
      "To replace the reusable cups with disposable ones",
    ],
    correct_answer: "To reduce delays caused when several cups are returned together",
  },
  {
    id: "b1pluspc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "Complete the paragraph: 'Living outside the city is often quieter and cheaper. ___, the daily journey to work may be longer.'",
    options: ["On the other hand,", "Similarly,", "For example,", "As a result,"],
    correct_answer: "On the other hand,",
  },
  {
    id: "b1pluspc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B1",
    prompt:
      "An essay has discussed both the flexibility of online study and the risk of isolation. Which conclusion weighs both sides?",
    options: [
      "Overall, online study offers valuable flexibility, but courses should also create regular opportunities for interaction.",
      "Online study is flexible, so concerns about isolation do not matter.",
      "Isolation can be difficult, which proves online study should end.",
      "For example, some learners study online and others do not.",
    ],
    correct_answer:
      "Overall, online study offers valuable flexibility, but courses should also create regular opportunities for interaction.",
  },
];

const B2_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "b2pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt:
      "Two past events: first the announcement was made, then journalists arrived. Which sentence makes the order clear?",
    options: [
      "When the journalists arrived, the announcement has been made.",
      "When the journalists arrived, the announcement had already been made.",
      "When the journalists arrived, the announcement was making.",
      "When the journalists arrived, the announcement will be made.",
    ],
    correct_answer: "When the journalists arrived, the announcement had already been made.",
  },
  {
    id: "b2pc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Maya was on a train to Edinburgh all afternoon. Someone says they saw her at a London meeting. Which response is most accurate?",
    options: [
      "She must have been at the meeting.",
      "She can't have been at the meeting.",
      "She might be in London now, so the meeting is certain.",
      "She must be at the meeting yesterday.",
    ],
    correct_answer: "She can't have been at the meeting.",
  },
  {
    id: "b2pc_grammar_3",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Which sentence links a past event to a different present?",
    options: [
      "If the factory closes, the high street will still have a cinema.",
      "If the factory had not closed, the high street would still have a cinema.",
      "If the factory would not close, the high street had a cinema.",
      "If the factory not closed, the high street still has a cinema.",
    ],
    correct_answer: "If the factory had not closed, the high street would still have a cinema.",
  },
  {
    id: "b2pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Choose the most natural collocation: 'She is ___ as one of the leading voices on housing policy.'",
    options: ["widely regarded", "widely raised", "widely recycled", "widely upgraded"],
    correct_answer: "widely regarded",
  },
  {
    id: "b2pc_vocab_2",
    skill: "vocabulary",
    task_type: "gap_fill",
    cefr_weight: "B2",
    prompt: "Flexible hours are becoming ___ common in larger firms. (Use the adverb form of 'increasing'.)",
    correct_answer: "increasingly",
  },
  {
    id: "b2pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt:
      "\"Tourist taxes are presented as an easy way to fund local services. In some coastal towns they have paid for extra bins and later buses — a concrete gain. Residents still argue that the tax does little about overcrowding at peak weekends. This editorial does not oppose a modest charge; it argues that a tax without limits on visitor numbers treats a symptom, not the pressure on housing and streets.\" — What is the writer's main argument?",
    options: [
      "Tourist taxes should be abolished immediately.",
      "A modest tax can help, but it does not solve overcrowding on its own.",
      "Residents are wrong to worry about weekends.",
      "Extra bins prove that overcrowding has ended.",
    ],
    correct_answer: "A modest tax can help, but it does not solve overcrowding on its own.",
  },
  {
    id: "b2pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "In the same text, which detail is offered as supporting evidence of a benefit?",
    options: [
      "The tax treats a symptom, not the pressure on housing.",
      "In some coastal towns the tax has paid for extra bins and later buses.",
      "Residents dislike all visitors.",
      "Overcrowding cannot be measured.",
    ],
    correct_answer: "In some coastal towns the tax has paid for extra bins and later buses.",
  },
  {
    id: "b2pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt: "Which sentence reports an ongoing rumour in a formal summary?",
    options: [
      "The board is said to be considering a merger.",
      "The board is said that they consider a merger.",
      "The board said to considering a merger.",
      "The board is saying to a merger.",
    ],
    correct_answer: "The board is said to be considering a merger.",
  },
  {
    id: "b2pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "B2",
    prompt:
      "Source: 'An early trial found a possible reduction in delivery delays at two sites.' Which formal paraphrase preserves the limited evidence?",
    options: [
      "The early trial suggests that delivery delays may have fallen at two sites.",
      "The trial proves that delivery delays have ended everywhere.",
      "Every site will certainly deliver on time because of the trial.",
      "Two sites proved that delays are no longer possible.",
    ],
    correct_answer: "The early trial suggests that delivery delays may have fallen at two sites.",
  },
];

const C1_PROGRESS_CHECK_QUESTIONS: PlacementQuestion[] = [
  {
    id: "c1pc_grammar_1",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Which cleft sentence best emphasises the cause of the delay?",
    options: [
      "The contractors published a new timetable.",
      "It was a shortage of parts that delayed the opening.",
      "The opening was delayed, sadly.",
      "What delayed? Parts, I guess.",
    ],
    correct_answer: "It was a shortage of parts that delayed the opening.",
  },
  {
    id: "c1pc_grammar_2",
    skill: "grammar",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "The spokesperson has not confirmed the leak. Which sentence is most appropriately cautious?",
    options: [
      "The document is stolen — there is no other explanation.",
      "The document has apparently been leaked.",
      "The minister definitely stole the document.",
      "The document can't exist.",
    ],
    correct_answer: "The document has apparently been leaked.",
  },
  {
    id: "c1pc_vocab_1",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Choose the most natural academic phrase: 'There is now a ___ that later start times help some students.'",
    options: ["growing body of evidence", "growing body of chat", "big pile of talk", "wide bunch of sayings"],
    correct_answer: "growing body of evidence",
  },
  {
    id: "c1pc_vocab_2",
    skill: "vocabulary",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Choose the correct dependent preposition: 'The director is responsible ___ the final budget.'",
    options: ["to", "for", "with", "on"],
    correct_answer: "for",
  },
  {
    id: "c1pc_reading_1",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt:
      "\"The gallery's decision to charge for evening entry has been described, rather hastily, as 'closing art to ordinary people'. Daytime visits remain free, and evening attendance has risen among people who work standard hours — a group previously underserved. The curator suggests that critics object not only to the fee, but to the idea that cultural venues should experiment with how access is provided.\" — What does the writer imply about the phrase 'closing art to ordinary people'?",
    options: [
      "It is overstated because daytime access remains free and evening access serves a new group.",
      "It is a neutral summary accepted by the curator.",
      "It proves that ordinary people never visit during the day.",
      "It refers only to tourists who buy evening tickets.",
    ],
    correct_answer:
      "It is overstated because daytime access remains free and evening access serves a new group.",
  },
  {
    id: "c1pc_reading_2",
    skill: "reading",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt:
      "\"A chart circulating online shows that cities with more street cafés also record more late-night noise complaints. The link is real; the leap to 'cafés cause the noise' is not. Warm evenings, outdoor events, and simply more people in the centre can raise both figures. The columnist is not asking readers to ignore the chart. She is asking them to notice what it leaves out before they treat it as a mechanism.\" — What is the rhetorical function of the final two sentences?",
    options: [
      "To qualify the chart's value: it may be informative, but it cannot establish the missing mechanism",
      "To dismiss every chart as too incomplete to use",
      "To confirm that the cafés directly caused every complaint",
      "To replace the chart with an unrelated personal anecdote",
    ],
    correct_answer:
      "To qualify the chart's value: it may be informative, but it cannot establish the missing mechanism",
  },
  {
    id: "c1pc_writing_1",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Which sentence is appropriately formal for a first message to a supplier?",
    options: [
      "Can you sort the delivery like yesterday?",
      "I would be grateful if you could confirm the delivery date.",
      "Sort it ASAP, mate.",
      "Delivery. Now.",
    ],
    correct_answer: "I would be grateful if you could confirm the delivery date.",
  },
  {
    id: "c1pc_writing_2",
    skill: "writing",
    task_type: "multiple_choice",
    cefr_weight: "C1",
    prompt: "Which sentence shows a probable outcome without treating it as certain?",
    options: [
      "The reform will certainly end waiting lists for good.",
      "The reform is likely to reduce waiting times, though other factors may play a part.",
      "The reform can't affect waiting times in any way.",
      "Waiting lists will vanish, with no possible exception.",
    ],
    correct_answer: "The reform is likely to reduce waiting times, though other factors may play a part.",
  },
];

const PROGRESS_CHECKS: Record<string, ProgressCheckContent> = {
  "a1-elementary": {
    level: "a1-elementary",
    title: "A1 Elementary — Progress Check",
    questions: A1_PROGRESS_CHECK_QUESTIONS,
  },
  "a2-pre-intermediate": {
    level: "a2-pre-intermediate",
    title: "A2 Pre-Intermediate — Progress Check",
    questions: A2_PROGRESS_CHECK_QUESTIONS,
  },
  "b1-intermediate": {
    level: "b1-intermediate",
    title: "B1 Intermediate — Progress Check",
    questions: B1_PROGRESS_CHECK_QUESTIONS,
  },
  "b1-plus-upper-intermediate": {
    level: "b1-plus-upper-intermediate",
    title: "Bridge to B2 — Bridge Check",
    questions: B1PLUS_PROGRESS_CHECK_QUESTIONS,
  },
  "b2-pre-advanced": {
    level: "b2-pre-advanced",
    title: "B2 Upper-Intermediate — Progress Check",
    questions: B2_PROGRESS_CHECK_QUESTIONS,
  },
  "c1-advanced": {
    level: "c1-advanced",
    title: "C1 Advanced — Progress Check",
    questions: C1_PROGRESS_CHECK_QUESTIONS,
  },
};

export function getProgressCheck(levelSlug: string): ProgressCheckContent | null {
  return PROGRESS_CHECKS[levelSlug] ?? null;
}
