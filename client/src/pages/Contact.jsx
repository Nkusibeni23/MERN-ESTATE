/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listings }) {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listings.userRef}`);
        console.log(res); // Log the response to the console
        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listings.userRef]);

  return (
    <>
      {landLord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className=" font-semibold">{landLord.username}</span>{" "}
            for{" "}
            <span className=" font-semibold">
              {listings.name.toLowerCase()}
            </span>
          </p>
          <textarea
            name="Message"
            id="message"
            cols="30"
            rows="2"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            className="w-full py-2 px-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
            0 sm:text-base"
          ></textarea>
          <Link
            to={`mailto:${landLord.email}?subject=Regarding ${listings.name}&body=${message}`}
            className=" bg-indigo-600 p-3 text-white font-medium rounded-lg items-center text-center shadow-md hover:bg-indigo-800 transition-all duration-300 cursor-pointer"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
