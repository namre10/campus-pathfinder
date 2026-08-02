/** Set on navigate when the header logo / brand is clicked */
export type WelcomeLocationState = {
  showWelcome?: boolean
  welcomeAt?: number
}

export function welcomeNavState(): WelcomeLocationState {
  return { showWelcome: true, welcomeAt: Date.now() }
}

export function isWelcomeNavState(state: unknown): state is WelcomeLocationState {
  const s = state as WelcomeLocationState | null
  return Boolean(s?.showWelcome && s?.welcomeAt)
}
