import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Post from "../PostContainer/Post";
import MainPost from "./MainPost";
import axios from "axios";
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";

const Feeds = () => {
  //For Authentication
  const userLoggedinDetails = useSelector((state) => state.user);
  let userLogged = userLoggedinDetails.user;
  // console.log(user);
  let id = userLogged.other._id;
  const accesstoken = userLogged.accessToken;

  //For Screen Loader
  const [loading, setLoading] = useState(false);

  //Showing Post
  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/followers/${id}`,
          {
            headers: {
              token: accesstoken,
            },
          }
        );
        setPost(res.data);
        setLoading(true);
      } catch (error) {}
    };
    getPost();
  }, [id, accesstoken]);

  // console.log(post);

  return (
    <Box flex={2} p={2}>
      <Post />
      {loading ? (
        post &&
        post
          .sort((a, b) => (a.createdat > b.createdat ? -1 : 1))
          .map((item) => (
            <Box key={item.createdat}>
              <MainPost post={item} />
            </Box>
          ))
      ) : (
        <Spinner />
      )}
    </Box>
  );
};

export default Feeds;
