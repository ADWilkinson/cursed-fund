import { colors } from "styles/colors";

export const Tabs = {
  variants: {
    unstyled: () => ({
      tablist: {
        backgroundColor: "#fff",
        borderRadius: "1rem",
        color: colors.themeNavy,
        fontSize: "16px",
        fontWeight: "500",
        height: "45px",
        outline: "0",
      },
      tab: {
        _selected: {
          backgroundColor: colors.themeBlue,
          borderRadius: "1rem",
          color: colors.themeWhite,
        },
      },
    }),
  },
};
