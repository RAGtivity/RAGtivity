import { Outlet, useNavigate } from "react-router"
import { useEffect } from "react"
import Sidebar from "../components/sidebar/Sidebar"

export default function MainLayout({ loggedInEmail, documents, removeDocument }) {
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedInEmail == "") {
            navigate("/login")
        }
    }, [loggedInEmail, navigate])

    return (
        <div className="flex">
            <Sidebar
                documents={documents}
                onRemoveDocument={removeDocument} />
                <Outlet />
        </div>
    )
}