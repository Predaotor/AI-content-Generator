import { useAuth } from "@/context/AuthContext"; 

const ProfilePage= ()=> {
   const {user} =useAuth();

   if (!user) return <p>Please sign in to view your profile</p>;
   return (
    <div className="mx-auto mt-10 max-w-md bg-white p-6 shadow rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      <p><strong>Username:</strong>{user.username}</p>
      <p><strong>Email:</strong>{user.email}</p>
    </div>

   );
  };

export default ProfilePage;