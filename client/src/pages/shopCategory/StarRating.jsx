import React, { useState, useEffect } from "react";
// import './StarRatng.css';
 // Assuming you have a CSS file for styling

const ratings = [
  { id: 1, name: "Terrible" },
  { id: 2, name: "Bad" },
  { id: 3, name: "OK" },
  { id: 4, name: "Good" },
  { id: 5, name: "Excellent" },
];

const StarRating = () => {
  const [rating, setRating] = useState(null);
  const [delayedRatings, setDelayedRatings] = useState([]);

  useEffect(() => {
    if (rating) {
      const newDelayedRatings = [];
      let delay = 0;
      ratings.forEach((r) => {
        // Add delay to all stars less than or equal to the selected rating
        if (r.id <= rating.id) {
          newDelayedRatings.push({ id: r.id, delay: ++delay });
        }
      });
      setDelayedRatings(newDelayedRatings);
    }
  }, [rating]);

  const handleChange = (e) => {
    const selectedRating = ratings.find((r) => r.id === +e.target.value);
    setRating(selectedRating);
  };

  return (
    <form className="rating">
      <div className="rating__stars" onChange={handleChange}>
        {ratings.map((r) => (
          <div key={r.id}>
            <input
              id={`rating-${r.id}`}
              className={`rating__input rating__input-${r.id}`}
              type="radio"
              name="rating"
              value={r.id}
            />
            <label
              className={`rating__label ${
                delayedRatings.find((dr) => dr.id === r.id)
                  ? `rating__label--delay${delayedRatings.find(
                      (dr) => dr.id === r.id
                    ).delay}`
                  : ""
              }`}
              htmlFor={`rating-${r.id}`}
            >
              <svg
                className="rating__star"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <g transform="translate(16,16)">
                  <circle
                    className="rating__star-ring"
                    fill="none"
                    stroke="#000"
                    strokeWidth="16"
                    r="8"
                    transform="scale(0)"
                  />
                </g>
                <g stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <g transform="translate(16,16) rotate(180)">
                    <polygon
                      className="rating__star-stroke"
                      points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                      fill="none"
                    />
                    <polygon
                      className="rating__star-fill"
                      points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                      fill="#000"
                    />
                  </g>
                  <g transform="translate(16,16)" strokeDasharray="12 12" strokeDashoffset="12">
                    <polyline transform="rotate(0)" points="0 4,0 16" />
                    <polyline transform="rotate(72)" points="0 4,0 16" />
                    <polyline transform="rotate(144)" points="0 4,0 16" />
                    <polyline transform="rotate(216)" points="0 4,0 16" />
                    <polyline transform="rotate(288)" points="0 4,0 16" />
                  </g>
                </g>
              </svg>
              <span className="rating__sr">{r.id} star—{r.name}</span>
            </label>
          </div>
        ))}
      </div>
      {rating && (
        <p className="rating__display">{rating.name}</p>
      )}
    </form>
  );
};

export default StarRating;