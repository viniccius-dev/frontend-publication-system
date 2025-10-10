import { useState, useEffect } from "react";

import { Container, SelectButton, Chevrons, OptionList, Option } from "./styles";
import { FiCheck, FiChevronUp } from "react-icons/fi";

export function InputSelect({ title, group, options, onSelect, selected, objectValue }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(selected || null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option);
    };

    useEffect(() => {
        setSelectedOption(selected || null);
    }, [selected]);

    return (
        <Container>
            <SelectButton onClick={toggleDropdown}>
                <div>
                    {selectedOption && Object.keys(selectedOption).length > 0 
                    ? selectedOption[objectValue] 
                    : title}
                </div>

                <Chevrons data-is-open={isOpen}>
                    <FiChevronUp />
                </Chevrons>
            </SelectButton>

            <OptionList data-is-open={isOpen}>
                {options.map(option => (
                    <Option key={option.id} onClick={() => handleSelect(option)}>
                        <input 
                            type="radio"
                            name={group}
                            value={option[objectValue]}
                            checked={selectedOption && selectedOption[objectValue] === option[objectValue]}
                            readOnly
                        />
                        <span>{option[objectValue]}</span>
                        {selectedOption && selectedOption[objectValue] === option[objectValue] && <FiCheck /> }
                    </Option>
                ))}
            </OptionList>
        </Container>
    );
}