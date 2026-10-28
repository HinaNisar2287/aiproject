
"use client";

import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const chatbotRules = rules as Rule[];

const quickTopics = [
  "Menu",
  "Deals",
  "Timings",
  "Location",
  "Delivery",
  "Payment",
];

function findBotReply(message: string): string {
  // Convert the message to lowercase whole-word tokens.
  // Example: "this" becomes ["this"], not ["hi", "s"].
  const words: string[] = message.toLowerCase().match(/[a-z0-9]+/g) ?? [];

  // Rules are checked in their JSON order, from specific to general.
  const matchedRule = chatbotRules.find((rule) =>
    rule.keywords.some((keyword) => words.includes(keyword))
  );

  if (matchedRule) {
    return matchedRule.reply;
  }

  return "Sorry, I couldn't understand that. 😊\n\nYou can ask me about our Menu, Deals, Timings, Location, Delivery, or Payment. You can also use the quick topic buttons below!";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 Welcome to Desi Bites, Sargodha!\n\nI'm your restaurant assistant. Ask me about our menu, deals, delivery, timings, location, or payment options.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  function sendMessage(text: string = input) {
    const trimmedText = text.trim();

    if (!trimmedText || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: nextIdRef.current++,
      sender: "user",
      text: trimmedText,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate the bot typing for approximately half a second.
    window.setTimeout(() => {
      const reply = findBotReply(trimmedText);

      const botMessage: Message = {
        id: nextIdRef.current++,
        sender: "bot",
        text: reply,
      };

      setMessages((previous) => [...previous, botMessage]);
      setIsTyping(false);
    }, 500);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <main className="min-h-screen bg-orange-50 px-3 py-5 text-stone-800 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">
        {/* Restaurant header */}
        <header className="bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-5 text-white sm:px-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
              🍔
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Desi Bites
              </h1>
              <p className="mt-1 text-sm text-orange-50">
                Restaurant Chatbot · Sargodha
              </p>

              <div className="mt-2 flex items-center gap-2 text-xs text-orange-50">
                <span className="h-2 w-2 rounded-full bg-green-300" />
                Rule-based assistant · Demo
              </div>
            </div>
          </div>
        </header>

        {/* Chat messages */}
        <section
          aria-label="Chat conversation"
          aria-live="polite"
          className="flex-1 space-y-5 overflow-y-auto bg-orange-50/50 p-4 sm:p-6"
        >
          <div className="text-center">
            <span className="inline-block rounded-full border border-orange-100 bg-white px-4 py-2 text-xs text-stone-500 shadow-sm">
              Welcome to Desi Bites!
            </span>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg">
                  🍔
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[78%] ${
                  message.sender === "user"
                    ? "rounded-br-sm bg-orange-600 text-white"
                    : "rounded-bl-sm border border-orange-100 bg-white text-stone-800"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6 sm:text-base">
                  {message.text}
                </p>

                <p
                  className={`mt-2 text-right text-[10px] ${
                    message.sender === "user"
                      ? "text-orange-100"
                      : "text-stone-400"
                  }`}
                >
                  {message.sender === "user" ? "You" : "Desi Bites Bot"}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div
              role="status"
              aria-label="Bot is typing"
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-lg">
                🍔
              </div>

              <div className="rounded-2xl rounded-bl-sm border border-orange-100 bg-white px-4 py-3 shadow-sm">
                <p className="animate-pulse text-sm text-stone-500">
                  Typing...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        {/* Quick topic buttons */}
        <section className="border-t border-orange-100 bg-white px-4 pb-3 pt-4 sm:px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Quick questions
          </p>

          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                disabled={isTyping}
                onClick={() => sendMessage(topic)}
                className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 transition hover:border-orange-500 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {topic}
              </button>
            ))}
          </div>
        </section>

        {/* Message input */}
        <footer className="border-t border-orange-100 bg-white p-4 sm:px-6 sm:pb-5">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <label htmlFor="chat-message" className="sr-only">
              Type your message
            </label>

            <input
              id="chat-message"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about our food..."
              autoComplete="off"
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-full border border-orange-200 bg-orange-50 px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:opacity-60 sm:text-base"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
            >
              Send
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-stone-400">
            Powered by simple keyword rules · No AI API required
          </p>
        </footer>
      </div>
    </main>
  );
}
