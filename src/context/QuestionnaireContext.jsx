// src/context/QuestionnaireContext.jsx
import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const QuestionnaireContext = createContext();

const initialState = {
  answers: {},
  currentQuestion: 0,
  results: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer
        }
      };
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestion: action.questionId
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.results
      };
    default:
      return state;
  }
}

export function QuestionnaireProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <QuestionnaireContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

QuestionnaireProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire debe usarse dentro de un QuestionnaireProvider');
  }
  return context;
}