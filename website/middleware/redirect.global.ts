export default defineNuxtRouteMiddleware((to, from) => {
  const allowedRoutes = ['/', '/home'] // Add your registered routes here

  if (!allowedRoutes.includes(to.path)) {
    return navigateTo('/') // Replace '/404' with the route you want to redirect to
  }
})