import { Link } from "react-router-dom";

export default function Signin() {
  return (
    <div>
      <div className="flex items-center justify-center">
        <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      </div>
      <form
        className="
        max-w-md mx-auto
        flex flex-col gap-4
        border border-gray-400
        p-8
        rounded-2xl
        shadow-lg
      "
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username..."
            className="border border-gray-300 rounded-md p-1 outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Email</label>
          <input
            type="email"
            id="email"
            placeholder="johndoe@gmail.com"
            className="border border-gray-300 rounded-md p-1 outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Password</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            className="border border-gray-300 rounded-md p-1 outline-none"
          />
        </div>
        <button className="bg-black text-white rounded-lg p-2 mt-3 font-semibold hover:bg-gray-700">
          SIGN UP
        </button>
        <p className="text-center text-sm">
          Already have an account? &nbsp;
          <Link to="/" className=" text-sm font-medium underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
