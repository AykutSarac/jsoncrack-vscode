import React from "react";
import { Anchor, Button, Image, Overlay, Stack, Text } from "@mantine/core";
import styled, { keyframes } from "styled-components";
import useConfig from "../../../../store/useConfig";

const shineEffect = keyframes`
  0% {
    transform: translateX(-120%) rotate(25deg);
    opacity: 0.5;
  }
  5% {
    opacity: 0.5;
    transform: translateX(-80%) rotate(25deg);
  }
  70% {
    transform: translateX(80%) rotate(25deg);
    opacity: 0.5;
  }
  80% {
    transform: translateX(120%) rotate(25deg);
    opacity: 0;
  }
  100% {
    transform: translateX(120%) rotate(25deg);
    opacity: 0;
  }
`;

const ShiningButton = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  border-radius: 0.5rem;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 35%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 65%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-120%) rotate(25deg);
    z-index: 20;
    pointer-events: none;
    animation: ${shineEffect} 4s ease-out infinite;
    transition: transform 0.2s ease-out;
  }
`;

export const NotSupported = () => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  return (
    <Overlay
      backgroundOpacity={0.8}
      color={darkmodeEnabled ? "gray" : "rgb(226, 240, 243)"}
      blur="1.5"
      center
    >
      <Stack maw="90%" align="center" justify="center" gap="sm">
        <Text fz="48" fw={600} c="bright" ta="center">
          Time to upgrade!
        </Text>
        <Text ta="center" size="lg" fw={500} c="gray" maw="600">
          This diagram is too large and not supported at JSON Crack.
          <br />
          Try{" "}
          <Anchor
            inherit
            c="teal"
            fw="500"
            href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=vscode"
            target="_blank"
            rel="noopener"
          >
            ToDiagram
          </Anchor>{" "}
          for larger diagrams and more features.
        </Text>
        <ShiningButton style={{ marginTop: "16px", position: "relative" }}>
          <Button
            component="a"
            href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=data_limit"
            rel="noopener"
            size="lg"
            w="200"
            target="_blank"
            color="teal"
          >
            Try now &rarr;
          </Button>
        </ShiningButton>
      </Stack>
    </Overlay>
  );
};
