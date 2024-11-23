import { useSetupBetState } from "../bet/bet-data";

export default function DevPage() {
  const setupBetState = useSetupBetState();

  return (
    <div>
      <button className="btn btn-accent btn-wide" onClick={() => setupBetState.mutateAsync()}>
        Setup
      </button>
      <div>
        {`errorMessage=${setupBetState.error?.message} isPending=${setupBetState.isPending} isSuccess=${setupBetState.isSuccess}`}
      </div>
    </div>
  );
}
