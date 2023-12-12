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
  return (
    <div className="flex-1 px-4 py-6 mx-2 my-4 overflow-hidden">
      <h1 className="text-3xl font-bold flex justify-center items-start my-6">
        Profile
      </h1>
      <form
        className="flex flex-col gap-y-4 w-full max-w-md mx-auto"
        onSubmit={handleSubmit}
      >
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
            <span className="text-green-500">Image uploaded successfully!</span>
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
            className=" w-full rounded-lg uppercase bg-blue-600 hover:bg-blue-800 transition-all hover:duration-200 text-white font-bold py-2 px
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
    </div>
  );
}
