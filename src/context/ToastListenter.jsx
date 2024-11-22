import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { eventBus, SHOW_MSG } from '../services/event-bus.service'

const ToastListener = () => {
  useEffect(() => {
    const unsubscribe = eventBus.on(SHOW_MSG, (msg) => {
      const { txt, type } = msg
      if (type === 'positive') toast.success(txt)
      else if (type === 'negative') toast.error(txt)
      else toast.info(txt)
    })

    return () => unsubscribe()
  }, [])

  return <ToastContainer position="top-center" autoClose={3000} />
}

export default ToastListener
