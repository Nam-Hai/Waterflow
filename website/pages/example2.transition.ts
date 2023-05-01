
const example2 = ({ wrapperRef, contentRef, titleWrapperRef }: any, resolve: () => void) => {
    const { $TL } = useNuxtApp()
    let tl = new $TL()
    tl.from({
        el: wrapperRef.value,
        d: 750,
        e: 'o4',
        p: {
            y: [100, 0],
            s: [0.9, .9]
        },
    }).from({
        el: wrapperRef.value,
        d: 500,
        delay: 750,
        e: 'o4',
        p: {
            y: [0, 0],
            s: [0.9, 1]
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
        delay: 750
    }).from({
        el: titleWrapperRef.value,
        p: {
            o: [0, 1]
        },
        d: 500,
        delay: 750
    })
    .play()
}

const example2InMap = new Map([
    ['default', example2]
])
export default example2InMap