/**
 * mini-react — the small part of React this game actually uses.
 * ---------------------------------------------------------------------------
 * Exposes the same two globals the app was written against, so nothing in
 * src/js/ has to change:
 *
 *   window.React            createElement, Fragment, useState, useEffect, useRef
 *   window.ReactDOMClient   createRoot(container).render(element)
 *
 * Why this exists: React's own build is ~460KB of the ~546KB single-file
 * bundle, and Claude's Artifact host stops rendering a page once it has that
 * much real code to process. The app only ever touched the six APIs above and
 * uses no JSX, so the honest fix was to implement those six rather than ship a
 * general-purpose library to use a corner of it. The bundle drops to ~90KB.
 *
 * What it deliberately does NOT do: concurrent rendering, error boundaries,
 * class components, context, portals, memo, or the synthetic event system.
 * Events are attached with addEventListener, with one React-ism preserved:
 * `onChange` binds to the native `input` event, because that is the React
 * semantic the answer box was written against.
 *
 * Updates are diffed rather than re-created, which is not an optimisation
 * here — it is what keeps the answer box focused and the caret in place while
 * the player types.
 */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var Fragment = { fragment: true };

  /* -------------------------------------------------------------------------
     Elements
  ------------------------------------------------------------------------- */

  /**
   * Children arrive as a rest argument and may nest arrays (every `.map()` in
   * the UI produces one). They are flattened once here so the reconciler only
   * ever sees a flat list, and nullish/boolean children are dropped the way
   * React drops them — `cond ? h(...) : null` is used throughout.
   */
  function flatten(list, out) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c === null || c === undefined || c === false || c === true) continue;
      if (Array.isArray(c)) flatten(c, out);
      else out.push(c);
    }
    return out;
  }

  function createElement(type, props) {
    var rest = [];
    for (var i = 2; i < arguments.length; i++) rest.push(arguments[i]);
    props = props || {};

    var clean = {};
    for (var k in props) {
      if (k !== 'key' && k !== 'ref') clean[k] = props[k];
    }
    return {
      type: type,
      props: clean,
      key: props.key === undefined || props.key === null ? null : String(props.key),
      ref: props.ref || null,
      children: flatten(rest, []),
    };
  }

  function keyOf(vnode) {
    return typeof vnode === 'object' ? vnode.key : null;
  }

  /** The identity used to decide "same node, update it" vs "replace it". */
  function typeOf(vnode) {
    return typeof vnode === 'object' ? vnode.type : '#text';
  }

  /* -------------------------------------------------------------------------
     Hooks

     Hook state lives on the component instance, addressed by call order, which
     is why the rules of hooks exist. `current` is set for exactly the duration
     of one component call.
  ------------------------------------------------------------------------- */

  var current = null;
  var hookIndex = 0;
  var pendingEffects = [];

  function slot(initialise) {
    var hooks = current.hooks;
    var i = hookIndex++;
    if (hooks.length <= i) hooks.push(initialise());
    return hooks[i];
  }

  function useState(initial) {
    var inst = current;
    var hook = slot(function () {
      return { value: typeof initial === 'function' ? initial() : initial };
    });
    if (!hook.set) {
      hook.set = function (next) {
        var value = typeof next === 'function' ? next(hook.value) : next;
        // Bailing on an unchanged value keeps a re-render out of the way of
        // the caret when a keystroke produces the same string.
        if (Object.is(value, hook.value)) return;
        hook.value = value;
        schedule(inst.root);
      };
    }
    return [hook.value, hook.set];
  }

  function useRef(initial) {
    return slot(function () { return { current: initial }; });
  }

  function useEffect(fn, deps) {
    var hook = slot(function () { return { deps: null, cleanup: null, fresh: true }; });
    var changed =
      hook.fresh ||
      !deps ||
      !hook.deps ||
      deps.length !== hook.deps.length ||
      deps.some(function (d, i) { return !Object.is(d, hook.deps[i]); });

    if (changed) {
      hook.fresh = false;
      hook.deps = deps ? deps.slice() : null;
      pendingEffects.push({ hook: hook, fn: fn });
    }
  }

  /** Run after the DOM is committed, previous cleanup first, as React does. */
  function flushEffects() {
    var queue = pendingEffects;
    pendingEffects = [];
    for (var i = 0; i < queue.length; i++) {
      var e = queue[i];
      runCleanup(e.hook);
      var result = e.fn();
      e.hook.cleanup = typeof result === 'function' ? result : null;
    }
  }

  function runCleanup(hook) {
    if (typeof hook.cleanup === 'function') {
      try { hook.cleanup(); } catch (err) { /* a failed cleanup must not stop the render */ }
      hook.cleanup = null;
    }
  }

  /* -------------------------------------------------------------------------
     Props
  ------------------------------------------------------------------------- */

  // Attribute names that differ from the prop names the app writes.
  var ALIAS = {
    className: 'class',
    autoComplete: 'autocomplete',
    autoCorrect: 'autocorrect',
    autoCapitalize: 'autocapitalize',
    htmlFor: 'for',
    tabIndex: 'tabindex',
    inputMode: 'inputmode',
    maxLength: 'maxlength',
    spellCheck: 'spellcheck',
    readOnly: 'readonly',
  };

  // These must be set as DOM properties, not attributes: an attribute only
  // seeds the initial value and would leave the live input out of sync.
  var AS_PROPERTY = { value: 1, checked: 1, disabled: 1, selected: 1 };

  function isHandler(name) {
    return name.charCodeAt(0) === 111 && name.charCodeAt(1) === 110; // "on"
  }

  function eventName(name) {
    var n = name.slice(2).toLowerCase();
    // React's onChange fires per keystroke; the native equivalent is `input`.
    return n === 'change' ? 'input' : n;
  }

  function setStyleValue(dom, key, value) {
    if (key.charCodeAt(0) === 45) dom.style.setProperty(key, value); // custom property
    else dom.style[key] = value === null || value === undefined ? '' : value;
  }

  function applyStyle(dom, oldStyle, newStyle) {
    oldStyle = oldStyle || {};
    newStyle = newStyle || {};
    for (var a in oldStyle) if (!(a in newStyle)) setStyleValue(dom, a, '');
    for (var b in newStyle) if (oldStyle[b] !== newStyle[b]) setStyleValue(dom, b, newStyle[b]);
  }

  function applyProps(dom, oldProps, newProps, svg) {
    var name;

    for (name in oldProps) {
      if (name in newProps) continue;
      if (isHandler(name) && typeof oldProps[name] === 'function') {
        dom.removeEventListener(eventName(name), oldProps[name]);
      } else if (name === 'style') {
        dom.removeAttribute('style');
      } else if (AS_PROPERTY[name] && !svg) {
        if (name === 'value') dom.value = '';
        else dom[name] = false;
      } else {
        dom.removeAttribute(ALIAS[name] || name);
      }
    }

    for (name in newProps) {
      var next = newProps[name];
      var prev = oldProps[name];

      if (isHandler(name)) {
        if (prev === next) continue;
        if (typeof prev === 'function') dom.removeEventListener(eventName(name), prev);
        if (typeof next === 'function') dom.addEventListener(eventName(name), next);
      } else if (name === 'style') {
        applyStyle(dom, prev, next);
      } else if (AS_PROPERTY[name] && !svg) {
        if (name === 'value') {
          var v = next === null || next === undefined ? '' : String(next);
          if (dom.value !== v) dom.value = v;
        } else {
          dom[name] = !!next;
        }
      } else if (prev === next) {
        continue;
      } else if (next === null || next === undefined || next === false) {
        dom.removeAttribute(ALIAS[name] || name);
      } else {
        // SVG attribute names are case-sensitive (viewBox), so they pass
        // through untouched; the alias table only covers HTML.
        dom.setAttribute(ALIAS[name] || name, next === true ? '' : String(next));
      }
    }
  }

  /* -------------------------------------------------------------------------
     Instances

     One instance per rendered node, mirroring the DOM. A component or fragment
     owns no DOM of its own, so `domNodes` walks through it to whatever its
     descendants produced.
  ------------------------------------------------------------------------- */

  function domNodes(inst, out) {
    if (inst.kind === 'text' || inst.kind === 'host') out.push(inst.dom);
    else if (inst.kind === 'component') domNodes(inst.child, out);
    else for (var i = 0; i < inst.children.length; i++) domNodes(inst.children[i], out);
    return out;
  }

  function renderComponent(inst) {
    var previous = current;
    var previousIndex = hookIndex;
    current = inst;
    hookIndex = 0;

    var props = inst.vnode.props;
    if (inst.vnode.children.length) {
      props = Object.assign({}, props, { children: inst.vnode.children });
    }

    var out;
    try {
      out = inst.vnode.type(props);
    } finally {
      current = previous;
      hookIndex = previousIndex;
    }
    // A component returning null renders nothing; an empty text node is the
    // simplest way to hold its place in the child list.
    return out === null || out === undefined || out === false ? '' : out;
  }

  function create(vnode, root, svg) {
    if (typeof vnode !== 'object') {
      var text = String(vnode);
      return { kind: 'text', key: null, type: '#text', text: text, dom: document.createTextNode(text) };
    }

    if (vnode.type === Fragment) {
      var frag = { kind: 'fragment', key: vnode.key, type: Fragment, vnode: vnode, root: root, children: [] };
      frag.children = vnode.children.map(function (c) { return create(c, root, svg); });
      return frag;
    }

    if (typeof vnode.type === 'function') {
      var comp = { kind: 'component', key: vnode.key, type: vnode.type, vnode: vnode, root: root, hooks: [], child: null };
      comp.child = create(renderComponent(comp), root, svg);
      return comp;
    }

    var inSvg = svg || vnode.type === 'svg';
    var dom = inSvg ? document.createElementNS(SVG_NS, vnode.type) : document.createElement(vnode.type);
    var host = { kind: 'host', key: vnode.key, type: vnode.type, vnode: vnode, root: root, dom: dom, svg: inSvg, ref: null, children: [] };

    applyProps(dom, {}, vnode.props, inSvg);
    host.children = vnode.children.map(function (c) { return create(c, root, inSvg); });
    var nodes = [];
    for (var i = 0; i < host.children.length; i++) domNodes(host.children[i], nodes);
    for (var j = 0; j < nodes.length; j++) dom.appendChild(nodes[j]);

    if (vnode.ref) { vnode.ref.current = dom; host.ref = vnode.ref; }
    return host;
  }

  function update(inst, vnode, root, svg) {
    if (inst.kind === 'text') {
      var text = String(vnode);
      if (inst.text !== text) { inst.text = text; inst.dom.nodeValue = text; }
      return inst;
    }

    if (inst.kind === 'fragment') {
      inst.vnode = vnode;
      inst.children = reconcileList(inst.children, vnode.children, root, svg);
      return inst;
    }

    if (inst.kind === 'component') {
      inst.vnode = vnode;
      var out = renderComponent(inst);
      inst.child = reconcileList([inst.child], [out], root, svg)[0];
      return inst;
    }

    applyProps(inst.dom, inst.vnode.props, vnode.props, inst.svg);
    inst.vnode = vnode;
    inst.children = reconcileList(inst.children, vnode.children, root, inst.svg);
    place(inst.dom, inst.children);

    if (vnode.ref && vnode.ref !== inst.ref) {
      if (inst.ref) inst.ref.current = null;
      vnode.ref.current = inst.dom;
      inst.ref = vnode.ref;
    }
    return inst;
  }

  function unmount(inst) {
    if (!inst) return;
    if (inst.kind === 'component') {
      for (var i = 0; i < inst.hooks.length; i++) {
        if (inst.hooks[i] && inst.hooks[i].cleanup) runCleanup(inst.hooks[i]);
      }
      unmount(inst.child);
    } else if (inst.kind === 'host' || inst.kind === 'fragment') {
      for (var j = 0; j < inst.children.length; j++) unmount(inst.children[j]);
      if (inst.ref) inst.ref.current = null;
    }
  }

  /**
   * Match new children against old ones: by key where the app supplied one,
   * otherwise by position among the unkeyed. Anything left over is unmounted,
   * which is where effect cleanups run.
   */
  function reconcileList(oldList, vnodes, root, svg) {
    var taken = new Array(oldList.length);
    var picks = new Array(vnodes.length);
    var byKey = {};
    var i;

    for (i = 0; i < oldList.length; i++) {
      if (oldList[i].key !== null && oldList[i].key !== undefined) byKey[oldList[i].key] = i;
    }

    for (i = 0; i < vnodes.length; i++) {
      var key = keyOf(vnodes[i]);
      picks[i] = -1;
      if (key !== null && key !== undefined && byKey[key] !== undefined) {
        var at = byKey[key];
        if (!taken[at] && oldList[at].type === typeOf(vnodes[i])) {
          picks[i] = at;
          taken[at] = true;
        }
      }
    }

    var cursor = 0;
    for (i = 0; i < vnodes.length; i++) {
      if (picks[i] >= 0 || keyOf(vnodes[i]) !== null) continue;
      while (cursor < oldList.length && (taken[cursor] || oldList[cursor].key !== null)) cursor++;
      if (cursor < oldList.length && oldList[cursor].type === typeOf(vnodes[i])) {
        picks[i] = cursor;
        taken[cursor] = true;
        cursor++;
      }
    }

    var out = new Array(vnodes.length);
    for (i = 0; i < vnodes.length; i++) {
      out[i] = picks[i] >= 0
        ? update(oldList[picks[i]], vnodes[i], root, svg)
        : create(vnodes[i], root, svg);
    }
    for (i = 0; i < oldList.length; i++) if (!taken[i]) unmount(oldList[i]);
    return out;
  }

  /**
   * Put this parent's nodes in document order and drop anything else it still
   * holds. Walking with a cursor means an unchanged run costs no DOM writes.
   */
  function place(parent, children) {
    var nodes = [];
    for (var i = 0; i < children.length; i++) domNodes(children[i], nodes);

    var cursor = parent.firstChild;
    for (var j = 0; j < nodes.length; j++) {
      if (cursor === nodes[j]) { cursor = cursor.nextSibling; continue; }
      parent.insertBefore(nodes[j], cursor);
    }
    while (cursor) {
      var next = cursor.nextSibling;
      parent.removeChild(cursor);
      cursor = next;
    }
  }

  /* -------------------------------------------------------------------------
     Scheduling

     Any setState re-renders from the root. The app keeps all of its state in
     one component, so a narrower update would buy nothing, and diffing means
     the DOM barely moves. Renders are batched onto a microtask so a handler
     that sets several pieces of state still paints once.
  ------------------------------------------------------------------------- */

  var dirty = [];
  var queued = false;

  function schedule(root) {
    if (dirty.indexOf(root) < 0) dirty.push(root);
    if (queued) return;
    queued = true;
    Promise.resolve().then(function () {
      queued = false;
      var roots = dirty;
      dirty = [];
      for (var i = 0; i < roots.length; i++) draw(roots[i]);
    });
  }

  function draw(root) {
    root.instance = reconcileList(root.instance ? [root.instance] : [], [root.vnode], root, false)[0];
    place(root.container, [root.instance]);
    flushEffects();
  }

  function createRoot(container) {
    var root = { container: container, vnode: null, instance: null };
    return {
      render: function (vnode) {
        root.vnode = vnode;
        draw(root);
      },
      unmount: function () {
        unmount(root.instance);
        root.instance = null;
        container.textContent = '';
      },
    };
  }

  window.React = {
    createElement: createElement,
    Fragment: Fragment,
    useState: useState,
    useEffect: useEffect,
    useRef: useRef,
  };
  window.ReactDOMClient = { createRoot: createRoot };
})();
