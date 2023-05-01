
const indexOutExample2 = async ({ wrapperRef, waterFlowTitleRef}: any, resolve: () => void, { canvasWrapperRef, flowRef }: any) => {
    const { $TL, $canvas } = useNuxtApp()

    let tl = new $TL()
    const noiseWebGL = $canvas.currentCanvasPage!.noiseBackground
    const transiMesh = $canvas.currentCanvasPage.createTransiMesh()
    const canvasSize = $canvas.size.value

    const flowProvider = flowRef.value
    tl.from({
        d: 400,
        el: wrapperRef.value,
        p: {
            o: [1, 0]
        }
    }).from({
        d: 400,
        el: waterFlowTitleRef.value.border,
        p: {
            o: [1, 0]
        }
    })
        .from({
            d: 800,
            delay: 0,
            e: 'io4',
            update: ({ progE }) => {
                transiMesh.position.y = - canvasSize.height * 1.2 * (1 - progE)
            }
        })
        .from({
            delay: 400,
            d: 400,
            update: ({ progE }) => {
                transiMesh.program.uniforms.uProg.value = 1 - progE
            }
        })
    tl.from({
        delay: 1300,
        update() {

        },
        cb: async () => {
            $canvas.onChange(flowProvider.getRouteTo())
            await $canvas.nextCanvasPage?.init()
            $canvas.currentCanvasPage?.destroy()
            $canvas.currentCanvasPage = $canvas.nextCanvasPage
            resolve()
        }
    })
        .play()
}

const indexOutMap = new Map([
    ['index => example2', indexOutExample2]
])
export default indexOutMap