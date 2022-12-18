import { useEffect, useState } from 'react'

export default function useColorScheme () {

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches)
  
      const handleMediaQueryChange = (event) => {
        setIsDarkMode(event.matches)
      };
  
      mediaQuery.addEventListener('change', handleMediaQueryChange)
  
      return () => {
        mediaQuery.removeEventListener('change', handleMediaQueryChange)
      };
    }, [])
  return isDarkMode ? 'dark': 'light'
}
