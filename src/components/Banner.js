import "../styles/Banner.css";

function Banner({ children}) {
    return (
        <div className="top-banner">
            {children}
        </div>
    );
}

export default Banner;