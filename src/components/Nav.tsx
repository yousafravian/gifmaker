import styles from "./Nav.module.css";
import { Menu } from "lucide-react";
import { Button } from "@headlessui/react";
import ThemedSwitch from "../components/ThemedSwitch";
function NavBar() {
  return (
    <>
      <nav className="grid items-center pb-5 justify-between grid-cols-[minmax(200px,auto)_auto] md:grid-cols-[minmax(200px,auto)_auto_minmax(200px,auto)]">
        <h1 className="text-5xl font-bold letter">GifMaker</h1>
        <ul className="gap-5 lg:gap-10 hidden md:flex">
          <li className="cursor-pointer hover:bg-black-900">Home</li>
          <li className="cursor-pointer hover:bg-black-900">Contact</li>
          <li className="cursor-pointer hover:bg-black-900">About Us</li>
        </ul>
        <div className="text-right md:block">
          <span className="hidden md:inline-block">
            <ThemedSwitch />
          </span>
          <Button className="inline-flex md:hidden items-center gap-2 rounded bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
            <Menu />
          </Button>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
