export const ImageContainer = ({ images }: {images: string[]}) => {
    return (
        <div className="relative w-40 mx-auto">
            {images[2] !== undefined && <img
                src={images[2]}
                alt="Tilted Right"
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 rotate-6 w-16 h-16 rounded-xl object-cover shadow-lg"
            />}
            {images[1] !== undefined && <img
                src={images[1]}
                alt="Tilted Left"
                className="absolute bottom-5 left-1/2 transform -translate-x-1/2 -rotate-6 w-16 h-16 object-cover rounded-lg shadow-lg"
            />}
            {images[0] !== undefined && <img
                src={images[0]}
                alt="Straight"
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-16 object-cover rounded-lg shadow-lg"
            />}
        </div>
    );
};
