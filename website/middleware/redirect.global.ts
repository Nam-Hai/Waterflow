export default defineNuxtRouteMiddleware((to, from) => {
  const allowedRoutes = ['/', '/example1', '/example2', '/example3'] // Add your registered routes here
  if (!allowedRoutes.includes(to.path)) {
    return navigateTo('/') // Replace '/404' with the route you want to redirect to
  }
})