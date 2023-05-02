import indexCanvas from "~/scene/Pages/indexCanvas"

const indexOutExample2 = async ({ wrapperRef, waterFlowTitleRef }: any, resolve: () => void, { canvasWrapperRef, flowRef }: any) => {
    const { $TL, $canvas } = useNuxtApp()

    let tl = new $TL()
    const curCanvasPage = $canvas.currentCanvasPage as unknown as indexCanvas

    const transiMesh = curCanvasPage.createTransiMesh()
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

const example3InIndex = async ({ wrapperRef, waterFlowTitleRef, watermarkContainerRef,
    titleSpanRef,
    pRef,
    headerRef,
    rotateRef
}: any, resolve: () => void, { canvasWrapperRef, flowRef }: any) => {
    const { $TL, $canvas } = useNuxtApp()


    let tl = new $TL
    waterFlowTitleRef.value.border.style.transformOrigin = 'center'

    const indexCanvas = $canvas.pages.index as unknown as indexCanvas
    const noiseWebGL = indexCanvas.noiseBackground

    tl.from({
        el: waterFlowTitleRef.value.border,
        p: {
            scale: [0, 1]
        },
        d: 1000,
        e: 'io4',
        cb: () => {
            resolve()
        }
    })
    tl.from({
        el: watermarkContainerRef.value,
        p: {
            x: [40, 0]
        },
        d: 1000,
        e: 'o3'
    }).play()
    console.log('object');

    noiseWebGL.uAlpha.value = 1
    titleSpanRef.value.style.transform = "translate(0px , 0px)"
    rotateRef.value.style.transform = "rotateX(0deg)"
    pRef.value.style.opacity = '1'
    headerRef.value.style.opacity = '1'
}

const indexInMap = new Map([
    ['example3 => index', example3InIndex]
])
export {indexOutMap, indexInMap}