import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemedSwitch() {
  function getDarkModeEnabled() {
    return JSON.parse(localStorage.getItem("DARKMODE") ?? "false");
  }

  const isDarkModeEnabled = getDarkModeEnabled();
  const [enabled, setEnabled] = useState(isDarkModeEnabled);

  useEffect(() => {
    if (enabled) {
      document.body.classList.add("dark");
      localStorage.setItem("DARKMODE", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.removeItem("DARKMODE");
    }
  }, [enabled]);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group relative flex h-7 w-14 cursor-pointer rounded-full  p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white bg-black/10 dark:bg-gray-300/10"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block size-5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7 bg-white dark:bg-gray-900`}
      >
        {!enabled ? (
          <Sun className="size-4 text-black dark:text-white absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]" />
        ) : (
          <Moon className="size-4 text-black dark:text-white absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]" />
        )}
      </span>
    </Switch>
  );
}
