import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  FormControl,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TtyOutlinedIcon from "@mui/icons-material/TtyOutlined";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import ShareLocationOutlinedIcon from "@mui/icons-material/ShareLocationOutlined";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import app from "../../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import LinearProgress from "@mui/material/LinearProgress";
import { fontSize } from "@mui/system";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 280, sm: 400 },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

const ProfileData = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  let accesstoken = userLogged.accessToken;
  // console.log(idLogged);

  //Show Profile Data of Specific User
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  // console.log(id);

  //Fir Menu Edit
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
  }, [id, userData]);

  //Trying to Follow or Unfollow Specific User
  const [followOrUnfollow, setFollowOrUnfollow] = useState([
    userLogged.other.following.includes(userData._id) ? "UnFollow" : "Follow",
  ]);
  useEffect(() => {
    userData._id
      ? setFollowOrUnfollow("Follow")
      : setFollowOrUnfollow("Unfollow");
  }, [setFollowOrUnfollow]);
  const handleFollowUser = async () => {
    if (followOrUnfollow === "Follow") {
      await fetch(`http://localhost:5000/api/user/follow/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/JSON", token: accesstoken },
        body: JSON.stringify({ user: `${userLogged.other._id}` }),
      });
      setFollowOrUnfollow("UnFollow");
    } else {
      await fetch(`http://localhost:5000/api/user/follow/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/JSON", token: accesstoken },
        body: JSON.stringify({ user: `${userLogged.other._id}` }),
      });
      setFollowOrUnfollow("Follow");
    }
  };

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

  //For Posting
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [Username, setUsername] = useState("");
  const [Bio, setBio] = useState("");
  const [Password, setPassword] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Location, setLocation] = useState("");

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (selectedProfile !== null || selectedBackground !== null) {
      const fileName1 = selectedProfile
        ? new Date().getTime() + selectedProfile.name
        : null;
      const fileName2 = selectedBackground
        ? new Date().getTime() + selectedBackground.name
        : null;
      const storage = getStorage(app);

      let downloadURLs = {};

      const uploadTasks = [];

      if (fileName1) {
        const storageRef1 = ref(storage, fileName1);
        const uploadTask1 = uploadBytesResumable(storageRef1, selectedProfile);
        uploadTasks.push(uploadTask1);

        uploadTask1.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Profile Upload is " + progress + "% done");
            setUploadPercent(progress);
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask1.snapshot.ref);
            downloadURLs = { ...downloadURLs, profilepicture: downloadURL };

            // Call updateProfile only when all upload tasks are complete
            if (
              uploadTasks.every((task) => task.snapshot.state === "success")
            ) {
              updateProfile(downloadURLs);
            }
          }
        );
      }

      if (fileName2) {
        const storageRef2 = ref(storage, fileName2);
        const uploadTask2 = uploadBytesResumable(
          storageRef2,
          selectedBackground
        );
        uploadTasks.push(uploadTask2);

        uploadTask2.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Background Upload is " + progress + "% done");
            setUploadPercent(progress);
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask2.snapshot.ref);
            downloadURLs = { ...downloadURLs, backgroundpicture: downloadURL };

            // Call updateProfile only when all upload tasks are complete
            if (
              uploadTasks.every((task) => task.snapshot.state === "success")
            ) {
              updateProfile(downloadURLs);
            }
          }
        );
      }
    } else {
      updateProfile({});
    }
  };

  const updateProfile = (downloadURLs) => {
    fetch(`http://localhost:5000/api/user/update/profile/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/JSON",
        token: accesstoken,
      },
      body: JSON.stringify({
        firstname: Firstname === "" ? "" : Firstname,
        lastname: Lastname === "" ? "" : Lastname,
        username: Username === "" ? "" : Username,
        bio: Bio === "" ? "" : Bio,
        password: Password === "" ? "" : Password,
        phonenumber: PhoneNumber === "" ? "" : PhoneNumber,
        location: Location === "" ? "" : Location,
        ...downloadURLs,
      }),
    })
      .then((data) => {
        console.log("Profile Updated Successfully");
        handleClose(true);
        setUploadPercent(0);
        // window.location.reload(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box flex={4} p={2} sx={{ width: { sm: "100%" } }}>
      <Card sx={{ boxShadow: 5 }}>
        <CardMedia
          component="img"
          height="194"
          image={userData?.backgroundpicture}
          alt={userData?.username}
        />
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: "red",
                height: { xs: "5rem" },
                width: { xs: "5rem" },
              }}
              aria-label="recipe"
              src={userData?.profilepicture}
            >
              R
            </Avatar>
          }
          action={
            userLogged?.other._id !== id ? (
              <Button
                variant="outlined"
                size="small"
                sx={{ marginTop: 3, marginRight: 2, borderRadius: 10 }}
                onClick={handleFollowUser}
              >
                {followOrUnfollow}
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                sx={{ marginTop: 3, marginRight: 2, borderRadius: 10 }}
                onClick={handleOpen}
              >
                Edit Profile
              </Button>
            )
          }
          title={
            // userData?.firstname
            userData?.firstname?.charAt(0).toUpperCase() +
            userData?.firstname?.slice(1) +
            " " +
            userData?.lastname?.charAt(0).toUpperCase() +
            userData?.lastname?.slice(1)
          }
          subheader={"@" + userData?.username}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {userData?.bio === undefined ? "Add Your Bio..." : userData.bio}
          </Typography>
          <CardContent>
            <Stack direction="row" spacing={1}>
              <LocalPhoneOutlinedIcon /> {"+63 " + userData?.phonenumber}
              <EventAvailableOutlinedIcon /> Joined{" "}
              {userData?.joineddate?.replace("-", " ").slice(0, -14)}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <ShareLocationOutlinedIcon />{" "}
              {userData?.location === undefined
                ? "Add location"
                : userData?.location}
            </Stack>
          </CardContent>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                {userData?.following?.length} Following
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                {userData?.followers?.length} Followers
              </Typography>
            </Stack>
          </CardContent>
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
          <LinearProgress
            variant="buffer"
            value={progress}
            valueBuffer={buffer}
          />
          <Box sx={{ flexWrap: "wrap" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Profile
              <Button
                variant="contained"
                sx={{ float: "right", borderRadius: 10 }}
                onClick={handleEditProfile}
              >
                Save
              </Button>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2 }}>
            <div>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  First name
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setFirstname(e.target.value)}
                  defaultValue={userData?.firstname}
                  startAdornment={
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Last name
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setLastname(e.target.value)}
                  defaultValue={userData?.lastname}
                  startAdornment={
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }} disabled={true}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Username
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setUsername(e.target.value)}
                  defaultValue={userData?.username}
                  startAdornment={
                    <InputAdornment position="start">
                      <Diversity3OutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Bio</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setBio(e.target.value)}
                  defaultValue={userData?.bio}
                  multiline
                  startAdornment={
                    <InputAdornment position="start">
                      <BookOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setPassword(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <VpnKeyOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Contact
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  defaultValue={userData?.phonenumber}
                  startAdornment={
                    <InputAdornment position="start">
                      <TtyOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Location
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  onChange={(e) => setLocation(e.target.value)}
                  defaultValue={userData?.location}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOnOutlinedIcon />
                    </InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Change Profile
                  <input
                    hidden
                    accept="image/*"
                    onChange={(e) => setSelectedProfile(e.target.files[0])}
                    multiple
                    type="file"
                  />
                </Button>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Change Background
                  <input
                    hidden
                    accept="image/*"
                    onChange={(e) => setSelectedBackground(e.target.files[0])}
                    multiple
                    type="file"
                  />
                </Button>
              </FormControl>
            </div>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfileData;
