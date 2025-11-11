import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";

import { Appearance, ColorSchemeName } from "react-native";

import { Colors } from "@/Constants/Colors";

export const ThemeContext = createContext(
  {} as {
    colorScheme: ColorSchemeName;
    setColorScheme: Dispatch<SetStateAction<ColorSchemeName>>;
    theme: typeof Colors.light | typeof Colors.dark;
  }
);


// ////////////////////////////////////////////////////////////////////

// type ThemeContextType = {
//   colorScheme: ColorSchemeName;
//   setColorScheme: Dispatch<SetStateAction<ColorSchemeName>>;
//   theme: typeof Colors.light | typeof Colors.dark;
// };

// export const ThemeContext = createContext<ThemeContextType>(
//   {} as ThemeContextType
// );

// ////////////////////////////////////////////////////////////////////


export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, theme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
