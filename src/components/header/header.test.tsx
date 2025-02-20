import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MutableSnapshot } from 'recoil';
import { renderWithTestRoots } from '@/app.test';
import { testEnglishDeck } from '@/models/mock/deck.mock';
import { paths } from '@/routing/paths';
import { userDecksState } from '@/state/user-decks';
import { Header } from './header';

describe('Header', () => {
  it('should render correctly with default props', () => {
    renderWithTestRoots(<Header />);
    expect(screen.queryByText('sign up')).toBeInTheDocument();
    expect(screen.queryByText('sign in')).toBeInTheDocument();
  });

  it('should route to view deck when dropdown option clicked', async () => {
    const testDeck = testEnglishDeck(0);
    const initRecoilState = (snapshot: MutableSnapshot) => {
      snapshot.set(userDecksState, [testDeck]);
    };
    const { history } = renderWithTestRoots(<Header />, { recoilState: initRecoilState });

    // type one letter of test deck title then click dropdown option
    userEvent.type(screen.getByRole('textbox'), testDeck.metaData.title.substring(0, 1));
    await waitFor(() => expect(screen.queryByText(testDeck.metaData.title)).toBeInTheDocument());
    fireEvent.click(screen.getByText(testDeck.metaData.title));

    expect(history.location.pathname).toBe(`${paths.deck}/${testDeck.metaData.id}`);
  });

  // todo: test sign up, sign in button functionality when hooked up
});
