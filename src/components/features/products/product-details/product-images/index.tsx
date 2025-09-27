"use client";

import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  //hooks
  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <>
      <div className="spac-y-4">
        <Image
          src={currentImage}
          alt="Product image"
          width={400}
          height={400}
          className="m-auto"
        ></Image>

        <div className="flex gap-2">
          {images.map((image) => {
            return (
              <Image
                onClick={() => setCurrentImage(image)}
                key={image}
                src={image}
                alt="Product image"
                width={100}
                height={100}
                className={`border-1 rounded-md hover:border-orange-500 ${
                  currentImage == image && "border-orange-500"
                }`}
              ></Image>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProductImages;
