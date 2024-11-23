import { UseQueryResult } from "@tanstack/react-query";

export function LoadingSpinnerOrError({ queries }: { queries: UseQueryResult[] }) {
  const errorQuery = queries.find(q => q.isError);
  if (errorQuery) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-red-500">An Error Occurred</h2>
        <p className="text-gray-700">{errorQuery.error.message || "Something went wrong!"}</p>
      </div>
    );
  }

  return (
    <div className="text-center my-32">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}