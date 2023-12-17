import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/Index");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
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
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="username...."
            className="border border-gray-300 rounded-md p-1 outline-none focus:ring-1 focus:ring-indigo-400 placeholder:px-1"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Email</label>
          <input
            type="email"
            id="email"
            placeholder="johndoe@gmail.com"
            className="border border-gray-300 rounded-md p-1 outline-none focus:ring-1 focus:ring-indigo-400 placeholder:px-1"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Password</label>
          <input
            type="password"
            id="password"
            placeholder="*********"
            className="border border-gray-300 rounded-md p-1 outline-none focus:ring-1 focus:ring-indigo-400 placeholder:px-1"
            onChange={handleChange}
            required
          />
        </div>
        <button
          disabled={loading}
          className="bg-black text-white rounded-lg p-2 mt-3 font-semibold hover:bg-gray-700"
        >
          {loading ? "Loading..." : "SIGN IN"}
        </button>
        <OAuth />
        <p className="text-center text-sm">
          Already have an account? &nbsp;
          <Link to="/login" className="text-sm font-bold underline">
            Login
          </Link>
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
