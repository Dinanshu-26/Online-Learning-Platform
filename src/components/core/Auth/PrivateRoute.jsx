// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {

//     const { token } = useSelector((state) => state.auth);

//     if (token !== null)
//         return children
//     else
//         return <Navigate to="/login" />

// }

// export default PrivateRoute

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Navigate } from "react-router-dom"
import { logout } from "../../../services/operations/authAPI"

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    if (token) {
        try {
            const decoded = jwtDecode(token)
            console.log(decoded)
            if (decoded.exp * 1000 < Date.now()) {
                dispatch(logout(navigate))   
                return null                  
            }
            return children
        } catch (err) {
            dispatch(logout(navigate))
            return null
        }
    } else {
        return <Navigate to="/login" />
    }
}

export default PrivateRoute
