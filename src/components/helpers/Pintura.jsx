import { PinturaEditor } from "@pqina/react-pintura";
import "@pqina/pintura/pintura.css";
import { getEditorDefaults } from "@pqina/pintura";
import { useEffect } from "react";
import { uploadStory } from "../../services/story";
import { useUser } from "../../context/UserContext";

const editorDefaults = getEditorDefaults({
    stickers: [],
    enableTextEditor: false,
    enableAnnotations: false,
    enableWatermark: false,
});

export default function Pintura({ selectedImage, result, setResult, setIsUploading, setUploaded }) {
    const { userData } = useUser()
    useEffect(() => {
        if (result) {
            setIsUploading(true);
            uploadStory(result, userData, setUploaded);
        }
    }, [result, setIsUploading, uploadStory]);
    return (
        <div className="dark w-full">
            <div style={{ height: "70vh" }}>
                <PinturaEditor
                    {...editorDefaults}
                    src={selectedImage}
                    imageCropAspectRatio={1}
                    theme="dark"
                    onProcess={({ dest }) => {
                        setResult(URL.createObjectURL(dest))
                    }}
                />
            </div>
        </div>
    );
}
