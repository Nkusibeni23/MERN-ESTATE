import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="flex-1 px-4 py-6 mx-2 my-4 overflow-hidden bg-white rounded-lg shadow-xl ">
      <h1 className="text-3xl font-bold flex justify-center items-start my-6">
        Profile
      </h1>
      <form
        className="flex flex-col gap-y-4 w-full max-w-md mx-auto"
        action="/profile/update"
        method="POST"
      >
        <img
          src={currentUser.avatar}
          alt="profile"
          className="object-cover object-center h-32 w-28 rounded-full border-gray-200 cursor-pointer self-center"
        />
        <input
          type="text"
          id="username"
          placeholder="Your Username...."
          className="outline-none border-2 border-gray-200 rounded-lg py-2 px-2"
        />
        <input
          type="text"
          id="email"
          placeholder="Your Email 
        "
          className="outline-none border-2 border-gray-200 rounded-lg py-2 px-2"
        />
        <input
          type="text"
          id="password"
          placeholder="Your Password
        "
          className="outline-none border-2 border-gray-200 rounded-lg py-2 px-2"
        />
        <button
          type="submit"
          className="w-full bg-gray-800 rounded-lg px-8 py-2 text-white text-md uppercase font-semibold tracking-wide
        transition ease-in duration-200 text-transform cursor-pointer"
        >
          Save Changes
        </button>
        <div className="flex justify-between">
          <span className="align-middle cursor-pointer text-red-500 select-none relative whitespace-no-wrap text-sm leading-5">
            Delete Account
          </span>
          <span className="align-middle cursor-pointer text-red-500 select-none relative whitespace-no-wrap text-sm leading-5 flex items-center gap-1">
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
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Sign Out
          </span>
        </div>
      </form>
    </div>
  );
}
