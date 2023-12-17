/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePrec, setFilePrec] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const dispatch = useDispatch();

  // console.log(formData);

  // console.log(filePrec);
  // console.log(fileUploadError);

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches("image/.*")

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error("Error", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  async function handleDeleteUser() {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
  const handlesignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
      console.log(error);
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);

        return;
      }
      setUserListings(data);
      setShowListings(!showListings);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    const res = await fetch(`api/listing/delete/${listingId}`, {
      method: "DELETE",
    });

    console.log("Response Status:", res.status);

    if (res.status === 204) {
      // Handle success (maybe update UI)
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } else {
      const data = await res.json();
      console.log("Response Data:", data);
    }
  };

  return (
    <div className="flex-1 px-4 py-6 mx-2 my-4 overflow-hidden">
      <h1 className="text-3xl font-bold flex justify-center items-start my-6">
        Profile
      </h1>
      <div className="flex flex-col gap-y-6 w-full max-w-md mx-auto">
        <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            src={formData.avatar || currentUser.avatar}
            onClick={() => fileRef.current.click()}
            alt="profile"
            className="object-cover object-center h-32 w-32 rounded-full border-gray-200 cursor-pointer self-center"
          />
          <p className="flex text-xs items-center justify-center">
            {fileUploadError ? (
              <span className="text-red-500">
                Error Image Upload(Image must be less than 2 mb)
              </span>
            ) : filePrec > 0 && filePrec < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePrec}%`}</span>
            ) : filePrec === 100 ? (
              <span className="text-green-500">
                Image uploaded successfully!
              </span>
            ) : null}
          </p>
          <input
            type="text"
            id="username"
            defaultValue={currentUser.username}
            placeholder="Your Username...."
            onChange={handleChange}
            className="outline-none border-2 border-gray-200 rounded-lg py-2 px-2"
          />
          <input
            type="text"
            id="email"
            defaultValue={currentUser.email}
            placeholder="Your Email"
            onChange={handleChange}
            className="outline-none border-2 border-gray-200 rounded-lg py-2 px-2"
          />
          <input
            type="password"
            id="password"
            placeholder="**********"
            onChange={handleChange}
            className="outline-none border-2 border-gray-200 rounded-lg py-2 px-2"
          />
          <button
            className="w-full bg-gray-800 rounded-lg px-8 py-2 text-white text-md uppercase font-semibold tracking-wide
        transition ease-in duration-200 text-transform cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "loading...." : "Save Changes"}
          </button>
          <Link to={"/create-listing"}>
            <button
              className=" w-full rounded-lg uppercase bg-indigo-500 hover:bg-indigo-700 transition-all hover:duration-200 text-white font-bold py-2 px
          4 outline-none focus:shadow-outline"
            >
              Create Listing
            </button>
          </Link>
          <div className="flex justify-between">
            <span
              onClick={handleDeleteUser}
              className="align-middle cursor-pointer text-red-500 select-none relative whitespace-no-wrap text-sm leading-5"
            >
              Delete Account
            </span>
            <span
              onClick={handlesignOut}
              className="align-middle cursor-pointer text-red-500 select-none relative whitespace-no-wrap text-sm leading-5 flex items-center gap-1"
            >
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
          <div className="flex justify-center items-center">
            <p className="text-xs text-red-600 font-medium">
              {error ? error : ""}
            </p>
            <p className="text-xs text-green-700 font-medium">
              {updateSuccess ? "User is updated successfully!" : ""}
            </p>
          </div>
        </form>
        <div>
          <div className="flex items-center justify-center">
            {showListings ? (
              <button
                onClick={handleShowListings}
                className="font-semibold text-base text-indigo-600 flex items-center justify-center gap-2"
              >
                Show Listings
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleShowListings}
                className="font-semibold text-base text-indigo-600 flex items-center justify-center gap-2"
              >
                Show Listings
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <p className=" text-red-600 mt-2 font-medium text-sm">
              {showListingError ? "Error showing listings" : ""}
            </p>
          </div>

          {showListings && (
            <div>
              <h2 className="text-center py-3 font-bold text-xl uppercase underline">
                Your Listings
              </h2>
              {userListings && userListings.length > 0 ? (
                userListings.map((listing) => (
                  <>
                    <div
                      key={listing._id}
                      className="border rounded-lg p-3 flex justify-between items-center gap-4"
                    >
                      <Link to={`/listing/${listing._id}`}>
                        <img
                          src={listing.imageUrls[0]}
                          alt="listing cover"
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </Link>
                      <Link
                        className="flex-1 text-slate-700 font-semibold text-sm  hover:underline transition-all duration-300 truncate"
                        to={`/listing/${listing._id}`}
                      >
                        <span>{listing.name}</span>
                      </Link>
                      <div className="flex gap-2 items-center justify-center">
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          className="text-red-500 hover:text-red-600"
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
                        <button className="text-indigo-500 hover:text-indigo-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="text-center">
                  <p className="italic font-medium text-lg"> Empty Listings </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
