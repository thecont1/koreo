/*
 * koreo performance direction: route-level lazy loading keeps the first article
 * view focused, while each specimen and the Studio load only when requested.
 */
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const AuthoringStudio = lazy(() => import("./pages/AuthoringStudio"));
const CinqueTerre = lazy(() => import("./pages/CinqueTerre"));
const Home = lazy(() => import("./pages/Home"));
const Humahuaca = lazy(() => import("./pages/Humahuaca"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading koreo route"
      style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f7f5ef", color: "#292725" }}
    >
      <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>
        Loading koreo
      </span>
    </main>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
        <Route path="/" component={Humahuaca} />
        <Route path="/guide" component={Home} />
        <Route path="/author" component={AuthoringStudio} />
        <Route path="/cinque-terre" component={CinqueTerre} />
        <Route path="/humahuaca" component={Humahuaca} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
