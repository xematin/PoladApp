// All backend API calls for PoladApp Mini App live here.
const BASE_URL = import.meta.env.VITE_API_URL || ''

const API = `${BASE_URL}/api/v1`

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch (_) {
      /* ignore */
    }
    throw new Error(detail)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  initUser: (initData) =>
    request('/miniapp/init/', {
      method: 'POST',
      body: JSON.stringify({ init_data: initData }),
    }),

  getProducts: () => request('/miniapp/products/'),

  createOrder: (data) =>
    request('/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getOrder: (trackingCode) => request(`/orders/${trackingCode}/`),

  getUserOrders: (tgId) => request(`/users/${tgId}/orders/`),

  getUserProfile: (tgId) => request(`/users/${tgId}/profile/`),

  createNowPaymentsInvoice: (orderId) =>
    request('/payments/nowpayments/create/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    }),

  submitCardReceipt: (orderId, receiptData) =>
    request('/payments/card/submit/', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, ...receiptData }),
    }),
}

export default api
