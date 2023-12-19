/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // Update searchTerm using setSearchTerm
    }
  }, [location.search]);

  return (
    <header className="shadow-md">
      <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <Link to="/">
          <h1 className="flex flex-wrap">
            <span className="text-indigo-500 font-semibold">Nkusi</span>
            <span className="text-black-600 font-medium">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className=" border border-gray-500 rounded-full p-3 py-2 flex items-center justify-between cursor-pointer"
        >
          <input
            type="text"
            name="search"
            id="search"
            className="bg-transparent outline-none text-sm sm:text-lg w-24 sm:w-60 placeholder:text-gray-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="flex text-white bg-indigo-600 rounded-full p-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
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
          <Link to="/profile" className="font-medium hover:underline">
            {currentUser ? (
              <>
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="w-8 h-8 rounded-2xl object-cover"
                />
              </>
            ) : (
              <li>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
