import { useState } from "react";

import { Container, HiddenCheckbox, StyledCheckbox, Text } from "./styles";
import { IoCheckmarkOutline } from "react-icons/io5";

export function Checkbox({ children, checked, onClick, ...props }) {
    return (
        <Container
            checked={checked}
            onClick={onClick}
        >
            <HiddenCheckbox 
                checked={checked}
                onChange={onClick}
                {...props}
            />
            <StyledCheckbox checked={checked}>
                <IoCheckmarkOutline size={20}/>
            </StyledCheckbox>
            <Text checked={checked} > {children} </Text>
        </Container>
    );
}