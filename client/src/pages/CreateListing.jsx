import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: "",
    discountedPrice: "0",
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 10) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Failed to upload images (2 mb max per image)",
            err
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload up to 10 images.");
      setUploading(true);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
          console.log(error);
        },
        () => {
          // Upload completed successfully, now we can create the post
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => index !== i),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discount price must be lower than Regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      console.log(data);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl text-center font-bold mt-8 my-7">
        Create Listing
      </h1>

      <form className="flex flex-col md:flex-row" onSubmit={handleSubmit}>
        <div className="w-10/12 lg:w-11/12 bg-white md:rounded-none rounded-t-2xl shadow p-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder="Title"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-
          sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
          text-sm"
            onChange={handleChange}
            value={formData.name}
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
            className="mt-1 block  w-full rounded-md py-2 px-3 text-base border border-gray-300 rounded-
          md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          0 sm:text-base"
            required
            placeholder="Description..."
            onChange={handleChange}
            value={formData.description}
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
            placeholder="Street, City, State (ZIP)"
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 mt-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="text-gray-800">Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="text-gray-800">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="text-gray-800">Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="text-gray-800">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                onChange={handleChange}
                checked={formData.offer}
              />
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
                value={formData.bedrooms}
                onChange={handleChange}
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
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <label htmlFor="bedrooms" className="ml-2">
                Bathroom
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                required
                className="p-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
                text-sm"
                placeholder="Regular Price (optional)"
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <label
                htmlFor="bedrooms"
                className="ml-2 flex flex-col items-center"
              >
                <div className="">Regular Price</div>
                <div className="text-xs text-gray-500">($/ month)</div>
              </label>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  className="p-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:
                   text-sm"
                  placeholder="Discounted Price ($/month)"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                />
                <label
                  htmlFor="discounted"
                  className="ml-2 flex flex-col items-center"
                >
                  <div className="">Discounted Price</div>
                  <div className="text-xs text-gray-500">($/ month)</div>
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 border-b-2 md:border-none p-4 w-10/12 md:w-6/12">
          <label className="font-semibold">
            images:
            <span className="font-normal text-sm text-gray-600 ml-2">
              The first image will be the cover (max 10)
            </span>
          </label>
          <div className="flex gap-2">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className=" mt-3 p-3 border border-gray-600 rounded-lg"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
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
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className=" text-xs text-red-600 font-medium mt-2">
            {imageUploadError && imageUploadError}
          </p>
          <div>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((urls, index) => (
                <>
                  <div
                    key={urls}
                    className="flex justify-between p-2 border items-center rounded-lg"
                  >
                    <img
                      src={urls}
                      alt="Listing image"
                      className="w-20 h-20 object-cover rounded-lg lg:w-28 lg:h-28"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="hover:text-red-600 transition-all duration-200"
                      alt="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              ))}
          </div>
          <button
            disabled={loading || uploading}
            className="mt-4 py-3 font-bold tracking-wide text-black uppercase border-2 border-black shadow-sm hover:bg-black hover:text-white focus:outline-none focus:shadow-transparent cursor-pointer rounded-lg transition-all duration-200"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && (
            <p className="mt-2 text-xs italic text-red-700 font-medium">
              {error}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}
