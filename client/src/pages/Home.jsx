import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItems from "./ListingItems";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  console.log(saleListings);
  console.log(offerListings);
  console.log(rentListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* Top */}
      <div className="flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto">
        <h1 className=" text-slate-700 font-bold text-4xl lg:text-6xl">
          Find your next <span className=" text-slate-400">Perfect</span>
          <br />
          place with ease
        </h1>
        <div className=" text-gray-400 text-sm sm:text-base">
          Nkusi Estate is the best place to find your next perfect place to live
          or to rent.
          <br />
          we have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className=" text-sm sm:text-base text-indigo-700 font-bold hover:underline transition-all duration-200"
        >
          Lets get started...
        </Link>
      </div>
      {/* Swiper */}

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => {
            // console.log(listing.imageUrls); // Log image URLs for debugging
            return (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                ></div>
              </SwiperSlide>
            );
          })}
      </Swiper>

      {/* Listings results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-6 my-8">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className=" flex flex-col gap-1 mb-2">
              <h2 className="text-xl font-bold text-gray-500">Recent Offer</h2>
              <Link
                to={"/search?offer=true"}
                className=" text-sm text-indigo-500 font-medium hover:underline hover:font-semibold transition-all duration-300"
              >
                Show more Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}{" "}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className=" flex flex-col gap-1 mb-2">
              <h2 className="text-xl font-bold text-gray-500">
                Recent Places for Rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className=" text-sm text-indigo-500 font-medium hover:underline hover:font-semibold transition-all duration-300"
              >
                Show more Place for Rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}{" "}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className=" flex flex-col gap-1 mb-2">
              <h2 className="text-xl font-bold text-gray-500">
                Recent Places for Sale
              </h2>
              <Link
                to={"/search?type=sale"}
                className=" text-sm text-indigo-500 font-medium hover:underline hover:font-semibold transition-all duration-300"
              >
                Show more Place for Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
