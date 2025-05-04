import { ChangeEvent } from "react";

interface UseConvertTabProps {
    inputValue: number;
    onInputChange?: (value: number) => void;
    dropdownValue: string;
    onDropdownChange: (value: string) => void;
    isReadOnly?: boolean;
}

export const useConvertTab = ({
    inputValue,
    onInputChange,
    dropdownValue,
    onDropdownChange,
    isReadOnly = false,
}: UseConvertTabProps) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isReadOnly && onInputChange) {
            onInputChange(Number(event.target.value));
        }
    };

    const handleDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onDropdownChange(event.target.value);
    };

    return {
        handleInputChange,
        handleDropdownChange,
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
