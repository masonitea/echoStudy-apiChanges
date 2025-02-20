import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Fade } from '@/animations/fade';
import { MicrophoneIcon } from '@/assets/icons/microphone-icon/microphone-icon';
import nextCardSound from '@/assets/sounds/next-card.wav';
import { AudioControlBar } from '@/components/audio-control-bar/audio-control-bar';
import { PageHeader } from '@/components/page-header/page-header';
import { ProgressBar } from '@/components/progress-bar/progress-bar';
import { StudyFlashcard } from '@/components/study-flashcard/study-flashcard';
import { useIsFirstRender } from '@/hooks/use-is-first-render';
import { usePlayLesson } from '@/hooks/use-play-lesson';
import { useStopWatch } from '@/hooks/use-stop-watch';
import { Deck } from '@/models/deck';
import { LazyAudio } from '@/models/lazy-audio';
import { LessonCard, LessonCardOutcome } from '@/models/lesson-card';
import { StudyConfiguration } from '@/pages/_shared/study-config-popup/study-config-popup';
import './study-lesson-page.scss';

interface StudyPageLessonProps {
  deck: Deck;
  studyConfig: StudyConfiguration;
  onLessonComplete: (lessonCards: LessonCard[], lessonTime: number) => void;
}

export const StudyLessonPage = ({ deck, studyConfig, onLessonComplete }: StudyPageLessonProps) => {
  const isFirstRender = useIsFirstRender();
  const [isPaused, setIsPaused] = useState(true);
  const { startStopWatch, pauseStopWatch, getElapsedTime } = useStopWatch();
  const [hasLessonStarted, setHasLessonStarted] = useState(false);
  const {
    currentCard,
    activeCardSide,
    completedCards,
    isCapturingSpeech,
    pause,
    play,
    skip,
    replay,
  } = usePlayLesson({
    deck,
    studyConfig,
  });

  const numCards = Math.min(studyConfig.maxCards ?? 5, deck.cards.length); // coerce to <= deck length
  const percentComplete = (completedCards.length / numCards) * 100;

  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    const nextCardAudio = new LazyAudio(nextCardSound);
    nextCardAudio.play();
  }, [currentCard.key, hasLessonStarted]);

  const showCover = !hasLessonStarted;

  return (
    <div className="study-lesson-page">
      <PageHeader label={deck.metaData.title} />
      <div className="study-lesson-page-content">
        <div className="study-flashcard-container">
          <div className="pulsing-microphone-container">
            <AnimatePresence>
              {isCapturingSpeech && (
                <Fade fadeIn={true}>
                  <div className="pulsing-microphone">
                    <MicrophoneIcon />
                  </div>
                </Fade>
              )}
            </AnimatePresence>
          </div>
          {showCover ? getCover() : getCard()}
          <ProgressBar
            variant="white"
            percent={percentComplete}
            label=""
            className="study-page-progress-bar"
            onAnimationComplete={handleProgressBarAnimationCompletion}
          />
        </div>
        <AudioControlBar
          isPaused={isPaused}
          onNextClick={handleNextClick}
          onPlayClick={handlePlayClick}
          onPauseClick={handlePauseClick}
          onPreviousClick={handleReplayClick}
        />
      </div>
    </div>
  );

  function getCover() {
    return (
      <StudyFlashcard
        id="cover"
        variant="dark"
        frontContent={deck.metaData.title}
        backContent=""
        backLabel=""
        frontLabel=""
        activeSide="front"
      />
    );
  }

  function getCard() {
    const cardFaceClasses: Record<LessonCardOutcome, string> = {
      correct: 'correct-card-face',
      incorrect: 'incorrect-card-face',
      unseen: '',
    };
    const cardFaceClass = cardFaceClasses[currentCard.outcome];

    return (
      <StudyFlashcard
        id={currentCard.key}
        variant="light"
        cardFaceClass={cardFaceClass}
        frontContent={currentCard.front.text}
        backContent={currentCard.back.text}
        backLabel="definition"
        frontLabel="term"
        activeSide={activeCardSide}
      />
    );
  }

  function handleReplayClick() {
    if (!hasLessonStarted) {
      return setHasLessonStarted(true);
    }
    replay();
  }

  function handleNextClick() {
    if (!hasLessonStarted) {
      return setHasLessonStarted(true);
    }
    skip();
  }

  function handlePlayClick() {
    setHasLessonStarted(true);
    startStopWatch();
    setIsPaused(false);
    play();
  }

  function handlePauseClick() {
    setIsPaused(true);
    pauseStopWatch();
    pause();
  }

  function handleProgressBarAnimationCompletion() {
    if (isLessonComplete()) {
      const lessonCards = completedCards.reverse();
      const lessonTime = getElapsedTime();
      onLessonComplete(lessonCards, lessonTime);
      pause(); // avoids lingering audio if manually clicked to completion
    }
  }

  function isLessonComplete() {
    return numCards === completedCards.length;
  }
};
