/*
 * koreo Field Manual direction: warm mineral paper, charcoal ink, oxide-red
 * focus marks, strict coordinate labels, and an asymmetric documentation rail.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthoringStudio from "./pages/AuthoringStudio";
import CinqueTerre from "./pages/CinqueTerre";
import Home from "./pages/Home";
import Humahuaca from "./pages/Humahuaca";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Humahuaca} />
      <Route path="/guide" component={Home} />
      <Route path="/author" component={AuthoringStudio} />
      <Route path="/cinque-terre" component={CinqueTerre} />
      <Route path="/humahuaca" component={Humahuaca} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
