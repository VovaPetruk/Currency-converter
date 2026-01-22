import { ChangeEvent } from "react";

interface UseConvertTabProps {
    inputValue: number;
    onInputChange?: (value: number) => void;
    dropdownValue: string;
    onDropdownChange: (value: string) => void;
    isReadOnly?: boolean;
}

/**
 * Хук для управління станом вкладки конвертера
 * Об'єднує логіку зміни значення в інпуті та вибору одиниці виміру
 */
export const useConvertTab = ({
    inputValue,
    onInputChange,
    dropdownValue,
    onDropdownChange,
    isReadOnly = false,
}: UseConvertTabProps) => {
    /**
     * Обробник зміни значення в текстовому полі
     * Перетворює введене значення в number та викликає callback,
     * якщо поле не в режимі лише для читання
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isReadOnly && onInputChange) {
            onInputChange(Number(event.target.value));
        }
    };

    /**
     * Обробник зміни вибраного значення в випадаючому списку
     */
    const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onDropdownChange(event.target.value);
    };

    return {
        // Обробники подій
        handleInputChange,
        handleDropdownChange,

        // Готові пропси для елементів форми
        inputProps: {
            value: inputValue,
            readOnly: isReadOnly,
            onChange: handleInputChange,
        },

        dropdownProps: {
            value: dropdownValue,
            onChange: handleDropdownChange,
        },
    };
};
