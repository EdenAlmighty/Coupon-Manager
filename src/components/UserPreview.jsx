export function UserPreview({ user }) {
    return (
        <>
            <td>{user.fullname}</td>
            <td>{user.username}</td>
            <td>{user.isAdmin ? "Admin" : "User"}</td>
        </>
    )
}