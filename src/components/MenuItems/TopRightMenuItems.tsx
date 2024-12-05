/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, memo } from "react";
import styled from 'styled-components'
import isTouchDevice from "utils/isTouchDevice";
import { Flex } from "../Box";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import TopMenuItem from "../MenuItem/TopMenuItem";
import { MenuItemsProps } from "./types";

const StyledFlex = styled(Flex)`
  margin-left: 4px;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  border 1px solid ${({ theme }) => theme.colors.textDisabled};
  background: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
`

const TopMenuItems: React.FC<React.PropsWithChildren<MenuItemsProps>> = ({
  items = [],
  activeItem,
  activeSubItem,
  ...props
}) => {
  return (
    <StyledFlex {...props}>
      {items.map(({ label, items: menuItems = [], href, icon, disabled }) => {
        const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color;
        const isActive = activeItem === href;
        const linkProps = isTouchDevice() && menuItems && menuItems.length > 0 ? {} : { href };
        const Icon = icon;
        const hasSubItem = menuItems?.length > 0;
        return (
          <DropdownMenu
            key={`${label}#${href}`}
            items={menuItems}
            py={1}
            activeItem={activeSubItem}
            isDisabled={disabled}
          >
            <TopMenuItem {...linkProps} hasSubItem={hasSubItem} isActive={isActive} statusColor={statusColor} isDisabled={disabled}>
              {label || (icon && createElement(Icon as any, { color: isActive ? "secondary" : "textSubtle" }))}
            </TopMenuItem>
          </DropdownMenu>
        );
      })}
    </StyledFlex>
  );
};

export default memo(TopMenuItems);
