import { RiStarFill, RiStarHalfFill, RiStarLine } from "react-icons/ri";


type Props = {
  rating: number;
  maxStars?: number;
};

const StarRatings = ({ rating, maxStars = 5 }: Props) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      // Full star
      stars.push(<RiStarFill key={i} className="text-(--primary)" size={12} />);
    } else if (rating >= i - 0.5) {
      // Half star
      stars.push(<RiStarHalfFill key={i} className="text-(--primary)" size={12} />);
    } else {
      // Empty star
      stars.push(<RiStarLine key={i} className="text-(--primary)" size={12} />);
    }
  }

  return <div className="flex gap-.5 text-(--primary)">{stars}</div>;
};

export default StarRatings;