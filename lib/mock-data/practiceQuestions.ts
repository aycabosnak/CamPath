/**
 * Purpose-owned non-listening Practice bank.
 *
 * These items reinforce lesson objectives but are not lesson guided
 * questions, Mixed Test items, Progress Check items, or Placement items.
 * Listening remains in listeningPractice.ts under purpose: "practice".
 */
import type { Skill, CefrLevel } from "@/components/types";
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";

type PracticeSeed = [
  id: string,
  prompt: string,
  options: string[],
  correctAnswer: string,
  explanation: string,
];

export interface PracticeQuestionItem {
  question: PlacementQuestion;
  explanation: string;
}

const LEVEL_CEFR: Record<string, CefrLevel> = {
  "a1-elementary": "A1",
  "a2-pre-intermediate": "A2",
  "b1-intermediate": "B1",
  "b1-plus-upper-intermediate": "B1",
  "b2-pre-advanced": "B2",
  "c1-advanced": "C1",
};

const PRACTICE_SEEDS: Record<string, Partial<Record<Skill, PracticeSeed[]>>> = {
  "a1-elementary": {
    grammar: [
      ["a1pr_grammar_1", "Marta and I ___ classmates.", ["am", "is", "are", "be"], "are", "Use 'are' with a plural subject such as 'Marta and I'."],
      ["a1pr_grammar_2", "My bag ___ under the chair.", ["am", "is", "are", "be"], "is", "Use 'is' with one thing: 'My bag is...'."],
      ["a1pr_grammar_3", "I ___ from Izmir.", ["am", "is", "are", "be"], "am", "The verb 'to be' uses 'am' with 'I'."],
    ],
    vocabulary: [
      ["a1pr_vocab_1", "Lena is my mother's daughter. Lena is my ___.", ["aunt", "sister", "grandmother", "niece"], "sister", "Your mother's daughter is your sister if she is not you."],
      ["a1pr_vocab_2", "My father's brother is my ___.", ["uncle", "cousin", "nephew", "grandfather"], "uncle", "Your father's brother is your uncle."],
      ["a1pr_vocab_3", "My sister's daughter is my ___.", ["aunt", "niece", "mother", "cousin"], "niece", "A sister's daughter is your niece."],
    ],
    reading: [
      ["a1pr_reading_1", "\"CAFÉ — Breakfast 7:00–11:00. Closed on Sunday.\" When can you buy breakfast?", ["Sunday at 9:00", "Monday at 8:00", "Monday at 12:00", "Sunday at 10:00"], "Monday at 8:00", "The café serves breakfast before 11:00 and is open on Monday."],
      ["a1pr_reading_2", "\"Swimming pool: Adults £6. Children £3.\" How much does a child pay?", ["£3", "£6", "£9", "Nothing"], "£3", "The notice gives the children's price as £3."],
      ["a1pr_reading_3", "\"Please leave wet umbrellas by the door.\" Where should umbrellas go?", ["On a table", "By the door", "Under a chair", "Outside"], "By the door", "The instruction says to leave them by the door."],
    ],
    writing: [
      ["a1pr_writing_1", "Which entry is written correctly on a form?", ["City: ankara", "city Ankara", "City: Ankara", "City, Ankara."], "City: Ankara", "Use a capital letter for the label and place name, with a colon after the label."],
      ["a1pr_writing_2", "Which is the clearest way to enter a phone number?", ["Phone: 555 0182", "phone number is maybe 5550182", "PHONE, 555;0182", "555 0182 phone?"], "Phone: 555 0182", "A form entry uses a clear label followed by the information."],
      ["a1pr_writing_3", "Which name is capitalised correctly?", ["selin Kaya", "Selin kaya", "SELIN kaya", "Selin Kaya"], "Selin Kaya", "First names and family names begin with capital letters."],
    ],
  },
  "a2-pre-intermediate": {
    grammar: [
      ["a2pr_grammar_1", "We ___ the last bus home yesterday.", ["catch", "catched", "caught", "catches"], "caught", "'Caught' is the irregular past form of 'catch'."],
      ["a2pr_grammar_2", "Leo didn't ___ breakfast this morning.", ["had", "has", "have", "having"], "have", "After 'didn't', use the base form: 'have'."],
      ["a2pr_grammar_3", "I ___ my keys, so I walked back to the café.", ["forget", "forgot", "forgets", "was forget"], "forgot", "A completed past event takes the past simple form 'forgot'."],
    ],
    vocabulary: [
      ["a2pr_vocab_1", "Before work, Nina ___ and puts on her clothes.", ["gets dressed", "goes to bed", "has dinner", "commutes"], "gets dressed", "'Gets dressed' means puts on clothes."],
      ["a2pr_vocab_2", "Omar travels from his home to the office every day. He ___.", ["wakes up", "commutes", "has lunch", "goes shopping"], "commutes", "To commute is to travel regularly between home and work or study."],
      ["a2pr_vocab_3", "I usually ___ at about 11 p.m.", ["go to bed", "get dressed", "have breakfast", "start work"], "go to bed", "'Go to bed' is the routine action that normally happens at night."],
    ],
    reading: [
      ["a2pr_reading_1", "\"Tariq left home at eight. He bought a ticket and boarded the 8:20 train. At nine, he met his cousin at the station.\" What did Tariq do before boarding?", ["Met his cousin", "Bought a ticket", "Left the station", "Had lunch"], "Bought a ticket", "The text says he bought a ticket before he boarded the train."],
      ["a2pr_reading_2", "\"Eva wanted to cook pasta, but there was no cheese. She went to the shop, then made dinner at seven.\" Why did Eva go to the shop?", ["To meet a friend", "To buy an ingredient", "To eat dinner there", "To catch a bus"], "To buy an ingredient", "She needed something for the pasta because there was no cheese."],
      ["a2pr_reading_3", "\"The match started late because heavy rain stopped at 4:30. The teams finally came onto the field at five.\" What caused the delay?", ["The teams were lost", "The rain", "The field closed at five", "The match ended early"], "The rain", "The word 'because' connects the late start to the heavy rain."],
    ],
    writing: [
      ["a2pr_writing_1", "Which opening suits a message to a close friend?", ["Dear Customer Services,", "Hi Deniz,", "To whom it may concern,", "Dear Hiring Manager,"], "Hi Deniz,", "A first-name greeting with 'Hi' is natural in an informal message."],
      ["a2pr_writing_2", "Which closing is most natural in a friendly message?", ["Yours faithfully,", "Kindly acknowledge receipt.", "See you soon!", "I await your response."], "See you soon!", "'See you soon!' is warm and informal."],
      ["a2pr_writing_3", "Which sentence sounds suitable in a message to a friend?", ["I am writing to enquire about availability.", "Do you fancy meeting after class?", "Please find the document enclosed.", "Your prompt response is requested."], "Do you fancy meeting after class?", "This is a natural, informal invitation between friends."],
    ],
  },
  "b1-intermediate": {
    grammar: [
      ["b1pr_grammar_1", "If the traffic is heavy, we ___ the train instead.", ["take", "will take", "would take", "took"], "will take", "The first conditional uses present simple after 'if' and 'will' for the likely result."],
      ["b1pr_grammar_2", "Maya will call you if she ___ any news.", ["has", "will have", "had", "would have"], "has", "Do not use 'will' in the if-clause of a first conditional."],
      ["b1pr_grammar_3", "If I finish the report early, I ___ you with the presentation.", ["help", "helped", "will help", "would help"], "will help", "This is a real future possibility, so the result clause uses 'will help'."],
    ],
    vocabulary: [
      ["b1pr_vocab_1", "We're ___ visiting the new exhibition next weekend.", ["looking forward to", "aiming at", "planning that", "intending for"], "looking forward to", "'Look forward to' is followed by a noun or -ing form."],
      ["b1pr_vocab_2", "The team ___ to finish the project before Friday.", ["aims", "expects for", "looks forward", "is plan"], "aims", "'Aim to do something' expresses an intended goal."],
      ["b1pr_vocab_3", "I ___ apply for a summer course this year.", ["plan to", "look forward", "am aim to", "intend that"], "plan to", "'Plan to' is followed by the base form of the verb."],
    ],
    reading: [
      ["b1pr_reading_1", "\"The community centre will close for two weeks while the roof is repaired. Evening classes will move to Green School, although weekend workshops are cancelled.\" Where will evening classes take place?", ["At the centre", "At Green School", "Online", "At the library"], "At Green School", "The notice directly says evening classes will move to Green School."],
      ["b1pr_reading_2", "\"The community centre will close for two weeks while the roof is repaired. Evening classes will move to Green School, although weekend workshops are cancelled.\" What is the main purpose of the notice?", ["To advertise a new school", "To explain temporary changes", "To recruit teachers", "To describe a workshop"], "To explain temporary changes", "The notice explains how repairs affect classes and workshops."],
      ["b1pr_reading_3", "\"The community centre will close for two weeks while the roof is repaired. Evening classes will move to Green School, although weekend workshops are cancelled.\" Which activity will not continue?", ["Roof repairs", "Evening classes", "Weekend workshops", "School lessons"], "Weekend workshops", "'Although' contrasts the relocated classes with workshops that are cancelled."],
    ],
    writing: [
      ["b1pr_writing_1", "Which phrase clearly introduces a personal opinion?", ["In my view,", "As listed below,", "At the same time,", "For example,"], "In my view,", "'In my view' directly signals the writer's opinion."],
      ["b1pr_writing_2", "Choose the most suitable sentence for a formal opinion paragraph.", ["I reckon uniforms are kind of pointless.", "In my opinion, uniforms can create a stronger sense of belonging.", "Uniforms? No thanks.", "Everybody knows uniforms are best."], "In my opinion, uniforms can create a stronger sense of belonging.", "It states a measured opinion in an appropriately formal style."],
      ["b1pr_writing_3", "Which sentence gives a reason for an opinion?", ["I believe the library should open later because many students work during the day.", "The library is in the town centre.", "On the other hand,", "To sum up,"], "I believe the library should open later because many students work during the day.", "'Because' introduces the reason supporting the writer's view."],
    ],
  },
  "b1-plus-upper-intermediate": {
    grammar: [
      ["b1pluspr_grammar_1", "Rosa ___ for the same company since 2022.", ["works", "has been working", "was working", "is worked"], "has been working", "The present perfect continuous connects an ongoing activity with its starting point."],
      ["b1pluspr_grammar_2", "How long ___ you ___ for the exam?", ["have / been preparing", "do / prepare", "are / prepared", "did / been preparing"], "have / been preparing", "Use 'have been' plus the -ing form to ask about an activity continuing until now."],
      ["b1pluspr_grammar_3", "I've ___ all morning, so I need a break.", ["been studying", "studied yesterday", "study", "been study"], "been studying", "The duration 'all morning' and present result support the present perfect continuous."],
    ],
    vocabulary: [
      ["b1pluspr_vocab_1", "The city plans to invest in ___ energy from wind and sunlight.", ["renewable", "disposable", "temporary", "artificial"], "renewable", "Wind and sunlight are renewable energy sources."],
      ["b1pluspr_vocab_2", "Old batteries should be ___ safely rather than put in household rubbish.", ["recycled", "upgraded", "downloaded", "charged"], "recycled", "Recycling processes used materials so they can be used again."],
      ["b1pluspr_vocab_3", "The software update should ___ the device's security.", ["upgrade", "pollute", "recycle", "consume"], "upgrade", "To upgrade something is to improve it to a newer or better standard."],
    ],
    reading: [
      ["b1pluspr_reading_1", "\"A company replaced many short meetings with written updates. Staff completed more focused work, but new employees said it was harder to ask quick questions.\" What trade-off does the text describe?", ["Lower salaries but longer holidays", "More focus but less immediate support", "More meetings but fewer updates", "Better offices but slower computers"], "More focus but less immediate support", "The change improved focused work but made quick support harder to access."],
      ["b1pluspr_reading_2", "\"A company replaced many short meetings with written updates. Staff completed more focused work, but new employees said it was harder to ask quick questions.\" Who experienced the main disadvantage?", ["Customers", "Managers only", "New employees", "Experienced clients"], "New employees", "The text specifically attributes the difficulty to new employees."],
      ["b1pluspr_reading_3", "\"A company replaced many short meetings with written updates. Staff completed more focused work, but new employees said it was harder to ask quick questions.\" Which conclusion is best supported?", ["Written updates solve every communication problem.", "The policy has both benefits and limitations.", "Meetings are never useful.", "New employees completed no work."], "The policy has both benefits and limitations.", "The writer presents a gain and a drawback without making an absolute claim."],
    ],
    writing: [
      ["b1pluspr_writing_1", "The scheme is expensive. ___, it could reduce traffic in the long term.", ["However", "For instance", "Therefore", "Similarly"], "However", "'However' introduces a contrasting benefit after the drawback."],
      ["b1pluspr_writing_2", "Which sentence introduces the opposing side of an argument?", ["Supporters focus on convenience; on the other hand, critics question the cost.", "The cost is listed in the report.", "For example, the office opens at nine.", "In conclusion, both views exist."], "Supporters focus on convenience; on the other hand, critics question the cost.", "'On the other hand' introduces a contrasting viewpoint."],
      ["b1pluspr_writing_3", "Which is the most balanced conclusion?", ["The proposal is obviously perfect.", "The proposal is a disaster.", "Overall, the benefits are significant, provided that the cost is carefully controlled.", "There are two paragraphs above."], "Overall, the benefits are significant, provided that the cost is carefully controlled.", "A balanced conclusion weighs the benefit and acknowledges a condition."],
    ],
  },
  "b2-pre-advanced": {
    grammar: [
      ["b2pr_grammar_1", "The lights are off and nobody is answering. They ___ home already.", ["must have gone", "should go", "can't go", "would be going"], "must have gone", "'Must have' expresses a strong deduction about a past event."],
      ["b2pr_grammar_2", "If the data had been backed up, we ___ the files now.", ["would still have", "will still have", "had still had", "would have still had yesterday"], "would still have", "This mixed conditional links a past condition to a present result."],
      ["b2pr_grammar_3", "The minister ___ to be considering a change in policy.", ["is reported", "reports", "has reporting", "is report"], "is reported", "The passive reporting structure is 'subject + is reported + to-infinitive'."],
      ["b2pr_grammar_4", "By next June, I ___ at the company for ten years.", ["will have been working", "have worked", "will work", "am working"], "will have been working", "The future perfect continuous describes duration up to a future point."],
      ["b2pr_grammar_5", "Sam knew the address, so he ___ the wrong building by mistake.", ["can't have entered", "must enter", "should have entering", "might enter"], "can't have entered", "'Can't have' expresses that a past explanation is logically impossible."],
    ],
    vocabulary: [
      ["b2pr_vocab_1", "The new guidelines are ___ regarded as a practical improvement.", ["widely", "heavily", "deeply", "closely"], "widely", "'Widely regarded' is the natural collocation meaning considered by many people."],
      ["b2pr_vocab_2", "The report draws attention to an ___ urgent shortage of skilled staff.", ["increasingly", "increase", "increasedly", "increasing"], "increasingly", "The adverb 'increasingly' modifies the adjective 'urgent'."],
      ["b2pr_vocab_3", "After several delays, the company decided to ___ the outdated booking system.", ["phase out", "bring up", "turn over", "set off"], "phase out", "To 'phase out' a system is to stop using it gradually."],
    ],
    reading: [
      ["b2pr_reading_1", "\"The council's trial of later bus services attracted more passengers than expected. However, the report notes that one successful month cannot show whether demand will remain high throughout winter.\" Why is the writer cautious?", ["The buses carried no passengers.", "The evidence covers only a short period.", "Winter services were cancelled.", "The council hid the report."], "The evidence covers only a short period.", "The writer questions whether one month provides enough evidence for a lasting conclusion."],
      ["b2pr_reading_2", "\"The council's trial of later bus services attracted more passengers than expected. However, the report notes that one successful month cannot show whether demand will remain high throughout winter.\" What is the writer's attitude to the result?", ["Entirely dismissive", "Encouraged but not convinced", "Angry about the timetable", "Certain of long-term success"], "Encouraged but not convinced", "The result is positive, but the writer explicitly limits the conclusion that can be drawn."],
      ["b2pr_reading_3", "\"The council's trial of later bus services attracted more passengers than expected. However, the report notes that one successful month cannot show whether demand will remain high throughout winter.\" Which evidence would best address the limitation?", ["Passenger numbers across several seasons", "The colour of the buses", "A list of driver names", "One passenger's ticket"], "Passenger numbers across several seasons", "Longer-term data would show whether demand continues beyond the trial month."],
    ],
  },
  "c1-advanced": {
    grammar: [
      ["c1pr_grammar_1", "Only after the figures were checked ___ the scale of the error.", ["we understood", "did we understand", "we did understand", "had we understanding"], "did we understand", "A restrictive phrase at the front triggers subject-auxiliary inversion."],
      ["c1pr_grammar_2", "The evidence ___ that the policy may have had a limited effect.", ["appears to suggest", "proves beyond doubt", "guarantees", "makes certain"], "appears to suggest", "'Appears to suggest' appropriately hedges a conclusion based on limited evidence."],
      ["c1pr_grammar_3", "What the review calls into question ___ the reliability of the original sample.", ["is", "are", "being", "have been"], "is", "The wh-cleft clause functions as a singular subject and takes 'is'."],
      ["c1pr_grammar_4", "Rarely ___ such a measured response to a highly divisive proposal.", ["we see", "do we see", "we have saw", "see we"], "do we see", "Fronted 'rarely' requires inversion with the auxiliary 'do'."],
      ["c1pr_grammar_5", "The results are ___ with the earlier findings, although they do not confirm them.", ["broadly consistent", "absolutely identical", "certainly proved", "entirely caused"], "broadly consistent", "The hedged phrase recognises similarity without claiming exact confirmation."],
    ],
    vocabulary: [
      ["c1pr_vocab_1", "The committee's recommendation was deliberately ___, allowing both sides to support it.", ["broadly worded", "carelessly loud", "briefly expensive", "deeply factual"], "broadly worded", "'Broadly worded' describes language kept general enough to permit different interpretations."],
      ["c1pr_vocab_2", "Her proposal was ambitious but not ___; each target was supported by a realistic timetable.", ["unrealistic", "innovative", "far-reaching", "constructive"], "unrealistic", "The contrast shows that the ambition did not make the proposal impractical."],
      ["c1pr_vocab_3", "The minister tried to ___ concerns by publishing the full report.", ["allay", "compile", "derive", "retain"], "allay", "To 'allay concerns' is to reduce or calm them; this is a standard collocation."],
    ],
    reading: [
      ["c1pr_reading_1", "\"The decline followed the advertising ban, a sequence that has encouraged confident claims about cause and effect. Yet consumer habits had begun shifting months earlier, and prices rose during the same period.\" What is the writer challenging?", ["The timing of the ban", "A simple causal explanation", "The existence of advertising", "The accuracy of all prices"], "A simple causal explanation", "The writer introduces other changes that weaken the claim that the ban alone caused the decline."],
      ["c1pr_reading_2", "\"The decline followed the advertising ban, a sequence that has encouraged confident claims about cause and effect. Yet consumer habits had begun shifting months earlier, and prices rose during the same period.\" What is the function of 'Yet'?", ["To add an unrelated example", "To introduce evidence that limits the previous claim", "To restate the confident claim", "To mark the final conclusion as certain"], "To introduce evidence that limits the previous claim", "'Yet' signals a contrast that complicates the initial causal interpretation."],
      ["c1pr_reading_3", "\"The decline followed the advertising ban, a sequence that has encouraged confident claims about cause and effect. Yet consumer habits had begun shifting months earlier, and prices rose during the same period.\" Which conclusion would the writer most likely accept?", ["The ban definitely had no effect.", "Several factors may have contributed to the decline.", "Price changes are never relevant.", "Sequence always proves causation."], "Several factors may have contributed to the decline.", "The passage resists a single cause and points to multiple plausible influences."],
    ],
    writing: [
      ["c1pr_writing_1", "Which sentence is most appropriate in a formal evaluation?", ["The scheme was a total mess, honestly.", "The scheme failed to meet several of its stated objectives.", "The scheme was, like, not great.", "Everyone hated the scheme."], "The scheme failed to meet several of its stated objectives.", "It is precise, evidence-oriented, and appropriately formal."],
      ["c1pr_writing_2", "Choose the most appropriately hedged conclusion.", ["This proves the approach never works.", "The findings may indicate that the approach is less reliable in larger groups.", "Obviously, the approach is useless.", "There can be no doubt about the result."], "The findings may indicate that the approach is less reliable in larger groups.", "'May indicate' states a cautious interpretation without overstating the evidence."],
      ["c1pr_writing_3", "Which revision best suits an academic report?", ["The numbers went up a lot.", "A substantial increase was observed over the six-month period.", "Loads more people joined.", "The increase was totally massive."], "A substantial increase was observed over the six-month period.", "The revision uses precise, formal language and identifies the measured period."],
    ],
  },
};

function toPracticeItem(
  level: string,
  skill: Skill,
  [id, prompt, options, correctAnswer, explanation]: PracticeSeed
): PracticeQuestionItem {
  return {
    question: {
      id,
      skill,
      task_type: "multiple_choice",
      cefr_weight: LEVEL_CEFR[level],
      prompt,
      options,
      correct_answer: correctAnswer,
    },
    explanation,
  };
}

export function getPracticeQuestionItems(level: string, skill: Skill): PracticeQuestionItem[] {
  const seeds = PRACTICE_SEEDS[level]?.[skill] ?? [];
  return seeds.map((seed) => toPracticeItem(level, skill, seed));
}

export function getPracticeQuestionCount(level: string, skill: Skill): number {
  return PRACTICE_SEEDS[level]?.[skill]?.length ?? 0;
}
