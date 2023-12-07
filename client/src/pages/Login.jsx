import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <h1 className="text-3xl text-center font-semibold my-7">Login</h1>
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
          <label className="font-medium">Email</label>
          <input
            type="email"
            id="email"
            placeholder=" johndoe@gmail.com"
            className="border border-gray-300 rounded-md p-1 outline-none"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Password</label>
          <input
            type="password"
            id="password"
            placeholder=" ********"
            className="border border-gray-300 rounded-md p-1 outline-none"
            onChange={handleChange}
            required
          />
        </div>
        <button
          disabled={loading}
          className="bg-black text-white rounded-lg p-2 mt-3 font-semibold hover:bg-gray-700"
        >
          {loading ? "Loading..." : "LOGIN"}
        </button>
        <OAuth />
        <p className="text-center">
          Dont have an account? &nbsp;
          <Link to="/signin" className="font-semibold text-sm underline">
            Sign Up
          </Link>
        </p>
        <p className="text-center mb-1">
          <Link
            to="/forgot-password"
            className="font-semibold text-sm underline"
          >
            Forgot Password
          </Link>
        </p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
