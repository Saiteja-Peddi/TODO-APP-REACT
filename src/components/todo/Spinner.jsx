import { useLoading } from "./security/LoadingContext";

export default function Spinner() {
  const { loading } = useLoading(); // Access loading state

  if (!loading) return null; // Don't render the spinner if not loading

  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
}
