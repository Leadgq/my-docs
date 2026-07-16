# langchain

## question: what's the langchain?

- 1. The langchain is a framework for building applications that use language models.
- 2. The langchain provides many features, including:

  - Easy integration with various language models ,such as openai, deepSeek ,and so on.
  - It simplifies composing LLMS with external data sources,tools and memory to create reliable applications.
  - chain: A chain is a sequence of steps that are executed in a specific order.
  - agent: An agent is a component that can use language models to perform tasks.

## question: How to create a model for node.js?

- 1. You need to install langchain package.

```ts
// This is example to create model
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  apiKey: process.env.API_KEY, // This is a key to request openai api
  model: modelName || "gpt-4o-mini", // Your model name
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});

const res = await model.invoke(
  "Hello, I am a student.  I wanna know the Weather in dalian."
);
console.log(res.content); // Oh, The Ai will tell you the Weather in dalian.
```

## question: what's the prompt?

- The prompt is the input text to ask the language model.
- The prompt is the only window through which you can have a conversation with Ai.
- So You must provide a clear context in the prompt of the conversation.

```ts
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
const prompt = new PromptTemplate({
  template: "你好，{name}。",
  inputVariables: ["name"],
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你是一个专业的翻译。"],
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);
const res = await chain.invoke({
  input: "你好，我是张三。",
});
console.log(res.content); // 你好，张三。
```

## question: How to create a chain ?

- 1. You need to create a model first.
- 2. You need a prompt of the conversation next.
- 3. Creating a resolver to parse the model output.

```ts
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const personSchema = z.object({
  question: z.string().describe("The customer's question"),
  answer: z.string().describe("The AI's answer to the customer's question"),
});

const parser = StructuredOutputParser.fromZodSchema(personSchema);

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template: `you're a helpful AI assistant. you will answer this {description} {format_instructions}`,
  inputVariables: ["description"],
  partialVariables: { format_instructions: formatInstructions },
});

const chain = prompt.pipe(model).pipe(parser);

const res = await chain.invoke({
  description: "Translate the following sentence into English.",
  input: "Hello, I am a student.",
});
console.log(res); // { question: "Hello, I am a student.", answer: "你好，我是一个学生。" }
```
