const example2 = async ({ wrapperRef, contentRef, titleWrapperRef }: any, resolve: () => void, { canvasWrapperRef }: any) => {
    const { $TL, $canvas } = useNuxtApp()
    let tl = new $TL()
    tl.from({
        el: wrapperRef.value,
        delay: 800,
        p: {
            o: [1,1]
        },
    }).from({
        el: wrapperRef.value,
        d: 500,
        delay: 800,
        e: 'io4',
        p: {
            s: [0.8, 1]
        },
        cb: () => {
            resolve()
        }
    }).from({
        el: contentRef.value,
        p: {
            o: [0, 1]
        },
        d: 500,
        delay: 800
    }).from({
        el: titleWrapperRef.value,
        p: {
            o: [0, 1]
        },
        d: 500,
        delay: 800
    })
        .play()
}

const example2InMap = new Map([
    ['default', example2]
])
export default example2InMap