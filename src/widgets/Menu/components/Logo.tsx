import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import Flex from "components/Box/Flex";
import { Box, Text } from "components";
import { MenuContext } from "../context";

interface Props {
  href: string;
  isMobile: boolean;
}

const blink = keyframes`
  0%,  100% { transform: scaleY(1); }
  50% { transform:  scaleY(0.1); }
`;

const StyledLink = styled("a")`
  display: flex;
  .mobile-icon {
    width: 48px;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: none;
    }
  }
  .desktop-icon {
    width: 48px;
    display: none;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: block;
    }
  }
  .eye {
    animation-delay: 20ms;
  }
  &:hover {
    .eye {
      transform-origin: center 60%;
      animation-name: ${blink};
      animation-duration: 350ms;
      animation-iteration-count: 1;
    }
  }
`;

const Logo: React.FC<React.PropsWithChildren<Props>> = ({ href, isMobile }) => {
  const { linkComponent } = useContext(MenuContext);
  const isAbsoluteUrl = href.startsWith("http");
  const innerLogo = (
    <>
      <img src="/images/logo.gif" alt="logo" className="desktop-icon" />
      <img src="/images/logo.gif" alt="logo" className="mobile-icon" />
    </>
  );

  return (
    <Flex alignItems="center">
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label="Pancake home page" target="_blank">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href={href} as={linkComponent} aria-label="Pancake home page">
          {innerLogo}
        </StyledLink>
      )}
      {!isMobile ? <StyledLink href={href} as={linkComponent} aria-label="Pancake home page">
        <Box>
          <Text color="white" fontSize="20px" bold>DEXTOP</Text>
        </Box>
      </StyledLink> : <></>}
    </Flex>
  );
};

export default React.memo(Logo);
