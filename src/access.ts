// src/access.ts
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
    const { currentUser } = initialState || {};
    return {
        canAdmin: currentUser && currentUser.AuthorityList?.includes('Admin'),
        // canUser: currentUser && currentUser.access === 'user',
    };
}