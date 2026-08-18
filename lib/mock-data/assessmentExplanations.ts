/**
 * Authored post-submission feedback for scored level assessments.
 *
 * Kept separate from the question banks so adding review does not
 * change question shapes, scoring, or persisted attempt records.
 */

export const MIXED_TEST_EXPLANATIONS: Record<string, string> = {
  // A1
  a1t1_grammar_1: "Use 'is' with the third-person singular subject 'he'.",
  a1t1_grammar_2: "The verb 'to be' uses 'are' with the plural subject 'we'.",
  a1t1_vocab_1: "People with the same parents are siblings; Marta is the speaker's sister.",
  a1t1_vocab_2: "A brother's or sister's daughter is a niece.",
  a1t1_reading_1: "The notice states that the park closes at 9pm; the 8pm time applies only to dogs.",
  a1t1_reading_2: "The notice specifically requires children under 8 to be accompanied by an adult.",
  a1t1_writing_1: "A form label and a country name begin with capitals, and a colon clearly separates the field from its value.",

  // A2
  a2t1_grammar_1: "'Last weekend' places the trip in the past, and the irregular past of 'go' is 'went'.",
  a2t1_grammar_2: "A completed action yesterday takes the past simple form 'watched'.",
  a2t1_vocab_1: "Eating toast and fruit before leaving is the routine 'have breakfast'.",
  a2t1_vocab_2: "To 'commute' is to travel regularly between home and work.",
  a2t1_reading_1: "The story first says that David woke up, before he got dressed or went to the bus stop.",
  a2t1_reading_2: "David woke up late, so the story states that he did not have time for breakfast.",
  a2t1_writing_1: "A short direct question such as 'Are you free...?' fits an informal message; the other choices use formal correspondence language.",

  // B1
  b1t1_grammar_1: "The likely rain plan uses present simple after 'if' and 'will' in the result clause.",
  b1t1_grammar_2: "After 'if' in a first conditional, use the present simple: 'if you reply by noon'.",
  b1t1_vocab_1: "The completed travel arrangements support 'is going to' for Kai's planned course.",
  b1t1_vocab_2: "'Look forward to' expresses positive anticipation and is followed here by 'seeing'.",
  b1t1_reading_1: "'Although' contrasts the advance warning with users' continuing disappointment.",
  b1t1_reading_2: "'Although' contrasts good preparation with the team's difficulty answering budget questions.",
  b1t1_writing_1: "'I personally think that' marks the claim as the writer's view without presenting it as universal fact.",
  b1t1_writing_2: "'From my point of view' marks a personal opinion, and the because-clause gives a relevant reason without overclaiming.",

  // B1+ Bridge
  b1plust1_grammar_1: "The work began at 8am and is still continuing, so 'have been clearing ... since 8am' fits both meaning and form.",
  b1plust1_grammar_2: "Use present perfect continuous for Mara's unfinished activity and 'for' with the duration 'two weeks'.",
  b1plust1_vocab_1: "Tidal power is naturally replenished, so the established term is 'renewable energy'.",
  b1plust1_vocab_2: "Recovering useful metals from old laptops is recycling.",
  b1plust1_reading_1: "Shared office days respond to the reported difficulty learning informal processes without ending remote work.",
  b1plust1_reading_2: "Keeping remote work while adjusting it shows the company sees both evidence of success and a problem to address.",
  b1plust1_writing_1: "'On the one hand' introduces the benefit before 'On the other hand' presents the drawback.",
  b1plust1_writing_2: "The sentence signals a conclusion, acknowledges both views, and then gives a measured judgement.",

  // B2
  b2t1_grammar_1: "The paint marks show a recent activity with a present result, while 'all afternoon' emphasises duration.",
  b2t1_grammar_2: "The dark office and missing car provide strong evidence for the past deduction 'must have left'.",
  b2t1_grammar_3: "'If only + past perfect' expresses regret about a past action that can no longer be changed.",
  b2t1_vocab_1: "'Take into account' is the fixed collocation meaning consider something before deciding.",
  b2t1_vocab_2: "In this context, 'bring up' means mention or introduce the budget overrun as a topic.",
  b2t1_reading_1: "Proposal B costs more now but adds capacity expected to meet demand for at least fifteen years.",
  b2t1_reading_2: "The recommendation is conditional on funding temporary bus links during construction disruption.",
  b2t1_writing_1: "'It is thought that...' is an impersonal passive reporting structure suited to a formal summary.",
  b2t1_writing_2: "'Suggests', 'may', and 'some users' preserve the limited survey's original certainty and scope.",

  // C1
  c1t1_grammar_1: "Fronted 'seldom' triggers subject-auxiliary inversion: 'Seldom had we encountered...'.",
  c1t1_grammar_2: "'Appear to suggest' and 'may' appropriately limit a conclusion from a small study.",
  c1t1_grammar_3: "The it-cleft places emphasis on the loss of specialist staff as the precise cause of the delay.",
  c1t1_vocab_1: "'Far-reaching implications' is the formal collocation for consequences with a wide effect.",
  c1t1_vocab_2: "'In practical terms' introduces what an abstract change means in concrete reality.",
  c1t1_reading_1: "The window metaphor shows that visibility is limited by the frame, just as the portal limits which responses residents can give.",
  c1t1_reading_2: "The final sentence separates publishing visible results from offering a comprehensive set of choices.",
  c1t1_writing_1: "The selected sentence is precise, relevant, and formal enough for a covering letter.",
  c1t1_writing_2: "'Please send the draft by Thursday' is direct and concise while retaining a polite request form.",
};

export const PROGRESS_CHECK_EXPLANATIONS: Record<string, string> = {
  // A1
  a1pc_grammar_1: "The verb 'to be' uses 'am' with the subject 'I'.",
  a1pc_grammar_2: "Use 'are' with the plural subject 'they'.",
  a1pc_grammar_3: "The verb 'to be' uses 'is' with 'she'.",
  a1pc_vocab_1: "Two children with the same parents are siblings; Nora is the speaker's sister.",
  a1pc_vocab_2: "A mother's other son is the speaker's brother.",
  a1pc_vocab_3: "A father's mother is the speaker's grandmother.",
  a1pc_reading_1: "'Switch off' means turn the phone off during the film.",
  a1pc_reading_2: "The notice identifies Gate 3 as the departure point; 12 is the bus number and 15 is the frequency.",
  a1pc_writing_1: "The field label and both parts of the person's name use capitals, with a colon after the label.",
  a1pc_writing_2: "'Age: 24' gives the requested information in a clear form-field format.",

  // A2
  a2pc_grammar_1: "After 'didn't', use the base form of the verb: 'didn't go'.",
  a2pc_grammar_2: "'Last summer' requires the past simple, and the past form of 'have' is 'had'.",
  a2pc_vocab_1: "'Get dressed' is the routine action of putting on clothes.",
  a2pc_vocab_2: "'Go to bed' is the routine action that naturally happens around 11pm.",
  a2pc_reading_1: "After getting dressed, Elena left for the office; she only returned home when she remembered her keys.",
  a2pc_reading_2: "Going back home for the forgotten keys delayed Elena's journey to work.",
  a2pc_writing_1: "'See you soon!' is a warm, informal closing for a message to a friend.",
  a2pc_writing_2: "'What time works for you?' uses natural conversational language rather than formal correspondence.",

  // B1
  b1pc_grammar_1: "The first conditional uses present simple after 'if' and 'will' for the likely future result.",
  b1pc_grammar_2: "Use present simple in the if-clause: 'If they arrive early...'.",
  b1pc_vocab_1: "'Aim to do something' expresses a goal, so 'aims to save' is the complete pattern.",
  b1pc_vocab_2: "'Intend to open' is the correct structure for a planned future action and agrees with 'they'.",
  b1pc_reading_1: "The policy aimed to reduce costs, but reported spending increased, suggesting the opposite effect.",
  b1pc_reading_2: "Twenty-four hours before Friday is Thursday.",
  b1pc_writing_1: "'I personally think that' introduces the writer's own view without claiming universal agreement.",
  b1pc_writing_2: "The selected sentence maintains formal vocabulary and tone from beginning to end.",

  // B1+ Bridge
  b1pluspc_grammar_1: "Use present perfect continuous for unfinished work and 'for' with the duration 'three months'.",
  b1pluspc_grammar_2: "A present perfect continuous question uses 'has + subject + been + -ing'.",
  b1pluspc_vocab_1: "Harmful chemicals in a river are a form of pollution.",
  b1pluspc_vocab_2: "To 'upgrade' a phone is to replace or improve it so it meets newer requirements.",
  b1pluspc_reading_1: "The higher return rate is positive evidence, while the added returns point addresses the queue problem.",
  b1pluspc_reading_2: "A separate returns point is intended to stop multiple returns from delaying the main café queue.",
  b1pluspc_writing_1: "'On the other hand' introduces the longer commute as a drawback contrasting with the benefits.",
  b1pluspc_writing_2: "The conclusion weighs flexibility against isolation and proposes a response rather than ignoring either side.",

  // B2
  b2pc_grammar_1: "The past perfect passive shows the announcement was completed before the journalists arrived.",
  b2pc_grammar_2: "Maya's train journey makes her presence at the London meeting impossible, so 'can't have been' is the logical deduction.",
  b2pc_grammar_3: "This mixed conditional uses a past unreal condition and a present result: 'had not closed' and 'would still have'.",
  b2pc_vocab_1: "'Widely regarded as' is the natural collocation meaning considered by many people.",
  b2pc_vocab_2: "The adverb 'increasingly' modifies the adjective 'common'.",
  b2pc_reading_1: "The writer accepts concrete benefits from the tax but argues that it cannot solve overcrowding alone.",
  b2pc_reading_2: "Extra bins and later buses are the specific services funded by the tax.",
  b2pc_writing_1: "'Is said to be considering' is a passive reporting structure for an unconfirmed ongoing rumour.",
  b2pc_writing_2: "'Suggests', 'may', and 'at two sites' retain the early trial's limited certainty and scope.",

  // C1
  c1pc_grammar_1: "The it-cleft places emphasis on 'a shortage of parts' as the cause of the delay.",
  c1pc_grammar_2: "'Apparently' reports unconfirmed information without presenting the leak as certain.",
  c1pc_vocab_1: "'A growing body of evidence' is the established academic collocation for accumulating research support.",
  c1pc_vocab_2: "The adjective 'responsible' takes the dependent preposition 'for'.",
  c1pc_reading_1: "The phrase is presented as hasty and overstated because free daytime access remains and evening entry reaches previously underserved workers.",
  c1pc_reading_2: "The ending qualifies rather than rejects the chart: it may be informative, but it leaves the causal mechanism untested.",
  c1pc_writing_1: "'I would be grateful if...' makes a formal, courteous request to a new supplier.",
  c1pc_writing_2: "'Is likely to' expresses probability, while the final clause acknowledges other possible influences.",
};
