import React, { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FlipTile } from '@/components/flip-tile/flip-tile';
import { noop } from '@/helpers/func';
import './study-flashcard.scss';

interface StudyFlashcardProps {
  frontContent: ReactNode;
  backContent: ReactNode;
  activeSide: 'front' | 'back';
  variant: 'light' | 'dark';
  cardFaceClass?: string;
  frontLabel?: string;
  backLabel?: string;
  id: string;
}

export const StudyFlashcard = ({
  frontContent,
  frontLabel = '',
  cardFaceClass = '',
  backContent,
  backLabel = '',
  activeSide,
  variant,
  id,
}: StudyFlashcardProps) => {
  // TODO: Allow card to be flippable, but reset on the content changes
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        key={id}
        initial={{ x: 15, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -15, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <FlipTile
          className="study-card"
          isFlipped={activeSide !== 'front'}
          front={getCardFace(frontContent, frontLabel)}
          frontClassName={'study-card-front dark'}
          back={getCardFace(backContent, backLabel)}
          onClick={noop}
        />
      </motion.div>
    </AnimatePresence>
  );

  function getCardFace(content: ReactNode, label: string) {
    return (
      <div className={`c-study-flashcard-content  ${variant} ${cardFaceClass}`}>
        <label className="c-study-flashcard-side-label">{label}</label>
        <div className="c-study-flashcard-text">{content}</div>
      </div>
    );
  }
};
