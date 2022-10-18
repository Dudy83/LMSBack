import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';
import { TextInput, Flex, Box } from '@strapi/design-system';

const ColorWindow = styled.div`
  background-color: ${(props) => props.color};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 4px;
  margin-left: 4px;
  cursor: pointer;
  border: 1px solid rgb(212 212 212);
`;

const PopOver = styled.div`
  position: absolute;
  z-index: 2;
  top: 70px;
  right: 0px;
`;

const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const ColorPicker = (props) => {
    const {
        name,
        value,
        attribute,
        onChange
    } = props

    const {
        placeholder,
        label,
        hint
    } = attribute.customFieldConfig || {}

    const [showPicker, setShowPicker] = useState(false);
    const [color, setColor] = useState(value);

    /**
     * Handle color change from the the color picker
     * @param {string} color - in hex format
     */
    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    return (
        <Flex alignItems="end" position="relative">
            <Box width="100%">
                <TextInput
                    id={name}
                    placeholder={placeholder}
                    label={label || name}
                    name={name}
                    hint={hint}
                    value={value}
                    onClick={() => setShowPicker(true)}
                />
            </Box>


            <Box>
                <ColorWindow color={color} onClick={() => setShowPicker(true)} />
            </Box>
            {showPicker ? (
                <PopOver>
                    <Cover onClick={() => setShowPicker(false)} />
                    <ChromePicker
                        color={color}
                        onChange={e => {
                            console.log(e)
                            const arg = {
                                target: {
                                    name,
                                    value: e.hex
                                }
                            }
                            handleChangeComplete(e)
                            onChange(arg)
                        }}
                    />
                </PopOver>
            ) : null}
        </Flex>
    );
};

export default ColorPicker;