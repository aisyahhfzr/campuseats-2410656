import { Link } from 'react-router'

function NotFoundPage() {
    return (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>404</h2>
            <p>No page here.</p>
            <Link to="/" className="btn" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                Back to Home
            </Link>
        </div>
    )
}

export default NotFoundPage