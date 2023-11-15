import { useState } from "react";
import { Review } from "../mocks/types";
import axios from "axios";

const Component = () => {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  const handleGetReviews = () =>
    axios.post("/reviews", { foo: "bar" }).then((res) => setReviews(res.data));

  return (
    <div>
      <button onClick={handleGetReviews}>Load reviews</button>
      {reviews && (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>{review.text}</p>
              <p>{review.author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Component;
