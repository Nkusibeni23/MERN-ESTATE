export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl text-center font-bold mt-8 my-7">
        Create Listing
      </h1>

      <form className="flex flex-col md:flex-row">
        <div className="w-10/12 lg:w-11/12 bg-white md:rounded-none rounded-t-2xl shadow p-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            autoComplete="off"
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-
          sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
          text-sm"
          />
          <label
            htmlFor="description"
            className="mt-6 block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full py-2 px-3 text-base border border-gray-300 rounded-
          md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-50
          0 sm:text-base"
            required
          />

          <label className="mt-6 block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-
          sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
          text-sm"
          />
          <div className="flex gap-6 mt-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" />
              <span className="text-gray-800">Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-4" />
              <span className="text-gray-800">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" />
              <span className="text-gray-800">Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
              <span className="text-gray-800">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-4" />
              <span className="text-gray-800">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                required
                className="p-2 border border-gray-300 rounded-lg w-16 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
                text-sm"
              />
              <label htmlFor="bedrooms" className="ml-2">
                Bedrooms
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                required
                className="p-2 border border-gray-300 rounded-lg w-16 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
                text-sm"
              />
              <label htmlFor="bedrooms" className="ml-2">
                Bathroom
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                className="p-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
                text-sm"
              />
              <label
                htmlFor="bedrooms"
                className="ml-2 flex flex-col items-center"
              >
                <div className="">Regular Price</div>
                <div className="text-xs text-gray-500">($/ month)</div>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                required
                className="p-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
                text-sm"
              />
              <label
                htmlFor="bedrooms"
                className="ml-2 flex flex-col items-center"
              >
                <div className="">Discounted Price</div>
                <div className="text-xs text-gray-500">($/ month)</div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 border-b-2 md:border-none p-4 w-10/12 md:w-6/12">
          <label className="font-semibold">
            images:
            <span className="font-normal text-sm text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </label>
          <div className="flex gap-2">
            <input
              className=" mt-3 p-3 border border-gray-600 rounded-lg"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              className="
              mt-3
            py-2.5 px-5
            font-semibold
            transition
            duration-200
            ease-in
            rounded-lg
            text-white
            uppercase
            bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring2 focus
            :ring-offset-4 focus:ring-indigo-500
            "
            >
              Upload
            </button>
          </div>
          <button
            className="
          mt-4
          py-3
          font-bold
          tracking-wide
          text-black
          uppercase
          border-2 border-black
          shadow-sm
          hover:bg-black
          hover:text-white
          focus:outline-none
          focus:shadow-transparent
          cursor-pointer
          rounded-lg transition-all duration-200
          "
          >
            Creating Listing
          </button>
        </div>
      </form>
    </main>
  );
}
