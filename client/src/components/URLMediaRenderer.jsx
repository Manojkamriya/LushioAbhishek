import React, { useState } from 'react';


const getMediaType = (src) => {
 
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv', 'wmv'];
  const extension = src.split('?')[0].split('.').pop().toLowerCase();
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  return 'unknown';
};

const URLMediaRenderer = ({ src, alt }) => {
  const mediaType = getMediaType(src);

  return (
    <>
      {mediaType === 'image' && <img src={src} alt={alt} className="media-preview" />}
      {mediaType === 'video' && (
        <video autoPlay muted loop src={src} className="media-preview">
          Your browser does not support the video tag.
        </video>
      )}
      {mediaType === 'unknown' && <p>Unsupported file type</p>}
    </>
  );
};
export default URLMediaRenderer;