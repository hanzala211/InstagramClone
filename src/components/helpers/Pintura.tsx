import { PinturaEditor } from "@pqina/react-pintura";
import "@pqina/pintura/pintura.css";
import { getEditorDefaults } from "@pqina/pintura";
import { uploadStory } from "../../services/story";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useStories } from "../../context/StoriesContext";

const editorDefaults = getEditorDefaults({
    stickers: [],
    enableTextEditor: false,
    enableAnnotations: false,
    enableWatermark: false,
});

interface PinturaProps{
    selectedImage: string;
    setIsUploading: (value: boolean) => void;
    setUploaded: (value: boolean) => void;
}

export default function Pintura({ selectedImage, setIsUploading, setUploaded }: PinturaProps){
    const { userData, innerWidth } = useUser()
    const { setSelectedImage, isUploading } = useStories()
    const navigate = useNavigate()

    return (
        <div className="dark w-full md:h-[70vh] h-[100vh]" style={{ position: "relative" }}>
            <PinturaEditor
                {...editorDefaults}
                src={selectedImage}
                imageCropAspectRatio={1}
                theme="dark"
                onProcess={({ dest }) => {
                    uploadStory(URL.createObjectURL(dest), userData, setUploaded, innerWidth, navigate, setSelectedImage, setIsUploading);
                }}
                style={{
                    backgroundColor: "transparent",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                disabled={isUploading}
            />
        </div>
    );
}
