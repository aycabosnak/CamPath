/**
 * lib/mock-data/audioLessons.ts
 *
 * Listening and Speaking lessons for every curriculum level (A1–C1),
 * added after the Web Speech API resourcing decision (see
 * services/speechService.ts). Kept in their own file so the original
 * four-skill content in curriculumLessons.ts stays readable; merged
 * per level by getCurriculumLessonsForLevel().
 *
 * Authoring rules applied (docs/AssessmentDesign.md):
 * - Each Listening lesson teaches ONE listening sub-skill; its Mixed
 *   Test and Progress Check items test that same sub-skill with NEW
 *   scripts (the Reading Passage Rule, applied to audio).
 * - Each script only uses language already taught at that level or
 *   below.
 * - Speaking prompts recycle the level's own grammar/vocabulary/
 *   writing targets, so speaking reinforces — never introduces —
 *   content.
 */
import type { CurriculumLesson } from "@/lib/mock-data/curriculumLessons";

const OK = "Well done — that's correct.";

export const AUDIO_LESSONS: Record<string, CurriculumLesson[]> = {
  // ------------------------------------------------------------- A1
  "a1-elementary": [
    {
      id: "a1-listening-1",
      level: "a1-elementary",
      skill: "listening",
      title: "Listening for Personal Details",
      introLabel: "Listening",
      introText:
        "When people introduce themselves, listen for the key details: name, age, country and family. Press Play, listen once for the general idea, then play it again to check the details.",
      audioScript: [
        {
          text: "Hello! My name is Anna. I am twenty-five years old and I am from Spain. I have one brother and two sisters.",
        },
      ],
      questions: [
        {
          prompt: "How old is Anna?",
          options: ["Fifteen", "Twenty", "Twenty-five", "Thirty-five"],
          correctAnswer: "Twenty-five",
          reviewFeedback: "Review this concept — listen for the number after 'I am...': Anna says 'twenty-five years old'.",
          successFeedback: OK,
        },
        {
          prompt: "Where is Anna from?",
          options: ["Spain", "Italy", "Turkey", "France"],
          correctAnswer: "Spain",
          reviewFeedback: "Review this concept — the country comes after 'I am from...'. Anna says 'Spain'.",
          successFeedback: OK,
        },
        {
          prompt: "How many sisters does Anna have?",
          options: ["One", "Two", "Three", "None"],
          correctAnswer: "Two",
          reviewFeedback: "Review this concept — Anna has one brother and two sisters. Listen for the word right before 'sisters'.",
          successFeedback: OK,
        },
      ],
      completionMessage: "You can now understand someone's basic personal details when they introduce themselves.",
    },
    {
      id: "a1-speaking-1",
      level: "a1-elementary",
      skill: "speaking",
      title: "Introducing Yourself",
      introLabel: "Speaking",
      introText:
        "Listen to each sentence, then say it yourself. Your browser checks which words it recognised. This is practice, not a test — try again as many times as you like.",
      speakingPrompts: [
        { text: "Hello, I am a student.", tip: "In fast speech, 'I am' often becomes 'I'm' — both are fine." },
        { text: "I am from Turkey.", tip: "Stress the country: I am from TUR-key." },
        { text: "I have one brother and one sister." },
      ],
      questions: [],
      completionMessage: "You can now introduce yourself out loud using the verb 'to be' and family words.",
    },
  ],

  // ------------------------------------------------------------- A2
  "a2-pre-intermediate": [
    {
      id: "a2-listening-1",
      level: "a2-pre-intermediate",
      skill: "listening",
      title: "Following a Sequence of Events",
      introLabel: "Listening",
      introText:
        "In a story about the past, words like first, then, after that and finally tell you the order of events. Listen for these words to follow what happened.",
      audioScript: [
        {
          text: "Yesterday was a busy day. I woke up at six o'clock. First, I had a shower. Then I had breakfast with my sister. After that, I took the bus to work. Finally, in the evening, I went to the cinema with friends.",
        },
      ],
      questions: [
        {
          prompt: "What did the speaker do first?",
          options: ["Had a shower", "Had breakfast", "Took the bus", "Went to the cinema"],
          correctAnswer: "Had a shower",
          reviewFeedback: "Review this concept — the word 'First' comes just before 'I had a shower'.",
          successFeedback: OK,
        },
        {
          prompt: "Who did the speaker have breakfast with?",
          options: ["Their sister", "Their friends", "Their mother", "Nobody"],
          correctAnswer: "Their sister",
          reviewFeedback: "Review this concept — the speaker says 'Then I had breakfast with my sister'.",
          successFeedback: OK,
        },
        {
          prompt: "What happened last?",
          options: ["The speaker went to the cinema.", "The speaker took the bus.", "The speaker woke up.", "The speaker had breakfast."],
          correctAnswer: "The speaker went to the cinema.",
          reviewFeedback: "Review this concept — 'Finally' signals the last event: going to the cinema in the evening.",
          successFeedback: OK,
        },
      ],
      completionMessage: "You can now follow the order of events when someone talks about their day.",
    },
    {
      id: "a2-speaking-1",
      level: "a2-pre-intermediate",
      skill: "speaking",
      title: "Talking About Your Day",
      introLabel: "Speaking",
      introText:
        "Practise past simple sentences about your routine. Listen to the model first, then repeat it. Pay attention to the -ed endings.",
      speakingPrompts: [
        { text: "I woke up at seven o'clock.", tip: "'woke' rhymes with 'joke'." },
        { text: "Then I had breakfast with my family." },
        { text: "After work, I walked to the gym.", tip: "'walked' ends with a /t/ sound: walk-t." },
      ],
      questions: [],
      completionMessage: "You can now describe your day out loud in the past simple.",
    },
  ],

  // ------------------------------------------------------------- B1
  "b1-intermediate": [
    {
      id: "b1-listening-1",
      level: "b1-intermediate",
      skill: "listening",
      title: "Understanding Plans in a Voice Message",
      introLabel: "Listening",
      introText:
        "In messages about plans, listen for the future forms (be going to, plan to, intend to) and the conditions (if...). They tell you what will happen and what might change it.",
      audioScript: [
        {
          speaker: "Leo",
          text: "Hi Maya, it's Leo. About Saturday — we're going to meet at the lake at ten, not nine. We plan to have a picnic and then go cycling. If it rains, we'll go to the museum instead. Let me know if you can come!",
        },
      ],
      questions: [
        {
          prompt: "What time are they going to meet?",
          options: ["At nine", "At ten", "At eleven", "At noon"],
          correctAnswer: "At ten",
          reviewFeedback: "Review this concept — Leo corrects the time: 'at ten, not nine'. Listen for corrections in messages.",
          successFeedback: OK,
        },
        {
          prompt: "What do they plan to do after the picnic?",
          options: ["Go cycling", "Go swimming", "Visit the museum", "Go home"],
          correctAnswer: "Go cycling",
          reviewFeedback: "Review this concept — 'We plan to have a picnic and then go cycling.'",
          successFeedback: OK,
        },
        {
          prompt: "What will they do if it rains?",
          options: ["Go to the museum", "Cancel the plan", "Meet on Sunday", "Stay at the lake"],
          correctAnswer: "Go to the museum",
          reviewFeedback: "Review this concept — the first conditional gives the backup plan: 'If it rains, we'll go to the museum instead.'",
          successFeedback: OK,
        },
      ],
      completionMessage: "You can now understand plans, changes and backup plans in a spoken message.",
    },
    {
      id: "b1-speaking-1",
      level: "b1-intermediate",
      skill: "speaking",
      title: "Giving Your Opinion",
      introLabel: "Speaking",
      introText:
        "Practise opinion phrases and the first conditional out loud. Speak at a natural pace — the recogniser works best with full, clear sentences.",
      speakingPrompts: [
        { text: "In my opinion, public transport should be cheaper." },
        { text: "I'm going to study abroad next year.", tip: "In fast speech, 'going to' often sounds like 'gonna' — both are fine here." },
        { text: "If it rains tomorrow, we will stay at home." },
      ],
      questions: [],
      completionMessage: "You can now give opinions and talk about plans and possibilities out loud.",
    },
  ],

  // ------------------------------------------------------------ B1+
  "b1-plus-upper-intermediate": [
    {
      id: "b1plus-listening-1",
      level: "b1-plus-upper-intermediate",
      skill: "listening",
      title: "Identifying Speakers' Opinions",
      introLabel: "Listening",
      introText:
        "When two people discuss an issue, they often disagree. Listen for who says what, and for phrases that show agreement or disagreement (I'm not sure, that's true, but...).",
      audioScript: [
        { speaker: "Tom", text: "I think the car-free Sunday in the city centre is brilliant. The air is cleaner and families can walk safely." },
        { speaker: "Ella", text: "That's true, but I'm not sure it works for everyone. My parents can't walk far, and the buses are always full on Sundays." },
      ],
      questions: [
        {
          prompt: "What does Tom think about the car-free Sunday?",
          options: ["He thinks it's brilliant.", "He thinks it's dangerous.", "He hasn't decided.", "He wants it every day."],
          correctAnswer: "He thinks it's brilliant.",
          reviewFeedback: "Review this concept — Tom opens with a clear opinion: 'I think... is brilliant'.",
          successFeedback: OK,
        },
        {
          prompt: "What problem does Ella mention?",
          options: [
            "Some people can't walk far and the buses are full.",
            "The air is not cleaner.",
            "Families don't like walking.",
            "The city centre is too small.",
          ],
          correctAnswer: "Some people can't walk far and the buses are full.",
          reviewFeedback: "Review this concept — after 'but', Ella explains her concern: her parents can't walk far and the buses are full.",
          successFeedback: OK,
        },
        {
          prompt: "How would you describe Ella's response?",
          options: [
            "She partly agrees but has a concern.",
            "She completely agrees.",
            "She completely disagrees.",
            "She changes the subject.",
          ],
          correctAnswer: "She partly agrees but has a concern.",
          reviewFeedback: "Review this concept — 'That's true, but...' accepts part of Tom's point before raising a problem.",
          successFeedback: OK,
        },
      ],
      completionMessage: "You can now tell apart different speakers' opinions in a short discussion.",
    },
    {
      id: "b1plus-speaking-1",
      level: "b1-plus-upper-intermediate",
      skill: "speaking",
      title: "Talking About Duration & Both Sides",
      introLabel: "Speaking",
      introText:
        "Practise the present perfect continuous and balanced arguments out loud. Notice how 'have been' is usually shortened in speech.",
      speakingPrompts: [
        { text: "I've been learning English for three years.", tip: "'I've been' is said quickly: /aɪv bɪn/." },
        { text: "On the one hand, cars are convenient." },
        { text: "On the other hand, they cause a lot of pollution." },
      ],
      questions: [],
      completionMessage: "You can now say how long you've been doing something and present two sides of an issue out loud.",
    },
  ],

  // ------------------------------------------------------------- B2
  "b2-pre-advanced": [
    {
      id: "b2-listening-1",
      level: "b2-pre-advanced",
      skill: "listening",
      title: "Understanding Purpose & Tone",
      introLabel: "Listening",
      introText:
        "At B2, you need to hear why someone is speaking and how they feel — even when they stay polite. Listen for requests (Could you...?), problems (it's missing...) and softened complaints (I'd rather not...).",
      audioScript: [
        {
          speaker: "Priya",
          text: "Hi Sam, it's Priya. Thanks for sending the report. The problem is, it's missing the sales figures we agreed on, and the client meeting is tomorrow morning. Could you add them tonight? I'd really rather not explain the gap to the client.",
        },
      ],
      questions: [
        {
          prompt: "What is the main purpose of Priya's message?",
          options: [
            "To ask Sam to add the missing figures",
            "To cancel the client meeting",
            "To thank Sam for a perfect report",
            "To offer Sam a promotion",
          ],
          correctAnswer: "To ask Sam to add the missing figures",
          reviewFeedback: "Review this concept — the key request is 'Could you add them tonight?' The thanks is just a polite opening.",
          successFeedback: OK,
        },
        {
          prompt: "How does Priya most likely feel?",
          options: ["Concerned but polite", "Delighted", "Bored", "Furious and rude"],
          correctAnswer: "Concerned but polite",
          reviewFeedback: "Review this concept — she points out a problem and a tight deadline, but uses polite forms ('Could you...', 'I'd rather not...').",
          successFeedback: OK,
        },
        {
          prompt: "When is the client meeting?",
          options: ["Tomorrow morning", "Tonight", "Next week", "This afternoon"],
          correctAnswer: "Tomorrow morning",
          reviewFeedback: "Review this concept — Priya says 'the client meeting is tomorrow morning' — that's why the request is urgent.",
          successFeedback: OK,
        },
      ],
      completionMessage: "You can now identify a speaker's purpose and attitude, even when they are being polite.",
    },
    {
      id: "b2-speaking-1",
      level: "b2-pre-advanced",
      skill: "speaking",
      title: "Describing Processes & Contrasts",
      introLabel: "Speaking",
      introText:
        "Practise passive forms and linking words in speech. In the passive, the past participle carries the stress: it was BUILT, it has been MOVED.",
      speakingPrompts: [
        { text: "Every order is checked before it is sent." },
        { text: "The meeting has been moved to Friday.", tip: "Link 'moved to' smoothly: /muːvtə/." },
        { text: "Although it was difficult, we met the deadline." },
      ],
      questions: [],
      completionMessage: "You can now use the passive and contrast linkers naturally when you speak.",
    },
  ],

  // ------------------------------------------------------------- C1
  "c1-advanced": [
    {
      id: "c1-listening-1",
      level: "c1-advanced",
      skill: "listening",
      title: "Following an Argument in a Talk",
      introLabel: "Listening",
      introText:
        "Speakers, like writers, often concede a point before making their claim. In speech, listen for 'to be fair', 'admittedly' or 'it's true that' — then for the turn ('but', 'yet') that leads to the speaker's real position.",
      audioScript: [
        {
          speaker: "Lecturer",
          text: "It's often said that working long hours shows commitment. And, to be fair, in some industries visible effort is rewarded. But the evidence points the other way: beyond about fifty hours a week, productivity drops sharply. So if we want real commitment, we should measure results, not hours.",
        },
      ],
      questions: [
        {
          prompt: "What is the speaker's main claim?",
          options: [
            "We should measure results, not hours.",
            "Long hours show commitment.",
            "Everyone should work fifty hours a week.",
            "Productivity is impossible to measure.",
          ],
          correctAnswer: "We should measure results, not hours.",
          reviewFeedback: "Review this concept — the speaker's position comes after the turn ('But...') and is summed up at the end: 'measure results, not hours'.",
          successFeedback: OK,
        },
        {
          prompt: "What does the speaker concede?",
          options: [
            "In some industries, visible effort is rewarded.",
            "Productivity drops after fifty hours.",
            "Results should be measured.",
            "Commitment doesn't matter.",
          ],
          correctAnswer: "In some industries, visible effort is rewarded.",
          reviewFeedback: "Review this concept — 'to be fair' introduces the point the speaker accepts before arguing against the general idea.",
          successFeedback: OK,
        },
        {
          prompt: "What evidence does the speaker use?",
          options: [
            "Productivity drops sharply beyond about fifty hours a week.",
            "Most workers prefer shorter days.",
            "Companies lose money on overtime.",
            "Long hours improve results.",
          ],
          correctAnswer: "Productivity drops sharply beyond about fifty hours a week.",
          reviewFeedback: "Review this concept — 'the evidence points the other way' is followed by the supporting fact about productivity.",
          successFeedback: OK,
        },
      ],
      completionMessage: "You can now follow a speaker's argument and separate their claim from what they concede.",
    },
    {
      id: "c1-speaking-1",
      level: "c1-advanced",
      skill: "speaking",
      title: "Emphatic & Hedged Speech",
      introLabel: "Speaking",
      introText:
        "Practise inversion for emphasis and academic hedging out loud. In inverted sentences, stress the opening word: NEVER have I...",
      speakingPrompts: [
        { text: "Never have I seen such a well-organised event.", tip: "Stress 'Never', then keep 'have I' light and quick." },
        { text: "Not only is it cheaper, but it is also faster." },
        { text: "It could be argued that the plan is too ambitious." },
      ],
      questions: [],
      completionMessage: "You can now use emphatic inversion and hedging confidently when you speak.",
    },
  ],
};
