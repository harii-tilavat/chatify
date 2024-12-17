import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-base-100 rounded-lg shadow sticky" style={{ top: "100vh" }}>
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="flex flex-col sm:flex-row  items-center sm:justify-between gap-4">
          <Link className="flex shrink-0 items-center gap-1" to={"/"}>
            {/* <img alt="Your Company" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500" className="h-8 w-auto" /> */}
            <span className="h-10 w-10 text-blue-500">
              <MessageCircle />
            </span>
            <span className="text-blue-500 dark:text-blue-100 rounded-md px-3 py-2 text-lg font-medium">Chatify</span>
          </Link>

          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="https://github.com/harii-tilavat" className="hover:underline me-4 md:me-6">
                Github
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/harit-tilavat-8a6888214/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500  text-center dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <a href="https://hariitilavat.web.app/" className="hover:underline text-blue-500" target="_blank">
            Harit Tilavat
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
