// cartMessages.js
export const renderCartMessages = (totalAmount) => {
   
    if (totalAmount >= 2000) {
      return (
        <>
          <p style={{ color: "green" }}>You are eligible for a 10% discount!</p>
          <p style={{ color: "blue" }}>
            Great! Your cart amount is above ₹2000. Enjoy your shopping!
          </p>
        </>
      );
    }
    if (totalAmount >= 1000) {
      return <p style={{ color: "red" }}>You are eligible for a 5% discount!</p>;
    }
    if (totalAmount >= 500) {
      return (
        <p style={{ color: "orange" }}>
          Add ₹{1000 - totalAmount} more to be eligible for a 5% discount.
        </p>
      );
    }
    return null;
  };
  