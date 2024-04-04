import { ThemeProvider } from '@/components/dark-mode/theme-provider';
import './index.css';
import { ModeToggle } from './components/dark-mode/mode-toggle';
import { Game } from './components/board/Game';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle />
            <Game />
            <SpeedInsights />
        </ThemeProvider>
    );
};
