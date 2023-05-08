// Create virtual node
export function h (tag, props, children) {
  return {
    tag,
    props,
    children
  }
}

export function mount (vnode, container) {
  // Create the element
  const el = (vnode.el = document.createElement(vnode.tag))

  // Set properties
  for (const key in vnode.props) {
    if (typeof vnode.props[key] === 'function') {
      el.addEventListener(key, vnode.props[key])
      continue
    }
    el.setAttribute(key, vnode.props[key])
  }

  // Handle children
  if (typeof vnode.children === 'string') {
    el.textContent = vnode.children
  } else {
    vnode.children?.forEach(child => {
      mount(child, el)
    })
  }

  // Mount to the DOM
  container.appendChild(el)
}

// Unmount a virtual node from the DOM
export function unmount (vnode) {
  vnode.el.parentNode.removeChild(vnode.el)
}

// Take 2 virtual nodes, compare & figure out what's the difference
export function patch (n1, n2) {
  const el = (n2.el = n1.el)

  // Case where the nodes are of different tags
  if (n1.tag !== n2.tag) { mount(n2, el.parentNode); unmount(n1) }

  // Case where the nodes are of the same tag
  else {
    // New virtual node has string children
    if (typeof n2.children === 'string') {
      el.textContent = n2.children
    }
    // New virtual node has array children
    else {
      // Old virtual node has string children
      if (typeof n1.children === 'string') {
        el.textContent = ''
        n2.children.forEach(child => mount(child, el))
      }

      // Case where the new vnode has string children
      else {
        const c1 = n1.children
        const c2 = n2.children
        const commonLength = Math.min(c1.length, c2.length)

        // Patch the children both nodes have in common
        for (let i = 0; i < commonLength; i++) {
          patch(c1[i], c2[i])
        }

        // Old children was longer
        // Remove the children that are not "there" anymore
        if (c1.length > c2.length) {
          c1.slice(c2.length).forEach(child => {
            unmount(child)
          })
        }

        // Old children was shorter
        // Add the newly added children
        else if (c2.length > c1.length) {
          c2.slice(c1.length).forEach(child => {
            mount(child, el)
          })
        }
      }
    }
  }
}
