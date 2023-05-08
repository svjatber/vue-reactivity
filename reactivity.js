let activeEffect

class Dep {
  subscribers = new Set()
  depend () {
    if (activeEffect) this.subscribers.add(activeEffect)
  }

  notify (value) {
    this.subscribers.forEach((sub) => sub(value))
  }
}

export function watchEffect (fn) {
  activeEffect = fn
  console.log(activeEffect)
  fn()
  activeEffect = null
}

export function watch (val, fn) {
  activeEffect = fn
  val()
  activeEffect = null
}

export function computed (fn) {
  return Object.defineProperty({}, 'value', { get () { return fn() } })
}

export function reactive (obj) {
  Object.keys(obj).forEach((key) => {
    const dep = new Dep()
    let value = obj[key]
    Object.defineProperty(obj, key, {
      get () {
        dep.depend()
        console.log(value, 'react')
        return value
      },
      set (newValue) {
        if (newValue !== value) {
          value = newValue
          dep.notify(value)
        }
      }
    })
  })

  return obj
}
