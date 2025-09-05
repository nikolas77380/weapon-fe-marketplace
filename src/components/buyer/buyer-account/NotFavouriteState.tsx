import React from "react";

const NotFavouriteState = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <div className="text-6xl mb-4">💔</div>
      <p className="font-medium font-roboto text-lg text-gray-500">
        No favourites yet.
      </p>
      <p className="font-light font-roboto text-sm text-gray-400 mt-2">
        Start adding products to your favourites!
      </p>
    </div>
  );
};

export default NotFavouriteState;
