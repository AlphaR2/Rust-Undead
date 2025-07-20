// Import the types we defined earlier
interface MongoEntity {
  _id: string;
}

interface Question extends MongoEntity {
  question_id: number;
  text: string;
  correct: boolean;
  explanation: string;
}

interface LearningContent extends MongoEntity {
  summary: string;
  big_note: string[];
  battle_relevance: string;
}

interface Topic extends MongoEntity {
  topic_id: number;
  title: string;
  learning_content: LearningContent;
  questions: Question[];
}

interface Concept extends MongoEntity {
  concept_id: number;
  title: string;
  description: string;
  topics: Topic[];
  __v: number;
}


interface ConceptsData {
  concepts?: Concept[]; // Optional for flexibility
}

/**
 * Helper function to get random elements from an array
 */
function getRandomElements<T>(array: T[], count: number): T[] {
  if (count > array.length) {
    throw new Error(`Cannot select ${count} elements from array of length ${array.length}`);
  }
  
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Helper function to get a single random element
 */
function getRandomElement<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Cannot select element from empty array');
  }
  return array[Math.floor(Math.random() * array.length)];
}

// Quiz result interface with pre-extracted data
interface QuizResult {
  concepts: Concept[];
  conceptInfo: Array<{ title: string; description: string }>;
  questions: Question[];
  totalQuestions: number;
}

/**
 * Generate randomized quiz from concepts array - returns pre-extracted data
 */
function generateRandomizedQuiz(concepts: Concept[]): QuizResult {
  // Validate input
  if (concepts.length < 5) {
    throw new Error('Need at least 5 concepts to generate quiz');
  }

  // Step 1: Get 5 random concepts from the concepts array
  const selectedConcepts: Concept[] = getRandomElements(concepts, 5);

  // Step 2 & 3: For each concept, get 2 random topics, and 1 random question per topic
  const randomizedConcepts: Concept[] = selectedConcepts.map((concept: Concept): Concept => {
    // Validate that concept has enough topics
    if (concept.topics.length < 2) {
      throw new Error(`Concept "${concept.title}" needs at least 2 topics`);
    }

    // Get 2 random topics from this concept's topics
    const selectedTopics: Topic[] = getRandomElements(concept.topics, 2);

    // For each topic, get 1 random question
    const topicsWithRandomQuestions: Topic[] = selectedTopics.map((topic: Topic): Topic => {
      // Validate that topic has questions
      if (topic.questions.length === 0) {
        throw new Error(`Topic "${topic.title}" has no questions`);
      }

      // Get 1 random question from this topic's questions
      const selectedQuestion: Question = getRandomElement(topic.questions);

      return {
        ...topic, // Keep all topic properties
        questions: [selectedQuestion] // Replace with single random question
      };
    });

    return {
      ...concept, // Keep all concept properties
      topics: topicsWithRandomQuestions // Replace with randomized topics
    };
  });

  // Extract concept info (titles and descriptions)
  const conceptInfo = randomizedConcepts.map(concept => ({
    title: concept.title,
    description: concept.description
  }));

  // Extract all questions into flat array
  const allQuestions: Question[] = [];
  randomizedConcepts.forEach(concept => {
    concept.topics.forEach(topic => {
      topic.questions.forEach(question => {
        allQuestions.push(question);
      });
    });
  });

  return {
    concepts: randomizedConcepts,
    conceptInfo: conceptInfo,
    questions: allQuestions,
    totalQuestions: allQuestions.length
  };
}

/**
 * Alternative function that works with data wrapped in concepts object
 */
function generateRandomizedQuizFromData(originalData: ConceptsData): QuizResult {
  if (!originalData.concepts) {
    throw new Error('Original data must contain concepts array');
  }

  return generateRandomizedQuiz(originalData.concepts);
}

/**
 * Step-by-step version with logging for debugging
 */
function generateRandomizedQuizWithLogging(concepts: Concept[]): QuizResult {
  console.log("Step 1: Selecting 5 random concepts from available concepts...");
  
  // Step 1: Get 5 random concepts
  const selectedConcepts: Concept[] = getRandomElements(concepts, 5);
  console.log("Selected concepts:", selectedConcepts.map(c => c.title));

  console.log("\nStep 2: Selecting 2 random topics from each concept...");
  console.log("Step 3: Selecting 1 random question from each topic...");
  
  const randomizedConcepts: Concept[] = selectedConcepts.map((concept: Concept): Concept => {
    // Step 2: Get 2 random topics from this concept's topics
    const selectedTopics: Topic[] = getRandomElements(concept.topics, 2);
    console.log(`  ${concept.title}: Selected topics:`, selectedTopics.map(t => t.title));
    
    const topicsWithQuestions: Topic[] = selectedTopics.map((topic: Topic): Topic => {
      // Step 3: Get 1 random question from this topic's questions
      const selectedQuestion: Question = getRandomElement(topic.questions);
      console.log(`    ${topic.title}: Selected question:`, selectedQuestion.text);
      
      return {
        ...topic,
        questions: [selectedQuestion]
      };
    });

    return {
      ...concept,
      topics: topicsWithQuestions
    };
  });

  // Extract data
  const conceptInfo = randomizedConcepts.map(concept => ({
    title: concept.title,
    description: concept.description
  }));

  const allQuestions: Question[] = [];
  randomizedConcepts.forEach(concept => {
    concept.topics.forEach(topic => {
      topic.questions.forEach(question => {
        allQuestions.push(question);
      });
    });
  });

  console.log("\n✅ Final result: 5 concepts × 2 topics × 1 question = 10 total questions");
  
  return {
    concepts: randomizedConcepts,
    conceptInfo: conceptInfo,
    questions: allQuestions,
    totalQuestions: allQuestions.length
  };
}

/**
 * Utility function to count total questions in result
 */
function countQuestions(concepts: Concept[]): number {
  return concepts.reduce((total, concept) => {
    return total + concept.topics.reduce((topicTotal, topic) => {
      return topicTotal + topic.questions.length;
    }, 0);
  }, 0);
}

/**
 * Extract concept information (titles and descriptions) from randomized quiz
 */
function extractConceptInfo(concepts: Concept[]): Array<{ title: string; description: string }> {
  return concepts.map(concept => ({
    title: concept.title,
    description: concept.description
  }));
}

/**
 * Extract all questions from randomized quiz into a flat array
 */
function extractQuestions(concepts: Concept[]): Question[] {
  const allQuestions: Question[] = [];
  
  concepts.forEach(concept => {
    concept.topics.forEach(topic => {
      topic.questions.forEach(question => {
        allQuestions.push(question);
      });
    });
  });
  
  return allQuestions;
}

/**
 * Extract both concept info and questions separately
 */
function extractQuizData(concepts: Concept[]): {
  conceptInfo: Array<{ title: string; description: string }>;
  questions: Question[];
} {
  return {
    conceptInfo: extractConceptInfo(concepts),
    questions: extractQuestions(concepts)
  };
}

// Export all functions and types
export {
  generateRandomizedQuiz,
  generateRandomizedQuizFromData,
  generateRandomizedQuizWithLogging,
  getRandomElements,
  getRandomElement
};

export type { Concept, Topic, Question, ConceptsData, QuizResult };

// Usage examples:
/*
// Generate randomized quiz with all data pre-extracted
const quizResult: QuizResult = generateRandomizedQuiz(yourConceptsArray);

// Access the data directly from the result:
console.log("Full concepts structure:", quizResult.concepts);
console.log("Concept info only:", quizResult.conceptInfo);
// Output: [{ title: "Computer Systems Fundamentals", description: "How computers actually work..." }, ...]

console.log("All questions array:", quizResult.questions);
// Output: [{ question_id: 1, text: "Question text", correct: true, explanation: "..." }, ...]

console.log("Total questions:", quizResult.totalQuestions);
// Output: 10

// If your data is wrapped in an object:
const originalData: ConceptsData = { concepts: yourConceptsArray };
const quizData: QuizResult = generateRandomizedQuizFromData(originalData);

// With logging for debugging:
const quizWithLogs: QuizResult = generateRandomizedQuizWithLogging(yourConceptsArray);

// Everything is already extracted for you!
const { concepts, conceptInfo, questions, totalQuestions } = quizResult;
*/