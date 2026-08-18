/**
 * lib/mock-data/tests.ts
 *
 * One available Mixed Test per taught level (A1–C1). Extra papers
 * (Review / Mock) remain coming_soon. Questions reuse PlacementQuestion
 * from placementQuestions.ts — no new schema.
 *
 * Listening is deliberately NOT a scored section: Mixed Tests must
 * never reuse the Practice Listening bank. Until Mixed Test has its
 * own unique clips, the test-taking page shows an honest placeholder.
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
  /** Shown as an honest placeholder section — never faked. */
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
        prompt: "Which sentence correctly describes a finished trip last weekend?",
        options: [
          "We goed to the coast last weekend.",
          "We went to the coast last weekend.",
          "We have go to the coast last weekend.",
          "We going to the coast last weekend.",
        ],
        correct_answer: "We went to the coast last weekend.",
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
        prompt:
          "Omar eats toast and fruit before he leaves for work. Which routine does he complete at home?",
        options: ["He has breakfast.", "He commutes.", "He goes to bed.", "He gets dressed for sleep."],
        correct_answer: "He has breakfast.",
      },
      {
        id: "a2t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A2",
        prompt:
          "Priya travels between her village and the city office every weekday. Which verb describes this journey?",
        options: ["commute", "wake up", "get dressed", "go to bed"],
        correct_answer: "commute",
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
        prompt: "In the same story, why did David go straight to the bus stop without breakfast?",
        options: [
          "He woke up late and did not have enough time.",
          "The café was closed.",
          "His meeting had been cancelled.",
          "He had already eaten at work.",
        ],
        correct_answer: "He woke up late and did not have enough time.",
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
        prompt: "Which sentence fits the body of an informal message to a friend?",
        options: [
          "Are you free to meet after class?",
          "I would be grateful if you could confirm your availability.",
          "Please find the requested schedule attached.",
          "I am writing to enquire about your availability.",
        ],
        correct_answer: "Are you free to meet after class?",
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
        prompt:
          "The organisers will move the market indoors only if there is heavy rain. Which sentence states the likely plan correctly?",
        options: [
          "If it rains heavily, they will move the market indoors.",
          "If it will rain heavily, they move the market indoors.",
          "If it rained heavily, they will move the market indoors.",
          "If it rains heavily, they would have moved the market indoors.",
        ],
        correct_answer: "If it rains heavily, they will move the market indoors.",
      },
      {
        id: "b1t1_grammar_2",
        skill: "grammar",
        task_type: "gap_fill",
        cefr_weight: "B1",
        prompt:
          "The venue can reserve your seat only if you ___ (reply) by noon. Write the missing verb only.",
        correct_answer: "reply",
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
        prompt:
          "Kai has booked flights and arranged a six-month course in Seoul. Which phrase best completes: 'He ___ study there next spring.'",
        options: ["is going to", "looks forward to", "aim", "intending"],
        correct_answer: "is going to",
      },
      {
        id: "b1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "The team enjoyed last year's conference and is excited about the next one. Complete: 'We ___ seeing you there again.'",
        options: ["look forward to", "intend to", "plan to", "aim to"],
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
          "\"The community centre will close for repairs from March 3rd to March 20th. Activities booked before the closure will go ahead. Although the announcement was made well in advance, several regular users were disappointed because the centre is normally open throughout spring.\" — What does the text suggest about the users?",
        options: [
          "They received no warning about the closure.",
          "They are disappointed despite being told in advance.",
          "They are pleased that every activity was cancelled.",
          "They expected the centre to close every spring.",
        ],
        correct_answer: "They are disappointed despite being told in advance.",
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
        prompt:
          "Which sentence introduces a personal view in formal writing without presenting it as an established fact?",
        options: [
          "I personally think that extending library hours would benefit commuters.",
          "Extending library hours will definitely solve access for everyone.",
          "It is universally accepted that longer opening hours have no drawbacks.",
          "If you ask me, keeping libraries shut is ridiculous.",
        ],
        correct_answer:
          "I personally think that extending library hours would benefit commuters.",
      },
      {
        id: "b1t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "Which sentence develops a personal opinion with a clear reason in formal writing?",
        options: [
          "From my point of view, the scheme should continue because it has reduced waiting times.",
          "The scheme should obviously continue because everyone knows it is perfect.",
          "I reckon the scheme is fine and that's that.",
          "The scheme continues, whatever people say.",
        ],
        correct_answer:
          "From my point of view, the scheme should continue because it has reduced waiting times.",
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
        prompt: "We ___ (be) ready for class. Write one word.",
        correct_answer: "are",
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
        prompt: "Marta and I have the same mother and father. Marta is my ___.",
        options: ["sister", "mother", "grandmother", "niece"],
        correct_answer: "sister",
      },
      {
        id: "a1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "A1",
        prompt: "Leo is my sister's daughter. Leo is my ___.",
        options: ["niece", "brother", "father", "grandmother"],
        correct_answer: "niece",
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
        prompt:
          "\"SWIMMING POOL — Open 7am–8pm. Children under 8 must be with an adult. No food or drinks on the poolside.\" — Who must be with an adult?",
        options: ["All visitors", "Children under 8", "Adults only", "Pool staff"],
        correct_answer: "Children under 8",
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
        prompt: "A form asks for country. Which entry is written correctly?",
        options: ["country: turkey", "Country: Turkey", "COUNTRY turkey", "Country; turkey"],
        correct_answer: "Country: Turkey",
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
        prompt:
          "The volunteers started clearing the beach at 8am and are still working. Which sentence emphasises the continuing activity?",
        options: [
          "They have been clearing the beach since 8am.",
          "They have cleared the beach every day last year.",
          "They had been clearing the beach tomorrow.",
          "They are clearing the beach since 8am.",
        ],
        correct_answer: "They have been clearing the beach since 8am.",
      },
      {
        id: "b1plust1_grammar_2",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "Mara started testing the new software two weeks ago and has not finished. Which sentence uses the duration correctly?",
        options: [
          "Mara has been testing the software for two weeks.",
          "Mara has been testing the software since two weeks.",
          "Mara tested the software for two weeks and still tests it.",
          "Mara has testing the software for two weeks.",
        ],
        correct_answer: "Mara has been testing the software for two weeks.",
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
        prompt:
          "The island imports diesel, but a new project will generate electricity from tides. The project uses ___ energy.",
        options: ["renewable", "disposable", "polluted", "temporary"],
        correct_answer: "renewable",
      },
      {
        id: "b1plust1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt:
          "The repair centre removes useful metals from broken laptops instead of sending them to landfill. The laptops are ___.",
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
          "\"After a six-month remote-work trial, the design team met every delivery target. However, newer employees said they found it harder to learn the team's informal processes. The company will keep remote work, but from October each team will choose two shared office days.\" — Why is the company introducing shared office days?",
        options: [
          "To address a weakness in informal learning while keeping remote work",
          "To punish the design team for missing its targets",
          "To end remote work for every employee",
          "To reduce the number of experienced staff",
        ],
        correct_answer: "To address a weakness in informal learning while keeping remote work",
      },
      {
        id: "b1plust1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B1",
        prompt: "In the same text, what does the company's decision suggest about its view of the trial?",
        options: [
          "The trial worked in some respects, but one problem needs a practical response.",
          "The trial failed completely and should stop immediately.",
          "Delivery targets are less important than office attendance.",
          "New employees caused the company to miss every target.",
        ],
        correct_answer: "The trial worked in some respects, but one problem needs a practical response.",
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
        prompt:
          "Complete the balanced paragraph: '___, a city-centre ban could reduce pollution. On the other hand, it could make deliveries more difficult.'",
        options: ["On the one hand", "In conclusion", "As a result", "For example"],
        correct_answer: "On the one hand",
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

const B2_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "b2t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt:
          "The kitchen looks freshly finished, and there are still paint marks on her clothes. Which sentence best emphasises the activity and how long it lasted?",
        options: [
          "She has painted the kitchen.",
          "She has been painting the kitchen all afternoon.",
          "She had painted the kitchen years ago.",
          "She was painted the kitchen all afternoon.",
        ],
        correct_answer: "She has been painting the kitchen all afternoon.",
      },
      {
        id: "b2t1_grammar_2",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "The office is dark and her car is gone. Which deduction is strongest?",
        options: [
          "She might leave later this evening.",
          "She must have already left.",
          "She can't leave yesterday.",
          "She must leave every morning at nine, so she is definitely still here.",
        ],
        correct_answer: "She must have already left.",
      },
      {
        id: "b2t1_grammar_3",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt:
          "The team did not check the figures, and the published report now contains an error. Which sentence expresses regret about that past decision?",
        options: [
          "If only the team had checked the figures before publication.",
          "If only the team checks the figures before publication.",
          "The team wishes it will check the figures yesterday.",
          "If only the team would check the figures last week.",
        ],
        correct_answer: "If only the team had checked the figures before publication.",
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
        prompt: "Choose the most natural phrase: 'The committee will ___ the extra cost before it votes.'",
        options: ["take into account", "raise into account", "come into account", "make into account"],
        correct_answer: "take into account",
      },
      {
        id: "b2t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "In 'Nobody wanted to bring up the budget overrun', bring up means:",
        options: ["educate a child", "mention or introduce a topic", "increase a price", "arrive unexpectedly"],
        correct_answer: "mention or introduce a topic",
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
          "\"Two proposals remain for the station redevelopment. Proposal A keeps the current platforms and adds a larger waiting area; it is cheaper and could be completed within a year, but it would not increase train capacity. Proposal B adds a new platform and pedestrian bridge. It would cost considerably more and disrupt services during construction, yet transport planners estimate that it would meet demand for at least fifteen years. The review panel recommends B, provided that temporary bus links are funded during the works.\" — Why does the panel prefer Proposal B?",
        options: [
          "It offers the stronger long-term response to rising demand.",
          "It is the cheapest option and causes no disruption.",
          "It can be completed within a year without changing capacity.",
          "It removes the need for temporary transport during construction.",
        ],
        correct_answer: "It offers the stronger long-term response to rising demand.",
      },
      {
        id: "b2t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt: "In the same text, what condition qualifies the panel's recommendation?",
        options: [
          "Temporary bus links must be funded while rail services are disrupted.",
          "Proposal A must first increase train capacity.",
          "The new platform must be completed within one year.",
          "Passengers must pay the full construction cost.",
        ],
        correct_answer: "Temporary bus links must be funded while rail services are disrupted.",
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
        prompt: "Which sentence reports 'Experts think ticket prices will rise' most appropriately in a formal summary?",
        options: [
          "Experts are like, tickets will be more expensive.",
          "It is thought that ticket prices will rise.",
          "Ticket prices think they will rise.",
          "Experts thought to rising ticket prices.",
        ],
        correct_answer: "It is thought that ticket prices will rise.",
      },
      {
        id: "b2t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "B2",
        prompt:
          "Source: 'A limited customer survey found that some users preferred the new layout.' Which formal paraphrase preserves the scope and certainty of the source?",
        options: [
          "The survey suggests that the new layout may be preferred by some users.",
          "The survey proves that every customer prefers the new layout.",
          "All users clearly want the new layout in every situation.",
          "Some users proved that the old layout was unusable.",
        ],
        correct_answer: "The survey suggests that the new layout may be preferred by some users.",
      },
    ],
  },
];

const C1_TEST_1_SECTIONS: TestSection[] = [
  {
    skill: "grammar",
    questions: [
      {
        id: "c1t1_grammar_1",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Which sentence uses inversion after a limiting adverbial?",
        options: [
          "Seldom we had encountered such resistance.",
          "Seldom had we encountered such resistance.",
          "We seldom had been encountering such resistance.",
          "Seldom we have encountering such resistance.",
        ],
        correct_answer: "Seldom had we encountered such resistance.",
      },
      {
        id: "c1t1_grammar_2",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "A small study shows a possible pattern, not proof. Which sentence is most appropriately hedged?",
        options: [
          "The figures prove that later start times eliminate teenage tiredness.",
          "The figures appear to suggest that later start times may reduce teenage tiredness.",
          "Later start times never affect tiredness.",
          "Everyone knows later start times are the only solution.",
        ],
        correct_answer: "The figures appear to suggest that later start times may reduce teenage tiredness.",
      },
      {
        id: "c1t1_grammar_3",
        skill: "grammar",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt:
          "The unexpected loss of specialist staff caused the delay. Which cleft sentence emphasises that cause?",
        options: [
          "It was the unexpected loss of specialist staff that caused the delay.",
          "What the unexpected staff lost was causing the delay.",
          "The delay was what specialist staff unexpectedly caused it.",
          "It caused the delay that the specialist staff were unexpected.",
        ],
        correct_answer: "It was the unexpected loss of specialist staff that caused the delay.",
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
        prompt: "Choose the most natural formal collocation: 'The ruling could have ___ for freelance workers.'",
        options: [
          "far-reaching implications",
          "wide-ranging intentions",
          "long-standing explanations",
          "broadly reached conclusions",
        ],
        correct_answer: "far-reaching implications",
      },
      {
        id: "c1t1_vocab_2",
        skill: "vocabulary",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Choose the most natural phrase: '___ , the change means longer evening hours, not a new collection.'",
        options: ["In practical terms", "In theoretical agreement", "By practical means", "On realistic wording"],
        correct_answer: "In practical terms",
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
          "\"The council calls its consultation portal a 'window into public priorities'. The metaphor is flattering, but incomplete: a window shows only what lies within its frame. Residents can rank five pre-selected transport schemes, yet they cannot propose an alternative or explain why none is acceptable. Publishing the results may make the process visible; it does not, by itself, make the choices comprehensive.\" — What is the main function of the window metaphor?",
        options: [
          "To show that apparent transparency can still restrict what the public is allowed to express",
          "To argue that online portals should display photographs of transport schemes",
          "To prove that residents cannot understand consultation results",
          "To claim that every visible process includes every possible choice",
        ],
        correct_answer:
          "To show that apparent transparency can still restrict what the public is allowed to express",
      },
      {
        id: "c1t1_reading_2",
        skill: "reading",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "In the same text, what distinction does the final sentence draw?",
        options: [
          "Between making a process observable and allowing a genuinely complete range of responses",
          "Between transport schemes that are cheap and those that are popular",
          "Between publishing data quickly and keeping it private",
          "Between residents who use windows and those who use online portals",
        ],
        correct_answer:
          "Between making a process observable and allowing a genuinely complete range of responses",
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
        prompt:
          "Which sentence states relevant experience precisely and in an appropriately professional register?",
        options: [
          "I have five years' experience in project coordination.",
          "I have done project coordination for ages and know it all.",
          "My project coordination experience is probably quite extensive.",
          "Five years of projects have made me an obviously perfect coordinator.",
        ],
        correct_answer: "I have five years' experience in project coordination.",
      },
      {
        id: "c1t1_writing_2",
        skill: "writing",
        task_type: "multiple_choice",
        cefr_weight: "C1",
        prompt: "Which rewrite is concise and still polite?",
        options: [
          "I am just writing in order to basically see if you could maybe possibly send the draft.",
          "Please send the draft by Thursday.",
          "You are required to send the draft by Thursday without delay.",
          "I request that the draft should perhaps be sent at your earliest possible Thursday convenience.",
        ],
        correct_answer: "Please send the draft by Thursday.",
      },
    ],
  },
];

const TESTS_BY_LEVEL: Record<string, TestContent[]> = {
  "a1-elementary": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: A1_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "review-test", title: "Review Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "a2-pre-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: A2_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b1-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: B1_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b1-plus-upper-intermediate": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: B1PLUS_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "review-test", title: "Review Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "b2-pre-advanced": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: B2_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
    },
    { id: "mock-test", title: "Mock Test", status: "coming_soon", sections: [], hasListeningPlaceholder: false },
  ],
  "c1-advanced": [
    {
      id: "test-1",
      title: "Test 1: Mixed Practice",
      status: "available",
      sections: C1_TEST_1_SECTIONS,
      hasListeningPlaceholder: true,
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
