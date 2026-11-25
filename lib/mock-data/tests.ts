/**
 * lib/mock-data/tests.ts
 *
 * One real Mixed Test ("Test 1: Mixed Practice") exists for every
 * curriculum level from A1 to C1. Every other test (Review Test,
 * Mock Test, Grammar Shorts) is still a "coming_soon" entry with no
 * content — Mock Exams wait on the Listening/Speaking decision.
 *
 * Questions reuse the exact PlacementQuestion shape from
 * placementQuestions.ts — no new question schema was introduced.
 * Listening questions carry an `audio_script` that the browser reads
 * aloud (services/speechService.ts) — real audio, never a faked item.
 */
import type { PlacementQuestion } from "@/lib/mock-data/placementQuestions";
import type { Skill } from "@/components/types";

export interface TestSummary {
  id: string;
  title: string;
  status: "available" | "coming_soon";
}

export interface TestSection {
  skill: Skill;
  questions: PlacementQuestion[];
}

export interface TestContent extends TestSummary {
  sections: TestSection[];
  /** Legacy: shows a "Listening coming soon" step at the end of the
   *  test. Every level now has a real listening section instead, so
   *  this is false everywhere; kept for tests without audio. */
  hasListeningPlaceholder: boolean;
}

const A2_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "a2t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Choose the correct sentence.",
        options: [
          "She go to school yesterday.",
          "She goes to school yesterday.",
          "She went to school yesterday.",
          "She going to school yesterday.",
        ],
        correct_answer: "She went to school yesterday.",
      },
      {
        id: "a2t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "A2",
        prompt: "Yesterday, we ___ (watch) a great film.",
        correct_answer: "watched",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "a2t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Choose the correct word: 'She ___ to work by bicycle every day.'",
        options: ["commutes", "wakes up", "gets dressed", "goes to bed"],
        correct_answer: "commutes",
      },
      {
        id: "a2t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Choose the correct word: 'I always ___ before 8am, then I have breakfast.'",
        options: ["wake up", "commute", "go to bed", "have dinner"],
        correct_answer: "wake up",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "a2t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt:
          "\"On Sunday morning, David woke up late and quickly got dressed. He didn't have time for breakfast, so he went straight to the bus stop. He arrived at work just before his meeting started.\" — What did David do first?",
        options: ["Had breakfast", "Woke up", "Got dressed", "Went to the bus stop"],
        correct_answer: "Woke up",
      },
      {
        id: "a2t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "In the same story, what did David do after getting dressed?",
        options: ["Had breakfast", "Went to the bus stop", "Went to his meeting", "Went back to sleep"],
        correct_answer: "Went to the bus stop",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "a2t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt: "Which is the best way to start a message to a close friend?",
        options: ["Dear Sir or Madam,", "Hey!", "To whom it may concern,", "I am writing to inform you."],
        correct_answer: "Hey!",
      },
    ],
  },
];

const B1_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "b1t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct sentence.",
        options: [
          "If it will be cold, I will wear a coat.",
          "If it is cold, I will wear a coat.",
          "If it is cold, I would wear a coat.",
          "If it was cold, I will wear a coat.",
        ],
        correct_answer: "If it is cold, I will wear a coat.",
      },
      {
        id: "b1t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "B1",
        prompt: "If you ___ (leave) now, you will catch the train.",
        correct_answer: "leave",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "b1t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct phrase: 'She ___ to start her own business next year.'",
        options: ["plans", "look forward", "aiming", "intended"],
        correct_answer: "plans",
      },
      {
        id: "b1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct phrase: 'We ___ seeing you at the conference next month.'",
        options: ["look forward to", "intend", "plan", "aim"],
        correct_answer: "look forward to",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "b1t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "\"Deliveries are made between 9am and 1pm. If no one is home, the parcel will be left with a neighbour or returned to the depot.\" — What happens if no one is home?",
        options: [
          "The parcel is delivered again the next day.",
          "The parcel is left with a neighbour or returned to the depot.",
          "The delivery is cancelled.",
          "The parcel is left outside the door.",
        ],
        correct_answer: "The parcel is left with a neighbour or returned to the depot.",
      },
      {
        id: "b1t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "\"Although the presentation was well-prepared, the team struggled to answer questions about the budget.\" — What is suggested about the presentation?",
        options: [
          "It was poorly prepared.",
          "It was prepared well, but had a weak point.",
          "It had no questions at all.",
          "The budget was not discussed.",
        ],
        correct_answer: "It was prepared well, but had a weak point.",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "b1t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "You're writing a formal opinion piece. Which phrase fits best?",
        options: ["I reckon,", "In my opinion,", "If you ask me,", "Everyone knows"],
        correct_answer: "In my opinion,",
      },
      {
        id: "b1t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which sentence best introduces a personal opinion in formal writing?",
        options: [
          "Obviously, this is the right choice.",
          "From my point of view, this is the right choice.",
          "This is the right choice, no doubt.",
          "It's pretty clear this is the right choice.",
        ],
        correct_answer: "From my point of view, this is the right choice.",
      },
    ],
  },
];

const A1_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "a1t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Choose the correct sentence.",
        options: ["He am from Spain.", "He is from Spain.", "He are from Spain.", "He be from Spain."],
        correct_answer: "He is from Spain.",
      },
      {
        id: "a1t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "A1",
        prompt: "We ___ (live) in a small flat.",
        correct_answer: "live",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "a1t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Choose the correct word: 'I drink ___ every morning.'",
        options: ["coffee", "chair", "window", "book"],
        correct_answer: "coffee",
      },
      {
        id: "a1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Which word is a number?",
        options: ["Monday", "seven", "yellow", "table"],
        correct_answer: "seven",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "a1t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "\"Park opens at 6am and closes at 9pm. No dogs allowed after 8pm.\" — What time does the park close?",
        options: ["6am", "8pm", "9pm", "9am"],
        correct_answer: "9pm",
      },
      {
        id: "a1t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "\"Please wait here. The doctor will call your name.\" — What should you do?",
        options: ["Go home", "Wait", "Call the doctor", "Leave a message"],
        correct_answer: "Wait",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "a1t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Which is written correctly on a form?",
        options: ["name: anna lee", "Name: Anna Lee", "NAME anna LEE", "Name; Anna, Lee"],
        correct_answer: "Name: Anna Lee",
      },
    ],
  },
];

const B1PLUS_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "b1plust1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct sentence.",
        options: [
          "He has been living here for two years.",
          "He has been live here for two years.",
          "He is been living here for two years.",
          "He have been living here for two years.",
        ],
        correct_answer: "He has been living here for two years.",
      },
      {
        id: "b1plust1_grammar_2",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct sentence.",
        options: [
          "We have been waiting for the bus for twenty minutes.",
          "We have being waiting for the bus for twenty minutes.",
          "We have been wait for the bus for twenty minutes.",
          "We are been waiting for the bus for twenty minutes.",
        ],
        correct_answer: "We have been waiting for the bus for twenty minutes.",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "b1plust1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct word: 'Many countries are investing in ___ energy like wind and solar power.'",
        options: ["renewable", "polluted", "recycled", "broken"],
        correct_answer: "renewable",
      },
      {
        id: "b1plust1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Choose the correct word: 'Old phones and laptops should be ___ properly, not thrown away.'",
        options: ["recycled", "polluted", "upgraded", "renewable"],
        correct_answer: "recycled",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "b1plust1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "\"Several employers have started allowing staff to work from home permanently. Supporters say productivity has improved, but some managers worry that team communication has weakened as a result.\" — According to the text, what do supporters of remote work say has improved?",
        options: ["Team communication", "Productivity", "Office attendance", "Management structure"],
        correct_answer: "Productivity",
      },
      {
        id: "b1plust1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "In the same text, what concern do some managers raise?",
        options: [
          "Productivity has fallen",
          "Team communication has weakened",
          "Employees want to return to the office",
          "Costs have increased",
        ],
        correct_answer: "Team communication has weakened",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "b1plust1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which phrase best introduces one side of a debate?",
        options: ["On the one hand,", "In conclusion,", "As a result,", "Therefore,"],
        correct_answer: "On the one hand,",
      },
      {
        id: "b1plust1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which sentence shows a balanced conclusion after presenting both sides?",
        options: [
          "In conclusion, both viewpoints have merit, but I believe the benefits are greater.",
          "On the one hand, this is important.",
          "For instance, many people agree.",
          "On the other hand, some disagree.",
        ],
        correct_answer: "In conclusion, both viewpoints have merit, but I believe the benefits are greater.",
      },
    ],
  },
];

/**
 * B2 Mixed Test — every item traces to a B2 lesson objective
 * (passive voice; Work & Careers words; writer's attitude; although /
 * despite / however / moreover). Reading uses a new scenario (a hotel
 * review, mainly negative) — not the lesson's cinema text, and not its
 * "expected X, surprisingly Y" structure.
 */
const B2_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "b2t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "Choose the correct passive sentence.",
        options: [
          "The windows are cleaned once a month.",
          "The windows are clean once a month.",
          "The windows is cleaned once a month.",
          "The windows cleaning once a month.",
        ],
        correct_answer: "The windows are cleaned once a month.",
      },
      {
        id: "b2t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "B2",
        prompt: "This castle ___ (build) in the 12th century. (Use the past simple passive.)",
        correct_answer: "was built",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "b2t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "Choose the correct word: 'The ___ for applications is 30 June — nothing will be accepted after that.'",
        options: ["deadline", "salary", "colleague", "promotion"],
        correct_answer: "deadline",
      },
      {
        id: "b2t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "Choose the correct words: 'Parents of young children often look for jobs with ___, so they can do the school run.'",
        options: ["flexible hours", "a deadline", "a colleague", "a promotion"],
        correct_answer: "flexible hours",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "b2t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt:
          "\"The hotel's website promised a peaceful escape, and the lakeside location was certainly beautiful. Sadly, thin walls and a noisy bar downstairs meant we barely slept. I doubt we'll be back.\" — What is the writer's overall attitude to the hotel?",
        options: [
          "Mainly disappointed, although they liked the location",
          "Completely satisfied",
          "Excited to return soon",
          "Only interested in the bar",
        ],
        correct_answer: "Mainly disappointed, although they liked the location",
      },
      {
        id: "b2t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "In the same text, which word signals that the writer's view turns negative?",
        options: ["Sadly", "certainly", "beautiful", "peaceful"],
        correct_answer: "Sadly",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "b2t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "Choose the correct sentence.",
        options: [
          "Although the tickets were expensive, the concert sold out.",
          "Despite the tickets were expensive, the concert sold out.",
          "Although the expensive tickets, the concert sold out.",
          "Despite of the expensive tickets, the concert sold out.",
        ],
        correct_answer: "Although the tickets were expensive, the concert sold out.",
      },
      {
        id: "b2t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "Complete the text: 'The new phone has a great camera. ___, its battery life is poor.'",
        options: ["However,", "Moreover,", "Although,", "Despite,"],
        correct_answer: "However,",
      },
    ],
  },
];

/**
 * C1 Mixed Test — traces to C1 objectives (inversion after Never /
 * Rarely / Seldom / Not only; the five taught idioms; claim vs
 * concession; hedging & academic register). Reading uses a new topic
 * (tourism and short-term rentals) and a different concession marker
 * ("Granted") than the lesson's ("Admittedly").
 */
const C1_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "c1t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Choose the correct sentence.",
        options: [
          "Seldom do we see such talent in a young player.",
          "Seldom we see such talent in a young player.",
          "Seldom do we saw such talent in a young player.",
          "Seldom we do see such talent in a young player.",
        ],
        correct_answer: "Seldom do we see such talent in a young player.",
      },
      {
        id: "c1t1_grammar_2",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Choose the correct sentence.",
        options: [
          "Not only is the hotel cheap, but it is also close to the beach.",
          "Not only the hotel is cheap, but it is also close to the beach.",
          "Not only is the hotel cheap, but is it also close to the beach.",
          "Not only does the hotel is cheap, but it is also close to the beach.",
        ],
        correct_answer: "Not only is the hotel cheap, but it is also close to the beach.",
      },
    ],
  },
  {
    skill: "vocabulary",
    questions: [
      {
        id: "c1t1_vocab_1",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Choose the correct expression: 'Right, it's nine o'clock — shall I ___ by presenting this month's figures?'",
        options: ["get the ball rolling", "cut corners", "sit on the fence", "be the tip of the iceberg"],
        correct_answer: "get the ball rolling",
      },
      {
        id: "c1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Choose the correct expression: 'The leaked emails are only ___ — the investigation is likely to reveal far more.'",
        options: ["the tip of the iceberg", "a blessing in disguise", "on the fence", "getting the ball rolling"],
        correct_answer: "the tip of the iceberg",
      },
    ],
  },
  {
    skill: "reading",
    questions: [
      {
        id: "c1t1_reading_1",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt:
          "\"Granted, tourism brings much-needed money into historic cities. But when residents are priced out of their own neighbourhoods by holiday rentals, the cost has clearly become too high. Cities must limit short-term rentals before their character is lost for good.\" — What is the writer's main claim?",
        options: [
          "Cities must limit short-term rentals.",
          "Tourism brings money into historic cities.",
          "Residents should move out of historic cities.",
          "Holiday rentals should be made cheaper.",
        ],
        correct_answer: "Cities must limit short-term rentals.",
      },
      {
        id: "c1t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "In the same text, which point does the writer concede?",
        options: [
          "Tourism brings much-needed money.",
          "Residents are being priced out.",
          "Cities are losing their character.",
          "The cost has become too high.",
        ],
        correct_answer: "Tourism brings much-needed money.",
      },
    ],
  },
  {
    skill: "writing",
    questions: [
      {
        id: "c1t1_writing_1",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Which sentence is most appropriate for an academic essay?",
        options: [
          "The data appears to show a link between sleep and exam performance.",
          "I reckon sleep's really important for exams.",
          "Everyone knows you do better in exams if you sleep a lot.",
          "Sleep is basically the key to exams, obviously.",
        ],
        correct_answer: "The data appears to show a link between sleep and exam performance.",
      },
      {
        id: "c1t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Choose the best hedged version of: 'Remote workers are more productive than office workers.'",
        options: [
          "It could be argued that remote workers tend to be more productive.",
          "Remote workers are always more productive, without doubt.",
          "Obviously, remote workers are more productive.",
          "Remote workers are definitely more productive.",
        ],
        correct_answer: "It could be argued that remote workers tend to be more productive.",
      },
    ],
  },
];

/**
 * Listening sections (Web Speech API — see services/speechService.ts).
 * Each tests its level's Listening-lesson sub-skill with a NEW script
 * (Reading Passage Rule applied to audio).
 */
const A1_TEST_1_LISTENING: TestSection = {
  skill: "listening",
  questions: [
    {
      id: "a1t1_listening_1",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "A1",
      prompt: "Listen. How old is David?",
      options: ["Thirteen", "Thirty", "Forty", "Three"],
      correct_answer: "Thirty",
      audio_script: [
        { text: "Hi, I'm David. I'm thirty years old. I'm from Canada, and I'm a teacher." },
      ],
    },
    {
      id: "a1t1_listening_2",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "A1",
      prompt: "Listen again if you need to. Where is David from?",
      options: ["Canada", "Spain", "Turkey", "England"],
      correct_answer: "Canada",
      audio_script: [
        { text: "Hi, I'm David. I'm thirty years old. I'm from Canada, and I'm a teacher." },
      ],
    },
  ],
};

const A2_TEST_1_LISTENING: TestSection = {
  skill: "listening",
  questions: [
    {
      id: "a2t1_listening_1",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "A2",
      prompt: "Listen. What did the speaker do first at the market?",
      options: ["Bought some bread", "Met Leila", "Walked in the park", "Had lunch"],
      correct_answer: "Bought some bread",
      audio_script: [
        { text: "Last Saturday I went to the market. First, I bought some bread. Then I met my friend Leila for coffee. After that, we walked in the park." },
      ],
    },
    {
      id: "a2t1_listening_2",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "A2",
      prompt: "What did they do after coffee?",
      options: ["Walked in the park", "Bought bread", "Went home", "Went to the cinema"],
      correct_answer: "Walked in the park",
      audio_script: [
        { text: "Last Saturday I went to the market. First, I bought some bread. Then I met my friend Leila for coffee. After that, we walked in the park." },
      ],
    },
  ],
};

const B1_TEST_1_LISTENING: TestSection = {
  skill: "listening",
  questions: [
    {
      id: "b1t1_listening_1",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "B1",
      prompt: "Listen to the message. Who is Jo planning to visit?",
      options: ["Grandma", "A friend", "Her teacher", "Her brother"],
      correct_answer: "Grandma",
      audio_script: [
        { speaker: "Jo", text: "Hi, it's Jo. I'm planning to visit Grandma on Sunday. I'm going to take the train at eleven. If you want to come, meet me at the station at quarter to eleven." },
      ],
    },
    {
      id: "b1t1_listening_2",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "B1",
      prompt: "How is Jo going to travel?",
      options: ["By train", "By bus", "By car", "On foot"],
      correct_answer: "By train",
      audio_script: [
        { speaker: "Jo", text: "Hi, it's Jo. I'm planning to visit Grandma on Sunday. I'm going to take the train at eleven. If you want to come, meet me at the station at quarter to eleven." },
      ],
    },
  ],
};

const B1PLUS_TEST_1_LISTENING: TestSection = {
  skill: "listening",
  questions: [
    {
      id: "b1plust1_listening_1",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "B1",
      prompt: "Listen to the conversation. Why does Ben like online shopping?",
      options: ["It saves time.", "It's cheaper.", "The clothes fit better.", "He can see things first."],
      correct_answer: "It saves time.",
      audio_script: [
        { speaker: "Ben", text: "I think online shopping is great. It saves so much time." },
        { speaker: "Lucy", text: "Maybe, but I miss seeing things before I buy them. Half my clothes don't fit!" },
      ],
    },
    {
      id: "b1plust1_listening_2",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "B1",
      prompt: "What is Lucy's concern?",
      options: ["She can't see things before buying them.", "Online shopping takes too long.", "Deliveries are late.", "Shops are too far away."],
      correct_answer: "She can't see things before buying them.",
      audio_script: [
        { speaker: "Ben", text: "I think online shopping is great. It saves so much time." },
        { speaker: "Lucy", text: "Maybe, but I miss seeing things before I buy them. Half my clothes don't fit!" },
      ],
    },
  ],
};

const B2_TEST_1_LISTENING: TestSection = {
  skill: "listening",
  questions: [
    {
      id: "b2t1_listening_1",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "B2",
      prompt: "Listen to the message. What is its main purpose?",
      options: ["To tell the listener about a delay", "To ask for payment", "To cancel the repairs completely", "To offer a new flat"],
      correct_answer: "To tell the listener about a delay",
      audio_script: [
        { speaker: "Mark", text: "Hello, this is Mark from Greenway Lettings. I'm afraid the repairs to your kitchen have been delayed until next Thursday. I do apologise \u2014 I know this isn't what you wanted to hear." },
      ],
    },
    {
      id: "b2t1_listening_2",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "B2",
      prompt: "What is Mark's tone?",
      options: ["Apologetic", "Angry", "Excited", "Bored"],
      correct_answer: "Apologetic",
      audio_script: [
        { speaker: "Mark", text: "Hello, this is Mark from Greenway Lettings. I'm afraid the repairs to your kitchen have been delayed until next Thursday. I do apologise \u2014 I know this isn't what you wanted to hear." },
      ],
    },
  ],
};

const C1_TEST_1_LISTENING: TestSection = {
  skill: "listening",
  questions: [
    {
      id: "c1t1_listening_1",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "C1",
      prompt: "Listen to the talk. What is the speaker's main claim?",
      options: ["Scooters should be allowed only with designated parking zones.", "Scooters should be banned completely.", "Scooters have no benefits.", "Pedestrians should use scooters."],
      correct_answer: "Scooters should be allowed only with designated parking zones.",
      audio_script: [
        { speaker: "Speaker", text: "Admittedly, electric scooters have made short trips quicker for many people. Yet, left unregulated, they clutter pavements and endanger pedestrians. Cities should allow them \u2014 but only with designated parking zones." },
      ],
    },
    {
      id: "c1t1_listening_2",
      skill: "listening",
      task_type: "audio_multiple_choice",
      cefr_weight: "C1",
      prompt: "What does the speaker concede?",
      options: ["Scooters have made short trips quicker.", "Scooters endanger pedestrians.", "Pavements are cluttered.", "Parking zones are expensive."],
      correct_answer: "Scooters have made short trips quicker.",
      audio_script: [
        { speaker: "Speaker", text: "Admittedly, electric scooters have made short trips quicker for many people. Yet, left unregulated, they clutter pavements and endanger pedestrians. Cities should allow them \u2014 but only with designated parking zones." },
      ],
    },
  ],
};

const TESTS_BY_LEVEL: Record<string, TestContent[]> = {
  "a1-elementary": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: [...A1_TEST_1_SECTIONS, A1_TEST_1_LISTENING],
      hasListeningPlaceholder: false,
    },
    { id: "review-test", title: "Review Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "a2-pre-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: [...A2_TEST_1_SECTIONS, A2_TEST_1_LISTENING],
      hasListeningPlaceholder: false,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b1-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: [...B1_TEST_1_SECTIONS, B1_TEST_1_LISTENING],
      hasListeningPlaceholder: false,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b1-plus-upper-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: [...B1PLUS_TEST_1_SECTIONS, B1PLUS_TEST_1_LISTENING],
      hasListeningPlaceholder: false,
    },
    { id: "review-test", title: "Review Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b2-pre-advanced": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: [...B2_TEST_1_SECTIONS, B2_TEST_1_LISTENING],
      hasListeningPlaceholder: false,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "c1-advanced": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: [...C1_TEST_1_SECTIONS, C1_TEST_1_LISTENING],
      hasListeningPlaceholder: false,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "grammar-shorts": [
    { id: "shorts-1", title: "Grammar Shorts #1", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
};

export function getTestsForLevel(levelSlug: string): TestSummary[] {
  return (TESTS_BY_LEVEL[levelSlug] ?? []).map(({ id, title, status }) => ({ id, title, status }));
}

export function getTestContent(levelSlug: string, testId: string): TestContent | null {
  const tests = TESTS_BY_LEVEL[levelSlug] ?? [];
  const test = tests.find((t) => t.id === testId);
  return test && test.status === "available" ? test : null;
}
