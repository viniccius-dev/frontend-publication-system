// import { useState, useEffect } from "react";

// import { Container, SelectButton, Chevrons, OptionList, Option } from "./styles";
// import { FiCheck, FiChevronUp } from "react-icons/fi";

// export function InputSelect({ title, group, options, onSelect, selected, objectValue }) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedOption, setSelectedOption] = useState(selected || null);

//     const toggleDropdown = () => {
//         setIsOpen(!isOpen);
//     };

//     const handleSelect = (option) => {
//         setSelectedOption(option);
//         setIsOpen(false);
//         onSelect(option);
//     };

//     useEffect(() => {
//         setSelectedOption(selected || null);
//     }, [selected]);

//     return (
//         <Container>
//             <SelectButton onClick={toggleDropdown}>
//                 <div>
//                     {selectedOption && Object.keys(selectedOption).length > 0 
//                     ? selectedOption[objectValue] 
//                     : title}
//                 </div>

//                 <Chevrons data-is-open={isOpen}>
//                     <FiChevronUp />
//                 </Chevrons>
//             </SelectButton>

//             <OptionList data-is-open={isOpen}>
//                 {options.map(option => (
//                     <Option key={option.id} onClick={() => handleSelect(option)}>
//                                 <input 
//                                     type="radio"
//                                     name={group}
//                                     value={option[objectValue]}
//                                     checked={!!(selectedOption && selectedOption[objectValue] === option[objectValue])}
//                                     readOnly
//                                 />
//                         <span>{option[objectValue]}</span>
//                         {selectedOption && selectedOption[objectValue] === option[objectValue] && <FiCheck /> }
//                     </Option>
//                 ))}
//             </OptionList>
//         </Container>
//     );
// }




import { useState, useEffect } from "react";
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
        <div className="relative select-none mb-2">
            {/* Select Button */}
            <div
                onClick={toggleDropdown}
                className="
                    h-12 flex items-center justify-between px-3
                    rounded-xl bg-[#2D2D2D] text-white
                    shadow-md shadow-black/40
                    cursor-pointer transition-all duration-200
                    hover:bg-[#353535] hover:shadow-lg
                "
            >
                <div className="text-sm font-medium">
                    {selectedOption && Object.keys(selectedOption).length > 0 
                        ? selectedOption[objectValue] 
                        : title}
                </div>

                <div 
                    className={`
                        text-white text-xl transition-transform duration-300 ease-in-out
                        ${isOpen ? 'rotate-180' : 'rotate-0'}
                    `}
                >
                    <FiChevronUp />
                </div>
            </div>

            {/* Option List */}
            <div
                className={`
                    absolute w-full mt-1 z-20
                    rounded-xl bg-[#E5E5E5] text-[#1A1A1A]
                    overflow-y-auto transition-all duration-300 ease-in-out
                    shadow-lg
                    ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                {options.map((option, index) => (
                    <div
                        key={option.id}
                        onClick={() => handleSelect(option)}
                        className={`
                            flex items-center gap-2 relative px-3 py-3
                            cursor-pointer transition-all duration-200
                            ${selectedOption && selectedOption[objectValue] === option[objectValue]
                                ? 'bg-[#4A4A4A] text-[#D4A574]'
                                : 'hover:bg-[#4A4A4A] hover:text-[#D4A574]'
                            }
                            ${index !== options.length - 1 ? 'border-b border-[#F5F5F5]' : ''}
                        `}
                    >
                        <input 
                            type="radio"
                            name={group}
                            value={option[objectValue]}
                            checked={!!(selectedOption && selectedOption[objectValue] === option[objectValue])}
                            readOnly
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        
                        <span className="text-sm font-medium">
                            {option[objectValue]}
                        </span>
                        
                        {selectedOption && selectedOption[objectValue] === option[objectValue] && (
                            <FiCheck className="ml-auto text-[#D4A574] transition-all duration-200" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}