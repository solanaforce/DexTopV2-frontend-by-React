import { darkColors, lightColors } from "theme/colors";
import { vars } from "theme/css/vars.css";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: lightColors.background,
  text: lightColors.text,
  boxShadow: vars.shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: darkColors.background,
  text: darkColors.text,
  boxShadow: vars.shadows.tooltip,
};
