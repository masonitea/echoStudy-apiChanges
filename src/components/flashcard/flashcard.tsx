import React, { useEffect, useRef } from 'react';
import { Card } from '@/models/card';
import { CardContent } from '@/models/card-content';
import { CardFace } from './card-face/card-face';
import './flashcard.scss';

interface FlashcardProps {
  card: Card;
  variant: 'active' | 'inactive';
  onCardChange: (card: Card) => void;
  onFocus: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export const Flashcard = ({ variant, card, onCardChange, onFocus }: FlashcardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => scrollIntoViewIfActive(), [variant]);

  return (
    <div ref={cardRef} className={`flashcard ${variant}`}>
      <CardFace
        variant={variant}
        placeholder="add term"
        changeLanguageLabel="term language"
        swapContentLabel="swap with definition"
        cardContent={card.front}
        onFocus={onFocus}
        onChange={handleFrontFaceChange}
        onSwapContentClick={handleSwapContentClick}
      />
      <CardFace
        variant={variant}
        placeholder="add definition"
        changeLanguageLabel="definition language"
        swapContentLabel="swap with term"
        className="back"
        cardContent={card.back}
        onFocus={onFocus}
        onChange={handleBackFaceChange}
        onSwapContentClick={handleSwapContentClick}
      />
    </div>
  );

  function handleFrontFaceChange(cardContent: CardContent) {
    onCardChange({ ...card, front: cardContent });
  }

  function handleBackFaceChange(cardContent: CardContent) {
    onCardChange({ ...card, back: cardContent });
  }

  function isCardInViewPort(cardDiv: HTMLDivElement) {
    const { top, bottom } = cardDiv.getBoundingClientRect();
    return bottom >= 0 && top <= (window.innerHeight || document.documentElement.clientHeight);
  }

  function handleSwapContentClick() {
    const newCardFront = { ...card.back };
    const newCardBack = { ...card.front };
    const newCard = { ...card, front: newCardFront, back: newCardBack };
    onCardChange(newCard);
  }

  function scrollIntoViewIfActive() {
    if (cardRef.current == null || variant !== 'active') {
      return;
    }

    if (!isCardInViewPort(cardRef.current)) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }
};
