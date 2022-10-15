import { v4 as uuidv4 } from 'uuid';
import { isBlankString } from '@/helpers/validator';
import { CardContent, createNewCardContent } from './card-content';
export interface Card {
  id?: number;
  position?: number;
  key: string;
  front: CardContent;
  back: CardContent;
  score: number;
  dateCreated: Date;
  dateUpdated: Date;
  dateTouched: Date;
}

export function createNewCard(): Card {
  return {
    front: createNewCardContent(),
    back: createNewCardContent(),
    key: uuidv4(),
    score: 0,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    dateTouched: new Date(),
  };
}

export function filterBlankCards(card: Card) {
  return !isBlankString(card.front.text) && !isBlankString(card.back.text);
}
