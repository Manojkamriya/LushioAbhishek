import React from "react";
import HeightBasedOptions from "./HeightBasedOptions";
import SimpleColorOptions from "./SimpleColorOptions";
const Checker = ({ data }) => {
  const isHeightBased = data &&  "height" in data;
  if (!data) {
    return <p>No product data available</p>;
}

  if (isHeightBased) {
    return <HeightBasedOption data={data} />;
  } else {
    return <SimpleColorOption data={data} />;
  }
};

const HeightBasedOption = ({ data }) => {
  return <HeightBasedOptions data={data} />;
};

const SimpleColorOption = ({ data }) => {
  return <SimpleColorOptions data={data} />;
};

export default Checker;
