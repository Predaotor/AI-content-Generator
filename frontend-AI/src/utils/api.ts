import { AppConfig } from "./AppConfig";    

export async function registerUser(data: {username: string,email: string, password: string}){
    const res = await fetch(`${AppConfig.apiUrl}/register`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Registration failed');
    }
    return res.json();
}


export async function loginUser(data: { username?: string, email?: string, password: string }) {
    const res = await fetch(`${AppConfig.apiUrl}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (!res.ok){
        throw new Error('Login failed');
    }
    return res.json();
    }
