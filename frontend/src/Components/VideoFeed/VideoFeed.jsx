import React from "react";
import styled from "styled-components";

const VideoFeed = () => {
  const VideoFeedSection = styled.section`
    display: flex;
    flex-direction: column;
    margin: 40px 10px;
    background-color: #0e0e0e;
    padding: 20px;
    width: 100%;
    height: 65vh;
    border-radius: 20px;
    border: 5px solid #5876ad;
    h2 {
      margin-top: 0;
      font-size: 45px;
      line-height: 1;
      color: #A6A6A6;
      text-align: center;
    }

    hr{
      background-color: #5876ad;
    }
  `;
  return (
    <VideoFeedSection className="some-space">
      <h2>
        Câmera
      </h2>

      <iframe
        allowFullScreen
        title="camera feed"
        webkitallowfullscreen
        mozallowfullscreen
        src="//:0"
        frameBorder="0"
        width="100%"
        height="576"
      />
    </VideoFeedSection>
  );
};

export default VideoFeed;
