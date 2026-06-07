'use client'

type IToastType  =
  'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'

export const showToast = async (
  message: string,
  type: IToastType = 'success'
) => {
  
  const bootstrap = await import('bootstrap')
  const toastEl = document.getElementById('app-toast')
  const toastBody = document.getElementById('app-toast-body')

  if (!toastEl || !toastBody) return

  toastBody.innerText = message
  toastEl.className = `toast text-bg-${type} border-0`

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl)
  toast.show()
}

export default function Toast() {
  return (
    <div className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3">
      <div
        id="app-toast"
        className="toast text-bg-primary border-0"
      >
        <div className="d-flex">
          <div
            id="app-toast-body"
            className="toast-body"
          >
          </div>

          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
          />
        </div>
      </div>
    </div>
  )
}