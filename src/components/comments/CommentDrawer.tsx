import { CommentsStructure } from "./CommentsStructure"

export const CommentDrawer: React.FC = () => {
    return <section className="overflow-y-auto h-[250rem] mt-6">
        <div className="flex flex-col gap-5 ml-3">
            <CommentsStructure />
        </div>
    </section>
}