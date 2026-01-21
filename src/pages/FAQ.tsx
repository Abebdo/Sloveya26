import { useState } from 'react';
import { Card } from '../components/common/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How does Solveya detect scams?",
    answer: "Solveya uses advanced Large Language Models (LLMs) fine-tuned on millions of scam messages. It analyzes linguistic patterns, psychological triggers (like urgency or fear), and specific request types (money, crypto, personal info) to determine the probability of fraud."
  },
  {
    question: "Is my data private?",
    answer: "Yes. We process your messages in real-time using secure, stateless edge functions. We do not store your messages on our servers after analysis is complete. Our privacy policy details exactly how we handle data."
  },
  {
    question: "Can it detect scams in other languages?",
    answer: "Yes, our AI models are multilingual and can detect scam patterns in over 20 languages including Spanish, French, German, Chinese, and Hindi, though English is currently our most optimized language."
  },
  {
    question: "Is Solveya free to use?",
    answer: "We offer a generous Free tier for individuals. For power users who need detailed breakdowns, rewrites, and unlimited analyses, we offer a Pro subscription."
  },
  {
    question: "Does it work on emails?",
    answer: "Yes! You can copy and paste the body of an email into Solveya. We recommend removing any sensitive personal information (like your own address) before pasting, although our system is designed to ignore PII."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-500">Everything you need to know about the platform.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="p-0 overflow-hidden bg-white border-slate-100 shadow-sm">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <span className="text-lg font-bold text-slate-800">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-brand-blue" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
};
