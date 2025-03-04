import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from '@/helpers/func';
import { Card, createNewCard } from '@/models/card';
import { getTestFoxCard } from '@/models/mock/card.mock';
import { Flashcard } from './flashcard';

describe('Flashcard', () => {
  it('should render correctly when inactive', () => {
    const testCard = getTestFoxCard();
    render(<Flashcard variant="inactive" card={testCard} onCardChange={noop} onFocus={noop} />);
    expect(screen.queryByDisplayValue(testCard.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testCard.back.text)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'speaker' }).length).toEqual(0);
    expect(screen.queryAllByRole('button', { name: 'kebab-menu' }).length).toEqual(0);
  });

  it('should render correctly when active', () => {
    const testCard = getTestFoxCard();
    render(<Flashcard variant="active" card={testCard} onCardChange={noop} onFocus={noop} />);
    expect(screen.queryByDisplayValue(testCard.front.text)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(testCard.back.text)).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: 'speaker' }).length).toEqual(0);
    expect(screen.queryAllByRole('button', { name: 'kebab-menu' }).length).toEqual(2);
  });

  it('should show placeholder when card is empty', () => {
    render(
      <Flashcard variant="active" card={createNewCard()} onCardChange={noop} onFocus={noop} />
    );
    expect(screen.queryByPlaceholderText('add term')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('add definition')).toBeInTheDocument();
  });

  it('should swap the card faces on term swap click', () => {
    const mockOnCardChange = jest.fn<void, [Card]>();
    const card = createNewCard();
    const termText = 'termText';
    const definitionText = 'definitionText';
    card.front.text = termText;
    card.back.text = definitionText;

    render(
      <Flashcard variant="active" card={card} onCardChange={mockOnCardChange} onFocus={noop} />
    );

    userEvent.click(screen.getAllByRole('button', { name: 'kebab-menu' })[1]);
    userEvent.click(screen.getByText('swap with term'));

    expect(mockOnCardChange).toHaveBeenCalled();

    const newCard = mockOnCardChange.mock.calls[0][0];
    expect(newCard.front.text).toEqual(definitionText);
    expect(newCard.back.text).toEqual(termText);
  });

  it('should swap the card faces on definition swap click', () => {
    const mockOnCardChange = jest.fn<void, [Card]>();
    const card = createNewCard();
    const termText = 'termText';
    const definitionText = 'definitionText';
    card.front.text = termText;
    card.back.text = definitionText;

    render(
      <Flashcard variant="active" card={card} onCardChange={mockOnCardChange} onFocus={noop} />
    );

    userEvent.click(screen.getAllByRole('button', { name: 'kebab-menu' })[0]);
    userEvent.click(screen.getByText('swap with definition'));

    expect(mockOnCardChange).toHaveBeenCalled();

    const newCard = mockOnCardChange.mock.calls[0][0];
    expect(newCard.front.text).toEqual(definitionText);
    expect(newCard.back.text).toEqual(termText);
  });
});
