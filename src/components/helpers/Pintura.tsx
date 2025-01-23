import { PinturaEditor } from "@pqina/react-pintura";
import "@pqina/pintura/pintura.css";
import { getEditorDefaults } from "@pqina/pintura";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useStories } from "../../context/StoriesContext";
import { useAuth } from "../../context/AuthContext";
import { storyUpload } from "../../services/story";

const editorDefaults = getEditorDefaults({
    stickers: [],
    enableTextEditor: false,
    enableAnnotations: false,
    enableWatermark: false,
});

interface PinturaProps {
    selectedImage: string;
    setIsUploading: (value: boolean) => void;
    setUploaded: (value: boolean) => void;
}

export default function Pintura({ selectedImage, setIsUploading, setUploaded }: PinturaProps) {
    const { innerWidth } = useUser()
    const { token } = useAuth()
    const { setSelectedImage, isUploading } = useStories()
    const navigate = useNavigate()

    async function uploadStory(image: string) {
        try {
            setIsUploading(true);
            const res = await storyUpload({
                token: token,
                image: image,
            })
            if (res.message === 'Story created successfully.' && innerWidth < 770) {
                navigate('/home');
                setSelectedImage(null);
                setIsUploading(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploaded(true);
        }
    }

    return (
        <div className="dark w-full md:h-[70vh] h-[100vh]" style={{ position: "relative" }}>
            <PinturaEditor
                {...editorDefaults}
                src={selectedImage}
                imageCropAspectRatio={1}
                theme="dark"
                onProcess={({ dest }) => {
                    uploadStory(URL.createObjectURL(dest))
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
