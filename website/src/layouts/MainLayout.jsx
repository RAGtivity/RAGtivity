import { Outlet } from "react-router"
import Sidebar from "../components/sidebar/Sidebar"

export default function MainLayout({ documents, removeDocument }) {
    return (
        <div className="flex">
            <Sidebar
                documents={documents}
                onRemoveDocument={removeDocument} />
                <Outlet />
        </div>
    )
}