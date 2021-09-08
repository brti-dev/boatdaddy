// the UserProvider in user-context.js is basically:
export const UserProvider = props => (
  <UserContext.Provider value={useAuth().data.user} {...props} />
)
// and the useUser hook is basically this:
export const useUser = () => React.useContext(UserContext)
