import React, { ReactNode, useState } from 'react';
import { SwapIcon } from '@/assets/icons/swap-icon/swap-icon';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import { KebabMenu } from '@/components/kebab-menu/kebab-menu';
import { LanguageDropDown } from '@/components/language-drop-down/drop-down-options/language-drop-down';
import { AllCardLanguages, CardLanguage } from '@/models/language';
import './card-menu.scss';

const langDropdownId = 'lang';
const swapOptionId = 'swap';

const dropDownOptionIDs = [langDropdownId, swapOptionId] as const;
type CardMenuDropdownID = typeof dropDownOptionIDs[number];

interface CardFaceProps {
  language: CardLanguage;
  changeLanguageLabel: string;
  swapContentLabel: string;
  onLanguageChange: (language: CardLanguage) => void;
  onSwapContentClick: () => void;
}

export const CardMenu = ({
  language,
  changeLanguageLabel,
  swapContentLabel,
  onLanguageChange,
  onSwapContentClick,
}: CardFaceProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: DropDownOption<CardMenuDropdownID, ReactNode>[] = [
    { id: langDropdownId, focusable: false, value: getLanguageDropdownOption() },
    { id: swapOptionId, focusable: true, value: getSwapOption() },
  ];

  return (
    <KebabMenu
      className="c-card-menu"
      options={options}
      isOpen={isOpen}
      variant="blue"
      setIsOpen={setIsOpen}
      onOptionSelect={handleOptionSelect}
    />
  );

  function handleOptionSelect(option: DropDownOption<CardMenuDropdownID, ReactNode>) {
    if (option.id === swapOptionId) {
      onSwapContentClick();
      setIsOpen(false);
    }
  }

  function getLanguageDropdownOption() {
    return (
      <LanguageDropDown
        className="card-menu-language-dropdown"
        languages={AllCardLanguages}
        language={language}
        onLanguageSelect={onLanguageChange}
        label={changeLanguageLabel}
        variant="light"
      />
    );
  }

  function getSwapOption() {
    return (
      <div className="card-menu-swap-option">
        <SwapIcon variant="dark" className="card-menu-swap-icon" />
        {swapContentLabel}
      </div>
    );
  }
};
