import HeaderComponent from "../../Components/user/HeaderComponent/HeaderComponent"
import SidebarComponent from "../../Components/user/SidebarComponent/SidebarComponent"

const UserLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen">

            <HeaderComponent />

            <div className="flex flex-1">
                <SidebarComponent />

                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default UserLayout