// import { useState } from "react";

// import { Container, HiddenCheckbox, StyledCheckbox, Text } from "./styles";
// import { IoCheckmarkOutline } from "react-icons/io5";

// export function Checkbox({ children, checked, onClick, ...props }) {
//     return (
//         <Container
//             checked={checked}
//             onClick={onClick}
//         >
//             <HiddenCheckbox 
//                 checked={checked}
//                 onChange={onClick}
//                 {...props}
//             />
//             <StyledCheckbox checked={checked}>
//                 <IoCheckmarkOutline size={20}/>
//             </StyledCheckbox>
//             <Text checked={checked} > {children} </Text>
//         </Container>
//     );
// }


import { IoCheckmarkOutline } from "react-icons/io5";

export function Checkbox({ children, checked, onClick, ...props }) {
    return (
        <div
            className={`
                cursor-pointer w-[150px] h-[35px] my-2.5 rounded-lg
                flex items-center px-2 gap-2
                transition-all duration-300 ease-in-out
                ${checked 
                    ? 'bg-[#FF5400] shadow-md shadow-orange-500/30' 
                    : 'bg-[#D9D9D9] hover:bg-[#C9C9C9]'
                }
            `}
            onClick={onClick}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={onClick}
                className="sr-only"
                {...props}
            />
            
            <div 
                className={`
                    w-6 h-6 rounded-full bg-white
                    flex items-center justify-center
                    transition-all duration-300
                    ${checked ? 'scale-100 rotate-0' : 'scale-90'}
                `}
            >
                <IoCheckmarkOutline 
                    size={20}
                    className={`
                        text-[#FF5400] transition-all duration-200
                        ${checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                    `}
                />
            </div>
            
            <label 
                className={`
                    cursor-pointer select-none text-sm font-medium
                    transition-colors duration-300
                    ${checked ? 'text-white' : 'text-[#555]'}
                `}
            >
                {children}
            </label>
        </div>
    );
}