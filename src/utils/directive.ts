// import { useUser } from '@/stores'
// const loginState = useUser().loginState

// export const needLogin = {
//   beforeMount(el, _, { transition }) {
//     el._vod = el.style.display === 'none' ? '' : el.style.display
//     if (transition && loginState) {
//       transition.beforeEnter(el)
//     } else {
//       setDisplay(el, loginState)
//     }
//   },
//   mounted(el, _, { transition }) {
//     if (transition && loginState) {
//       transition.enter(el)
//     }
//   },
//   updated(el, _, { transition }) {
//     if (transition) {
//       if (loginState) {
//         transition.beforeEnter(el)
//         setDisplay(el, true)
//         transition.enter(el)
//       } else {
//         transition.leave(el, () => {
//           setDisplay(el, false)
//         })
//       }
//     } else {
//       setDisplay(el, loginState)
//     }
//   },
//   beforeUnmount(el) {
//     setDisplay(el, loginState)
//   },
// }

// function setDisplay(el, value) {
//   el.style.display = value ? el._vod : 'none'
// }
