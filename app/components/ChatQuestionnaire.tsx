import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONNAIRE_DATA = {
  relations: [
    'Sister', 'Mother', 'Boss', 'Girlfriend', 
    'Boyfriend', 'Elder Relative', 'Younger Relative', 
  ],
  moods: [
    'Angry', 'Neutral', 'Happy', 'Excited', 'Unknown',
  ],
  moodEmojis: {
    'Angry': '😠',
    'Neutral': '😐',
    'Happy': '😊',
    'Excited': '🎉',
    'Unknown': '🤔',
  }
};

interface QuestionnaireProps {
  onComplete: (answers: {
    relation: string;
    mood: string;
  }) => void;
}

const ChatQuestionnaire = ({ onComplete }: QuestionnaireProps) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    relation: '',
    mood: '',
  });

  const handleNext = () => {
    if (step === 1 && answers.relation) {
      setStep(2);
    } else if (step === 2 && answers.mood) {
      onComplete({
        relation: answers.relation,
        mood: answers.mood
      });
    }
  };

  const getMoodEmoji = (mood: keyof typeof QUESTIONNAIRE_DATA.moodEmojis) => {
      return QUESTIONNAIRE_DATA.moodEmojis[mood] || '✨';
  };

  const getCurrentOptions = () => {
    return step === 1 ? QUESTIONNAIRE_DATA.relations.filter(option => option !== 'Other') : QUESTIONNAIRE_DATA.moods.filter(option => option !== 'Other');
  };

  const getSelectedValue = () => {
    return step === 1 ? answers.relation : answers.mood;
  };

  const isNextButtonDisabled = () => {
    return step === 1 ? !answers.relation : !answers.mood;
  };

  return (
    <div className="min-h-[400px] w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="p-8">
        <div className="w-full h-1 bg-gray-200 rounded-full mb-8">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {step === 1 ? 
                'Who would you like to message?' : 
                'What is their current mood?'
              }
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {getCurrentOptions().map((option) => (
                <button
                  key={option}
                  onClick={() => setAnswers(prev => ({
                    ...prev,
                    [step === 1 ? 'relation' : 'mood']: option
                  }))}
                  className={`
                    p-4 rounded-xl text-left transition-all duration-200
                    ${getSelectedValue() === option
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {step === 2 && (
                      <span className="text-xl">{getMoodEmoji(option )}</span>
                    )}
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleNext}
          disabled={isNextButtonDisabled()}
          className={`
            w-full mt-8 py-4 rounded-xl font-semibold transition-all duration-200
            ${!isNextButtonDisabled()
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {step === 1 ? 'Next' : 'Start Chat'}
        </button>
      </div>
    </div>
  );
};

export default ChatQuestionnaire;
