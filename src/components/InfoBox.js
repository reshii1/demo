import '../styles/InfoBox.css';

function InfoBox({title, children}) {
    return (
        <div className="info-box">
            <h4 className="info-title">{title}</h4>
            <div className="info-content">{children}</div>
        </div>
    );
}

export default InfoBox;
