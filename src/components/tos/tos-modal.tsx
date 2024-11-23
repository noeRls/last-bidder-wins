import { Link } from "react-router-dom";

interface TosModalProps {
  subtitle: string;
  additionalSections: {bold: string, content: string}[]
  onAgree: () => void;
  onCancel: () => void;
}

export function TosModal(props: TosModalProps) {
  return <div className="modal modal-open">
  <div className="modal-box max-w-xl">
    <h2 className="text-xl font-bold mb-4">Important Disclaimer</h2>
    <p className="text-sm text-gray-500 mb-4">
      {props.subtitle}:
    </p>
    <ul className="list-disc text-sm text-gray-600 space-y-2 mb-4 ml-6">
      {props.additionalSections.map(({bold, content}) => {
        return (
          <li key={bold}>
          <strong>{bold}:</strong>  {content}
        </li>
        )
      })}
      <li>
        <strong>Autonomous Platform:</strong> This platform operates on blockchain smart contracts and is provided "as-is." The creator has no control over or access to funds and assumes no responsibility for losses, errors, or disputes.
      </li>
      <li>
        <strong>User Responsibility:</strong> You are solely responsible for complying with all applicable laws and regulations in your jurisdiction. The creator assumes no liability for any misuse of this platform.
      </li>
      <li>
        <strong>Experimental Nature:</strong> This is an experimental platform. You understand and accept all risks, including the possibility of bugs, exploits, or technical failures.
      </li>
    </ul>
    <p className="text-sm text-gray-500 mb-4">
      For full details, please review our{" "}
      <Link
        to="/tos"
        className="link"
      >
        Terms of Service
      </Link>.
    </p>
    <div className="modal-action">
      <button className="btn btn-secondary" onClick={props.onCancel}>
        Cancel
      </button>
      <button className="btn btn-accent" onClick={props.onAgree}>
        I Agree
      </button>
    </div>
  </div>
</div>
}