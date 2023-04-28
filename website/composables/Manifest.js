import { Texture } from "ogl"

export default class Manifest {
  constructor(gl, gl2) {
    const textures = {
      images: {
        'images/1.png': new Texture(gl),
        'images/2.jpg': new Texture(gl),
        'images/3.png': new Texture(gl),
      },
      font: {
        'msdf/Amarante-Regular.png': new Texture(gl2, {
          generateMipmaps: false,
        })
      }
    }

    this.jsons = {
      'msdf/Amarante-Regular.json': null
    }


    this.length = 0
    for (const m of Object.values(textures)) {
      this.length += Object.values(m).length
    }
    this.length += Object.values(this.jsons).length

    this.index = ref(0)

    this.callback = (n)=>{}
    watch(this.index, i =>{
      this.callback(i)
      console.log('object');
    })

    this.textures = textures
  }


  async loadManifest() {

    for (const m of Object.values(this.textures)) {
      for (const [keys, values] of Object.entries(m)) {
        // await new Promise((resolve) => {
        let image = new Image()
        image.crossOrigin = 'anonymous'
        image.onload = () => {
          values.image = image

          this.index.value += 1
          // resolve()
        }
        image.src = keys
      }
    }

    for (const [keys, values] of Object.entries(this.jsons)) {
      const font = await (await fetch(keys)).json();
      this.jsons[keys] = font
      this.index.value += 1
    }
  }
}
