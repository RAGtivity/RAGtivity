import { Outlet, useNavigate } from "react-router"
import { useEffect } from "react"
import Sidebar from "../components/sidebar/Sidebar"
import FileDuplicatePopup from "../components/FileDuplicatePopup/FileDuplicatePopup"

export default function MainLayout({ loggedInEmail, documents, removeDocument, openDuplicatePopup, setOpenDuplicatePopup }) {
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedInEmail == "") {
            navigate("/login")
        }
    }, [loggedInEmail, navigate])

    return (
        <div>
            <FileDuplicatePopup openDuplicatePopup={openDuplicatePopup} setOpenDuplicatePopup={setOpenDuplicatePopup}/>
            <div className="flex">
                <Sidebar
                    documents={documents}
                    onRemoveDocument={removeDocument} />
                    <Outlet />
            </div>
        </div>
    )
}