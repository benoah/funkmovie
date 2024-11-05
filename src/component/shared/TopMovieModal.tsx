// src/component/movie/TopModal.tsx
import React from "react";

type TopModalProps = {
  movie: any;
  open: boolean;
  onClose: () => void;
};

const TopModal: React.FC<TopModalProps> = ({ movie, open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal">
      <button onClick={onClose}>Close</button>
      <h2>{movie.title || movie.name}</h2>
      {/* Additional movie details */}
    </div>
  );
};

export default TopModal;
