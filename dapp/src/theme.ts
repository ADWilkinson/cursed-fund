import { Button } from "styles/button";
import { colors } from "styles/colors";
import { fonts } from "styles/fonts";
import { global } from "styles/global";
import { Heading } from "styles/heading";
import { Tabs } from "styles/tabs";
import { Text } from "styles/text";

import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,
};

const components = {
  Button,
  Heading,
  Tabs,
  Text,
  Alert: {
    variants: {
      subtle: (props) => {
        // only applies to `subtle` variant
        return {
          container: {
            bg: colors.themeOldlace, // or literal color, e.g. "#0984ff"
          },
        };
      },
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  components,
  fonts,
  styles: { global },
});

export default theme;
