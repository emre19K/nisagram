import React, { useEffect, useState } from "react";
import { getLoginCookie } from "../../util/LoginCookie";
import { jwtDecode } from "jwt-decode";
import { easyGet, easyPatchWithFile, easyPatch } from "../../util/EasyFetch";
import { ValidateFile } from "../../util/FileUpload";
import ChangeNameComponent from "../profile/ChangeNameComponent";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../util/CustomAlert";
import { IoImageOutline } from "react-icons/io5";
import CropImageModal from "../ImageCrop/CropImageModal";
import { handleOnEmailChange } from "../../util/CredentialsOnChange";
import useIsMobile from "../../util/useIsMobile";

export default function EditProfileComponent() {
  const token = getLoginCookie();
  const _id = jwtDecode(token)._id;

  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerFileURL, setBannerFileURL] = useState(null);
  const [inputEmail, setInputEmail] = useState((user && user.email) || "");
  const [inputEmailAvailable, setInputEMailAvailable] = useState("");
  const [inputEmailError, setInputEmailError] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const isMobile = useIsMobile();

  useEffect(() => {
    const getUser = async () => {
      let user = await easyGet(`/user/${_id}`, token);
      setUser(user);
      setInputEmail(user.email);
      setImageFile(user.profilePicture);
      setImageFileURL(user.profilePicture);
      setBannerFile(user.bannerPicture);
      setBannerFileURL(user.bannerPicture);
      setDescription(user.description || "");
    };

    getUser();
  }, [token, _id]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    ValidateFile(uploadedFile, (err, file) => {
      if (err) {
        setError(err);
      } else {
        setImageFile(file);
        setImageFileURL(URL.createObjectURL(file));
        setError("");
        setCropModalVisible(true);
      }
    });
  };

  const handleBannerFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    ValidateFile(uploadedFile, (err, file) => {
      if (err) {
        setError(err);
      } else {
        setBannerFile(file);
        setBannerFileURL(URL.createObjectURL(file));
        setError("");
      }
    });
  };

  const handleCropComplete = (croppedImageUrl) => {
    fetch(croppedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], imageFile.name, { type: blob.type });
        setCroppedImage(file);
        setImageFileURL(croppedImageUrl);
        setCropModalVisible(false);
      });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  async function handleOnEmailClick() {
    if (error || inputEmail == user.email) {
      return;
    }

    let credentials = {
      email: inputEmail,
    };

    try {
      let updatedUser = await easyPatch(`/user/${_id}`, credentials, token);

      if (!updatedUser) {
        setError("E-Mail nicht verfügbar!");
        return;
      }
      navigate(`/profile/${_id}`);
      showAlert("E-Mail erfolgreich aktualisiert!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  const handleOnClick = async (field) => {
    if (field === "description") {
      try {
        await easyPatch(`/user/description/${_id}`, { description }, token);
        navigate(`/profile/${_id}`);
        showAlert("Profil erfolgreich aktualisiert!");
      } catch (error) {
        showAlert("Fehler beim Aktualisieren des Profils!", "error");
      }
    } else {
      const formData = new FormData();
      if (field === "image" && croppedImage) {
        formData.append("image", croppedImage);
      } else if (field === "banner" && bannerFile) {
        formData.append("banner", bannerFile);
      }
      try {
        await easyPatchWithFile(`/user/${field}/${_id}`, formData, token);
        navigate(`/profile/${_id}`);
        showAlert("Profil erfolgreich aktualisiert!");
      } catch (error) {
        showAlert("Fehler beim Aktualisieren des Profils!", "error");
      }
    }
  };

  return (
    <div>
      {user ? (
        !isMobile ? (
          <div>
            <div>
              <div
                className="flex justify-center md:mt-36"
                style={{ height: "125px", width: "100%" }}
              >
                <div className="rounded-xl w-2/3 2xl:w-1/2 flex items-center bg-light-bg dark:bg-dark-bg">
                  <label htmlFor="image">
                    <input
                      id="image"
                      type="file"
                      onChange={(e) => handleFileChange(e)}
                      className="hidden"
                    />

                    <img
                      src={imageFileURL ? imageFileURL : imageFile}
                      alt="Profile Picture"
                      className="ml-14 w-24 h-24 rounded-full cursor-pointer mr-10"
                    />
                  </label>
                  <div className="font-bold 2xl:mr-0 ml-64 mr-4 2xl:ml-64">
                    <button
                      className="hover:text-lila text-light dark:text-dark"
                      onClick={() => handleOnClick("image")}
                    >
                      Profilbild ändern
                    </button>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                  </div>
                </div>
              </div>

              <div
                className="flex justify-center mt-10"
                style={{ height: "125px", width: "100%" }}
              >
                <div className="rounded-xl w-2/3 2xl:w-1/2 flex items-center bg-light-bg dark:bg-dark-bg">
                  <label htmlFor="banner">
                    <input
                      id="banner"
                      type="file"
                      onChange={(e) => handleBannerFileChange(e)}
                      className="hidden"
                    />

                    {bannerFile ? (
                      <img
                        src={bannerFileURL}
                        alt="Banner Preview"
                        className="ml-12 w-36 h-24 cursor-pointer"
                      />
                    ) : (
                      <IoImageOutline className="text-6xl mr-4" />
                    )}
                  </label>
                  <div className="font-bold 2xl:mr-0 ml-64 mr-4 2xl:ml-64">
                    <button
                      className="hover:text-lila text-light dark:text-dark"
                      onClick={() => handleOnClick("banner")}
                    >
                      Banner aktualisieren
                    </button>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="mt-10 rounded-xl w-2/3 2xl:w-1/2 h-24 flex items-center bg-light-bg dark:bg-dark-bg">
                  <ChangeNameComponent userID={user.userID} />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="mt-10 rounded-xl w-2/3 2xl:w-1/2 h-24 flex items-center bg-light-bg dark:bg-dark-bg">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <input
                        required
                        onChange={(e) =>
                          handleOnEmailChange(
                            e,
                            setInputEmail,
                            setInputEmailError,
                            setInputEMailAvailable
                          )
                        }
                        value={inputEmail}
                        className="auth-input md:w-1/2 w-full text-white dark:text-dark font-josefine ml-4 pl-3"
                      />
                      <button
                     
                        onClick={handleOnEmailClick}
                      >
                        <p className="hover:text-lila md:ml-56 2xl:ml-60 font-bold ml-2 md:mr-8">E-Mail ändern</p>
                      </button>
                    </div>
                    <div className="relative w-full">
                      {inputEmailAvailable && (
                        <p className="absolute ml-10 text-green mt-0 pl-1">
                          {inputEmailAvailable}
                        </p>
                      )}
                      {inputEmailError && (
                        <p className="absolute ml-9 text-red mt-0 pl-1">
                          {inputEmailError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <div className="rounded-xl w-2/3 2xl:w-1/2 flex items-center p-4 bg-light-bg dark:bg-dark-bg">
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Beschreibung eingeben"
                    className="w-full p-2 rounded text-light dark:text-dark"
                    style={{ flexGrow: 1 }}
                  />
                  <button
                    className="ml-4 hover:text-lila font-bold"
                    onClick={() => handleOnClick("description")}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Beschreibung ändern
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <div
                className="flex justify-center md:mt-36"
                style={{ height: "125px", width: "100%" }}
              >
                <div className="rounded-xl w-full  flex items-center bg-light-bg dark:bg-dark-bg">
                  <label htmlFor="image">
                    <input
                      id="image"
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, setImageFile, setImageFileURL)
                      }
                      className="hidden"
                    />
                    <img
                      src={imageFileURL ? imageFileURL : imageFile}
                      alt="Profile Picture"
                      className="ml-14 md:w-24 md:h-24 w-16 h-16 rounded-full cursor-pointer mr-10"
                    />
                  </label>
                  <div className="font-bold 2xl:mr-0  mr-4 2xl:ml-64">
                    <button
                      className="hover:text-lila text-light dark:text-dark"
                      onClick={() => handleOnClick("image")}
                    >
                      Profilbild ändern
                    </button>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                  </div>
                </div>
              </div>

              <div
                className="flex justify-center mt-10"
                style={{ height: "125px", width: "100%" }}
              >
                <div className="rounded-xl flex items-center bg-light-bg dark:bg-dark-bg">
                  <label htmlFor="banner">
                    <input
                      id="banner"
                      type="file"
                      onChange={(e) => handleBannerFileChange(e)}
                      className="hidden"
                    />
                    {bannerFile ? (
                      <img
                        src={bannerFileURL}
                        alt="Banner Preview"
                        className="ml-14 md:w-24 md:h-24 w-16 h-16 rounded-full cursor-pointer mr-10"
                      />
                    ) : (
                      <IoImageOutline className="text-6xl mr-4" />
                    )}
                  </label>
                  <div className="font-bold 2xl:mr-0  mr-4 2xl:ml-64">
                    <button
                      className="hover:text-lila text-light dark:text-dark"
                      onClick={() => handleOnClick("banner")}
                    >
                      Banner aktualisieren
                    </button>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="mt-10 rounded-xl  h-24 flex items-center bg-light-bg dark:bg-dark-bg">
                  <ChangeNameComponent userID={user.userID} />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="mt-10 rounded-xl w-full  md:w-2/3 2xl:w-1/2 h-24 flex items-center bg-light-bg dark:bg-dark-bg">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <input
                        required
                        onChange={(e) =>
                          handleOnEmailChange(
                            e,
                            setInputEmail,
                            setInputEmailError,
                            setInputEMailAvailable
                          )
                        }
                        value={inputEmail}
                        className="auth-input w-1/2 text-white dark:text-dark font-josefine ml-4 pl-3"
                      />
                      <button onClick={handleOnEmailClick}>
                        <p className="hover:text-lila md:ml-48 2xl:ml-60 font-bold ml-2">
                          E-Mail ändern
                        </p>
                      </button>
                    </div>
                    <div className="relative w-full">
                      {inputEmailAvailable && (
                        <p className="absolute ml-10 text-green mt-0 pl-1">
                          {inputEmailAvailable}
                        </p>
                      )}
                      {inputEmailError && (
                        <p className="absolute ml-9 text-red mt-0 pl-1">
                          {inputEmailError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <div className="rounded-xl w-full md:w-2/3 2xl:w-1/2 flex items-center p-4 bg-light-bg dark:bg-dark-bg">
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Beschreibung eingeben"
                    className="w-full p-2 rounded text-light dark:text-dark"
                    style={{ flexGrow: 1 }}
                  />
                  <button
                    className="ml-2 hover:text-lila font-bold"
                    onClick={() => handleOnClick("description")}
                  >
                    Beschreibung ändern
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}
      {cropModalVisible && imageFile && (
        <CropImageModal
          visible={cropModalVisible}
          imageSrc={imageFileURL}
          onCancel={() => setCropModalVisible(false)}
          onComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
