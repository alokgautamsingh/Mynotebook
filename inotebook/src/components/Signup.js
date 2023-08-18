import React, {useState} from 'react'
import { useNavigate} from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email: "", password: "",cpassword:""}) 
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name,email,password } = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,email,password})
        });
        const json = await response.json()
        console.log(json);
        if (json.success){
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken); 
            navigate("/");
            props.showAlert("Account created sucessfully ", "success")

        }
        else{
            props.showAlert("Invalid crudentials", "error")
        }
    }


const onChange = (e)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
}

    return (
        <div className='container mt-2'>
            <h2 className='container my-3'>hey! glad to welcome you . please create your account</h2>
            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name"onChange={onChange}aria-describedby="emailHelp" placeholder="Enter Name"/>
                     
                </div>
                <div className="mb-3">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="email"onChange={onChange}aria-describedby="emailHelp" placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password"onChange={onChange} placeholder="Password"minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword"onChange={onChange}placeholder="ConfirmPassword"minLength={5} required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
