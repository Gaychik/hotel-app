'use client'; // Этот компонент интерактивный (меняет состояние)

import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images || images.length === 0) {
    return <div>Нет изображений</div>;
  }

  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div>
      {/* Главное изображение */}
      <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden">
        <Image
          src={mainImage}
          alt="Фото номера"
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300 ease-in-out"
        />
      </div>
      {/* Миниатюры */}
      <div className="flex space-x-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative w-24 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
              mainImage === image ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`Миниатюра ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
