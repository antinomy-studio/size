import Emitter from 'tiny-emitter'
import sniffer from '@antinomy-studio/sniffer'
import debounce from 'debounce'

const emitter = new Emitter()
const EVENT_NAME = "resize";
const isClient = typeof window !== 'undefined' && window.document;
let debounced;

class Size {
  constructor(){
    this.width = 0
    this.height = 0
    this.hasBar = false
    this.isLandscape = false
  }

  addListener (listener, context) {
    emitter.on(EVENT_NAME, listener, context);
  }

  removeListener (listener, context) {
    if(listener) emitter.off(EVENT_NAME, listener, context);
  }

  bind (opts) {
    opts = opts || {};
    size.unbind();
    const debounceTime = opts.debounceTime || 150;
    debounced = debounce(onEvent, debounceTime);
    window.addEventListener(EVENT_NAME, debounced);
  }

  unbind () {
    window.removeEventListener(EVENT_NAME, debounced);
  }
}

const size = new Size();

const onEvent = () => {
  if (sniffer.isIos) {
    size.hasBar = size.width > size.height && size.height > window.innerHeight;
  }

  size.width = isClient ? window.innerWidth : 0;
  size.height = isClient ? window.innerHeight : 0;

  size.isLandscape = size.width > size.height;
  emitter.emit(EVENT_NAME, size.width, size.height);
}

if (isClient) {
  onEvent();
  size.bind();
}

export default size
