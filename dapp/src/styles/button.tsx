export const Button = {
  baseStyle: {
    border: "2px solid",
    fontSize: "md",
    fontWeight: "bold",
    px: 6,
    py: 4,
    _disabled: {
      backgroundColor: "#FCF6EE",
      borderColor: "#040728",
      color: "#040728",
    },
  },
  variants: {
    blue: {
      backgroundColor: "#025BEE",
      borderColor: "#025BEE",
      color: "#FFFFFF",
    },
    navy: {
      backgroundColor: "#040728",
      borderColor: "#040728",
      color: "#FFFFFF",
    },
  },
  defaultProps: {
    variant: "blue",
  },
};
