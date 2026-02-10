export default function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="card w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold text-[color:var(--text)]">
          Sign out?
        </h3>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Are you sure you want to sign out from this device?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="btn-primary w-full"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-strong w-full"
            onClick={onConfirm}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
