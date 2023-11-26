import { useAuth0 } from '@auth0/auth0-vue';

export const getDefaultState = () => {
  return {
    user: useAuth0().user,
    accessToken: '',
    auth0UserId: '',
    loginRequired: false,
  }
}