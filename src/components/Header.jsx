import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="shadow-md">
      <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <Link to="/">
          <h1 className="flex font-semibold text-sm sm:text-xl flex-wrap">
            <span className="text-red-400">Nkusi</span>
            <span className="text-black-600">Estate</span>
          </h1>
        </Link>
        <form className="border border-gray-300 rounded-full p-1 py-1 flex items-center">
          <input
            type="text"
            name="search"
            id="search"
            className="bg-transparent outline-none text-sm sm:text-lg w-24 sm:w-64"
            placeholder="  Search..."
          />
          <div className="text-white bg-red-500 rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </form>
        <ul className="flex gap-4 cursor-pointer">
          <Link to="/">
            <li className="hidden sm:inline hover:underline font-medium">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline hover:underline font-medium">
              About
            </li>
          </Link>
          <Link to="/signin">
            <li className=" hover:underline font-medium">Sign in</li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
