// src/access.ts
export default function access(initialState: { currentUser?: LoginUserInfo.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canUser: currentUser && currentUser.access === 'user',
  };
}
