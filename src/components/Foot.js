import React from 'react'
import { Link } from 'react-router-dom'

export default function Foot() {
  return (
    <div>
      
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <div className="col-md-4 d-flex align-items-center">
        <Link to="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
        </Link>
        <span className="text-muted">© 2023 Gujfood, Inc</span>
      </div>
      </footer>
      
      <div>
        <div>
          <h3>Contact for help</h3>
        </div>
        <div>
          <a href="https://www.facebook.com/profile.php?id=100073313805889" >Facebook  </a>
          <a href="https://www.instagram.com/teerthpatel0408/?hl=en" >  Instagram</a>
        </div>
      </div>
    </div>
  )
}
