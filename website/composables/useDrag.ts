export const useDrag = ({ wrapper, limit }: { wrapper: Ref<HTMLElement>, limit?: { min: number, max: number } }) => {
    limit = limit ? limit : { min: -Infinity, max: Infinity }
    const on = ref(false)

    const start = {
        x: 0,
        y: 0
    }
    const end = {
        x: 0,
        y: 0
    }
    const distance = reactive({
        x: 0,
        y: 0
    })
    const distanceOnStart = {
        x: 0,
        y: 0
    }

    onMounted(() => {
        wrapper.value.addEventListener('mousedown', onMouseDown)
        wrapper.value.addEventListener('touchstart', onTouchStart)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('touchmove', onTouchMove)

        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('touchend', onTouchEnd)
    })

    onBeforeUnmount(() => {
        wrapper.value.removeEventListener('mousedown', onMouseDown)
        wrapper.value.removeEventListener('touchstart', onTouchStart)

        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('touchmove', onTouchMove)

        window.removeEventListener('mouseup', onMouseUp)
        window.removeEventListener('touchend', onTouchEnd)
    })

    function onTouchStart(event: TouchEvent) {
        dragStart({
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        })
    }
    function onMouseDown(event: MouseEvent) {
        dragStart({
            x: event.clientX,
            y: event.clientY
        })
    }

    function onMouseMove(event: MouseEvent) {
        dragMove({
            x: event.clientX,
            y: event.clientY
        })
    }
    function onTouchMove(event: TouchEvent) {
        dragMove({
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        })
    }
    function onMouseUp() {
        dragEnd()
    }
    function onTouchEnd() {
        dragEnd()
    }


    function dragStart({ x, y }: { x: number, y: number }) {
        on.value = true
        start.x = x
        start.y = y

        distanceOnStart.x = distance.x
        distanceOnStart.y = distance.y
    }
    function dragMove({ x, y }: { x: number, y: number }) {
        end.x = x
        end.y = y
        if (!on.value) return
        distance.x = end.x - start.x + distanceOnStart.x
        distance.y = end.y - start.y + distanceOnStart.y

        distance.x = N.Clamp(distance.x, limit!.min, limit!.max)
        distance.y = N.Clamp(distance.y, limit!.min, limit!.max)
    }

    function dragEnd() {
        on.value = false
    }
    return { distance, on }
}