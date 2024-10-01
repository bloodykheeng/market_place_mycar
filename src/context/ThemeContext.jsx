import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { PrimeReactContext } from "primereact/api"; // Import the context
import PrimeReact from "primereact/api";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  //   const [theme, setTheme] = useState("dark");
  const { changeTheme } = useContext(PrimeReactContext); // Access PrimeReact API through context

  const getThemeFromLocalStorage = () => {
    const linkId = "theme-link";
    console.log("current theme is : ", theme);
    changeTheme(`lara-light-blue`, `lara-${theme}-blue`, linkId, () => {
      const existingLinks = document.querySelectorAll(`link[id="${linkId}"]`);
      if (existingLinks.length > 1) {
        // Assuming that the first link is the old one and the new one is appended last,
        // we remove the first occurrence.
        document.head.removeChild(existingLinks[0]);
      }
    });
    return;
  };

  const changeMyTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    const linkId = "theme-link";
    changeTheme(`lara-${theme}-blue`, `lara-${newTheme}-blue`, linkId, () => {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      console.log("current theme in local storage : ", newTheme);
    });
    return;
  };

  let myTheme = theme;

  useEffect(() => {
    getThemeFromLocalStorage();
  }, []);

  const toggleTheme = () => {
    let currentTheme;
    if (theme === "light") {
      currentTheme = "dark";
    } else {
      currentTheme = "light";
    }

    // setTheme(currentTheme);
    // setTheme((current) => (current === "light" ? "dark" : "light"));
    changeMyTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
