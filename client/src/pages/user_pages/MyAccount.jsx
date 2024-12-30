import React from "react";
import Login from "./Login";
import Register from "./Register";

const MyAccount = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto pt-5 pb-5">
      {/* Login Section */}
      <div className="w-full md:w-1/2 mx-auto">
        <Login />
      </div>
    </div>
  );
};

export default MyAccount;
