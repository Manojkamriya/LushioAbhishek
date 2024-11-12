import React from 'react';
const getMediaType = (src, file) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv', 'wmv'];

  if (src.startsWith('blob:') && file) {
    const type = file.type;
    if (type.startsWith('image/')) {
      return 'image';
    } else if (type.startsWith('video/')) {
      return 'video';
    }
  } else {
    const extension = src.split('.').pop().toLowerCase();
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    }
  }

  return 'unknown';
};

const MediaRenderer = (props) => {
  const mediaType = getMediaType(props.src, props.file);
  
  return (
    <>
      {mediaType === 'image' && (
        <img src={props.src} alt={props.alt} className={props.className} onClick={props.onClick} />
      )}
      {mediaType === 'video' && (
        <video autoPlay loop muted  playsInline src={props.src} className={props.className} onClick={props.onClick}>
          Your browser does not support the video tag.
        </video>
      )}
      {mediaType === 'unknown' && (
        <p>Unsupported file type</p>
      )}
    </>
  );
};

export default MediaRenderer;
