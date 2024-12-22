export function createState<State>(getter: () => State) {
  const state = getter()
  return () => state
}
