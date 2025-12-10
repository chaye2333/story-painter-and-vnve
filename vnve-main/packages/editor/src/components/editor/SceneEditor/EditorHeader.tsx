import { Icons } from "@/components/icons";
import { useEditorStore } from "@/store";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/plate-ui/button";

export function EditorHeader() {
  const project = useEditorStore((state) => state.project);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Initialize dark mode based on html class or system preference
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    if (!document.documentElement.classList.contains("dark") && !document.documentElement.classList.contains("light")) {
        // Default to light if not set
        document.documentElement.classList.add("light");
        setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  const goHome = () => {
    window.location.href = "/?no_intro=true";
  };

  return (
    <header className="sticky top-0 z-10 flex h-[53px] items-center justify-between gap-1 border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={goHome} className="gap-2">
           <ArrowLeft className="h-4 w-4" />
           Back to Home
        </Button>
        <h1 className="text-xl font-bold">
                    VNVE
                    {project && (
            <span className="text-xs text-muted-foreground ml-2">
                // {project.name}
            </span>
            )}
        </h1>
      </div>

      <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Icons.gitHub
            className="size-5 cursor-pointer"
            onClick={() => {
            window.location.href = "https://github.com/vnve/vnve";
            }}
          ></Icons.gitHub>
      </div>
    </header>
  );
}
