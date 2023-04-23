import Lenis from "@studio-freight/lenis"

export default defineNuxtPlugin(nuxtApp =>{
  return {
    provide: {
        lenis: new Lenis({
            normalizeWheel: true
        })
    }
  }

})
