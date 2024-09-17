import React, { useContext } from "react";
import { ShopContext } from "../../components/context/ShopContext";
import EmptyWishList from "./EmptyWishList";
import ProductCard from "../home/ProductCard";
function WishList() {
  const { all_product, wishlistItems } = useContext(ShopContext);

  const wishlistHasItems = Object.values(wishlistItems).some(
    (isInWishlist) => isInWishlist === true
  );

  if (!wishlistHasItems) {
    return <EmptyWishList />; 
  }
  return (
    <div className="wishlist-container">
      {all_product.map((e, id) => {
        if (wishlistItems[e.id] === true) {
          return (
            <ProductCard
              // key={i}
              id={e.id}
              description={e.name}
              image1={e.image}
              image2={e.image}
              newPrice={e.new_price}
              oldPrice={e.old_price}
              discount={Math.round(
                ((e.old_price - e.new_price) / e.old_price) * 100
              )}
              rating={e.rating}
              liked={true} 
            />
          );
        }
        return null;
      })}
    </div>
  );
}

export default WishList;
