/* eslint-disable react-refresh/only-export-components */
import { ReactNode, Suspense, useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { AccountChecker } from '../account/account-ui'
import { ClusterChecker, ClusterUiSelect, ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'

export function UiLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex p-2 bg-base-300 text-neutral-content flex-row flex-wrap w-full justify-between">
        <div className="flex">
          <Link className="btn btn-ghost normal-case text-xl" to="/">
            <img className="h-10" alt="Logo" src={`${import.meta.env.BASE_URL}/last-bidder-wins-logo.png`} />
          </Link>
        </div>
        <div className="flex gap-2">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>
      <div className="overflow-x-auto flex flex-grow flex-col">
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
        <div className="px-4 py-6 bg-base-100 flex-grow">
          <Suspense
            fallback={
              <div className="text-center my-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            {children}
          </Suspense>
          <Toaster position="bottom-right" />
        </div>
        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
          <aside>
            <div className="flex flex-row gap-6 flex-wrap">
              <Link to="/tos" className="link">Terms of services</Link>
                <a
                  className="link hover:text-white"
                  href="https://github.com/noeRls/last-bidder-wins"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
            </div>
          </aside>
        </footer>
      </div>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
      </div>,
    )
  }
}
