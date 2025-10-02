// components/ImageCropper.jsx
"use client";

import { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { CheckIcon } from '@heroicons/react/24/outline';
import ModalDesk from '@/ui/ModalDesk';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ImageCropper = ({
  image,
  onCropComplete,
  onCancel,
  aspect = 1,
  open,
}) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(croppedImage);
    }
  };

  return (
    <ModalDesk
      open={open}
      onClose={onCancel}
      title="برش تصویر"
      description="ناحیه مورد نظر را با کشیدن گوشه‌ها یا حاشیه‌ها انتخاب کنید"
    >
      <div className="space-y-4">
        {/* Cropper Area */}
        <div className="flex justify-center max-h-[50vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="max-w-full"
            keepSelection
          >
            <img
              ref={imgRef}
              src={image}
              alt="تصویر برای برش"
              onLoad={onImageLoad}
              className="max-w-full max-h-[45vh]"
              style={{ display: 'block' }}
            />
          </ReactCrop>
        </div>

        {/* Controls */}
        <div className="flex gap-3 pt-4 border-t border-secondary-200">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-medium"
          >
            انصراف
          </button>
          <button
            onClick={handleCropComplete}
            disabled={!completedCrop}
            className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            تایید برش
          </button>
        </div>
      </div>
    </ModalDesk>
  );
};

async function getCroppedImg(image, crop) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'cropped-image.jpg', { 
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      resolve(file);
    }, 'image/jpeg', 0.95);
  });
}

export default ImageCropper;