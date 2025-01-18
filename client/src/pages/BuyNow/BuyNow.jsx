import React,{useState,useContext,useEffect,useRef} from "react";
import { useLocation } from "react-router-dom";
import { useAddress } from "../../components/context/AddressContext";
import PlaceOrder from "../cartItems/PlaceOrder";
import PriceDetails from "../cartItems/PriceDetails";
import { UserContext } from "../../components/context/UserContext";
import { renderCartMessages } from "../cartItems/cartUtils"
import axios from "axios";
const BuyNowPage = () => {
 // Context and Location Data
const { user } = useContext(UserContext);
const location = useLocation();
const { selectedAddress } = useAddress();
const queryParams = new URLSearchParams(location.search);

// Query Parameters
const heightCategory = queryParams.get("heightCategory");
const selectedColor = queryParams.get("selectedColor");
const selectedSize = queryParams.get("selectedSize");
const name = queryParams.get("name");
const productId = queryParams.get("productId");
const imageURL = queryParams.get("imageURL");

// Form and Address States
const [formData, setFormData] = useState({
  name: selectedAddress?.name || "",
  mobile: selectedAddress?.contactNo || "",
});

// Payment and Discount States
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("phonepe");
const [discountPercentage, setDiscountPercentage] = useState(0);
const [couponApplied, setCouponApplied] = useState("");
const [useWalletPoints, setUseWalletPoints] = useState(true);
const [walletPoints, setWalletPoints] = useState(null);
const additionalDiscountRef = useRef(0); // Reference for additional discounts

// Product and Interaction States
const [product, setProduct] = useState(null);
const [isActive, setIsActive] = useState(false);

// UI and Loading States
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [showNotification, setShowNotification] = useState(false);
const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    // Fetch product when `id` changes
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products/${productId}`
        );

        const data = await response.json();
setProduct(data);
        
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]); 
  const getSelectedTotalAmount = () => {
    if(product){
      return product.discountedPrice;
    }
   
 
  };
  const getTotalWithWalletAndDiscount = () => {
    let total = getSelectedTotalAmount();

    // Apply wallet points if applicable
    if (useWalletPoints && walletPoints > 0) {
      total = Math.max(0, total - walletPoints); // Ensure total doesn't go below zero
    }

    // Calculate coupon discount
  //  const couponDiscountAmount = (total * discountPercentage) / 100; // Calculate coupon discount
  const couponDiscountAmount = Math.ceil(discountPercentage);
  total = Math.max(0, total - couponDiscountAmount); 
  // const couponDiscountAmount = discountPercentage;
  //   total = Math.max(0, total - couponDiscountAmount); 

    // Apply additional discount for payment method
    if (selectedPaymentMethod !== "cashOnDelivery") {
      const additionalDiscount =  Math.ceil(total * 0.05); // 5% additional discount for online payment
      additionalDiscountRef.current = additionalDiscount; // Store it in useRef without causing re-renders
      total = Math.max(0, total - additionalDiscount); // Apply additional discount and ensure total doesn't go below zero
    }

    // No additional discount for "COD"

    return total;
  };
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/wallet/${user.uid}`
          );
          const data = response.data;
          setWalletPoints(data.totalCredits);
          //   console.log("Fetched user data:", response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);
  const selectedProductDetails = [
    {
      productId,         // Assuming these variables are defined earlier
      heightCategory,    // and hold the respective values.
      selectedColor,
      selectedSize,
      name,
      price: product?.discountedPrice || 0, // Correcting property access for discountedPrice
    }
  ];
  
  const orderDetails = {
    uid: user?.uid,
    modeOfPayment: selectedPaymentMethod,
    totalAmount: getSelectedTotalAmount(),
    payableAmount: getTotalWithWalletAndDiscount(),
    discount: getSelectedTotalAmount() - getTotalWithWalletAndDiscount(),
    lushioCurrencyUsed: useWalletPoints && walletPoints,
    couponCode: couponApplied,
    address: selectedAddress,
    orderedProducts: selectedProductDetails,
 //   paymentData: paymentData,
  
  };

  const handleWalletCheckboxChange = () => {
    setUseWalletPoints(!useWalletPoints);
  };
  const handlePayment = async () => {
   
    const { name, mobile } = formData;

    const data = {
      name,
      mobile,
      amount: getTotalWithWalletAndDiscount(),
      MUID: "MUIDW" + Date.now(),
      transactionId: "T" + Date.now(),
    };
     // Combine orderDetails with paymentData
  const combinedData = {
    ...orderDetails, // Include all the properties of orderDetails
    ...data,  // Override or add properties from paymentData
  };

   
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/payment/`,
        combinedData
      )
      .then((response) => {
       
     //   setPaymentData(response.data);
        if (
          response.data
          && response.data.data.instrumentResponse.redirectInfo.url
        ) {
         
          window.location.href =
            response.data.data.instrumentResponse.redirectInfo.url;
           
        
        } else {
          console.error("Redirect URL not found in response:", response.data);
        }

      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
 
  const createOrder = async () => {
   
    try {
      setIsActive(true);
   
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/createOrder`,
        orderDetails
      );
     
    
   //   await deleteCartItems(selectedProductIds);
      setIsActive(false);
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 4000);
    } catch (error) {
      console.log(error);
    }
    finally{
      setIsActive(false);
    }
  };
  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    if (selectedPaymentMethod === "phonepe") {
      await handlePayment();
     // await createOrder();
    } else {
      await createOrder();
     
    }
  };
  if (loading)
    return (
      <div className="loader-container">
        {" "}
        <span className="loader"></span>
      </div>
    );
  const shippingFee = "FREE";
  return (
    <div>
        {showNotification && (
        <div className="notification-container">
   <div className="cart-notification" style={{ aspectRatio: 180 / 25 }}>
          Select Address to Proceed
        </div>
        </div>
     
      )}
      {isActive && (
        <div className="spinner-overlay">
          <div></div>
        </div>
      )}
         <div className="selected-address-container">
        {selectedAddress ? (
          <div className="selected-address">
            <h4>Delivery Address:</h4>
            <div style={{ display: "flex" }}>
              <strong>{selectedAddress.name},</strong>{" "}
              <strong>{selectedAddress.pinCode} </strong>
            </div>

            <span>{selectedAddress.flatDetails},</span>
            <span>{selectedAddress.areaDetails},</span>
            {selectedAddress.landmark && (
              <span>{selectedAddress.landmark},</span>
            )}
            <span>
              {selectedAddress.townCity}, {selectedAddress.state},
            </span>
          </div>
        ) : (
          <p>No addresses found. Please add a new address.</p>
        )}
        <PlaceOrder />
      </div>
      <div className="cartitems">
      <div className="select-all-buttons">
  <div className="itemContainer-base-item">
     <div className={`cartitems-format `}>
      <div className="itemContainer-base-itemLeft">
    
        <img
          style={{
            background: "rgb(244, 255, 249)",
            height: "155px",
            width: "111px",
          }}
          src={imageURL} 
          alt=""
          className="image-base-imgResponsive"
        />
      </div>
      <div className="itemContainer-base-itemRight">
     
        <div className="itemContainer-base-details">
          <div className="itemContainer-base-brand">LUSHIO</div>
       <div className="itemContainer-base-description">
       {name} 
          </div>
          <p className="product-color">
           {  heightCategory !== "null" && <p> <strong>Height:</strong> {heightCategory}</p>}
          </p>
          <p className="product-color">
            <strong>Color:</strong> {selectedColor}
            <span
              className="color-box"
              style={{ backgroundColor: "pink" }}
            ></span>
          </p>
          <div className="itemContainer-base-sizeAndQtyContainer">
            <div className="itemContainer-base-sizeAndQty">
              <div className="itemComponents-base-size">
                <span className="">Size:  {selectedSize}</span>
                {/* <img src="/Images/icons/quantityDropdown.svg" alt=""/> */}
              </div>

              <div className="itemComponents-base-quantity">
                <span className="">Qty: 1</span>
                <img src="/Images/icons/quantityDropdown.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="itemContainer-base-description">
          {/* ₹ {item.product.price * item.quantity}  */}
          </div>
         
        </div>

        <div className="returnPeriod-base-returnItem">
          <img
            src="/Images/icons/return.svg"
            alt=""
            className="returnPeriod-base-returnIcon"
          />

          <div className="returnPeriod-base-returnText">
            <span className="returnPeriod-base-returnDays">7 days</span> return
            available
          </div>
        </div>
      </div>
      </div>
    </div>

  </div>
      </div>
      <PriceDetails
          couponApplied={couponApplied}
          setCouponApplied={setCouponApplied}
          discountPercentage={discountPercentage}
          setDiscountPercentage={setDiscountPercentage}
          walletPoints={walletPoints}
          useWalletPoints={useWalletPoints}
          handleWalletCheckboxChange={handleWalletCheckboxChange}
          getSelectedTotalAmount={getSelectedTotalAmount}
          getSelectedAmount={getSelectedTotalAmount}
          getTotalWithWalletAndDiscount={getTotalWithWalletAndDiscount}
          renderCartMessages={renderCartMessages}
          shippingFee={shippingFee}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          handleCreateOrder={handleCreateOrder}
        />
     {/* <PriceDetails/> */}
     <div className="priceBlock-button-mobile">
      {selectedPaymentMethod==="cashOnDelivery" && <p>Pay Online to get ₹{additionalDiscountRef.current} OFF</p>}
      {selectedPaymentMethod==="phonepe" && <p>Hurray you get ₹{additionalDiscountRef.current} OFF by paying online</p>}
        <button onClick={handleCreateOrder} className="proceed-to-pay-button">
          PLACE ORDER ₹{getTotalWithWalletAndDiscount()}
        </button>
      </div>
    </div>
  );
};

export default BuyNowPage;
