import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [Copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        console.log(data);
        setListings(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  //   const totalDiscounted = +listings.regularPrice - +listings.discountedPrice;

  return (
    <main>
      {loading && (
        <p className="text-center my-10 text-2xl font-medium">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-lg font-medium text-red-500">
          Something Went Wrong!!
        </p>
      )}
      {listings && !loading && !error && (
        <>
          <Swiper navigation>
            {listings.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10  rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 hover:bg-stone-400 transition-all duration-200">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {Copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-1 font-medium">
                Link copied
              </p>
            )}
          </div>
          <div className="flex flex-col flex-wrap max-w-4xl mx-auto p-3 my-2 gap-4">
            <p className="text-xl font-medium">
              {listings.type === "rent" && listings.discountedPrice > 0 ? (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold">{listings.name} -</p>
                  <p className="line-through text-slate-600">
                    ${listings.regularPrice.toLocaleString("en-US")}
                  </p>
                  <p className="text-black font-bold">
                    $
                    {(
                      +listings.regularPrice - +listings.discountedPrice
                    ).toLocaleString("en-US")}
                  </p>
                  <span>/month</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold">{listings.name} -</p>
                  {listings.discountedPrice > 0 ? (
                    <>
                      <p className="line-through text-slate-600">
                        ${listings.regularPrice.toLocaleString("en-US")}
                      </p>
                      <p className="text-black font-bold">
                        $
                        {(
                          +listings.regularPrice - +listings.discountedPrice
                        ).toLocaleString("en-US")}
                      </p>
                    </>
                  ) : (
                    <span className="font-bold text-black">
                      ${listings.regularPrice.toLocaleString("en-US")}
                    </span>
                  )}
                  {listings.type === "rent" && <p>/ month</p>}
                </div>
              )}
            </p>
            <p className="flex items-center gap-2 text-slate-600 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>

              {listings.address}
            </p>
            <div className="flex gap-4 items-center text-center">
              <p className=" bg-indigo-700 w-full max-w-[200px] text-white rounded-md font-medium p-1">
                {listings.type === "rent" ? "For Rent" : "For Sale"}
              </p>
            </div>
            <p className=" text-slate-700">
              <span className="font-bold text-black text-lg">
                Description - {""}
              </span>
              {listings.description}
            </p>
            <ul className="flex flex-wrap text-indigo-700 font-semibold text-base gap-5 items-center sm:gap-6">
              <li className="flex items-center text-center gap-2 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listings.bedrooms > 1
                  ? `${listings.bedrooms} beds`
                  : `${listings.bedrooms}bed`}
              </li>
              <li className="flex items-center text-center gap-2 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listings.bedrooms > 1
                  ? `${listings.bathrooms} baths`
                  : `${listings.bathrooms} bath`}
              </li>
              <li className="flex items-center text-center gap-2 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listings.parking ? "Parking Spot" : "No Parking"}
              </li>
              <li className="flex items-center text-center gap-2 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listings.furnished ? "Furniture" : "Unfurniture"}
              </li>
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
