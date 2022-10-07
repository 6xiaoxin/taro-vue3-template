import { App } from 'vue'
import { createPinia } from 'pinia'
export { useApp } from './app'
export const store = createPinia()

export function setupStore(app: App) {
  app.use(store)
}
