import { h, mount, patch } from './core.js'
import { reactive, watchEffect, computed, watch } from './reactivity.js'
// ----------------------------
const state = reactive({
  count: 0
})

function renderCount (clickCount) {
  return h('div', { class: 'container', click: () => state.count++ }, [
    h('h1', null, clickCount),
    h('p', null, 'clicks')
  ])
}

let previousVnodeCount
watchEffect(() => {
  if (!previousVnodeCount) {
    previousVnodeCount = renderCount(String(state.count))
    mount(previousVnodeCount, document.getElementById('app'))
  } else {
    const newVnode = renderCount(String(state.count))
    patch(previousVnodeCount, newVnode)
    previousVnodeCount = newVnode
  }
})

// ---------------------------------------------------------

function renderMesage (message) {
  return h('div', { class: 'message' }, message)
}

const message = computed(() => state.count && state.count % 10 === 0
  ? `Congrats with ${state.count} 🌈`
  : null
)

let previousVnodeMessage
watchEffect(() => {
  if (!previousVnodeMessage) {
    previousVnodeMessage = renderMesage(message.value)
    mount(previousVnodeMessage, document.getElementById('app'))
  } else {
    const newVnode = renderMesage(message.value)
    patch(previousVnodeMessage, newVnode)
    previousVnodeMessage = newVnode
  }
})

// -----------------------------------------------------------
function renderState2 (lvl) {
  return h('div', { class: 'lvl' }, lvl)
}
const state2 = reactive({ lvl: 10 })

watch(() => state.count, () => {
  if (state.count && state.count % 10 === 0) {
    state2.lvl = state.count / 10
  }
})

let previousVnodeState2
watchEffect(() => {
  console.log(state2.lvl, 'lvl')
  if (!previousVnodeState2) {
    previousVnodeState2 = renderState2(String(state2.lvl))
    mount(previousVnodeState2, document.getElementById('app'))
  } else {
    const newVnode = renderState2(String(state2.lvl))
    patch(previousVnodeState2, newVnode)
    previousVnodeState2 = newVnode
    console.log(previousVnodeState2, 'dsaadsads')
    console.log(document.getElementById('app'), '2')
  }
})
