import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="fixed top-6.5 right-12 text-white bg-gray-800 px-4 rounded cursor-pointer z-50"
    >
      /
    </button>
  );
}

export default HomeButton;
