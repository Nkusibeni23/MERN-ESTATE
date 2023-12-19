/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItems({ listing }) {
  //   console.log(listing.name);
  return (
    <div className=" bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-lg w-full sm:w-[400px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="Listing cover"
          className=" h-[320px] sm:[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-2">
            <MdLocationOn className="h-4 w-4 text-slate-500" />
            <p className=" text-sm text-gray-500 w-full">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-500 line-clamp-3">
            {listing.description}
          </p>
          <p className=" font-semibold text-slate-600 mt-2">
            ${" "}
            {listing.offer
              ? listing.regularPrice.toLocaleString("en-US")
              : listing.discountedPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="text-indigo-600 flex items-center gap-4">
            <div className=" font-bold text-sm">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </div>
            <div className=" font-bold text-sm">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
