import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import app from "../../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";

const Post = ({ handleNewPost }) => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  let accesstoken = userLogged.accessToken;
  let id = userLogged.other._id;

  //For Progress Bar Upload Post
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const [uploadPercent, setUploadPercent] = useState(0);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = uploadPercent;
        const diff2 = uploadPercent;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  //For Showing Preview of Image and For uploading
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [title, setTile] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  // console.log(selectedImage.name);

  useEffect(() => {
    if (selectedImage !== null) {
      setImageUrl(URL.createObjectURL(selectedImage));
      setVideoUrl(null);
    }
    if (selectedVideo !== null) {
      setVideoUrl(URL.createObjectURL(selectedVideo));
      setImageUrl(null);
    }
  }, [selectedImage, selectedVideo]);

  const handleRemoveMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setImageUrl(null);
    setVideoUrl(null);
  };

  //For Posting
  const [key, setKey] = useState(0);
  const handlePost = (e) => {
    setKey(key + 1);
    e.preventDefault();
    if (selectedImage !== null) {
      const fileName = new Date().getTime() + selectedImage?.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, selectedImage);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadPercent(progress);
          // console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("Image File available at", downloadURL);
            fetch(`http://localhost:5000/api/post/user/post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/JSON",
                token: accesstoken,
              },
              body: JSON.stringify({
                title: title === "" ? "" : title,
                image: downloadURL,
                video: "",
              }),
              // handleNewPost()
            }).then((data) => {
              setUploadPercent(0);
              setSelectedImage(null);
              // alert("Your Post was upload successfully");
              // window.location.reload(true);
            });
          });
        }
      );
    } else if (selectedVideo !== null) {
      const fileName = new Date().getTime() + selectedVideo?.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, selectedVideo);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadPercent(progress);
          // console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("Video File available at", downloadURL);
            fetch(`http://localhost:5000/api/post/user/post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/JSON",
                token: accesstoken,
              },
              body: JSON.stringify({
                title: title === "" ? "" : title,
                video: downloadURL,
                image: "",
              }),
            }).then((data) => {
              setUploadPercent(0);
              setSelectedVideo(null);
              // alert("Your Post was upload successfully");
              // window.location.reload(true);
            });
          });
        }
      );
    } else {
      fetch(`http://localhost:5000/api/post/user/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/JSON",
          token: accesstoken,
        },
        body: JSON.stringify({
          title: title,
          video: "",
          image: "",
        }),
      }).then((data) => {
        // alert("Your Post was upload successfully");
        // window.location.reload(true);
      });
    }
  };

  //For Get Data of User Profile
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const getnewFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/post/user/details/${id}`
        );
        setUserData(res.data);
      } catch (error) {
        console.log("Get new followers list error.");
      }
    };
    getnewFollowers();
  }, [id]);

  return (
    <Box flex={4} p={2} sx={{ width: { sm: "100%" } }} key={key}>
      <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
      <Card sx={{ boxShadow: 5 }}>
        <CardHeader
          avatar={
            <Avatar
              alt={userLogged.other.username}
              src={userData.profilepicture}
              sx={{ bgcolor: "red" }}
              aria-label="recipe"
              component={Link}
              to={`/Profile/${id}`}
            />
          }
          title={
            userLogged.other.firstname.charAt(0).toUpperCase() +
            userLogged.other.firstname.slice(1) +
            " " +
            userLogged.other.lastname.charAt(0).toUpperCase() +
            userLogged.other.lastname.slice(1)
          }
          // subheader="September 14, 2016"
        />
        <CardContent>
          <TextField
            multiline
            rows={2}
            placeholder="How's life going?"
            variant="standard"
            sx={{ width: "100%" }}
            onChange={(e) => setTile(e.target.value)}
          />
          {(selectedImage || selectedVideo) && (
            <Box
              mt={2}
              sx={{
                position: "relative",
                height: 233,
                width: { xs: "100%", md: 350 },
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 350 },
              }}
            >
              {selectedImage && (
                <Box
                  component="img"
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                  alt={selectedImage.name}
                  src={imageUrl}
                />
              )}
              {selectedVideo && (
                <Box
                  component="video"
                  sx={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                  }}
                  autoPlay
                  muted
                  loop
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </Box>
              )}
              <Box
                sx={{
                  position: "absolute",
                  top: "0%",
                  right: "0%",
                }}
              >
                <IconButton
                  color="primary"
                  onClick={handleRemoveMedia}
                  variant="contained"
                >
                  <CancelIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardContent>
        <CardActions>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            justifyContent="space-evenly"
            sx={{ width: "100%" }}
          >
            <Tooltip title="Upload Image">
              <IconButton aria-label="upload picture" component="label">
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
                <AddPhotoAlternateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload Video">
              <IconButton aria-label="upload picture" component="label">
                <input
                  hidden
                  accept="video/*"
                  type="file"
                  onChange={(e) => setSelectedVideo(e.target.files[0])}
                />
                <VideoCallIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send">
              <IconButton
                variant="contained"
                sx={{ color: "default.color" }}
                size="small"
                onClick={handlePost}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Post;
